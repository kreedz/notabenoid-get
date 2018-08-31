import { IServices } from './services/services';

export class NotabenoidGet {

    constructor(private services: IServices) { }

    async writeChapters(): Promise<void> {
        const { bookService, chapterService } = this.services;
        const book = await bookService.getBook();
        const urls = chapterService.getUrlsOfChapters(book);
        const chapters = (await chapterService.getChapters(urls)).filter(Boolean);

        for (const chapter of chapters) {
            chapterService.writeChapter(chapter);
        }
    }
}
