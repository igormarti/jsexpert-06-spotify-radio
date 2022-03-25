import {createServer} from 'http';
import 'dotenv/config';
import {handler} from './routes.js';

export default createServer(handler);