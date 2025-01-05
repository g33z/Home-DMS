import 'dotenv/config'
import fs from 'fs';
import documentTags from "./data/documentTags";
import ora from 'ora';
import { bucketUrl, imageNames } from './data/imageUrls';
import { finished } from 'stream/promises';
import { Readable } from 'stream';
import PocketBase from 'pocketbase'
import { Collections, TagsRecord, TypedPocketBase } from '../pocketbase/pb-types';
import { CreateRecord } from '../pocketbase/helper-types';

const IMAGES_PATH = 'test/data/images';
const NUMBER_OF_DOCUMENTS = 200;

const pb = new PocketBase(import.meta.env.WAKU_PUBLIC_PB_URL) as TypedPocketBase

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

function getRandomImageFiles(){
    return getRandomImagePaths()
        .map(path => new File(
            [fs.readFileSync(`${IMAGES_PATH}/${path}`)],
            path,
        ))
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

async function pbClear() {
    const spinner = ora('Deleting Tags and Documents...')
    const pbDocs = await pb.collection('documents').getFullList({ fields: 'id' });
    const pbTags = await pb.collection('tags').getFullList({ fields: 'id' })

    const logDoc = (doc: number) => `Deleting Document ${doc}/${pbDocs.length}`

    await Promise.all(pbTags.map(tag => pb
        .collection(Collections.Tags)
        .delete(tag.id)
    ))

    for (let index = 0; index < pbDocs.length; index++) {
        spinner.text = logDoc(index+1)
        await pb.collection(Collections.Documents).delete(pbDocs[index]!.id)
    }

    spinner.succeed('Deleted all Tags and Documents.')
}

async function pbFill() {
    const tagBatch = pb.createBatch()
    documentTags.forEach(tag => tagBatch
        .collection(Collections.Tags)
        .create({
            keyword: tag
        } satisfies CreateRecord<TagsRecord>)
    )
    await tagBatch.send()

    const newTagIds = (await pb.collection('tags').getFullList({ fields: 'id' })).map(r => r.id)

    const log = (doc: number) => `Uploading Document ${doc}/${NUMBER_OF_DOCUMENTS}`
    const spinner = ora(log(1)).start();
    for (let index = 0; index < NUMBER_OF_DOCUMENTS; index++) {
        spinner.text = log(index+1)
        await pb.collection('documents').create({
            pages: getRandomImageFiles(),
            tags: newTagIds.filter(() => Math.random() < 0.01)
        })
    }
    spinner.succeed('Added all test data.')
}

async function main() {
    if(fs.readdirSync(IMAGES_PATH).length === 0){
        console.log('Could not find test images')
        console.log('Downloading them now...')
        await downloadTestImages()
    }

    console.log('Clearing db and filling it with testdata...')

    await pbClear()
    await pbFill()
    
    console.log('Finished!')
    process.exit()
}

main()