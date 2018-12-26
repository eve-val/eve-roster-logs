
import LogViewer from './logviewer/LogViewer.vue';
import Login from './Login.vue';
import { RouteConfig } from 'vue-router';

export function buildClientRoutes() {
  const routes: RouteConfig[] = [
    { path: '/', redirect: '/logs' },
    { path: '/logs/:path*', component: LogViewer },
    { path: '/login', component: Login },
    // Catch-all, redirect to home
    { path: '/*', redirect: '/' },
  ];
  return routes;
}
