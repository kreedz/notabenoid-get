import axios from 'axios';
// import { createWriteStream, WriteStream } from 'fs';
// import { join } from 'path';
import parse5 from 'parse5';
import { DOMParser } from 'xmldom';
import xmlserializer from 'xmlserializer';

import xpath from 'xpath';

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
        const bookHtmlStr = await axios(bookUrl);
        const bookHtml = parse5.parse(bookHtmlStr.data);
        // const xhtmlStr = new XMLSerializer().serializeToString(bookHtml as Node);
        const xhtmlStr = xmlserializer.serializeToString(bookHtml);
        const xhtml = new DOMParser().parseFromString(xhtmlStr);
        // const chaptersIDs = select('//table[@id="Chapters"].//tr/td[2]/a/@href', parsedBook);
        const select = xpath.useNamespaces({ x: 'http://www.w3.org/1999/xhtml' });
        const chapterIDs = select('//x:table[@id="Chapters"]//tr/td[2]/a/@href', xhtml);
        console.log(`chaptersIDs = ${chapterIDs}`);
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
