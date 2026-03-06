<template>
  <v-layout class="rounded rounded-md background">
    <v-main v-if="isLoggedIn !== null">
      <br><br><br>
      <div v-if="isLoggedIn" class="main-content">
        <!-- Contenido principal de la página -->
        <div v-if="activeTab === null" class="welcome">
          <h1 class="welcome-text">Benvingut a MathRace</h1>
          <v-btn @click="openTab(1)" class="button">Introducció</v-btn>
        </div>

        <!-- Contenido detallado 1 -->
        <div v-if="activeTab === 1" class="info-tab pestanya">
          <div class="info-header">
            <h2>Joc</h2>
            <br>
            <p>MathRace tracta d'una carrera d'equacions en la que per resposta correcta avançes posicions en una
              pista.
              Per guanyar, has d'arribar a la meta abans que els teus rivals.
            </p>
            <br>
            <p class="paragraf">Mode de joc:</p>
            <ul>
              <li> Individual</li>
              <li> Multijugador</li>
            </ul>
            <br>
          </div>
          <!-- Contenido detallado 1 -->
          <v-btn @click="openTab(2)" class="button">Següent</v-btn>
          <v-btn @click="closeTab(1)" class="button">Tancar</v-btn>
        </div>

        <!-- Contenido detallado 2 -->
        <div v-else-if="activeTab === 2" class="info-tab pestanya">
          <div class="info-header2">
          <h2>Informació de perfil</h2>
          <br>
          <ul >
            <li> Información bàsica de l'usuari</li>
            <li> Rol</li>
            <li> Classe</li>
            <li> Editar el perfil</li>
          </ul>
          <br>
        </div>
          <!-- Contenido detallado 2 -->
          <v-btn @click="openTab(3)" class="button">Següent</v-btn>
          <v-btn @click="closeTab(2)" class="button">Tancar</v-btn>
        </div>

        <!-- Contenido detallado 3 -->
        <div v-else-if="activeTab === 3" class="info-tab pestanya2">
          <h2>Tancar sessió</h2>
          <!-- Contenido detallado 2 -->
          <v-btn @click="closeTab(3)" class="button">D'acord</v-btn>
        </div>

        <!-- Elemento contenedor para aplicar el blur al fondo -->
        <div v-if="activeTab !== null" class="blur-container"></div>
      </div>
      <div v-else>
        <v-alert color="red lighten-4" class="text-center">Error. No autoritzat<router-link class="text-center"
            to="/">Tornar a la pàgina d'inici de sessió</router-link></v-alert>
      </div>
      <!-- Imagen fuera del div de desenfoque -->
      <img src="@/components/flecha2.webp" alt="Imagen" class="corner-image" v-if="activeTab === 1">
      <img src="@/components/flecha2.webp" alt="Imagen" class="corner-image2" v-if="activeTab === 2">
      <img src="@/components/flecha2.webp" alt="Imagen" class="corner-image3" v-if="activeTab === 3">
    </v-main>
  </v-layout>
</template>

<script>
import { useAppStore } from "@/store/app";

export default {
  data() {
    return {
      activeTab: null,
    };
  },
  computed: {
    isLoggedIn() {
      const appStore = useAppStore();
      return appStore.loginInfo.loggedIn;
    },
  },
  created() {
    this.checkAuthentication();
  },
  beforeRouteEnter(to, from, next) {
    // Verificar la información de autenticación antes de cargar la ruta
    useAppStore().checkAuthentication();
    next();
  },
  methods: {
    checkAuthentication() {
      const appStore = useAppStore();
      const storedAuthInfo = localStorage.getItem('authInfo');

      if (storedAuthInfo) {
        // Si hay información de autenticación almacenada, restaurarla
        const authInfo = JSON.parse(storedAuthInfo);
        appStore.setLoginInfo(authInfo);
      }
    },
    openTab(tabNumber) {
      // Muestra la sección correspondiente al número de pestaña
      this.activeTab = tabNumber;
    },
    closeTab() {
      // Cierra la sección activa
      this.activeTab = null;
    },
  },
};
</script>

<style>
.background {
  background-image: url('@/components/cubo.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}

.main-content {
  text-align: center;
}

.welcome {
  padding-top: 20vh;
}

.welcome-text {
  color: white;
  margin: 0;
}

.info-tab {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 10%;
  z-index: 1000;
}

.pestanya {
  width: 50%;
  height: 40%;
  margin: auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  color: white !important;
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
}

.pestanya2 {
  width: 20%;
  height: 11%;
  margin: auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
  color: white !important;
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
}
.info-header ul {
  list-style-type: none;
  padding: 0;
  margin-left: 43%;
  text-align: left;
}

.info-header li::before {
  content: '\2022';
  /* Código Unicode para un punto grande */
  color: #007BFF;
  /* Color del punto (puedes cambiarlo según tu preferencia) */
  font-size: 1.5em;
  /* Tamaño del punto */
}
.info-header2 ul {
  list-style-type: none;
  padding: 0;
  margin-left: 35%;
  text-align: left;
}

.info-header2 li::before {
  content: '\2022';
  /* Código Unicode para un punto grande */
  color: #007BFF;
  /* Color del punto (puedes cambiarlo según tu preferencia) */
  font-size: 1.5em;
  /* Tamaño del punto */
}
.blur-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.corner-image {
  position: fixed;
  top: 9%;
  left: 47.6%;
  width: 5%;
  height: 8%;
  border-radius: 50%;
  transform: rotate(90deg);
}

.corner-image2 {
  position: fixed;
  top: 9%;
  left: 55%;
  width: 5%;
  height: 8%;
  border-radius: 50%;
  transform: rotate(90deg);
}

.corner-image3 {
  position: fixed;
  top: 9%;
  left: 91%;
  width: 5%;
  height: 8%;
  border-radius: 50%;
  transform: rotate(90deg);
}

.button {
  margin-top: 1.5%;
  font-size: 15px;
  background: transparent !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  color: white !important;
}

h2 {
  text-decoration: none;
  text-transform: none;
}

.paragraf {
  font-weight: bold;
  text-transform: none;
}
</style>