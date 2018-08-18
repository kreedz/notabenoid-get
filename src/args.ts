import { join } from 'path';
import { RequiredArgumentError } from './errors/RequiredArgumentError';

export const enum EArgKeys {
    DIR = '--dir'
}

interface IArgs {
    [key: string]: string;
}

export interface IParsedArgs {
    bookId?: string;
    url?: string;
    dir: string;
}

export const defaultDir = join('.');

export function getParsedArgs(argv: string[] = process.argv): IParsedArgs {
    if (argv.length < 3) {
        throw new RequiredArgumentError();
    }
    const args = argv.slice(2).reduce<IArgs>((acc, arg) => {
        const [k, v = null] = arg.split('=');
        acc[k] = v;
        return acc;
    }, {});
    const result: IParsedArgs = {
        dir: defaultDir
    };
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

    if (!result.url && !result.bookId) {
        throw new RequiredArgumentError();
    }

    return result;
}
