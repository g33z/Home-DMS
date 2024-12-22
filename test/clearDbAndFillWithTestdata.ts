import 'dotenv/config'
import { db } from "../src/lib/db";
import { pageTable, documentTable } from "../src/lib/db/schema";
import supabase from "../src/lib/supabase/client";
import { throwOnError } from "../src/lib/supabase/utils";
import fs from 'fs';
import documentTitles from "./data/documentTitles";
import ora from 'ora';
import { bucketUrl, imageNames } from './data/imageUrls';
import { finished } from 'stream/promises';
import { Readable } from 'stream';

const imagesPath = 'test/data/images';

if (!fs.existsSync(imagesPath)){
    fs.mkdirSync(imagesPath);
}

function getRandomImagePaths(){
    const imagePaths = fs.readdirSync(imagesPath)
    let filteredPaths = fs.readdirSync(imagesPath).filter(() => Math.random() < 0.08);

    if(filteredPaths.length === 0){
        filteredPaths = [ imagePaths[0]! ];
    }

    return filteredPaths;
}

async function removeAllDOcuments(){
    const pages = await db
        .delete(pageTable)
        .returning({ path: pageTable.storagePath });

    await supabase.storage
        .from('documents')
        .remove(pages.map(p => p.path));

    await db
        .delete(documentTable);
}

async function addTestDocument(title: string, pagePaths: string[]) {
    const pages = await Promise.all(pagePaths.map(pagePath => supabase.storage
        .from('documents')
        .upload(
            crypto.randomUUID(), 
            fs.readFileSync(`${imagesPath}/${pagePath}`), 
            { cacheControl: '31536000' }
        )
        .then(throwOnError)
    ));

    const [ document ] = await db
        .insert(documentTable)
        .values({ name: title })
        .returning({ id: documentTable.id });

    await db
        .insert(pageTable)
        .values(pages.map((page, index) => ({
            page: index,
            storagePath: page.path,
            documentId: document!.id
        })))
}

async function addTestDocuments() {
    const log = (doc: number) => `Uploading Document ${doc}/${documentTitles.length}`

    const spinner = ora(log(1)).start();

    for (let index = 0; index < documentTitles.length; index++) {
        spinner.text = log(index+1)
        await addTestDocument(documentTitles[index]!, getRandomImagePaths());
    }

    spinner.succeed('Added all test data.')
}

async function downloadTestImages() {
    const log = (img: number) => `Downloading image ${img}/${imageNames.length}`
    const spinner = ora(log(1)).start()

    for (let index = 0; index < imageNames.length; index++) {
        spinner.text = log(index+1)
        const res = await fetch(`${bucketUrl}/${imageNames[index]}`)
        const fileStream = fs.createWriteStream(`${imagesPath}/${imageNames[index]}`, { flags: 'wx' });
        await finished(Readable.fromWeb(res.body!).pipe(fileStream));
    }

    spinner.succeed('Downloaded all test images.')
}

async function main() {
    if(fs.readdirSync(imagesPath).length === 0){
        console.log('Could not find test images')
        console.log('Downloading them now...')
        await downloadTestImages()
    }

    console.log('Clearing db and filling it with testdata...')

    const removeSpinner = ora('Removing all existing documents...')
    await removeAllDOcuments()
    removeSpinner.succeed('Removed all existing documents.')

    await addTestDocuments()

    console.log('Finished!')
    process.exit()
}

main()