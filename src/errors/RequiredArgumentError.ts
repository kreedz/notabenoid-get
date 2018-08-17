export enum ErrorCode {
    URL_OR_ID_MISSING = 'URL_OR_ID_MISSING'
}

export const ErrorMessage: { [k in keyof typeof ErrorCode]: string } = {
    [ErrorCode.URL_OR_ID_MISSING]: 'Provide url or id to book!'
};

export class RequiredArgumentError extends Error {
    constructor(message: string = ErrorMessage[ErrorCode.URL_OR_ID_MISSING]) {
        super(message);
    }
}
