import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { IArgs } from '../ParseArgs';

export type TGet = AxiosPromise<string>;
export type TGetResponse = AxiosResponse<string>;

export class Service {

    constructor(protected args: IArgs) { }

    protected get(url: string): TGet {
        return axios(url);
    }

}
