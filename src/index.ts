import { App } from './App';

if (require.main === module) {
    const app = new App();
    app.run();
}

export { App };
