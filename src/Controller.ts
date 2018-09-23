import { IServices } from './services/ServicesFactory';

export interface IController {
    obtainChapters(): Promise<void>;
}

export class Controller implements IController {

    constructor(private services: IServices) { }

    async obtainChapters(): Promise<void> {
        const { bookService, chapterService } = this.services;
        const book = await bookService.getBook();
        const urls = chapterService.getUrlsOfChapters(book);
        const chapters = (await chapterService.getChapters(urls)).filter(Boolean);

        for (const chapter of chapters) {
            chapterService.writeChapter(chapter);
        }
    }
}
