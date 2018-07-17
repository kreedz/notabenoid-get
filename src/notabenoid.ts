import axios from 'axios';
import * as cheerio from 'cheerio';
// const args: string[] = process.argv.slice(2);
// --directory /hello/js --bookId 56565

// const uploadDir: string = join('./');
// const files: string[] = [
//     '369809',
//     '369785'
// ];
const baseUrl: string = 'https://opennota.duckdns.org/';
const defaultBookId: string = '69614';
const getBookPartUrl = (bookId: string) => `book/${bookId}/`;
const partBookUrl: string = getBookPartUrl(defaultBookId);
const bookUrl = `${baseUrl}${partBookUrl}`;
// const params: string = 'algorithm=0&skip_neg=0&skip_neg=1&author_id=0&format=s&enc=UTF-8&crlf=1';
// const getFileUrl = (fileName: string) => `${baseUrl}${partBookUrl}${fileName}/download?${params}`;

async function getBookData() {
    try {
        const bookHtmlStr = await axios(bookUrl);
        const $ = cheerio.load(bookHtmlStr.data);
        return $('table#Chapters tr td:nth-child(2) a').toArray().map(a => {
            const href = $(a).attr('href').split('/');
            return href[href.length - 1];
        });

    } catch (e) {
        console.error(e);
    }
}

getBookData().then(data => console.log(data));

// get(bookUrl, bookResponse => {
//     files.forEach((fileName: string) => {
//         const file: WriteStream = createWriteStream(join(`${uploadDir}${fileName}.srt`));
//         const request = get(getFileUrl(fileName), (response) => response.pipe(file));
//     });
// });
