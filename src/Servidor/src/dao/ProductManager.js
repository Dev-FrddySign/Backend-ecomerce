import fs from "fs";

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const fileContent = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(fileContent);
        } catch (error) {
            throw new Error("Error al leer el archivo de productos");
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newProduct = { id: products.length + 1, ...product };
            products.push(newProduct);
            await this.saveProducts(products);
            return newProduct;
        } catch (error) {
            throw new Error("Error al agregar el producto");
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === id);
        } catch (error) {
            throw new Error("Error al obtener el producto por ID");
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                // Mantener el mismo ID al actualizar
                updatedProduct.id = id;
                products[index] = updatedProduct;
                await this.saveProducts(products);
                return updatedProduct;
            } else {
                throw new Error("Producto no encontrado para actualizar");
            }
        } catch (error) {
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const updatedProducts = products.filter(product => product.id !== id);
            await this.saveProducts(updatedProducts);
        } catch (error) {
            throw new Error("Error al eliminar el producto");
        }
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
        } catch (error) {
            throw new Error("Error al guardar los productos en el archivo");
        }
    }
}

// Ejemplo de uso:
const pathToProductsFile = "./products.json";
const productManager = new ProductManager(pathToProductsFile);

// Agregar un producto
productManager.addProduct({
    id: "5",
    title: "La leyenda de la peregrina",
    category: "Aventuras",
    description: "By Carmen Posadas",
    price: 2120,
    img: "Servidor/public/imagenes/La_Leyenda_de_la_Pelegrina.jpg",
    stock: 5
})
    .then(newProduct => {
        console.log("Producto agregado:", newProduct);
    })
    .catch(error => {
        console.error(error.message);
    });

// Obtener todos los productos
productManager.getProducts()
    .then(products => {
        console.log("Todos los productos:", products);
    })
    .catch(error => {
        console.error(error.message);
    });

// Obtener un producto por ID
productManager.getProductById(1)
    .then(product => {
        console.log("Producto por ID:", product);
    })
    .catch(error => {
        console.error(error.message);
    });

// Actualizar un producto por ID
productManager.updateProduct(1, {
    id: "4",
    title: "Harry Potter y las reliquías de la muerte ",
    category: "Accion",
    description: "By J. K. Rowling ",
    price: 2000,
    img: "Servidor/public/imagenes/harry-potter-y-las-reliquias-de-la-muerte-harry-potter-7.jpg",
    stock: 5
})
    .then(updatedProduct => {
        console.log("Producto actualizado:", updatedProduct);
    })
    .catch(error => {
        console.error(error.message);
    });

// Eliminar un producto por ID
productManager.deleteProduct(1)
    .then(() => {
        console.log("Producto eliminado con éxito");
    })
    .catch(error => {
        console.error(error.message);
    });