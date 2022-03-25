import {jest, expect, describe, test, beforeEach} from '@jest/globals';
import Util from '../_util'
import {handler} from '../../../server/routes.js';
import project from '../../../server/configs/project.js';
import FileController from '../../../server/controllers/FileController.js';

describe('#Routes - test site for response API', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test('GET / - should redirect to home page', async () => {
        const params = Util.defaultHandlerParams();
        params.request.method = 'GET';
        params.request.url =  '/';

        await handler(...params.values())
        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': project.location.home
            }
        );
    })


    test(`GET /home - should response with ${project.pages.home} file stream `, async () => {
        const params = Util.defaultHandlerParams();
        params.request.method = 'GET';
        params.request.url =  '/home';
        const mockFileStream = Util.generateReadbleStream(['data']);

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockResolvedValue({
            stream: mockFileStream
        });

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values())

        expect(FileController.show).toBeCalledWith(project.pages.home);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    })

    test(`GET /home - should response with ${project.pages.controller} file stream `, async () => {
        const params = Util.defaultHandlerParams();
        params.request.method = 'GET';
        params.request.url =  '/controller';
        const mockFileStream = Util.generateReadbleStream(['data']);

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockResolvedValue({
            stream: mockFileStream
        });

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values())

        expect(FileController.show).toBeCalledWith(project.pages.controller);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    })


    test(`GET /index.html - should response with file stream `, async () => {
        const params = Util.defaultHandlerParams();
        const FileName = '/index.html';
        const FileExt = '.html';
        params.request.method = 'GET';
        params.request.url = FileName;
        const mockFileStream = Util.generateReadbleStream(['data']);

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockResolvedValue({
            stream: mockFileStream,
            type: FileExt,
        });

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values())

        expect(FileController.show).toBeCalledWith(FileName);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).toHaveBeenCalledWith(200,{
            'Content-Type': project.constants.CONTENT_TYPE[FileExt]
        })
    })

    test(`GET /file.ext - should response with file stream `, async () => {
        const params = Util.defaultHandlerParams();
        const FileName = '/file.ext';
        const FileExt = '.ext';
        params.request.method = 'GET';
        params.request.url = FileName;
        const mockFileStream = Util.generateReadbleStream(['data']);

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockResolvedValue({
            stream: mockFileStream,
            type: FileExt,
        });

        jest.spyOn(
            mockFileStream,
            "pipe"
        ).mockReturnValue();

        await handler(...params.values())

        expect(FileController.show).toBeCalledWith(FileName);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).not.toBeCalled();
    })

    test(`GET /unknown - give an inexistent route it should response with 404`, async () => {
        const params = Util.defaultHandlerParams();

        params.request.method = 'POST';
        params.request.url = '/unknown';

        await handler(...params.values())

        expect(params.response.writeHead).toBeCalledWith(404);
        expect(params.response.end).toBeCalled();
    })
});

describe('Exception', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test('give inexistent file it should response with 404', async () => {
        const params = Util.defaultHandlerParams();

        params.request.method = 'GET';
        params.request.url = '/index.png';

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockRejectedValue(new Error('Error: ENOENT: no suck file or directory'));

        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    })


    test('give an error it should response with 500', async () => {
        const params = Util.defaultHandlerParams();
        params.request.method = 'GET';
        params.request.url = '/index.png';

        jest.spyOn(
            FileController,
            FileController.show.name
        ).mockRejectedValue(new Error('Error:'));

        await handler(...params.values())

        expect(params.response.writeHead).toHaveBeenCalledWith(500);
        expect(params.response.end).toHaveBeenCalled();
    })
});