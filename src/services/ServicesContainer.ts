import { BookService } from './BookService';
import { ChapterService } from './ChapterService';

export class ServicesContainer {

    bookService: BookService = new BookService();

    chapterService: ChapterService = new ChapterService();
}
