import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ApuestasViewComponent } from './pages/apuestas-view/apuestas-view.component';
import { MisApuestasComponent } from './pages/mis-apuestas/mis-apuestas.component';
import { CrearApuestaComponent } from './pages/crear-apuesta/crear-apuesta.component';
import { VerApuestaComponent } from './pages/ver-apuesta/ver-apuesta.component';
import { MisTicketsComponent } from './pages/mis-tickets/mis-tickets.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { UsuarioConfigComponent } from './pages/usuario-config/usuario-config.component';
import { CarteraComponent } from './pages/cartera/cartera.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TransaccionesComponent } from './pages/transacciones/transacciones.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Inicio' }
  },
  {
    path: 'apuestas',
    component: ApuestasViewComponent,
    data: { title: 'Apuestas' }
  },
  {
    path: 'mis-apuestas',
    component: MisApuestasComponent,
    data: { title: 'Mis Apuestas' }
  },
  {
    path: 'apuestas/crear',
    component: CrearApuestaComponent,
    data: { title: 'Crear Apuesta' }
  },
  {
    path: 'apuestas/tickets',
    component: MisTicketsComponent,
    data: { title: 'Mis Tickets' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Iniciar Sesión',
      sidebar: false
    }
  },
  {
    path: 'registro',
    component: RegistroComponent,
    data: {
      title: 'Registro',
      sidebar: false
    }
  },
  {
    path: 'ajustes',
    component: UsuarioConfigComponent,
    data: { title: 'Configuración de Usuario' }
  },
  {
    path: 'cartera',
    component: CarteraComponent,
    data: { title: 'Mi Cartera' }
  },
  {
    path: 'transacciones',
    component: TransaccionesComponent,
    data: { title: 'Mis Transacciones' }
  },
  {
    path: 'apuestas/:id',
    component: VerApuestaComponent,
    data: { title: 'Detalle de Apuesta' }
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: 'Página no encontrada',
      sidebar: false
    }
  },


];
