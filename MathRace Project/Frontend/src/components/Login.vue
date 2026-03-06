<template>
  <v-container fluid class="container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="3" class="card-container">
        <v-card class="elegant-card">
          <v-card-title class="text-center, text-title">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="username" label="Usuari" prepend-icon="mdi-account"></v-text-field>
              <v-text-field v-model="password" label="Contrasenya" type="password" prepend-icon="mdi-lock"></v-text-field>
              <v-btn type="submit" class="btn-color">Login</v-btn>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <p>Encara no t'has registrat?
            <a class="text-bold" href="#" @click.prevent="openRegistrationDialog">Registrat aquí.</a>
          </p>

        </v-card>
      </v-col>
    </v-row>

    <!-- Registration Dialog -->
    <v-dialog v-model="registrationDialog" max-width="600px" class="text-black" transition="dialog-bottom-transition">
      <v-card class="registration-card">
        <v-card-title class="text-center">Registrarse</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="registerUser">
            <v-text-field v-model="newUser.nomUsuari" label="Nom usuari" prepend-icon="mdi-account"></v-text-field>
            <v-text-field v-model="newUser.nomCogonoms" label="Noms i cognoms"
              prepend-icon="mdi-account-details"></v-text-field>
            <v-text-field v-model="newUser.correu" label="Correu" prepend-icon="mdi-email"></v-text-field>
            <v-text-field v-model="newUser.passwd" label="Contrasenya" type="password"
              prepend-icon="mdi-lock"></v-text-field>
            <v-select v-model="newUser.rol" :items="['Alumne']" label="Rol"
              prepend-icon="mdi-account-circle"></v-select>
            <v-select v-if="newUser.rol === 'Alumne'" v-model="newUser.idClasse" :items="classes"
              label="Selecciona una clase" item-title="nom_classe" item-value="id_classe"
              prepend-icon="mdi-school"></v-select>
            <v-btn type="submit" color="primary">Registrar-se</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useAppStore } from "@/store/app";
import { getUsuarios, registrarUsuario, getClases } from "@/services/connectionManager";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      newUser: {
        nomUsuari: "",
        nomCogonoms: "",
        correu: "",
        passwd: "",
        rol: "",
        idClasse: null,
      },
      selectedClassId: null,
      registrationDialog: false,
      classes: [],
    };
  },
  mounted() {
    useAppStore().checkAuthentication();

    // Redirect automatically if already authenticated
    if (useAppStore().loginInfo.loggedIn) {
      this.$router.push({ name: "PaginaPrincipal" });
    }
  },
  methods: {
    async login() {
      try {
        const users = await getUsuarios();

        // Check if the provided username and password match any user's credentials
        const authenticatedUser = users.find(user => user.nomUsuari === this.username && user.passwd === this.password);

        if (authenticatedUser) {
          useAppStore().setLoginInfo({
            loggedIn: true,
            username: this.username,
          });

          // Store authentication information in localStorage
          const authInfo = {
            loggedIn: true,
            username: this.username,
          };
          localStorage.setItem('authInfo', JSON.stringify(authInfo));

          this.$router.push({ name: "PaginaPrincipal" });
        } else {
          alert("Credencials incorrectes");
        }
      } catch (error) {
        console.error('Error en la autenticacio:', error);
        alert('Error en la autenticacio');
      }
    },
    async registerUser() {
      try {
        const result = await registrarUsuario(this.newUser, this.newUser.idClasse);

        if (result.success) {
          alert("Usuari registrat correctament. Siusplau, inicia sessió.");
          this.registrationDialog = false;
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        this.handleError("Error en el registre:", error);
      }
    },
    handleError(message, error) {
      console.error(message, error);
      alert("Error: " + message);
    },
    openRegistrationDialog() {
      this.registrationDialog = true;
      this.fetchClasses();
    },
    async fetchClasses() {
      try {
        this.classes = await getClases();
        console.log('Classes:', this.classes);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.text-title {
  font-size: 30px !important;
  margin-top: 15px !important;
  margin-bottom: 15px !important;
}

.container {
  background-image: url('@/components/cubo.jpg');
  background-color: rgba(255, 255, 255, 1);
  /* Fondo blanco semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-position: center;
}

.card-container {
  text-align: center;
  margin-top: 20px;
}

.elegant-card {
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(10px) !important;
  /* Añade un efecto de desenfoque al fondo */
  color: white !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;

}

.btn-color {
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(20px);
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 10px rgba(17, 82, 125, 0.675) !important;
  /* Sombra ligeramente más pronunciada al pasar el ratón */
  color: white !important;
}

.text-black {
  color: black !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
}

.card-container p {
  margin: 10px 0;
  color: white;
}

.elegant-card:hover {
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.41);
  /* Sombra ligeramente más pronunciada al pasar el ratón */
}

.card-container a {
  color: white;
  /* Color azul similar a Vuetify primary */
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
}

.card-container a:hover {
  color: #79838e;
  /* Color azul más oscuro al pasar el ratón */
}

.text-bold {
  font-weight: bold;
}

.color-whte {
  color: white !important;
  ;
}

.btn-color {
  color: white !important;
}

.transparent {
  background: transparent !important;
  /* Usa !important si es necesario para anular estilos predeterminados de Vuetify */
  backdrop-filter: blur(10px) !important;
  /* Añade un efecto de desenfoque al fondo */
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.41) !important;
}

.registration-card {
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

.registration-card .v-card__text {
  /* Si el contenido del texto dentro del v-card necesita un fondo específico */
  background-color: transparent !important;
}

.registration-card v-btn {
  background: transparent !important;
  /* Fondo transparente para el botón */
}</style>
