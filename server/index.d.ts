import { Express } from 'express';

declare const app: Express;
declare const server: Server<typeof IncomingMessage, typeof ServerResponse>
export { app, server };
