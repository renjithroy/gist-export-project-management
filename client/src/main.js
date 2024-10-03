import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import VModal from 'vue-js-modal';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'vue-toastification/dist/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

library.add(faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Toast);  
Vue.use(VModal);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
