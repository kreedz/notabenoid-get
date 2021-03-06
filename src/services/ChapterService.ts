import * as cheerio from 'cheerio';
import { writeFile } from 'fs';
import { join } from 'path';
import querystring from 'querystring';
import { Service, TGetResponse } from './Service';

export class ChapterService extends Service {
    static params = '/download?' + querystring.stringify({
        algoritm: 0, skip_neg: [0, 1], author_id: 0, format: 's', enc: 'UTF-8', crlf: 1
    });

    getUrlsOfChapters(book: TGetResponse): string[] {
        const $ = cheerio.load(book.data);
        return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
            const chapterId = '/' + $(a).attr('href').split('/').slice(-1);
            return book.config.url + chapterId + ChapterService.params;
        });
    }

    getChapters(urls: string[]): Promise<TGetResponse[]> {
        const getChapter = async (url: string) =>
            this.get(url).catch(err => {
                console.error(err);
                return null;
            });
        return Promise.all(urls.map(getChapter));
    }

    writeChapter(chapter: TGetResponse): void {
        const disposition = chapter.headers['content-disposition'];
        const [, fileName] = disposition.match(/filename="(.+)"/);

        writeFile(join(this.args.dir, fileName), chapter.data, err => {
            if (err) {
                throw err;
            }
        });
    }
}
