<template>
  <v-app>
    <v-app-bar v-if="isLoggedIn" style="background: transparent; box-shadow: none; border-bottom: 1px solid white;">
      <div class="marg-btn">
        <v-btn outlined><router-link to="/benvingut" class="router-link">Pàgina Principal</router-link></v-btn>
        <v-btn outlined><router-link to="/juga" class="router-link">Joc</router-link></v-btn>
        <v-btn outlined><router-link to="/perfil" class="router-link">Perfil Usuari</router-link></v-btn>
        <div class="spacer"></div> <!-- Espaciador para centrar manualmente -->
      </div>
      <div>
        <v-btn class="custom-button" @click="logout">Tancar la sessió</v-btn>
      </div>
    </v-app-bar>
    
    <router-view/>
  </v-app>
</template>

<script>
import { useAppStore } from "@/store/app";

export default {
  computed: {
    isLoggedIn() {
      const appStore = useAppStore();
      return appStore.loginInfo.loggedIn;
    },
  },
  methods: {
    logout() {
      if (this.socket) {
      this.socket.disconnect();
    }

      // Llama al método de logout en el store
      useAppStore().logout();

      // Redirige a la página de inicio de sesión u otra página deseada
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
.v-application a.router-link {
  color: white;
  text-decoration: none;
  text-transform: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1.2em;
}

.v-application a.router-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 5px;
  left: 0;
  bottom: -5px;
  transform: scaleX(0);
  transition: transform .5s;
}

.v-application a.router-link:hover::after {
  transform: scaleX(1);
}

.custom-button {
  color: white;
  border: 1px solid lightgray;
  border-radius: 4px;
  margin: 5px;
  padding: 10px 20px;
  text-transform: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1em;
}

.marg-btn {
  max-width: 200px; /* ajusta según sea necesario */
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.spacer {
  flex: 1; /* El espaciador ocupa todo el espacio disponible, centrando los botones */
}

</style>