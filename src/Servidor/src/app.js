import express from "express";
import { ProductManager } from "./dao/ProductManager.js";
import { librosRouter } from "./routes/Libros.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { __dirname } from "./utils.js";
import path from "path";
import handlebars from "express-handlebars";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.route.js";
 
// Creando app
const port = 8080;
const app = express();

// Middleware para parsear los datos del body de las peticiones http
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración del middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

//api
app.use("/api/libros", librosRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/produsts", productsRouter);

// Levantar servidor
app.listen(port, () =>
  console.log(`El servidor está escuchando en el puerto ${port}`)
);

//configurar hbs
app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"./views"));


//Crear la instancia de la clase 
const productServices = new ProductManager("./products.json");

let products = [];

// Rutas

app.get("/productos", (req, res) => {
  res.render('home', { products: products })
});

// post:crear item
app.post("/productos", (req, res) => {
  const product = req.body;
  products.push(product);
  res.send("Item Creado con éxito");
});

// Actualizar producto
app.put("/productos/:name", (req, res) => {
  const productName = req.params.name;
  const newInfo = req.body;
  const productIndex = products.findIndex(
    (product) => product.nombre === productName
  );
  if (productIndex >= 0) {
    products[productIndex] = newInfo;
    res.json({
      status: "success",
      message: "Librería actualizada, disfruta tu elección",
    });
  } else {
    res.status(404).json({
      status: "error",
      message: "El libro no existe, vuelve a intentarlo",
    });
  }
});

// Eliminar producto
app.delete("/productos/:name", (req, res) => {
  const productName = req.params.name;
  const productIndex = products.findIndex((product) => product.nombre === productName);

  if (productIndex >= 0) {
    products.splice(productIndex, 1);
    res.json({ status: "success", message: "Producto eliminado" });
  } else {
    res.status(404).json({
      status: "error",
      message: "El libro no existe, vuelve a intentarlo",
    });
  }
});