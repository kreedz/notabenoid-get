import { IArgs } from '../args';
import { BookService } from './BookService';
import { ChapterService } from './ChapterService';

export interface IServices {
    bookService: BookService;
    chapterService: ChapterService;
}

export function getServices(args: IArgs): IServices {
    return {
        bookService: new BookService(args),
        chapterService: new ChapterService(args)
    };
}
