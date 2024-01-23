import { createApp as createVueApp } from 'vue';
import VueApp from './App.vue';

window.mdui.setColorScheme("#64c8ff");

const App = createVueApp(VueApp);
App.mount("#app");