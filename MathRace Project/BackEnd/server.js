const mysql = require('mysql2/promise');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require("cors");
const socketIO = require('socket.io');
const http = require('http');
const { spawn } = require('child_process');
var session = require('express-session')
const {getPreguntas} = require('./connexioBD.js');
const {getUsuariInfoForLogin, registrarUsuari, getAllAlumneClasse,getAllAlumneClassebyProfesor,getUsuariInfo, getAlumneInfo, getProfessorInfo, obtenerRolUsuario, editarUsuario, GetUsuarios} = require('./sql.js');
const {deletePregunta,updatePregunta,insertPregunta, updatePreguntaAcertada} = require('./connexioBD.js');
const {getUsuarisLoginAndroid, registrarUsuariAndroid,getClases,updateClaseProfe,insertClase} = require('./SqlAndroid.js');
const { v4: uuidv4 } = require('uuid');
const PORT = 3788;
const ubicacioGrafics = path.join(__dirname, "..", "M10/grafics");
const arxiuPython = path.join(__dirname, "..", "M10/graficos.py");
const connection = mysql.createPool({
  host: 'localhost',
    user: 'root',
    password: '',
    database: 'math_race'
});
const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.use(cors({
  origin: function (origin, callback) {
    return callback(null, true);
  }
}));

app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/getPreguntas', async (req, res) => {
    try {
        const result = await getPreguntas();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las preguntas de la base de datos');
    }
});

app.delete('/deletePreguntas/:id', async (req, res) => {
  const id = req.params.id;
  try {
      const result = await deletePregunta(id);
      await cargarPreguntas();
      io.emit('preguntes', preguntas);
      res.json(result);
      console.log(result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar la pregunta de la base de datos');
  }
});
app.put('/editarUsuario', async (req, res) => {
  try {
    const usuario = req.body;
    await editarUsuario(connection, usuario);
    res.status(200).send('Usuario actualizado con éxito');
  } catch (error) {
    console.error('Error al editar usuario:', error.message);
    res.status(500).send('Error al editar usuario');
  }
});
app.put('/updatePreguntas/:id', async (req, res) => {
  const id = req.params.id;
  const pregunta = req.body;
  try {
      const result = await updatePregunta(id,pregunta);
      await cargarPreguntas();
      io.emit('preguntes', preguntas);
      res.json(result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar la pregunta en la base de datos');
  }
});

app.put('/updatePreguntasAcertar/:id', async (req, res) => {
  const id = req.params.id;
  const acertada = req.body;
  try {
      const result = await updatePreguntaAcertada(id, acertada);
      res.json(result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar la pregunta en la base de datos');
  }
});

app.post('/insertPreguntas', async (req, res) => {
  const pregunta = req.body;
  try {
    console.log(pregunta);
      const result = await insertPregunta(pregunta);
      await cargarPreguntas();
      io.emit('preguntes', preguntas);
      res.json(result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al insertar la nueva pregunta en la base de datos');
  }
});
app.get('/usuaris', async (req, res) => {
  try {
    const usuariosJSON = await getUsuariInfoForLogin(connection);
    const usuarios = JSON.parse(usuariosJSON);
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la lista de usuarios');
  }
});
app.get("/dadesUsuari/:username/:rol", async (req, res) => {
  const nomUsuari = req.params.username;
  const rol = req.params.rol;
  console.log(nomUsuari, rol);

  if (rol === 'Alumne') {
    const alumnesJSON = await getAlumneInfo(connection, nomUsuari);
    const alumnes = JSON.parse(alumnesJSON);
    res.json(alumnes);
  } else if (rol === 'Professor') {
    const professorsJSON = await getProfessorInfo(connection, nomUsuari);
    const professors = JSON.parse(professorsJSON);
    res.json(professors);
  } else {
    res.status(400).json({ error: 'Rol no válido' });
  }
});
app.get('/obtenerRol/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const rol = await obtenerRolUsuario(connection, username);
    res.json({ rol });
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener el rol del usuario' });
  }
});
app.get('/clases', async (req, res) => {
  try {
    const clasesJSON = await getAllAlumneClasse(connection);
    const usuarios = JSON.parse(clasesJSON);
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la lista de clases');
  }
});
app.get('/alumnos/:nomUsuari', async (req, res) => {
  try {
      const nomUsuari = req.params.nomUsuari;
      const result = await getAllAlumneClassebyProfesor(connection, nomUsuari);
      res.json(result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener la lista de alumnos');
  }
});

app.post('/registrar', async (req, res) => {
  try {
    const newUser = req.body;
    const id = req.body.idClasse;
    const registrationResult = await registrarUsuari(connection, newUser, id);
    if (registrationResult) {
      res.json({ success: true, message: 'Usuario registrado exitosamente' });
    } else {
      res.status(500).json({ success: false, message: 'Error al registrar usuario' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

app.get("/getUsuarios", (req, res) => {
  const user = req.query.user; // Obtener el valor de nombreUsuario de los parámetros de consulta

  if (!user) {
      return res.status(400).json({ error: "El parámetro nombreUsuario es obligatorio." });
  }

  GetUsuarios(user) // Llama a GetUsuarios con el nombre de usuario proporcionado
      .then((data) => {
          const usuario = data;
          res.json(usuario);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Error al obtener usuarios" });
      });
});



//---------------------  SQL ANDROID  ---------------------//

app.post("/usuarisLogin", function (req, res) {
  const user = req.body;
  let usuariTrobat = false;

  autoritzacio = { "autoritzacio": false };

  usuaris = getUsuarisLoginAndroid(connection).then((usuaris) => {
      usuaris = JSON.parse(usuaris)
      console.log(usuaris)
      for (var i = 0; i < usuaris.length && usuariTrobat == false; i++) {

          if (usuaris[i].nomUsuari == user.nomUsuari) {
              contra = (user.passwd)
              if (usuaris[i].passwd == contra) {
                  usuariTrobat = true;
                  req.session.nombre = user.nomUsuari;
                  usuariLog = req.session.nombre
              }
          }
      }
      autoritzacio.autoritzacio = usuariTrobat;
      res.json(autoritzacio)
  })
})

app.post("/registrarUsuari", function (req, res) {
  nouUsuari = {
      "nomUsuari": req.body.nomUsuari,
      "nomCogonoms": req.body.nomCogonoms,
      "correu": req.body.correu,
      "passwd": req.body.passwd,
      "rol": req.body.rol,    
  }
  autoritzacio = { "autoritzacio": false };
  auto = registrarUsuariAndroid(connection, nouUsuari).then((auto) => {
      autoritzacio.autoritzacio = auto
      if (autoritzacio.autoritzacio) {
          req.session.nombre = req.body.nomUsuari;
          usuariLog = req.session.nombre
      }
      res.json(autoritzacio)
  })
})
app.get('/nomClases', async (req, res) => {
  try {
    const clasesJSON = await getClases(connection);
    const clases = JSON.parse(clasesJSON);
    res.json(clases);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la lista de clases');
  }
});
app.post('/insertClases', async (req, res) => {
  const nuevaClase = req.body.nom_classe;
  try {
    const result = await insertClase(connection, nuevaClase);
    await getClases(connection);
    io.emit('classes', nuevaClase);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al insertar la nueva pregunta en la base de datos');
  }
});

app.put('/addClaseProfe/:idUsuari/:nomUsuari', async (req, res) => {
  const idUsuari = req.params.idUsuari;
  const nomUsuari = req.params.nomUsuari;
  const clase = req.body.nom_classe;
  try {
    const result = await updateClaseProfe(connection,idUsuari,clase);
    const usuarioActualizado = await GetUsuarios(nomUsuari);
    io.emit('usuario', usuarioActualizado);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener la lista de clases');
  }
});
const users = {};
const salas = {};
const MAX_USERS = 4;
let preguntas = [];

cargarPreguntas()

async function cargarPreguntas() {
  preguntas = await getPreguntas();
}


// En el servidor
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  console.log(salas)
  io.emit('actualizarSalas', (Object.values(salas)));
  socket.on('crearSala', ({ nombre, contrasenya, username }) => {
    const salaId = generateUniqueId();
    const creador = username;
    const estatPartida = 'EnSala';
    const sala = { id: salaId, nombre, contrasenya, creador, estatPartida, usuarios: [{ id: socket.id, username, position: 0 }] };
    salas[salaId] = sala;
    socket.join(salaId);
    console.log(`Sala ${nombre} creada con ID ${salaId} por el usuario ${username}`);
    console.log('Salas:', salas);
  
    // Emitir la lista de usuarios a todos los clientes en la sala
    io.to(salaId).emit('actualizarUsuarios', salas[salaId].usuarios);
    io.emit('actualizarSalas', Object.values(salas));
  });

  socket.on('getPreguntas', async (id) => {
    io.emit('preguntes', preguntas);
  });
  socket.on('getClases', async () => {
    try {
      const clases = await getClases(connection);
      socket.emit('classes', clases);
    } catch (error) {
      console.error('Error al obtener clases:', error.message);
    }
  });
  socket.on('getUsuario', async (userNom) => {
    try {
        const usuario = await GetUsuarios(userNom);
        socket.emit('usuario', usuario);
    } catch (error) {
        console.error('Error al obtener información del usuario:', error.message);
        // Manejar el error, por ejemplo, emitiendo un evento de error al cliente
        socket.emit('errorObtenerUsuario', { mensaje: 'Error al obtener información del usuario' });
    }
});


  // Manejo de ingreso a la sala de espera

      
 socket.on('unirseASala', ({ salaId, username }) => {
  // Verificar si el usuario ya está presente en la sala
  if (isUserInSala(salaId, socket.id) || isUsernameTaken(salaId, username) || !salas[salaId] || salas[salaId].usuarios.length >= MAX_USERS) {
    console.log(`Error al unirse a la sala ${salaId}`);
    socket.emit('errorUnirseASala', { mensaje: 'Contraseña incorrecta, sala llena o nombre de usuario ya tomado.' });
    return;
  }
  if (salas[salaId].estatPartida === 'EnCurs') {
    socket.emit('errorUnirseAPartida', { mensaje: 'Partida en curs.' });
    return;
  }

  socket.join(salaId);
  const user = { id: socket.id, username, position: 0 };
  salas[salaId].usuarios.push(user);

  // Emitir el evento 'unidoASala' de vuelta al cliente
  socket.emit('unidoASala');

  // Emitir la lista de usuarios a todos los clientes en la sala
  io.to(salaId).emit('actualizarUsuarios', salas[salaId].usuarios);
  io.emit('actualizarSalas', Object.values(salas));
});
socket.on('solicitarUnirseASala', ({ salaId, username, contrasenya }) => {
  if (
    isUserInSala(salaId, socket.id) ||
    isUsernameTaken(salaId, username) ||
    !salas[salaId] ||
    salas[salaId].usuarios.length >= MAX_USERS || salas[salaId].estatPartida === 'EnCurs' ||
    !verificarContrasenya(salaId, contrasenya)
  ) {
    console.log(`Error al unirse a la sala ${salaId}`);
    socket.emit('errorUnirseASala', {
      mensaje: 'Contraseña incorrecta, sala llena o nombre de usuario ya tomado.'
    });
    return;
  }

  socket.join(salaId);
  const user = { id: socket.id, username, position: 0 };
  salas[salaId].usuarios.push(user);

  // Emitir el evento 'unidoASala' de vuelta al cliente
  socket.emit('unidoASala');

  // Emitir la lista de usuarios a todos los clientes en la sala
  io.to(salaId).emit('actualizarUsuarios', salas[salaId].usuarios);
  io.emit('actualizarSalas', Object.values(salas));
});

  socket.on('ready', () => {
    const salaId = getUserSalaId(socket.id);
    if (salaId && salas[salaId]) {
      const user = salas[salaId].usuarios.find(u => u.id === socket.id);
      if (user) {
        user.ready = true;
        io.to(salaId).emit('actualizarUsuarios', salas[salaId].usuarios);
        
        const allUsersReady = salas[salaId].usuarios.every(u => u.ready);
  
        if (allUsersReady) {
          io.to(salaId).emit('carreraIniciada');
          salas[salaId].estatPartida = 'EnCurs';
        } else {
          console.log('No todos los usuarios están listos');
        }
      } else {
        console.log(`Error: El usuario con ID ${socket.id} no está registrado en la sala ${salaId}`);
      }
    } else {
      console.log(`Error: El usuario con ID ${socket.id} no está en ninguna sala`);
      console.log('Salas:', salas);
    }
  });
  
  socket.emit('connected', { userId: socket.id });

  socket.on('respuestaSeleccionada', ({ username, selectedAnswer, currentEquation }) => {
  
    const salaId = getUserSalaId(socket.id);
    if (salaId && salas[salaId]) {
      const user = salas[salaId].usuarios.find(u => u.id === socket.id);
      if (user) {
        if (selectedAnswer === currentEquation) {
          user.position += 15.4;
  
          io.to(salaId).emit('actualizarPosicion', { userId: socket.id, position: user.position });
  
          if (user.position >= 154) {
            io.to(salaId).emit('carreraTerminada', { users: salas[salaId].usuarios });
            console.log('Carrera acabada '+ 'Guanyador: ' + user.username);
            salas[salaId].estatPartida = 'Acabada';
            return;
          }
  
          io.to(socket.id).emit('siguientePregunta');
        } else {
          io.to(socket.id).emit('siguientePregunta');
        }
      } else {
        console.log(`Error: El usuario con ID ${socket.id} no está registrado en la sala ${salaId}`);
      }
    } else {
      console.log(`Error: El usuario con ID ${socket.id} no está en ninguna sala`);
      console.log('Salas:', salas);
    }
  });


  socket.on('desconectarUsuario', () => {
    const salaId = getUserSalaId(socket.id);
    if (salaId && salas[salaId]) {
      // Elimina al usuario de la lista de usuarios en la sala
      salas[salaId].usuarios = salas[salaId].usuarios.filter(user => user.id !== socket.id);
  
      // Emitir la lista actualizada de usuarios a todos los clientes en la sala
      io.to(salaId).emit('actualizarUsuarios', salas[salaId].usuarios);
      io.emit('actualizarSalas', Object.values(salas));
      console.log(`Jugador ${socket.username} se desconectó`);
  
      eliminarSalaSiVacia(salaId);
      io.emit('actualizarSalas', Object.values(salas));
      // También puedes ejecutar otras acciones necesarias al desconectar un usuario
    }
  });
  socket.on('reiniciarJuego', () => {
    const salaId = getUserSalaId(socket.id);
  
    if (salaId && salas[salaId]) {
      salas[salaId].usuarios.forEach(user => {
        user.position = 0;
        user.ready = false;
      });
  
      // Restablecer el índice de la pregunta actual
      salas[salaId].currentEquationIndex = 0;
  
      io.to(salaId).emit('juegoReiniciado', { usuarios: salas[salaId].usuarios });
      io.to(salaId).emit('siguientePregunta');
    }
  });
});

httpServer.listen(PORT, () => {
  console.log("Server => " + PORT);
});

function generateUniqueId() {
  return uuidv4();
}

function getUserSalaId(userId) {
  // Buscar la sala a la que pertenece el usuario
  for (const salaId in salas) {
    const userInSala = salas[salaId].usuarios.find(user => user.id === userId);
    if (userInSala) {
      return salaId;
    }
  }
  return null;
}
function isUserInSala(salaId, userId) {
  if (salas[salaId] && salas[salaId].usuarios) {
    return salas[salaId].usuarios.some(user => user.id === userId);
  }
  return false;
}

function isUsernameTaken(salaId, username) {
  if (salas[salaId] && salas[salaId].usuarios) {
    return salas[salaId].usuarios.some(user => user.username === username);
  }
  return false;
}

function eliminarSalaSiVacia(salaId) {
  if (salas[salaId] && salas[salaId].usuarios.length === 0) {
    console.log(`Eliminando sala ${salaId} porque está vacía.`);
    delete salas[salaId];
    io.emit('actualizarSalas', Object.values(salas));
  }
}

function verificarContrasenya(salaId, contrasenya) {
  return salas[salaId] && salas[salaId].contrasenya === contrasenya;
}

//graficos
function comprobarExistencia(fotografia) {
  return new Promise((resolve, reject) => {
      fs.readdir(fotografia, function (err, archivos) {
          if (err) {
              console.log('Error al leer el directorio');
              reject(err);
          } else {
              resolve(archivos);
          }
      });
  });
}

function base64_encode(file) {
  let bitmap = fs.readFileSync(file);
  return Buffer.from(bitmap).toString('base64');
}

async function comensarPython() {
    return new Promise((resolve, reject) => {
        const python = spawn('python', [arxiuPython]);

        python.stdout.on('data', function (data) {
            console.log(`stdout: ${data}`);
        });

        python.stderr.on('data', function (data) {
            console.error(`stderr: ${data}`);
        });

        python.on('close', function (code) {
            console.log(`child process exited with code ${code}`);
            comprobarExistencia(ubicacioGrafics).then((grafics) => {
                let arxius = [];
                for (let i = 0; i < grafics.length; i++) {
                    let nomArxius = grafics[i].split(".");
                    let arxiu = {
                        titol: nomArxius[0],
                        foto: base64_encode(path.join(ubicacioGrafics, grafics[i]))
                    }
                    arxius[i] = arxiu;
                }
                resolve(arxius);
            });
        });
    });
}

app.get('/getPython', async function (req, res) {
    let arxius = await comensarPython();
    res.json(arxius);
});

// Ejecuta la función cada minuto
setInterval(async () => {
    await comensarPython();
}, 24 * 60 * 60 * 1000);

  var history = require('connect-history-api-fallback')
const staticFileMiddleware = express.static('../dist');
app.use(staticFileMiddleware);
app.use(history({
    disableDotRule: true,
    verbose: true
}));
app.use(staticFileMiddleware);
