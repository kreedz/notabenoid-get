import { RequiredArgumentError } from './errors/RequiredArgumentError';

const enum EArgKeys {
    DIR = '--dir'
}

interface IArgs {
    [key: string]: string;
}

export interface IParsedArgs {
    bookId?: string;
    url?: string;
    dir?: string;
}

export function getParsedArgs(): IParsedArgs {
    if (process.argv.length < 3) {
        throw new RequiredArgumentError();
    }
    const args = process.argv.slice(2).reduce<IArgs>((acc, arg) => {
        const [k, v = null] = arg.split('=');
        acc[k] = v;
        return acc;
    }, {});
    const result: IParsedArgs = {};
    Object.entries(args).forEach(([k, v]) => {
        if (!v && k.length && k[0] !== '-') {
            if (/^\d+$/.test(k)) {
                result.bookId = k;
            } else {
                result.url = k;
            }
        } else if (k === EArgKeys.DIR) {
            result.dir = v;
        }
    });
    return result;
}
