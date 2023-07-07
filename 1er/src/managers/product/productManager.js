// Importar el módulo 'fs' para trabajar con el sistema de archivos
const fs = require("fs");

// Clase 'ProductManager' para manejar la gestión de productos
class ProductManager {
  // Ruta del archivo 'products.json' (puede ser modificada según el uso)
  static #path = "./mock/products.json";

  constructor() {
    // Arreglo para almacenar los productos
    this.products = [];
    // Asignar la ruta del archivo 'products.json'
    this.path = ProductManager.#path;
  }

  // Método privado para obtener el siguiente ID disponible para un producto
  _getNextId = () => {
    const count = this.products.length;
    const nextId = count > 0 ? this.products[count - 1].id + 1 : 1;

    return nextId;
  };

  // Método para agregar un nuevo producto
  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category
  ) => {
    // Obtener todos los productos existentes
    const products = await this.getProducts();

    try {
      // Crear un nuevo producto con un ID único
      const product = {
        id: this._getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status: true,
      };

      // Verificar si ya existe un producto con el mismo código
      if (products.find((product) => product.code === code)) {
        return console.log(
          `The product with code: ${product.code} already exists\n`
        );
      } else {
        // Agregar el nuevo producto al arreglo
        products.push(product);

        // Escribir el arreglo actualizado en el archivo 'products.json'
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );

        return console.log(products);
      }
    } catch (err) {
      return console.log(err);
    }
  };

  // Método para obtener todos los productos
  getProducts = async () => {
    try {
      // Leer el contenido del archivo 'products.json'
      const data = await fs.promises.readFile(this.path, "utf-8");
      // Parsear los datos como un arreglo de productos
      const products = JSON.parse(data);
      // Actualizar el arreglo de productos en la instancia
      this.products = products;
      return products;
    } catch (err) {
      console.log("File not found");
      return [];
    }
  };

  // Método para obtener un producto por su ID
  getProductById = async (id) => {
    const products = await this.getProducts();
    try {
      // Buscar el producto con el ID especificado
      const product = products.find((product) => product.id === id);

      if (product === undefined) {
        console.log("Product does not exist");
        return null;
      } else {
        console.log(product);
        return product;
      }
    } catch (err) {
      return console.error(err);
    }
  };

  // Método para actualizar un producto con propiedades específicas
  updateProduct = async (id, propsProduct) => {
    const products = await this.getProducts();
    try {
      // Encontrar el producto con el ID especificado
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        return console.log(`Product with id: ${id} does not exist`);
      }
      if (
        propsProduct.hasOwnProperty("id") ||
        propsProduct.hasOwnProperty("code")
      ) {
        return console.log("Cannot update 'id' or 'code' property");
      }

      // Actualizar las propiedades del producto con las proporcionadas
      Object.assign(products[productIndex], propsProduct);

      // Escribir el arreglo actualizado en el archivo 'products.json'
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      // Obtener el producto actualizado
      const updatedProduct = products[productIndex];

      console.log(updatedProduct);
      return updatedProduct;
    } catch (err) {
      return console.error(err);
    }
  };

  // Método para eliminar un producto por su ID
  deleteProduct = async (id) => {
    let products = await this.getProducts();
    try {
      // Encontrar el producto con el ID especificado
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex !== -1) {
        // Filtrar los productos para eliminar el producto con el ID especificado
        products.splice(productIndex, 1);
        // Escribir el arreglo actualizado en el archivo 'products.json'
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );

        return console.log("Product removed");
      } else {
        return console.error("Product does not exist");
      }
    } catch (err) {
      return console.error(err);
    }
  };
}

// Exportar la clase 'ProductManager' para ser utilizada en otros archivos
module.exports = ProductManager;