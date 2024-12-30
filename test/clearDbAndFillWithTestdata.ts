import 'dotenv/config'
import { db } from "../src/lib/db";
import { pageTable, documentTable, documentToTagTable, tagTable } from "../src/lib/db/schema";
import supabase from "../src/lib/supabase/client";
import { throwOnError } from "../src/lib/supabase/utils";
import fs from 'fs';
import documentTags from "./data/documentTags";
import ora from 'ora';
import { bucketUrl, imageNames } from './data/imageUrls';
import { finished } from 'stream/promises';
import { Readable } from 'stream';

const IMAGES_PATH = 'test/data/images';
const NUMBER_OF_DOCUMENTS = 200;

let tagIdsInDb: number[] = []

if (!fs.existsSync(IMAGES_PATH)){
    fs.mkdirSync(IMAGES_PATH);
}

function getRandomImagePaths(){
    const imagePaths = fs.readdirSync(IMAGES_PATH)
    const filteredPaths = fs.readdirSync(IMAGES_PATH).filter(() => Math.random() < 0.08);

    if(filteredPaths.length === 0){
        filteredPaths.push(imagePaths[0]!);
    }

    return filteredPaths;
}

function getRandomTagIds(){
    const filteredTags = tagIdsInDb.filter(() => Math.random() < 0.01)

    if(filteredTags.length === 0){
        filteredTags.push(tagIdsInDb[0]!)
    }

    return filteredTags;
}

async function removeAllDocuments(){
    const pages = await db
        .delete(pageTable)
        .returning({ path: pageTable.storagePath });

    await supabase.storage
        .from('documents')
        .remove(pages.map(p => p.path));

    await db.delete(documentTable);
}

async function removeAllTags() {
    await db.delete(documentToTagTable);
    await db.delete(tagTable);
}

async function addAllTags() {
    await db
        .insert(tagTable)
        .values(documentTags.map(keyword => ({ keyword })))
}

async function addTestDocument(tagIds: number[], pagePaths: string[]) {
    const pages = await Promise.all(pagePaths.map(pagePath => supabase.storage
        .from('documents')
        .upload(
            crypto.randomUUID(), 
            fs.readFileSync(`${IMAGES_PATH}/${pagePath}`), 
            { cacheControl: '31536000' }
        )
        .then(throwOnError)
    ));

    const [ document ] = await db
        .insert(documentTable)
        .values({})
        .returning();

    await db
        .insert(pageTable)
        .values(pages.map((page, index) => ({
            page: index,
            storagePath: page.path,
            documentId: document!.id
        })))
    
    await db
        .insert(documentToTagTable)
        .values(tagIds.map(tagId => ({
            documentId: document!.id,
            tagId
        })))
}

async function addTestDocuments() {
    const log = (doc: number) => `Uploading Document ${doc}/${NUMBER_OF_DOCUMENTS}`

    const spinner = ora(log(1)).start();

    for (let index = 0; index < NUMBER_OF_DOCUMENTS; index++) {
        spinner.text = log(index+1)
        await addTestDocument(getRandomTagIds(), getRandomImagePaths());
    }

    spinner.succeed('Added all test data.')
}

async function downloadTestImages() {
    const log = (img: number) => `Downloading image ${img}/${imageNames.length}`
    const spinner = ora(log(1)).start()

    for (let index = 0; index < imageNames.length; index++) {
        spinner.text = log(index+1)
        const res = await fetch(`${bucketUrl}/${imageNames[index]}`)
        const fileStream = fs.createWriteStream(`${IMAGES_PATH}/${imageNames[index]}`, { flags: 'wx' });
        await finished(Readable.fromWeb(res.body!).pipe(fileStream));
    }

    spinner.succeed('Downloaded all test images.')
}

async function main() {
    if(fs.readdirSync(IMAGES_PATH).length === 0){
        console.log('Could not find test images')
        console.log('Downloading them now...')
        await downloadTestImages()
    }

    console.log('Clearing db and filling it with testdata...')

    const tagSpinner = ora('Removing and re-adding tags...')
    await removeAllTags()
    await addAllTags()
    tagIdsInDb = (await db.query.tagTable
        .findMany({ columns: { id: true } }))
        .map(t => t.id)
    tagSpinner.succeed('Re-added all tags.')

    const removeSpinner = ora('Removing all existing documents...')
    await removeAllDocuments()
    removeSpinner.succeed('Removed all existing documents.')

    await addTestDocuments()
    
    console.log('Finished!')
    process.exit()
}

main()