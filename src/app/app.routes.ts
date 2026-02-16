import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'detalles-partidos/:id',
    loadComponent: () => import('./pages/detalles-partidos/detalles-partidos.page').then( m => m.DetallesPartidosPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/ranking/ranking.page').then( m => m.RankingPage)
  },
  {
    path: 'clasificacion',
    loadComponent: () => import('./pages/clasificacion/clasificacion.page').then( m => m.ClasificacionPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage)
  },
 {
  path: 'detalles-equipos/:nombre', 
  loadComponent: () => import('./pages/detalles-equipos/detalles-equipos.page').then( m => m.DetallesEquiposPage)
},
];