import { BookService } from './BookService';
import { ChapterService } from './ChapterService';

export interface IServices {
    bookService: BookService;
    chapterService: ChapterService;
}

export const services: IServices = {
    bookService: new BookService(),
    chapterService: new ChapterService()
};
