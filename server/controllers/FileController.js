import { FileService } from "../services/file.service.js"

class FileController{
    
    constructor(){
         this.fileService = new FileService();
    }

    async show(fileName){
        return this.fileService.getFileStream(fileName);
    }
 }

 export default new FileController();
