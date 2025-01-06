import 'dotenv/config'
import fs from 'fs';
import documentTags from "./data/documentTags";
import ora from 'ora';
import { bucketUrl, imageNames } from './data/imageUrls';
import { finished } from 'stream/promises';
import { Readable } from 'stream';
import PocketBase from 'pocketbase'
import { Collections, TagsRecord, TypedPocketBase } from '../src/lib/pocketbase/pb-types';
import { CreateRecord } from '../src/lib/pocketbase/helper-types';

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
    const spinner = ora('Deleting all Records...')
    const pbDocs = await pb.collection('documents').getFullList({ fields: 'id' });
    const pbTags = await pb.collection('tags').getFullList({ fields: 'id' })
    const pbPages = await pb.collection('pages').getFullList({ fields: 'id' })

    // deleting documents
    await Promise.all(pbDocs.map(doc => pb.collection('documents').delete(doc.id)))

    // deleting tags
    await Promise.all(pbTags.map(tag => pb.collection('tags').delete(tag.id)))

    // deleting pages
    const logPage = (page: number) => `Deleting Pages ${page}/${pbPages.length}`
    for (let index = 0; index < pbPages.length; index++) {
        spinner.text = logPage(index+1)
        await pb.collection('pages').delete(pbPages[index]!.id)
    }
    spinner.succeed('Deleted all Records.')
}

async function pbFill() {
    // fill tags

    const tagSpinner = ora('Filling Tags...')

    const tagBatch = pb.createBatch()
    documentTags.forEach(tag => tagBatch
        .collection(Collections.Tags)
        .create({
            keyword: tag
        } satisfies CreateRecord<TagsRecord>)
    )
    await tagBatch.send()

    tagSpinner.succeed('Filled Tags.')


    // fill pages

    const log = (doc: number) => `Uploading Page ${doc}/${NUMBER_OF_DOCUMENTS}`
    const spinner = ora(log(1)).start();
    
    const imagePaths = fs.readdirSync(IMAGES_PATH)
    
    for (let index = 0; index < imagePaths.length; index++) {
        spinner.text = log(index+1)

        await pb.collection('pages').create({
            file: new File(
                [fs.readFileSync(`${IMAGES_PATH}/${imagePaths[index]}`)],
                imagePaths[index]!,
            )
        })
    }

    spinner.succeed('Uploaded all pages.')


    // fill documents

    const docSpinner = ora('Filling Documents...')

    const newTagIds = (await pb.collection('tags').getFullList({ fields: 'id' })).map(r => r.id)
    const newPageIds = (await pb.collection('pages').getFullList({ fields: 'id' })).map(r => r.id)

    const docBatch = pb.createBatch()
    for (let index = 0; index < NUMBER_OF_DOCUMENTS; index++) {
        docBatch.collection('documents').create({
            pages: newPageIds.filter(() => Math.random() < 0.08),
            tags: newTagIds.filter(() => Math.random() < 0.01)
        })
    }
    await docBatch.send()

    docSpinner.succeed('Filled Documents.')
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