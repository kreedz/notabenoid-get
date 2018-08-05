export enum ErrorCode {
    DEFAULT = 'DEFAULT',
    URL_OR_ID_MISSING = 'URL_OR_ID_MISSING'
}

export const ErrorMessage: { [k in keyof typeof ErrorCode]: string } = {
    [ErrorCode.DEFAULT]: 'Required argument doesn\'t provided!',
    [ErrorCode.URL_OR_ID_MISSING]: 'Provide url or id to book!'
};

export const ErrorURLOrIDMissingMessage = ErrorMessage[ErrorCode.URL_OR_ID_MISSING];

export class RequiredArgumentError extends Error {
    message = 'Required argument doesn\'t provided!';
    constructor(message: string = ErrorMessage[ErrorCode.DEFAULT]) {
        super(message);
    }
}
