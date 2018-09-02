import { Args } from './args';
import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { getServices } from './services/services';

import { NotabenoidGet } from './NotabenoidGet';

export class App {
    async run(): Promise<void> {
        try {
            const args = new Args();
            const services = getServices(args.getArgs());
            const notabenoidGet = new NotabenoidGet(services);
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
