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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'apuestas', component: ApuestasViewComponent },
  { path: 'mis-apuestas', component: MisApuestasComponent },
  { path: 'apuestas/crear', component: CrearApuestaComponent },
  { path: 'apuestas/tickets', component: MisTicketsComponent },
  { path: 'login', component: LoginComponent, data: { sidebar: false } },
  { path: 'registro', component: RegistroComponent, data: { sidebar: false } },
  { path: 'ajustes', component: UsuarioConfigComponent },


  { path: 'apuestas/:id', component: VerApuestaComponent },

];
