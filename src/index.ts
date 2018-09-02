import { app } from './App';

if (require.main === module) {
    app().catch(err => console.error(err));
}

export { app };
