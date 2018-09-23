import { AppFactory, IAppFactory } from './AppFactory';
import { RequiredArgumentError } from './errors/RequiredArgumentError';
import { messages } from './messages';
import { IArgs } from './ParseArgs';

export class App {
    constructor(private factory: IAppFactory = new AppFactory()) { }

    async run(args: IArgs): Promise<void> {
        const services = this.factory.getServices(args);
        const controller = this.factory.getController(services);
        await controller.obtainChapters();
    }

    async runCli(main: NodeModule, nodeModule: NodeModule): Promise<void> {
        try {
            if (main === nodeModule) {
                const args = this.factory.getArgs();
                await this.run(args);
            }
        } catch (err) {
            if (err instanceof RequiredArgumentError) {
                console.log(messages.USAGE);
            } else {
                console.error(err);
            }
        }
    }

}
