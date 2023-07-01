// Importar el módulo 'express' para crear una instancia de la aplicación
const express = require("express");
const app = express();

// Importar el módulo 'router' desde un archivo local llamado 'router'
const router = require("./router");

// Definir el número de puerto en el cual el servidor escuchará las solicitudes
const port = 8080;

// Configurar la aplicación Express para analizar datos JSON en las solicitudes
app.use(express.json());

// Configurar la aplicación Express para analizar datos codificados en URL en las solicitudes
app.use(express.urlencoded({ extended: true }));

// Conectar las rutas y controladores definidos en el archivo 'router' a la aplicación principal
router(app);

// Iniciar el servidor y especificar el número de puerto en el cual escuchará las solicitudes
app.listen(port, (req, res) => {
  console.log(`Server running at port: ${port}`);
});
