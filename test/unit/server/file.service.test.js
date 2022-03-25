import {jest, expect, describe, test, beforeEach} from '@jest/globals';
import Util from '../_util'
import { FileService } from '../../../server/services/file.service.js';
import fs from 'fs';
import fsPromises from 'fs/promises';
import project from '../../../server/configs/project'
import {join} from 'path'

const {
    dir:{
        publicDirectory
    }
} = project;

describe('#service - test service file', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    test(`Call service createFileStream -  should response with file stream readable`, async () => {
        const mockFileStream = Util.generateReadbleStream(['test']);
        const mockFileName = 'test.mp3'

        jest.spyOn(
            fs,
            fs.createReadStream.name
        ).mockReturnValue(mockFileStream);

        const fileservice = new FileService();
        const filestream = fileservice.createFileStream(mockFileName);

        expect(filestream).toStrictEqual(mockFileStream);
        expect(fs.createReadStream).toHaveBeenCalledWith(mockFileName);
    })

    test(`Call service getFileInfo -  should response with file info(type and name)`, async () => {
        const mockFileStream = Util.generateReadbleStream(['test']);
        const mockFileName = 'test.mp3'
        const mockFileType = '.mp3'

        jest.spyOn(
            fsPromises,
            fs.access.name
        ).mockResolvedValue(mockFileStream);

        const fileservice = new FileService();
        const result = await fileservice.getFileInfo(mockFileName);

        expect(result).toStrictEqual({
            type:mockFileType,
            name: join(publicDirectory,mockFileName)
        });
    });

    test(`Call service getFileStream -  should response with stream and file`, async () => {
        const mockFileStream = Util.generateReadbleStream(['test']);
        const mockFileName = 'test.mp3'
        const mockFileType = '.mp3'

        jest.spyOn(
            fsPromises,
            fs.access.name
        ).mockResolvedValue(mockFileStream);

        jest.spyOn(
            fs,
            fs.createReadStream.name
        ).mockReturnValue(mockFileStream);

        const fileservice = new FileService();
        const result = await fileservice.getFileStream(mockFileName)

        expect(result).toStrictEqual({
            stream:mockFileStream,
            type: mockFileType
        });
    });
})