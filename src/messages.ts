type TMessageKeys = 'USAGE';

export const messages: { [k in TMessageKeys]: string } = {
    USAGE:
        'Usage: notabenoid [options] url|id\n\n' +
        'Options:\n' +
        ' --dir=<directory>\tDirectory to save files'
};
