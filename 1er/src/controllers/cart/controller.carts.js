// Importar el módulo 'CartManager' desde el archivo correspondiente
const CartManager = require("../../managers/cart/cartManager");

// Crear una instancia de 'CartManager'
const cartManager = new CartManager();

// Importar el módulo 'Router' desde Express
const { Router } = require("express");

// Crear un nuevo enrutador utilizando el método 'Router'
const router = Router();

// Definir una ruta POST en la raíz ('/') del enrutador
router.post("/", async (req, res) => {
  try {
    // Crear un nuevo carrito utilizando el método 'createCart' del 'CartManager'
    const newCart = await cartManager.createCart();
    res.status(200).json("A new cart was created");
  } catch (err) {
    res.status(400).json({ error400: "Error creating cart" });
  }
});

// Definir una ruta POST con parámetros en el enrutador
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    // Actualizar el carrito utilizando el método 'updateCart' del 'CartManager'
    const update = await cartManager.updateCart(Number(cid), Number(pid), quantity);
    if (update) {
      res
        .status(200)
        .json(`The product ${pid} in cart ${cid} was successfully updated`);
    } else {
      res.status(404).json({ error404: "Not Found" });
    }
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

// Definir una ruta GET en la raíz ('/') del enrutador
router.get("/", async (req, res) => {
  try {
    // Obtener todos los carritos utilizando el método 'getCarts' del 'CartManager'
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

// Definir una ruta GET con parámetros en el enrutador
router.get("/:cid", async (req, res) => {
  let { cid } = req.params;
  try {
    // Obtener un carrito por su ID utilizando el método 'getCartById' del 'CartManager'
    const cart = await cartManager.getCartById(Number(cid));
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ error404: "Not Found" });
  }
});

// Definir una ruta DELETE con parámetros en el enrutador
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Eliminar un carrito por su ID utilizando el método 'deleteCart' del 'CartManager'
    await cartManager.deleteCart(Number(cid));
    res.status(200).json(`Cart with id: ${cid} was removed`);
  } catch (err) {
    res.status(400).json({ error400: "Bad Request" });
  }
});

// Exportar el enrutador para ser utilizado en otros archivos
module.exports = router;
