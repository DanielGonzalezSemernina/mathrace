/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "/src/App.vue"

// Composables
import { createApp } from "/node_modules/.vite/deps/vue.js?v=7564ed40"

// Plugins
import { registerPlugins } from "/src/plugins/index.js"

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
