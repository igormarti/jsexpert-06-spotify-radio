import fs from 'fs';
import project from '../configs/project.js';
import fsPromises from 'fs/promises'
import {join, extname} from 'path';
const {
    dir: 
    {
        publicDirectory
    }
} = project;

export class FileService {
    createFileStream(filename){
        return fs.createReadStream(filename);
    }

    async getFileInfo(file){
        const fullFilePath =  join(publicDirectory,file);
        await fsPromises.access(fullFilePath);
        const fileType = extname(fullFilePath);
        return {
            type:fileType,
            name: fullFilePath,
        }
    }

    async getFileStream(file){
        const {name,type} = await this.getFileInfo(file);
        return {
            stream: this.createFileStream(name),
            type,
        }
    }
}