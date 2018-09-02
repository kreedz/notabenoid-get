import { Args } from './Args';
import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { NotabenoidGet } from './NotabenoidGet';
import { getServices } from './services/services';

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
