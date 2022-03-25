import project from "./configs/project.js"
import FileController from "./controllers/FileController.js"
import logger from './utils/log.js';

async function routes(request, response){
    const {method, url} = request;

    if(method === 'GET' && url === '/'){
        response.writeHead(302, {
            'Location': project.location.home
        });

        return response.end();
    }

    if(method === 'GET' && url === '/home'){
        const {stream} = await FileController.show(project.pages.home);
        return stream.pipe(response);
    }

    if(method === 'GET' && url === '/controller'){
        const {stream} = await FileController.show(project.pages.controller);
        return stream.pipe(response);
    }

    if(method === 'GET'){
        const {stream, type} =  await FileController.show(url);

        if(project.constants.CONTENT_TYPE[type]){
            response.writeHead(200, {
                'Content-Type': project.constants.CONTENT_TYPE[type]
            });
        }

        return stream.pipe(response);
    }

    response.writeHead(404);
    return response.end();
}

export function handlerError(error, response){
    if(error.message.includes('ENOENT')){
        logger.warn(`asset not found ${error.stack}`);
        response.writeHead(404);
        return response.end();
    }

    logger.error(`caught erro on API ${error.stack}`);
    response.writeHead(500);
    return response.end();
}

export function handler(request, response){
    return routes(request,response).catch( error => handlerError(error,response));
}