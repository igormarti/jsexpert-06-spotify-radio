import {jest, expect, describe, test, beforeEach} from '@jest/globals';
import Util from '../_util'
import { FileService } from '../../../server/services/file.service.js';
import FileController from '../../../server/controllers/FileController.js';

describe('#controller - test controller file', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test(`Call function show -  should respond with file stream and file extension`, async () => {
        const mockFileStream = Util.generateReadbleStream(['test']);
        const mockType = '.html'
        const mockFileName = 'test.html'

        jest.spyOn(
            FileService.prototype,
            FileService.prototype.getFileStream.name
        ).mockResolvedValue({
            stream: mockFileStream,
            type: mockType,
        });

        const {stream, type} = await FileController.show(mockFileName)

        expect(stream).toStrictEqual(mockFileStream);
        expect(type).toStrictEqual(type);
    })
})