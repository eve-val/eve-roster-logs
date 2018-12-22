import Vue from 'vue';
import VueRouter from 'vue-router';
import { buildClientRoutes } from './routes';

import './main.css';

Vue.use(VueRouter);

const v = new Vue({
  el: "#app",
  router: new VueRouter({
    mode: 'history',
    routes: buildClientRoutes(),
  }),
  template: `<router-view></router-view>`,
});
