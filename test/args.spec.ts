import { Args, defaultDir, EArgKeys, IArgs } from '../src/args';
import { RequiredArgumentError } from '../src/errors/RequiredArgumentError';

describe('Arguments', () => {
    const processArgv = ['/path/to/node', '/path/to/command'];

    const getProcessArgvWith = (...args: string[]) => [...processArgv, ...args];
    const getExpectedArgs = (args: Partial<IArgs>) => ({ dir: defaultDir, ...args });

    test('should give an object that contains dir field and url field with string value', () => {
        const url = 'http://some.not.validated.url';
        const args = new Args();
        const received = args.getArgs(getProcessArgvWith(url));
        const expected = getExpectedArgs({ url });
        expect(received).toEqual(expected);
    });

    test('should throw RequiredArgumentError if arguments not given', () => {
        const received = () => new Args().getArgs();
        const expected = RequiredArgumentError;
        expect(received).toThrow(expected);
    });

    test('should throw RequiredArgumentError if bookId or url arguments not given', () => {
        const received = () => new Args().getArgs(getProcessArgvWith('--someArg=arg'));
        const expected = RequiredArgumentError;
        expect(received).toThrow(expected);
    });

    test('should give an object that contains dir field and bookId field with string value of numbers', () => {
        const bookId = '4567';
        const received = new Args().getArgs(getProcessArgvWith(bookId));
        const expected = getExpectedArgs({ bookId });
        expect(received).toEqual(expected);
    });

    test('should give an object that contains dir field and url field with string value', () => {
        const url = 'http://some.not.validated.url';
        const received = new Args().getArgs(getProcessArgvWith(url));
        const expected = getExpectedArgs({ url });
        expect(received).toEqual(expected);
    });

    test('should give an object that contains dir field', () => {
        const dir = 'subtitles/eng';
        const bookId = '4567';
        const received = new Args().getArgs(getProcessArgvWith(`${EArgKeys.DIR}=${dir}`, bookId));
        const expected = getExpectedArgs({ dir, bookId });
        expect(received).toEqual(expected);
    });
});
