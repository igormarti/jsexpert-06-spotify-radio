import server from "./server.js";
import logger from './utils/log.js';
import project from './configs/project.js';

server.listen(project.port)
.on('listening', () => {
    logger.info(`server running at port ${project.port}`)
});