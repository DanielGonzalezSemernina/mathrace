<template>
  <v-row v-if="screen === 'Creacion de salas'">
    <v-col>
      <v-card class="crear-Sala">
        <div class="center-content">
          <v-card-title>Creació sales multijugador</v-card-title>
          <br>
          <v-btn @click="abrirDialogo" class="botons">Crear sala</v-btn>

          <!-- Diálogo -->
          <v-dialog v-model="dialogCrearSalas">
            <v-card class="crear-Sala">
              <v-card-title>Crear Sala</v-card-title>
              <v-form @submit.prevent="crearSala">
                <v-text-field v-model="contrasenyaSala"
                  label="Contrasenya (Si ho deixes en blanc sera sala pública)"></v-text-field>
                <v-card-actions class="d-flex justify-center align-center">
                  <v-btn type="submit" class="botons">Crear sala</v-btn>
                  <v-btn @click="cerrarDialogo" class="botons">Cancelar</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <br>

          <!-- Lista de salas disponibles -->
          <v-card class="salaDisponibles">
            <v-row>
              <v-col>
                <v-card-title>Jocs publics</v-card-title>
                <v-list class="llista">
                  <v-list-item v-for="sala in salasPublicas" :key="sala.id" @click="seleccionarSala(sala.id)">
                    <v-list-item-title>Sala de {{ sala.creador }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col>
                <hr style="border: 1px solid grey; height: 100%; margin: 0;">
              </v-col>
              <v-col>
                <v-card-title>Jocs privats</v-card-title>
                <v-list class="llista">
                  <v-list-item v-for="sala in salasPrivadas" :key="sala.id" @click="seleccionarSalaPrivada(sala.id)">
                    <v-list-item-title>Sala de {{ sala.creador }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <v-snackbar v-model="mostrarSnackbar" color="error">
          Ja estas a la sala o sala completa,
          <v-btn text @click="mostrarSnackbar = false" class="botons">Tancar</v-btn>
        </v-snackbar>
        <v-snackbar v-model="mostrarSnackbarPartida" color="error">
          La partida esta en curs, espera a que acabi.
          <v-btn text @click="mostrarSnackbar = false" class="botons">Tancar</v-btn>
        </v-snackbar>


      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="mostrarDialogoUnirsePrivada" transition="dialog-bottom-transition">
    <v-card class="crear-Sala">
      <v-card-title>Unirse a sala privada</v-card-title>
      <v-card-text>
        <v-form @submit="unirseASalaPrivada">
          <v-text-field v-model="contrasenyaSalaExistente" label="Contraseña" type="password" required></v-text-field>
          <v-btn type="submit" class="botons">Unirse a sala</v-btn>
          <v-btn @click="cerrarDialogoUnirsePartida" class="botons">Cancelar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>


  <v-container v-if="screen === 'SalaEspera'">
    <v-card class="salaDeEspera">
      <v-card-title>Sala de Espera Multijugador</v-card-title>
      <v-card-text>
        <p>¡Esperant a altres jugadors a que s'uneixin!</p>
        <!-- Añade un mensaje si la sala está llena -->
        <p v-if="users.length >= MAX_USERS">La sala esta plena. Siusplau, espera a que hi hagui espai disponible.</p>
      </v-card-text>
    </v-card>

    <!-- Pantalla del juego -->
    <v-container>
      <v-row>
        <v-col v-for="(player, index) in users" :key="index">
          <v-card class="jugadorsVcard">
            <v-card-title>{{ player.username }}</v-card-title>
            <v-icon v-if="!player.ready" color="red">mdi-close</v-icon>

            <!-- Mostrar el tick si el usuario está listo -->
            <v-icon v-if="player.ready" color="green">mdi-check</v-icon>
            <v-btn v-if="player.id === userId && !player.ready" @click="setReady" class="botons">Estic preparat</v-btn>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card class="vcardTornar">
            <v-card-text>
              <v-btn v-if="!raceStarted && users.some(user => user.position >= maxPosition)" @click="reiniciarJuego"
                :disabled="raceStarted" class="botons">
                Tornar a Jugar
              </v-btn>
              <v-btn @click="desconectar" class="botons">Tornar a la seleccio de sales</v-btn>
              <v-card-title v-if="raceStarted">{{ currentEquation.pregunta }}</v-card-title>
              <v-form v-if="raceStarted">
                <v-btn v-for="(respuesta, respuestaIndex) in currentEquation.respuestas" :key="respuestaIndex"
                  @click="checkAnswer(respuesta)" class="botons">
                  {{ respuesta.texto }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="track">
            <div v-for="(player, index) in users" :key="index" class="horse"
              :style="{ top: `${index * 81}px`, left: `${player.position * 10}px`, backgroundColor: 'lightblue', zIndex: '2' }">
              <v-img src="@/components/caball.png" contain></v-img>
              <div class="horse-content">
                <div class="horse-name">
                  {{ player.username }}
                </div>
              </div>
            </div>
            <div class="meta-line" :style="{ left: `${metaLinePosition}px`, zIndex: '1' }">
    <img src="@/components/612-Meta3.jpg" style="width: 48px; height: 322px;" />
  </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showPodiumDialog" max-width="600">
      <v-card class="podiuMultijugador">
        <v-card-title>Podio</v-card-title>
        <v-card-text>
          <v-row v-for="(player, index) in podium" :key="index">
            <v-col>
              <v-avatar size="40">
                <span class="colorSpan">{{ index + 1 }}</span>
              </v-avatar>
            </v-col>
            <v-col>{{ player.username }}</v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="vcard-actions">
          <v-btn @click="reiniciarJuego" class="botons">Tornar a jugar</v-btn>
          <v-btn @click="showPodiumDialog = false" class="botons">Tancar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script>

import io from 'socket.io-client';
import { getPreguntes } from '../services/connectionManager';
import { useAppStore } from "@/store/app";
export default {
  mounted() {
    this.conectarWebSocket();
    window.addEventListener('beforeunload', this.desconectar);
    this.$watch('screen', this.handleScreenChange);
    this.$router.afterEach(this.handleRouteChange);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.desconectar);
    this.$watch('screen', null);
    this.$router.afterEach(null);
  },
  created() {
    this.getEcuacions();
  },
  computed: {
    metaLinePosition() {
  return '100%';
},
    currentEquation() {
      this.currentEquationIndex = Math.floor(Math.random() * this.equations.length);
      return this.equations[this.currentEquationIndex];
    },
    salasPublicas() {
      return Object.values(this.salas).filter(sala => sala.contrasenya === '');
    },
    salasPrivadas() {
      return Object.values(this.salas).filter(sala => sala.contrasenya !== '');
    },
    username() {
      return useAppStore().loginInfo.username;
    },
  },
  watch: {
    users: {
      handler(newUsers) {
        // Actualizar la lista de usuarios
        this.users = newUsers;
      },
      deep: true,
    },
  },
  data() {
    return {
      screen: 'Creacion de salas',
      nombreSala: '',
      contrasenyaSala: '',
      mostrarDialogoUnirse: false,
      nombreSalaExistente: '',
      contrasenyaSalaExistente: '',
      dialogCrearSalas: false,
      idSalaPublica: '',
      idSalaPrivada: '',
      mostrarDialogoUnirsePrivada: false,
      salaSeleccionadaPrivada: null,
      mostrarSnackbar: false,
      MAX_USERS: 4,
      socket: null,
      enSalaDeEspera: false,
      raceStarted: false,
      selectedAnswer: null,
      isAnswering: false,
      currentEquationIndex: 0,
      timer: null,
      podium: [],
      equations: [],
      showPodiumDialog: false,
      users: [],
      salas: [],
      mostrarSnackbarPartida: false,
      maxPosition: 1,
    };
  },
  methods: {
    conectarWebSocket() {
      this.socket = io('http://grup4.dam.inspedralbes.cat:3788');

      this.socket.on('connect', () => {
        console.log('Conectado al servidor WebSocket');

        this.socket.emit('ingresarSalaDeEspera', this.username); // Asegúrate de enviar el nombre de usuario
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor WebSocket');
      });

      this.socket.on('connected', ({ userId }) => {
        this.userId = userId;
      });

      this.socket.on('actualizarUsuarios', (users) => {
        this.users = users;
      });
      this.socket.on('salaLlena', () => {
        console.log('La sala está llena');
      });
      this.socket.on('unidoASala', () => {
        this.screen = 'SalaEspera';
      });
      this.socket.on('carreraIniciada', () => {
        console.log('Carrera iniciada');
        if (!this.raceStarted) {
          this.raceStarted = true;
          this.timer = setInterval(() => {
            // Lógica del juego multijugador
          }, 1000);
        }
      });

      // En el cliente
      this.socket.on('actualizarPosicion', ({ userId, position }) => {
        const playerIndex = this.users.findIndex((user) => user.id === userId);
        if (playerIndex !== -1) {
          this.users[playerIndex].position = position;
          console.log(`Actualizando posición del jugador ${userId} a ${position}`);
        } else {
          console.error(`No se encontró al jugador con ID ${userId} en el array this.users`);
        }
      });
      this.socket.on('actualizarSalas', (salas) => {
        if (!Array.isArray(salas)) {
          console.error('El servidor no envió una lista válida de salas.');
          return;
        }

        console.log('Recibido evento actualizarSalas con salas:', salas);

        // Asigna el array directamente a la propiedad reactiva salas
        this.salas = salas;
      });
      this.socket.on('siguientePregunta', () => {
        this.currentEquationIndex++;
        this.isAnswering = false;
        this.selectedAnswer = null;
      });
      this.socket.on('carreraTerminada', ({ users }) => {
        console.log(`La carrera ha terminado.`);
        this.raceStarted = false;
        this.podium = users.sort((a, b) => b.position - a.position);

        this.showPodiumDialog = true;
      });
      this.socket.on('unidoASala', () => {
        // Cambia la pantalla solo cuando el servidor confirma que te has unido a la sala
        this.screen = 'SalaEspera';
      });
      this.socket.on('errorUnirseASala', (data) => {
        this.salaCompleta = true;
        this.mostrarSnackbar = true;
      });
      this.socket.on('errorUnirseAPartida', (data) => {
        this.mostrarSnackbarPartida = true;
      });


      this.socket.on('juegoReiniciado', ({ usuarios }) => {
        console.log('El juego ha sido reiniciado.');
        this.users = usuarios;
        this.currentEquationIndex = 0;
      });
    },
    
   
    canviScreen() {
      this.screen = 'Creacion de salas';
    },
    startRace() {
      if (!this.raceStarted) {
        this.raceStarted = true;
        this.timer = setInterval(() => {
          // Lógica del juego multijugador
        }, 1000);
      }
    },
    crearSala(e) {
      e.preventDefault();
      this.socket.emit('crearSala', {
        nombre: this.nombreSala,
        contrasenya: this.contrasenyaSala,
        username: this.username,
      });
      this.nombreSala = '';
      this.contrasenyaSala = '';
      this.dialogCrearSalas = false;
      this.screen = 'SalaEspera';
    },
    unirseASala() {
      this.socket.emit('unirseASala', {
        salaId: this.idSalaPublica,
        username: this.username,
      });
    },
    async getEcuacions() {
      try {
        const response = await getPreguntes();
        this.equations = response;
      } catch (error) {
        console.error('Error preguntas:', error);
      }
    },
    unirseASalaPrivada(e) {
      e.preventDefault();
      this.socket.emit('solicitarUnirseASala', {
        salaId: this.idSalaPrivada,
        username: this.username,
        contrasenya: this.contrasenyaSalaExistente,
      });
      this.mostrarDialogoUnirsePrivada = false;
    },
    checkAnswer(answer) {
      if (!this.isAnswering) {
        this.isAnswering = true;
        this.selectedAnswer = answer.texto;
        // Emitir la respuesta seleccionada al servidor
        this.socket.emit('respuestaSeleccionada', {
          username: this.username,
          selectedAnswer: this.selectedAnswer,
          currentEquation: this.currentEquation.answer,
          userId: this.userId
        });
      }
    },
    seleccionarSala(idSala) {
      this.idSalaPublica = idSala;

      this.unirseASala(this.idSalaPublica);
    },
    seleccionarSalaPrivada(idSala) {
      this.idSalaPrivada = idSala;
      this.mostrarDialogoUnirsePrivada = true;
    },
    abrirDialogo() {
      this.dialogCrearSalas = true;
    },
    cerrarDialogo() {
      this.dialogCrearSalas = false;
    },
    cerrarDialogoUnirsePartida() {
      this.mostrarDialogoUnirsePrivada = false;
    },
    setReady() {
      this.socket.emit('ready');
    },
    desconectar() {
      this.socket.emit('desconectarUsuario');
      this.screen = 'Creacion de salas';
    },
    reiniciarJuego() {
      this.socket.emit('reiniciarJuego');
      this.showPodiumDialog = false;
    },
    handleScreenChange(newScreen, oldScreen) {
      if (newScreen !== 'SalaEspera') {
        this.desconectar();
      }
    },
    handleRouteChange(newRoute, oldRoute) {
      if (newRoute !== 'http://grup4.dam.inspedralbes.cat:3777/juga') {
        this.desconectar();
      }
    },
  },
};
</script>

<style scoped>
.horse-name {
  text-align: center;
  color: black;
  /* Ajusta el color del texto según sea necesario */
  margin-bottom: 5px;
  /* Ajusta el espacio entre el nombre y la imagen del caballo */
  background-color: inherit;
  /* El color heredado del contenedor principal */
}

.start-card {
  width: 650px;
  height: 740px;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.llista {
  text-align: center;
  background: rgba(255, 255, 255, 0.0);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
}

.play-button {
  margin-top: 16px;
  font-size: 24px;
}

.track {
  position: relative;
  height: 325px;
  border: 1px solid #ccc;
  margin-top: 20px;
  background-image: url("@/components/pista.jpg");
  /* Reemplaza 'ruta/de/la/imagen.jpg' con la ruta correcta de tu imagen */
  background-size: cover;
  /* Ajusta el tamaño de la imagen para cubrir completamente el fondo */
  background-position: center;
  /* Ajusta la posición de la imagen de fondo */
}

.horse {
  position: absolute;
  height: 50px;
  width: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 16px;
  margin-left: 10px;
  transition: left 0.5s ease-in-out, background-color 0.5s ease-in-out;
}

.horse-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sala-card {
  width: 650px;
  height: 500px;
  /* Sin sombra */
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
}

.crear-Sala {
  width: 650px;
  height: 500px;
  margin: auto;
  text-align: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.crear-Sala .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.crear-Sala v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}

.botons {
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
}

.salaDisponibles {
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.salaDisponibles .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.salaDisponibles v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}

.salaDeEspera {
  margin: auto;
  text-align: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.salaDeEspera .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.jugadorsVcard {
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.vcardTornar {
  margin: auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  ;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.podiuMultijugador {
  width: 100%;
  margin: auto;
  text-align: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  color: white !important;
  backdrop-filter: blur(15px);
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
}

.podiuMultijugador .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.vcard-actions {
  width: 100%;
  margin: auto;
  text-align: center;
  justify-content: center;
}
.colorSpan{
  color: white !important;
}
.meta-line {
  position: absolute;
  width: 2px;
  height: 100%;
  /* Ajusta el grosor de la línea según sea necesario */
  background-color: black;
  /* Ajusta el color de la línea según sea necesario */
  right: 100px;
}
</style>
