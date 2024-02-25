const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

connection.connect(error => {
  if (error) throw error;
  console.log('Conexión exitosa a la base de datos');
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Rutas CRUD
// Obtener todos los registros con filtro opcional por fecha de servicio
app.get('/api/registros', (req, res) => {
    let query = 'SELECT * FROM tabla';
    const { fecha_servicio } = req.query;
    const queryParams = [];
  
    if (fecha_servicio) {
      query += ' WHERE fecha_servicio = ?';
      queryParams.push(fecha_servicio);
    }
  
    connection.query(query, queryParams, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

// Obtener un registro por su ID
app.get('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM tabla WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

// Agregar un nuevo registro
app.post('/api/registros', (req, res) => {
  const nuevoRegistro = req.body;
  connection.query('INSERT INTO tabla SET ?', nuevoRegistro, (error, result) => {
    if (error) throw error;
    res.status(201).send('Registro añadido correctamente');
  });
});

// Actualizar un registro
app.put('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;
  connection.query('UPDATE tabla SET ? WHERE id = ?', [datosActualizados, id], (error, result) => {
    if (error) throw error;
    res.send('Registro actualizado correctamente');
  });
});

// Eliminar un registro
app.delete('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tabla WHERE id = ?', [id], (error, result) => {
    if (error) throw error;
    res.send('Registro eliminado correctamente');
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
