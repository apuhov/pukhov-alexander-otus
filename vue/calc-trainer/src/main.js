import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

router.afterEach((to) => {  //,from
  Vue.nextTick(() => {
    document.title = to.meta.title || 'Training of calculation';
  });
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
