import { Args } from './Args';
import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { NotabenoidGet } from './NotabenoidGet';
import { getServices } from './services/services';

async function app(): Promise<void> {
    const args = new Args();
    const services = getServices(args.getArgs());
    const notabenoidGet = new NotabenoidGet(services);
    await notabenoidGet.writeChapters();
}

export async function runApp(): Promise<void> {
    await app().catch(err => {
        if (err instanceof RequiredArgumentError) {
            console.log(messages.USAGE);
            process.exit();
        } else {
            console.error(err);
        }
    });
}
