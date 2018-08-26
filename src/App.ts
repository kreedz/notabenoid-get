import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { NotabenoidGet } from './NotabenoidGet';

export class App {
    async run(): Promise<void> {
        try {
            const notabenoidGet = new NotabenoidGet();
            await notabenoidGet.writeChapters();
        } catch (err) {
            if (err instanceof RequiredArgumentError) {
                console.log(messages.USAGE);
            } else {
                console.error(err);
            }
        }
    }
}
