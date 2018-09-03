import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { NotabenoidGet } from './NotabenoidGet';
import { ParseArgs } from './ParseArgs';
import { getServices } from './services/services';

export async function app(args = new ParseArgs()): Promise<void> {
    const services = getServices(args.getArgs());
    const notabenoidGet = new NotabenoidGet(services);
    await notabenoidGet.writeChapters();
}

export async function cliApp(main: NodeModule, module: NodeModule): Promise<void> {
    try {
        if (main === module) {
            await app();
        }
    } catch (err) {
        if (err instanceof RequiredArgumentError) {
            console.log(messages.USAGE);
        } else {
            console.error(err);
        }
    }
}
