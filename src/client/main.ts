import Vue from 'vue';
import VueRouter from 'vue-router';
import { buildClientRoutes } from './routes';
import axios from 'axios';

import './main.css';
import { checkNotNil } from '../shared/util/checkNotNil';

// If we are told that we're not logged in, redirect to /login
axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status == 401) {
    v.$router.push('/login');
  }
  return Promise.reject(error);
});

const config =
    JSON.parse(
        checkNotNil(document.getElementById('config')).innerHTML);

Vue.use(VueRouter);

const v = new Vue({
  el: "#app",
  router: new VueRouter({
    mode: 'history',
    routes: buildClientRoutes(),
  }),
  data: {
    config: config,
  },
  template: `<router-view :config="config"></router-view>`,
});
