import { Args } from './Args';
import { NotabenoidGet } from './NotabenoidGet';
import { getServices } from './services/services';

export async function app(): Promise<void> {
    const args = new Args();
    const services = getServices(args.getArgs());
    const notabenoidGet = new NotabenoidGet(services);
    await notabenoidGet.writeChapters();
}
