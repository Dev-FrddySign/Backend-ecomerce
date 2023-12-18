import { Router } from "express";

const router = Router();

const libros = [];

const isAdmin = true;
//middleware de endpoint
const middlewareEndpoint = (req, res, next) => {
    if (isAdmin) {
        next();
    } else {
        res.json({status:"error", message:"no tienes permisos"});
    }
};

//http://localhost:8080/api/libros
router.get("/", middlewareEndpoint, (req,res) => {
    res.json({status:"success", data:libros});
});

router.post("/", (req,res) => {
    const newLibro = req.body;
    libros.push(newLibro);
    res.json({status:"sucess", menssage:"libro creado"});
});

export {router as librosRouter}