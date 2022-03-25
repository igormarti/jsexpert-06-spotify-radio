import pino from 'pino';
import 'dotenv/config';

const log = pino({
    enabled: !(!!process.env.LOG_DISABLED),
    transport:{
        target: 'pino-pretty',
        options:{
            colorize: true
        }
    }
})

export default log;