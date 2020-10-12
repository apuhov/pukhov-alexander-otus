import Vue from 'vue'
import VueRouter from 'vue-router'
import PageSettings from "../components/PageSettings";
import PageTraining from "../components/PageTraining";

Vue.use(VueRouter)

const routes = [{
  path: '/settings',
  component: PageSettings,
  meta: {title: 'Settings page'}
}, {
  path: '/train',
  component: PageTraining,
  meta: {title: 'Training page'}
}, {
  path: '/',
  component: PageSettings,
  meta: {title: 'Settings page'}
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router