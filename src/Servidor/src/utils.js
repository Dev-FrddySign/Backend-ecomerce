import path from 'path';
import multer from "multer";
import { fileURLToPath } from 'url';
export const __dirname = path.dirname(fileURLToPath(import.meta.url));


const storageFile = multer.diskStorage({
    //carpeta donde se guardan las imagenes
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../public/imagenes"))
    },
    // con que nombre se guarda el archivo
    filename: function(req, file, cb){
        cb(null, Date.now() +"-"+ file.originalname)
    }
});

//middleware de multer
export const uploader = multer({storage:storageFile});