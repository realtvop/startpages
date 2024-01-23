import config from './config';

window.mdui.setColorScheme(config.settings.color || "#64c8ff");

import { createApp as createVueApp } from 'vue';
import VueApp from './App.vue';

const App = createVueApp(VueApp);
App.mount("#app");