import { RequiredArgumentError } from '../src/errors/RequiredArgumentError';
import { defaultDir, EArgKeys, IArgs, ParseArgs } from '../src/ParseArgs';

describe('Arguments', () => {
    const processArgv = ['/path/to/node', '/path/to/command'];

    const getProcessArgvWith = (...args: string[]) => [...processArgv, ...args];
    const getExpectedArgs = (args: Partial<IArgs>) => ({ dir: defaultDir, ...args });

    test('should give an object that contains dir field and url field with string value', () => {
        const url = 'http://some.not.validated.url';
        const args = new ParseArgs(getProcessArgvWith(url));
        const received = args.getArgs();
        const expected = getExpectedArgs({ url });
        expect(received).toEqual(expected);
    });

    test('should throw RequiredArgumentError if arguments not given', () => {
        const received = () => new ParseArgs(getProcessArgvWith()).getArgs();
        const expected = RequiredArgumentError;
        expect(received).toThrow(expected);
    });

    test('should throw RequiredArgumentError if bookId or url arguments not given', () => {
        const received = () => new ParseArgs(getProcessArgvWith('--someArg=arg')).getArgs();
        const expected = RequiredArgumentError;
        expect(received).toThrow(expected);
    });

    test('should give an object that contains dir field and bookId field with string value of numbers', () => {
        const bookId = '4567';
        const received = new ParseArgs(getProcessArgvWith(bookId)).getArgs();
        const expected = getExpectedArgs({ bookId });
        expect(received).toEqual(expected);
    });

    test('should give an object that contains dir field and url field with string value', () => {
        const url = 'http://some.not.validated.url';
        const received = new ParseArgs(getProcessArgvWith(url)).getArgs();
        const expected = getExpectedArgs({ url });
        expect(received).toEqual(expected);
    });

    test('should give an object that contains dir field', () => {
        const dir = 'subtitles/eng';
        const bookId = '4567';
        const received = new ParseArgs(getProcessArgvWith(`${EArgKeys.DIR}=${dir}`, bookId)).getArgs();
        const expected = getExpectedArgs({ dir, bookId });
        expect(received).toEqual(expected);
    });
});
