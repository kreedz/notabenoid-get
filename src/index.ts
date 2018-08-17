import { NotabenoidGet } from './notabenoidGet';

if (require.main === module) {
    const notabenoidGet = new NotabenoidGet();
    notabenoidGet.run();
}

export { NotabenoidGet };
