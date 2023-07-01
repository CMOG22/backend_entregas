// Importar el módulo 'fs' para trabajar con el sistema de archivos
const fs = require("fs");

// Definir la ruta del archivo 'carts.json'
const path = "./mock/carts.json";

// Clase 'CartManager' para manejar la gestión de carritos
class CartManager {
  // Ruta del archivo 'carts.json' (puede ser modificada según el uso)
  static #path = "./mock/carts.json";

  constructor() {
    // Arreglo para almacenar los carritos
    this.carts = [];
    // Asignar la ruta del archivo 'carts.json'
    CartManager.#path;
  }

  // Método privado para obtener el siguiente ID disponible para un carrito
  _getNextId = () => {
    const count = this.carts.length;
    const nextId = count > 0 ? this.carts[count - 1].id + 1 : 1;

    return nextId;
  };

  // Método para crear un nuevo carrito
  createCart = async () => {
    // Obtener todos los carritos existentes
    const carts = await this.getCarts();

    try {
      // Crear un nuevo carrito con un ID único
      const cart = {
        id: this._getNextId(),
        products: [],
      };

      // Agregar el nuevo carrito al arreglo
      carts.push(cart);

      // Escribir el arreglo actualizado en el archivo 'carts.json'
      await fs.promises.writeFile(
        CartManager.#path,
        JSON.stringify(carts, null, "\t")
      );

      return carts;
    } catch (err) {
      return console.log(err);
    }
  };

  // Método para obtener todos los carritos
  getCarts = async () => {
    try {
      // Leer el contenido del archivo 'carts.json'
      const data = await fs.promises.readFile(CartManager.#path, "utf-8");
      // Parsear los datos como un arreglo de carritos
      const carts = JSON.parse(data);
      // Actualizar el arreglo de carritos en la instancia
      this.carts = carts;
      return carts;
    } catch {
      console.log("File not found");
      return [];
    }
  };

  // Método para obtener un carrito por su ID
  getCartById = async (idCart) => {
    const carts = await this.getCarts();
    try {
      // Buscar el carrito con el ID especificado
      const cartId = Object.values(carts).find((cart) => cart.id === idCart);

      if (cartId === undefined) {
        console.error("Cart does not exist");
        return "Cart does not exist";
      } else {
        console.log(cartId);
        return cartId;
      }
    } catch (err) {
      return console.error(err);
    }
  };

  // Método para actualizar un carrito con un producto y su cantidad
  updateCart = async (idCart, idProduct, quantity = 1) => {
    const carts = await this.getCarts();
    try {
      // Encontrar el carrito con el ID especificado
      const cart = await carts.find((cart) => cart.id === idCart);
      if (cart === undefined) {
        return console.log(`Cart with id: ${idCart} does not exist`);
      }

      // Verificar si el carrito ya tiene una lista de productos
      if (!cart.products) {
        cart.products = [];
        return console.log(`The cart does not have products`);
      }

      // Verificar si el producto ya existe en el carrito
      const productExist = cart.products.find(
        (product) => product.id === idProduct
      );
      if (productExist) {
        // Actualizar la cantidad del producto existente
        productExist.quantity += quantity;
      } else {
        // Agregar un nuevo producto al carrito
        cart.products.push({
          id: idProduct,
          quantity,
        });
      }

      // Escribir el arreglo actualizado en el archivo 'carts.json'
      await fs.promises.writeFile(
        CartManager.#path,
        JSON.stringify(carts, null, "\t")
      );

      return cart;
    } catch (err) {
      return console.error(err);
    }
  };

  // Método para eliminar un carrito por su ID
  deleteCart = async (idCart) => {
    let carts = await this.getCarts();
    try {
      // Encontrar el carrito con el ID especificado
      const cart = Object.values(carts).find((cart) => cart.id === idCart);
      if (cart) {
        // Filtrar los carritos para eliminar el carrito con el ID especificado
        carts = carts.filter((item) => item.id !== idCart);
        // Escribir el arreglo actualizado en el archivo 'carts.json'
        await fs.promises.writeFile(path, JSON.stringify(carts), "utf-8");

        return console.log("Cart removed");
      } else {
        return console.error("Cart does not exist");
      }
    } catch (err) {
      return console.error(err);
    }
  };
}

// Exportar la clase 'CartManager' para ser utilizada en otros archivos
module.exports = CartManager;
