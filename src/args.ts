import { join } from 'path';
import { RequiredArgumentError } from './errors/RequiredArgumentError';

export const enum EArgKeys {
    DIR = '--dir'
}

interface IProcessArgv {
    [key: string]: string;
}

export interface IArgs {
    bookId?: string;
    url?: string;
    dir: string;
}

export const defaultDir = join('.');

export class Args {

    private args: IArgs = null;

    getArgs(): IArgs {
        if (!this.args) {
            this.args = this.getArgsFromArgv();
        }
        return this.args;
    }

    private getArgsFromArgv(argv: string[] = process.argv): IArgs {
        if (argv.length < 3) {
            throw new RequiredArgumentError();
        }
        const splittedArgv = argv.slice(2).reduce<IProcessArgv>((acc, arg) => {
            const [k, v = null] = arg.split('=');
            acc[k] = v;
            return acc;
        }, {});
        const args: IArgs = {
            dir: defaultDir
        };
        Object.entries(splittedArgv).forEach(([k, v]) => {
            if (!v && k.length && k[0] !== '-') {
                if (/^\d+$/.test(k)) {
                    args.bookId = k;
                } else {
                    args.url = k;
                }
            } else if (k === EArgKeys.DIR) {
                args.dir = v;
            }
        });

        if (!args.url && !args.bookId) {
            throw new RequiredArgumentError();
        }

        return args;
    }
}
