import { App } from './App';

const app = new App();
app.runCli(require.main, module);

export { App };
