// Importar el módulo 'ProductManager' desde el archivo correspondiente
const ProductManager = require("../../managers/product/productManager");

// Crear una instancia de 'ProductManager'
const productManager = new ProductManager();

// Importar el módulo 'Router' desde Express
const { Router } = require("express");

// Crear un nuevo enrutador utilizando el método 'Router'
const router = Router();

// Definir una ruta POST en la raíz ('/') del enrutador
router.post("/", async (req, res) => {
  // Extraer los campos del cuerpo de la solicitud
  const { title, description, price, code, stock, category } = req.body;
  const thumbnail = req.body.thumbnail || [];

  // Verificar que todos los campos requeridos estén presentes
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Obtener todos los productos utilizando el método 'getProducts' del 'ProductManager'
    const products = await productManager.getProducts();

    // Verificar si ya existe un producto con el mismo código
    if (products.find((product) => product.code === code)) {
      res.status(409).json({ error: `The product with code: ${code} already exists` });
    } else {
      // Agregar un nuevo producto utilizando el método 'addProduct' del 'ProductManager'
      await productManager.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
      );
      res.status(201).json("Product created successfully");
    }
  } catch (err) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// Definir una ruta GET en la raíz ('/') del enrutador
router.get("/", async (req, res) => {
  // Obtener el parámetro 'limit' de la consulta
  const limit = parseInt(req.query.limit);

  try {
    // Obtener todos los productos utilizando el método 'getProducts' del 'ProductManager'
    const products = await productManager.getProducts();

    // Verificar si se proporcionó el parámetro 'limit'
    if (!isNaN(limit) && limit >= 1) {
      // Obtener un número limitado de productos utilizando el método 'slice' de JavaScript
      const limitedProducts = products.slice(0, limit);
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// Definir una ruta GET con parámetros en el enrutador
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Obtener un producto por su ID utilizando el método 'getProductById' del 'ProductManager'
    const product = await productManager.getProductById(Number(pid));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// Definir una ruta PUT con parámetros en el enrutador
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;
  try {
    // Actualizar un producto utilizando el método 'updateProduct' del 'ProductManager'
    const updatedProduct = await productManager.updateProduct(Number(pid), props);
    if (!updatedProduct) {
      res.status(404).json({ error: `Product with id: ${pid} not found.` });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// Definir una ruta DELETE con parámetros en el enrutador
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    // Eliminar un producto por su ID utilizando el método 'deleteProduct' del 'ProductManager'
    await productManager.deleteProduct(Number(pid));
    res.status(200).json(`Product with id: ${pid} was removed`);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// Exportar el enrutador para ser utilizado en otros archivos
module.exports = router;
