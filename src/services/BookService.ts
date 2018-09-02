import axios, { AxiosResponse } from 'axios';
import { Service } from './Service';

export class BookService extends Service {

    getBook(): Promise<AxiosResponse<string>> {
        const url = this.getBookUrl();
        return axios(url);
    }

    private getBookUrl(): string {
        const baseUrl = 'https://opennota.duckdns.org';
        const getBookPartUrl = (bookId: string) => `/book/${bookId}`;
        const args = this.args;

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
}
