import { ErrorCode, ErrorMessage, RequiredArgumentError } from '../src/errors/RequiredArgumentError';

describe('RequiredArgumentError', () => {
    function throwError(message?: string) {
        if (typeof message !== 'undefined') {
            throw new RequiredArgumentError(message);
        } else {
            throw new RequiredArgumentError();
        }
    }

    test('should throw an error with default error message', () => {
        const received = throwError;
        const expected = ErrorMessage[ErrorCode.URL_OR_ID_MISSING];
        expect(received).toThrow(expected);
    });

    test('should throw an error with specific error message', () => {
        const errorMessage = 'error message';
        const received = () => throwError(errorMessage);
        const expected = errorMessage;
        expect(received).toThrow(expected);
    });
});
