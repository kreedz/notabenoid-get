import { Controller, IController } from './Controller';
import { IArgs, ParseArgs } from './ParseArgs';
import { IServices, ServicesFactory } from './services/ServicesFactory';

export interface IAppFactory {
    getServices(args: IArgs): IServices;
    getController(services: IServices): IController;
    getArgs(): IArgs;
}

export class AppFactory implements IAppFactory {
    getServices(args: IArgs): IServices {
        return new ServicesFactory(args).get();
    }
    getController(services: IServices): IController {
        return new Controller(services);
    }
    getArgs(): IArgs {
        return new ParseArgs().get();
    }
}
