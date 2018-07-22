import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import { join } from 'path';

interface IArgs {
    [key: string]: string | true;
}

interface IUrlOrBookId {
    bookId?: string;
    url?: string;
}

class RequiredArgumentError extends Error {
    message = 'Required argument doesn\'t provided!';
}

function getUrlOrBookId(): IUrlOrBookId {
    if (process.argv.length < 3) {
        throw new RequiredArgumentError();
    }
    const args = process.argv.slice(2).reduce((acc: IArgs, arg) => {
        const [k, v = true] = arg.split('=');
        acc[k] = v;
        return acc;
    }, {});
    const result: IUrlOrBookId = {};
    Object.entries(args).forEach(([k, v]) => {
        if (v && k.length && k[0] !== '-') {
            if (/^\d+$/.test(k)) {
                result.bookId = k;
            } else {
                result.url = k;
            }
        }
    });
    return result;
}

function getBookUrl(): string {
    const baseUrl = 'https://opennota.duckdns.org';
    const getBookPartUrl = (bookId: string) => `/book/${bookId}`;
    const urlOrBookId = getUrlOrBookId();

    if ('url' in urlOrBookId) {
        let url = urlOrBookId.url;
        if (url.slice(-1) === '/') {
            url = url.slice(0, -1);
        }
        return url;
    } else if ('bookId' in urlOrBookId) {
        const bookPartUrl = getBookPartUrl(urlOrBookId.bookId);
        return `${baseUrl}${bookPartUrl}`;
    }
}

async function getChaptersUrls(): Promise<string[]> {
    const bookUrl = getBookUrl();
    const bookHtmlStr = await axios(bookUrl);
    const $ = cheerio.load(bookHtmlStr.data);
    return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
        const chapterId = '/' + $(a).attr('href').split('/').slice(-1);
        return bookUrl + chapterId + params;
    });
}

async function getChapters(urls: string[]): Promise<Array<AxiosResponse<string>>> {
    const getChapter = async (url: string) =>
        axios(url).catch(err => {
            console.error(err);
            return null;
        });
    return Promise.all(urls.map(getChapter));
}

function writeChapter(chapter: AxiosResponse<string>): void {
    const disposition = chapter.headers['content-disposition'];
    const [, fileName] = disposition.match(/filename="(.+)"/);
    writeFile(join(uploadDir, fileName), chapter.data, err => {
        if (err) {
            throw err;
        }
    });
}

async function writeChapters(): Promise<void> {
    const urls = await getChaptersUrls();
    const chapters = (await getChapters(urls)).filter(Boolean);
    for (const chapter of chapters) {
        writeChapter(chapter);
    }
}

const params = '/download?algorithm=0&skip_neg=0&skip_neg=1&author_id=0&format=s&enc=UTF-8&crlf=1';
const uploadDir = join('./');

writeChapters().catch(err => console.error(err));
