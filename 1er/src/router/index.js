// Importar los controladores de productos y carritos desde los respectivos archivos
const productsController = require("../controllers/product/controller.products");
const cartsController = require("../controllers/cart/controller.carts");

// Definir una función de enrutamiento que recibe la aplicación Express como argumento
const router = (app) => {
  // Configurar la aplicación para utilizar el controlador de productos en la ruta '/api/products'
  app.use("/api/products", productsController);

  // Configurar la aplicación para utilizar el controlador de carritos en la ruta '/api/carts'
  app.use("/api/carts", cartsController);
};

// Exportar la función de enrutamiento para ser utilizada en otros archivos
module.exports = router;