import { ServicesContainer } from './services/ServicesContainer';

export class NotabenoidGet {

    private services: ServicesContainer = new ServicesContainer();

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
