import axios from 'axios';
// import { createWriteStream, WriteStream } from 'fs';
// import { join } from 'path';
import { DOMParser } from 'xmldom';
import { select } from 'xpath';

// const args: string[] = process.argv.slice(2);
// --directory /hello/js --bookId 56565

// const uploadDir: string = join('./');
// const files: string[] = [
//     '369809',
//     '369785'
// ];
const baseUrl: string = 'https://opennota.duckdns.org/';
const defaultBookId: string = '69614';
const getBookPartUrl = (bookId: string) => `book/${bookId}/`;
const partBookUrl: string = getBookPartUrl(defaultBookId);
const bookUrl = `${baseUrl}${partBookUrl}`;
// const params: string = 'algorithm=0&skip_neg=0&skip_neg=1&author_id=0&format=s&enc=UTF-8&crlf=1';
// const getFileUrl = (fileName: string) => `${baseUrl}${partBookUrl}${fileName}/download?${params}`;

async function getBookData() {
    try {
        const bookHtml = await axios(bookUrl);
        const parsedBook = new DOMParser().parseFromString(bookHtml.data);
        // const chaptersIDs = select('//table[@id="Chapters"].//tr/td[2]/a/@href', parsedBook);
        const chaptersIDs = select('//table[@id="Chapters"]', parsedBook);
        console.log(`chaptersIDs = ${chaptersIDs}`);
    } catch (e) {
        console.error(e);
    }
}

getBookData();

// get(bookUrl, bookResponse => {
//     files.forEach((fileName: string) => {
//         const file: WriteStream = createWriteStream(join(`${uploadDir}${fileName}.srt`));
//         const request = get(getFileUrl(fileName), (response) => response.pipe(file));
//     });
// });
