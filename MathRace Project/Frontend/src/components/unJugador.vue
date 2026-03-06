<template>
  <v-layout class="rounded rounded-md background">

    <v-container v-if="isLoggedIn !== null" style="margin-top: 100px;">
      <v-row v-if="isLoggedIn">
        <v-container v-if="screen === 'start'">
          <!-- Pantalla de Inicio -->
          <v-row>
            <v-col>
              <v-card class="start-card">
                <v-card-title class="title">Mode de joc</v-card-title>
                <div class="additional-content">
                  <!-- Contenido adicional, como texto o imágenes -->
                  ¡Selecciona el mode de joc preferit!
                </div>
                <div class="center-content">
                  <v-btn @click="startSoloGame" class="play-button">
                    <v-icon left>mdi-account</v-icon> <!-- Icono para el modo individual -->
                    Individual
                  </v-btn>
                  <!--<v-img src="@/assets/imagen_individual.jpg" height="200"></v-img>
                   Foto para el modo individual -->
                </div>
                <div class="center-content">
                  <v-btn @click="Multijugador" class="play-button">
                    <v-icon left>mdi-account-multiple</v-icon> <!-- Icono para el modo multijugador -->
                    MultiJugador
                  </v-btn>
                  <!--<v-img src="@/assets/imagen_multijugador.jpg" height="200"></v-img>
                   Foto para el modo multijugador -->
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-if="screen === 'Multijugador'">
          <multijugador />
        </v-container>


        <v-container v-if="screen === 'selectDifficulty'">

          <!-- Pantalla de Selección de Dificultad -->
          <v-row>
            <v-col>
              <v-card class="segona-card">
                <v-btn icon @click="screen = 'start'" class="back-button">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
                <div class="center-content">
                  <v-card-title>Selecciona la dificultat dels jugadors</v-card-title>
                  <div class="d-flex justify-center align-center">
                    <v-btn @click="setDifficulty('facil')" class="play-button2">Fàcil</v-btn>
                    <v-btn @click="setDifficulty('mediana')" class="play-button2">Mitjana</v-btn>
                    <v-btn @click="setDifficulty('dificil')" class="play-button2">Difícil</v-btn>
                  </div>
                  <br>
                  <v-select v-model="selectedQuestionCount"
                    :items="[{ text: '5', value: 5 }, { text: '10', value: 10 }, { text: '15', value: 15 }]"
                    label="Preguntes acertades per acabar guanyar la carrera" item-title="text" item-value="value"
                    style="min-width: 320px;"></v-select>
                  <v-btn @click="goToGameScreen" class="play-button3">Accedir al Joc</v-btn>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-container v-else-if="screen === 'game'">
          <!-- Pantalla del Juego -->
          <v-row align="center" justify="center">

            <!-- Intercambié el orden de las dos columnas a continuación -->
            <v-col>
              <v-card class="tercera-card">
                <v-card-text>
                  <v-btn class="play-button2" v-if="!raceStarted && players.every(player => player.position === 0)"
                    @click="startRace" :disabled="raceStarted">Començar joc</v-btn>
                    <v-btn class="play-button2" v-if="!raceStarted && players.every(player => player.position === 0)"
                    @click="tornarScreen" :disabled="raceStarted">Modificar dificultat/nPreguntes</v-btn>
                  <v-btn class="play-button2"
                    v-if="!raceStarted && players.some(player => player.position >= maxPosition)" @click="restartGame"
                    :disabled="raceStarted">
                    Tornar a Jugar
                  </v-btn>

                  <v-card-title v-if="raceStarted">{{ currentEquation.pregunta }}</v-card-title>

                  <v-form v-if="raceStarted">
                    <v-btn class="play-button2" v-for="(respuesta, respuestaIndex) in currentEquation.respuestas"
                      :key="respuestaIndex" @click="checkAnswer(respuesta)">
                      {{ respuesta.texto }}
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col>
              <v-card class="podi1">
                <v-card-title>Podi Actual</v-card-title>
                <v-row v-for="(player, index) in sortedPlayers" :key="index">
                  <v-col>{{ index + 1 }}. {{ player.name }}</v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>



          <v-row>
  <v-col>
    <div class="track">
  <div v-for="(player, index) in players" :key="index" class="horse"
    :style="{ top: `${index * 81}px`, left: `${player.position * 9}px`, backgroundColor: `${player.color}`, zIndex: '2' }">
    <v-img src="@/components/caball.png" contain></v-img>

    <!-- Agrega el nombre del jugador dentro del div "horse" -->
    <div class="horse-content">
      <div class="horse-name">
        {{ player.name }}
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

        <v-dialog v-model="showPodiumDialog" max-width="600" transition="dialog-bottom-transition">
          <v-card class="podiuDialog">
            <v-card-title>Resultats</v-card-title>
            <v-card-text>
              <!-- Aquí puedes personalizar el diseño del podio visual -->
              <v-row v-for="(player, index) in podium" :key="index">

                <v-col> <span>{{ index + 1 }}</span>. {{ player.name }}</v-col>

              </v-row>
              <br>
              <v-btn class="play-button2" @click="showPodiumDialog = false">Cerrar</v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row v-else>
        <!-- Mensaje de error para usuarios no autenticados -->
        <v-col>
          <v-alert color="lightred" class="text-center">Error. No Autoritzat <router-link class="text-center"
              to="/">Tornar pagina login</router-link></v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import Multijugador from './Multijugador.vue';
import { getPreguntes, updatePreguntaAcertada } from '../services/connectionManager';
import { useAppStore } from "@/store/app";
export default {
  components: {
    Multijugador,
  },
  data() {
    return {
      mostrarMultijugador: null,
      winner: null,
      equations: [],
      gameStarted: false,
      screen: 'start',
      players: [
        { name: 'Usuari  1', position: 0, color: '#3498db' },
        { name: 'Jugador 1', position: 0, color: '#e74c3c' },
        { name: 'Jugador 2', position: 0, color: '#2ecc71' },
        { name: 'Jugador 3', position: 0, color: '#f39c12' }
      ],
      selectedAnswer: null,
      isAnswering: false,
      currentEquationIndex: 0,
      maxPosition: 1,
      timer: null,
      raceStarted: false,
      difficulty: 'mediana',
      podium: [],
      showPodiumDialog: false,
      selectedQuestionCount: 5,
      difficultyConfig: {
        facil: { decisionTime: 4500, successRate: 0.1 },
        mediana: { decisionTime: 3000, successRate: 0.2 },
        dificil: { decisionTime: 1000, successRate: 0.3 },
      },
    };
  },
  created() {
    this.getEcuacions();
    this.checkAuthentication();
  },
  computed: {
    metaLinePosition() {
  let factor;

  if (this.selectedQuestionCount === 5) {
    factor = 10;
  } else if (this.selectedQuestionCount === 10) {
    factor = 9.5;
  } 
  else if (this.selectedQuestionCount === 15) {
    factor = 9.3, 1 , 8;
  } 
  else {
    // Definir un valor predeterminado si la cantidad seleccionada no coincide con los casos anteriores
    factor = 1;
  }

  return this.selectedQuestionCount * 10 * factor;
},
currentEquation() {
    this.currentEquationIndex = Math.floor(Math.random() * this.equations.length);
    return this.equations[this.currentEquationIndex];
  },
    isLoggedIn() {
      const appStore = useAppStore();
      return appStore.loginInfo.loggedIn;
    },
    sortedPlayers() {
      // Calcula las posiciones de los jugadores y ordénalos
      return this.players.slice().sort((a, b) => b.position - a.position);
    },
  },
  beforeRouteEnter(to, from, next) {
    useAppStore().checkAuthentication();
    next();
  },
  methods: {
    checkAuthentication() {
      const appStore = useAppStore();
      const storedAuthInfo = localStorage.getItem('authInfo');

      if (storedAuthInfo) {
        // Si hay información de autenticación almacenada, restaurarlaº
        const authInfo = JSON.parse(storedAuthInfo);
        appStore.setLoginInfo(authInfo);
      }
    },
    async getEcuacions() {
      try {
        const response = await getPreguntes();
        this.equations = response;
      } catch (error) {
        console.error("Error preguntas:", error);
      }
    },
    setDifficulty(selectedDifficulty) {
      this.difficulty = selectedDifficulty;
    },
    startSoloGame() {
      this.gameStarted = true;
      this.screen = 'selectDifficulty';
    },
    ModeDeJoc() {
      this.screen = 'EscollirModoDeJoc';
    },
    Multijugador() {
      this.mostrarMultijugador = true;
      this.screen = 'Multijugador';
    },
    goToGameScreen() {
      this.screen = 'game';
    },
    startRace() {
      if (!this.raceStarted) {
        this.raceStarted = true;
        const questionCount = this.selectedQuestionCount;
        this.maxPosition = questionCount * 10; // 10 unidades por pregunta

        this.timer = setInterval(() => {
          this.players.slice(1).forEach((player) => {
            const randomAction = Math.random();
            const jumpDistance = 10;
            const decisionTime = this.difficultyConfig[this.difficulty].decisionTime;
            const successRate = this.difficultyConfig[this.difficulty].successRate;

            if (randomAction < successRate) {
              setTimeout(() => {
                player.position += jumpDistance;

                if (player.position >= this.maxPosition) {
                  this.endRace();
                }
              }, decisionTime);
            } else {
              player.position += 0;
            }
          });

          if (this.players[0].position >= this.maxPosition) {
            this.endRace();
          }
        }, 1000);
      }
    },
    allPlayersReachedMaxPosition() {
      const maxPosition = this.selectedQuestionCount * 10; // 10 unidades por pregunta
      return this.players.every(player => player.position >= maxPosition);
    },
    checkAnswer(answer) {
      this.isAnswering = true;
      let isCorrect = false;

      if (this.currentEquation && answer.texto === this.currentEquation.answer) {
        this.players[0].position += 10;
        isCorrect = true;
      }
      updatePreguntaAcertada(this.currentEquation.id, isCorrect)
        .then(result => {
          // Manejar la respuesta del servidor si es necesario
          console.log(result);
        })
        .catch(error => {
          console.error(error);
          // Manejar el error si es necesario
        })
        .finally(() => {
          this.currentEquationIndex++;
        });
    },
    endRace() {
      clearInterval(this.timer);
      this.raceStarted = false;
      const winner = this.players.reduce((prev, current) => (prev.position > current.position) ? prev : current);
      this.winner = winner.name;
      this.podium = this.players.slice().sort((a, b) => b.position - a.position).slice(0, 3);
      this.showPodiumDialog = true;

      console.log('Guanyador!!!' + this.winner);
    },
    restartGame() {
      // Reset game-related state
      this.gameStarted = false;
      this.raceStarted = false;
      this.currentEquationIndex = 0;
      this.winner = null;
      this.podium = [];
      this.showPodiumDialog = false;

      // Reset player positions
      this.players.forEach((player) => {
        player.position = 0;
      });
    },
    tornarScreen() {
      this.screen = 'selectDifficulty';
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>


<style scoped>
.horse-name {
  text-align: center;
  color: black; /* Ajusta el color del texto según sea necesario */
  margin-bottom: 5px; /* Ajusta el espacio entre el nombre y la imagen del caballo */
  background-color: inherit; /* El color heredado del contenedor principal */
}

.back-button{
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
  right: 285px;
  top: 10px;
  margin-bottom: -35px;
}

.title-text {
  font-size: 21px;
  font-weight: bold;
}


.start-card {
  width: 650px;
  height: 320px;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(10px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
}

.start-card .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.start-card v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}

.additional-content {
  margin: 5px;
  /* Ajusta el margen según sea necesario */
}

.segona-card {
  width: 650px;
  height: 300px;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(10px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.segona-card .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.segona-card v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}

.tercera-card {
  width: 650px;
  height: 250px;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(10px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.tercera-card .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.tercera-card v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}

.podi1 {
  width: 422px;
  height: 250px;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(10px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.podi1 .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.podiuDialog {
  width: 500px;
  height: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  margin: auto;
  /* Añade esta línea para centrar horizontalmente */
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(20px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.podiuDialog .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.center-row {
  align-items: center;
  justify-content: center;

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

.play-button {
  margin-top: 16px;
  font-size: 24px;
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
}

.play-button2 {
  margin-top: 15px;
  font-size: 15px;
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
}

.play-button3 {
  margin-bottom: 15px;
  font-size: 20px;
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
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

.container {
  background-image: url('@/components/cubo.jpg');
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.meta-line {
  position: absolute;
  width: 2px;
  height: 100%;
  /* Ajusta el grosor de la línea según sea necesario */
  background-color: black;
  /* Ajusta el color de la línea según sea necesario */
}
</style>