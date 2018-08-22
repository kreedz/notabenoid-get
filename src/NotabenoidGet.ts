import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import { join } from 'path';
import querystring from 'querystring';
import { getParsedArgs, IParsedArgs } from './args';
import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';

export class NotabenoidGet {
    static params = '/download?' + querystring.stringify({
        algoritm: 0, skip_neg: [0, 1], author_id: 0, format: 's', enc: 'UTF-8', crlf: 1
    });

    private args: IParsedArgs = null;

    run(): void {
        this.writeChapters().catch(err => {
            if (err instanceof RequiredArgumentError) {
                console.log(messages.USAGE);
            } else {
                console.error(err);
            }
        });
    }

    private getArgs(): IParsedArgs {
        if (!this.args) {
            this.args = getParsedArgs();
        }
        return this.args;
    }

    private getBookUrl(): string {
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

    private async getChaptersUrls(): Promise<string[]> {
        const bookUrl = this.getBookUrl();
        const bookHtmlStr = await axios(bookUrl);
        const $ = cheerio.load(bookHtmlStr.data);
        return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
            const chapterId = '/' + $(a).attr('href').split('/').slice(-1);
            return bookUrl + chapterId + NotabenoidGet.params;
        });
    }

    private async getChapters(urls: string[]): Promise<Array<AxiosResponse<string>>> {
        const getChapter = async (url: string) =>
            axios(url).catch(err => {
                console.error(err);
                return null;
            });
        return Promise.all(urls.map(getChapter));
    }

    private writeChapter(chapter: AxiosResponse<string>): void {
        const disposition = chapter.headers['content-disposition'];
        const [, fileName] = disposition.match(/filename="(.+)"/);

        writeFile(join(this.getArgs().dir, fileName), chapter.data, err => {
            if (err) {
                throw err;
            }
        });
    }

    private async writeChapters(): Promise<void> {
        const urls = await this.getChaptersUrls();
        const chapters = (await this.getChapters(urls)).filter(Boolean);
        for (const chapter of chapters) {
            this.writeChapter(chapter);
        }
    }
}
