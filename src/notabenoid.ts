import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import { join } from 'path';

// const args: string[] = process.argv.slice(2);
// --directory /hello/js --bookId 56565
const baseUrl = 'https://opennota.duckdns.org';
const defaultBookId = '69614';
const getBookPartUrl = (bookId: string) => `/book/${bookId}/`;
const partBookUrl = getBookPartUrl(defaultBookId);
const bookUrl = `${baseUrl}${partBookUrl}`;
const params = '/download?algorithm=0&skip_neg=0&skip_neg=1&author_id=0&format=s&enc=UTF-8&crlf=1';
const uploadDir = join('./');

async function getUrls() {
    try {
        const bookHtmlStr = await axios(bookUrl);
        const $ = cheerio.load(bookHtmlStr.data);
        return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
            const href = $(a).attr('href');
            return baseUrl + href + params;
        });
    } catch (e) {
        console.error(e);
    }
}

async function writeChapter(url: string) {
    const chapter = await axios(url);
    const disposition = chapter.headers['content-disposition'];
    const [, fileName] = disposition.match(/filename="(.+)"/);
    writeFile(join(uploadDir, fileName), chapter.data, err => {
        if (err) {
            throw err;
        }
    });
}

async function writeChapters() {
    try {
        const urls = await getUrls();
        urls.forEach(url => writeChapter(url));
    } catch (e) {
        console.error(e);
    }
}

writeChapters();
