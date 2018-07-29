import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import { join } from 'path';
import querystring from 'querystring';
import { getParsedArgs, IParsedArgs } from './args';

class Notabenoid {
    static params = '/download?' + querystring.stringify({
        algoritm: 0, skip_neg: [0, 1], author_id: 0, format: 's', enc: 'UTF-8', crlf: 1
    });

    private _args: IParsedArgs = null;

    getArgs() {
        if (!this._args) {
            this._args = getParsedArgs();
        }
        return this._args;
    }

    getBookUrl(): string {
        const baseUrl = 'https://opennota.duckdns.org';
        const getBookPartUrl = (bookId: string) => `/book/${bookId}`;
        const args = this.getArgs();

        if ('url' in args) {
            let url = args.url;
            if (url.slice(-1) === '/') {
                url = url.slice(0, -1);
            }
            return url;
        } else if ('bookId' in args) {
            const bookPartUrl = getBookPartUrl(args.bookId);
            return `${baseUrl}${bookPartUrl}`;
        }
    }

    async getChaptersUrls(): Promise<string[]> {
        const bookUrl = this.getBookUrl();
        const bookHtmlStr = await axios(bookUrl);
        const $ = cheerio.load(bookHtmlStr.data);
        return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
            const chapterId = '/' + $(a).attr('href').split('/').slice(-1);
            return bookUrl + chapterId + Notabenoid.params;
        });
    }

    async getChapters(urls: string[]): Promise<Array<AxiosResponse<string>>> {
        const getChapter = async (url: string) =>
            axios(url).catch(err => {
                console.error(err);
                return null;
            });
        return Promise.all(urls.map(getChapter));
    }

    writeChapter(chapter: AxiosResponse<string>): void {
        const disposition = chapter.headers['content-disposition'];
        const [, fileName] = disposition.match(/filename="(.+)"/);

        writeFile(join(this.getArgs().dir, fileName), chapter.data, err => {
            if (err) {
                throw err;
            }
        });
    }

    async writeChapters(): Promise<void> {
        const urls = await this.getChaptersUrls();
        const chapters = (await this.getChapters(urls)).filter(Boolean);
        for (const chapter of chapters) {
            this.writeChapter(chapter);
        }
    }
}

const notabenoid = new Notabenoid();
notabenoid.writeChapters().catch(err => console.error(err));
