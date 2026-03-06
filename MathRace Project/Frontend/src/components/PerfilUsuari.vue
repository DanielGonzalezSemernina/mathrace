<template>
  <v-layout class="rounded rounded-md background " >
    <v-main v-if="isLoggedIn !== null">
      <div  v-if="isLoggedIn" >
        <v-card class="infoUsuari, cardStyle" style="margin-top: 100px;max-width: 600px;" >
        
          <v-card-title class="text-center">Informació d'usuari</v-card-title>
          {{ console.log(usuarioInfo) }}
          <v-card-text class="text-perfil" v-for="usuario in usuarioInfo" :key="usuario.idUsuari">
            <p><strong>Nom usuari:</strong> {{ usuario.nomUsuari }}</p><br>
            <p><strong>Nom i cognom:</strong> {{ usuario.nomCogonoms }}</p><br>
            <p><strong>Correu:</strong> {{ usuario.correu }}</p><br>
            <p><strong>Contrasenya:</strong> {{ usuario.passwd }}</p><br>
            <p><strong>Rol:</strong> {{ usuario.rol }}</p><br>
            <p><strong>Classe:</strong> {{ usuario.nom_classe }}</p><br>
            
            <v-btn @click="editDialog = true" class="boto-editar">Editar</v-btn>
            <v-dialog v-model="editDialog" max-width="500px">
              <v-card class="editar-card">
                <v-card-title>
                  <span class="headline">Editar informació de l'usuari</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field label="Nom d'usuari" v-model="usuario.nomUsuari"></v-text-field>
                  <v-text-field label="Noms i cognoms" v-model="usuario.nomCogonoms"></v-text-field>
                  <v-text-field label="Correu" v-model="usuario.correu"></v-text-field>
                  <v-text-field label="Contrasenya" v-model="usuario.passwd"></v-text-field>
                  <v-select label="Rol" v-model="usuario.rol" :items="['Alumne', 'Professor']" disabled></v-select>
                  <v-select label="Classe" v-model="usuario.idClasse" :items="classes" item-title="nom_classe" item-value="id_classe" disabled></v-select>
    
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="editDialog = false">Tancar</v-btn>
                  <v-btn color="blue darken-1" text @click="updateUsuarioInfo">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </div>
      <div v-else>
        <v-alert color="lightred" class="text-center">Error. No Autoritzat <router-link class="text-center" to="/">Tornar pagina login</router-link></v-alert>
      </div>
    </v-main>
  </v-layout>
</template>


<script>
import { useAppStore } from "@/store/app";
import { updateUsuarioInfo, getDadesUsuari, getRolUsuario, getClases } from "@/services/connectionManager";

export default {
  data() {
    return {
      usuarioInfo: [],
      editDialog: false,
      classes: [],
    };
  },
  computed: {
    isLoggedIn() {
      const appStore = useAppStore();
      return appStore.loginInfo.loggedIn;
    },
    loginInfo() {
      const appStore = useAppStore();
      return appStore.loginInfo;
    },
  },
  async created() {
    this.checkAuthentication();
    this.fetchUsuarioInfo();
   await this.fetchClasses();
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
    async fetchUsuarioInfo() {
      try {
        const username = this.loginInfo.username;
        const rol = await getRolUsuario(username);
        console.log('Obteniendo información del usuario...');
        this.usuarioInfo = await getDadesUsuari(username, rol);
        console.log('Información del usuario obtenida:', this.usuarioInfo);
      } catch (error) {
        console.error('Error al obtener información del usuario:', error.message);
      }
    },
    async fetchClasses() {
      try {
        this.classes = await getClases();

        console.log('Classes:', this.classes);
      } catch (error) {
        console.error(error);
      }
    },
    async updateUsuarioInfo() {
  try {
    console.log(this.usuarioInfo[0]);
    await updateUsuarioInfo(this.usuarioInfo[0]);
    alert('Els canvis estan guardats correctament.');
  } catch (error) {
    console.error(error);
    alert('Hi ha hagut un error al guardar els canvis.');
  }
},
  },
};
</script>

<style scoped>
.background {
  background-image: url('@/components/cubo.jpg');
  background-size: cover; /* Ajusta el tamaño de la imagen para cubrir el contenedor */
  background-position: center; /* Centra la imagen */
  height: 100vh; 
}

.cardStyle{
  margin: auto;
  background: rgba(255, 255, 255, 0.5);
  color: white !important;
  backdrop-filter: blur(10px);
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  height: 390px;
}

.text-perfil{
  color: white !important;
  margin-top: 45px;
  font-size: 17px;
}
.boto-editar {
  margin-top: 10px;
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
  margin-left: 242px;
}
.editar-card {
  background: rgba(255, 255, 255, 0.5);
  /* Fondo blanco semitransparente */
  color: white !important;;
  /* Cambiar el color del texto según tus preferencias */
  backdrop-filter: blur(15px);
  /* Efecto de desenfoque */

  /* Importante: establecer un fondo transparente para el v-card */
  background-color: transparent !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
  /* Sin sombra */
}

.editar-card .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.editar-card v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}
</style>