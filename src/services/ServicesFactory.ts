import { IArgs } from '../ParseArgs';
import { BookService } from './BookService';
import { ChapterService } from './ChapterService';

export interface IServices {
    bookService: BookService;
    chapterService: ChapterService;
}

export class ServicesFactory {
    constructor(private args: IArgs) { }
    get(): IServices {
        return {
            bookService: new BookService(this.args),
            chapterService: new ChapterService(this.args)
        };
    }
}
