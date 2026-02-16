import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PartidosService } from '../services/partidos';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage implements OnInit {
  username: string = '';
  partidos: any[] = []; 
  partidosLive: any[] = [];
  partidosPending: any[] = [];
  partidosFinished: any[] = [];
  clasificacion: any[] = []; 
  private intervalId: any;
  private router = inject(Router);
  private partidosService = inject(PartidosService);
  segmentoSeleccionado: string = 'todos';
  
  //para el boton de saber que joranada estamos cuando se ha simulado mucho
  jornadaRastreador: number = 0; 
  textoBuscar: string = '';

  cambiarFiltro(tipo: string) {
    this.segmentoSeleccionado = tipo;
  }

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'user' });
    
    if (value) {
      this.username = JSON.parse(value).username;
    }
    this.obtenerYFiltrar();
    this.cargarClasificacion();
    this.intervalId = setInterval(() => {
      this.obtenerYFiltrar();
    }, 5000);
}


  mapaEscudos: { [key: string]: string } = {
  "Real Madrid": "real_madrid",
  "FC Barcelona": "fc_barcelona",
  "Atlético Madrid": "atletico",
  "Real Sociedad": "real_sociedad",
  "Villarreal": "villarreal",
  "Real Betis": "betis",
  "Athletic Club": "athletic",
  "Sevilla FC": "sevilla",
  "Osasuna": "osasuna",
  "Girona FC": "girona",
  "Rayo Vallecano": "rayo",
  "Celta de Vigo": "celta",
  "Valencia CF": "valencia",
  "Getafe CF": "getafe",
  "RCD Mallorca": "mallorca",
  "UD Las Palmas": "las_palmas",
  "Deportivo Alavés": "alaves",
  "Granada CF": "granada",
  "Cádiz CF": "cadiz",
  "UD Almería": "almeria"
};

  obtenerYFiltrar() {
    this.partidosService.getSimulationState().subscribe({
      next: (state) => {
        let j = state.currentJornada;
        
        // si el rastreador detecta que el servidor se queda encganchado en una jornada, usamos el rastreador
        if (this.jornadaRastreador > j) {
          j = this.jornadaRastreador;
        }

        // buscamos jornadas mas adelante por si pasa lo de que se engancha en una jornada cuando se ha simulado muhjco
        const jornadasABuscar = [j - 1, j, j + 1, j + 2, j + 3, j + 4];
        let todosLosPartidos: any[] = [];
        let peticionesFinalizadas = 0;

        jornadasABuscar.forEach(numJornada => {
          if (numJornada <= 0 || numJornada > 38) {
            peticionesFinalizadas++;
            this.verificarPeticiones(peticionesFinalizadas, jornadasABuscar.length, todosLosPartidos);
            return;
          }

          this.partidosService.getPartidosPorJornada(numJornada).subscribe({
            next: (partidos) => {
              if (partidos && partidos.length > 0) {
                todosLosPartidos = [...todosLosPartidos, ...partidos];
              }
              peticionesFinalizadas++;
              this.verificarPeticiones(peticionesFinalizadas, jornadasABuscar.length, todosLosPartidos);
            },
            error: () => {
              peticionesFinalizadas++;
              this.verificarPeticiones(peticionesFinalizadas, jornadasABuscar.length, todosLosPartidos);
            }
          });
        });
      }
    });
  }

  verificarPeticiones(completadas: number, total: number, partidos: any[]) {
    if (completadas === total) {
      // para limpiar duplicados
      const partidosUnicos = partidos.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      this.procesarPartidos(partidosUnicos);
    }
  }

  procesarPartidos(partidos: any[]) {
    this.partidosLive = partidos.filter(p => p.status === 'live');
    this.partidosPending = partidos.filter(p => p.status === 'pending').sort((a, b) => a.id - b.id);
    this.partidosFinished = partidos.filter(p => p.status === 'finished').sort((a, b) => b.id - a.id);
    // Si la api nos ha mandado pura jornada finalizada, significa que hizo el catch-up, se fuerza a la app a buscar más adelante en la próxima recarga.
    if (this.partidosLive.length === 0 && this.partidosPending.length === 0 && this.partidosFinished.length > 0) {
      const maximaJornadaDescargada = Math.max(...this.partidosFinished.map(p => p.jornada));
      this.jornadaRastreador = maximaJornadaDescargada + 1; 
    }
  }

  cargarClasificacion() {
    this.partidosService.getStandings().subscribe({
      next: (res) => {
        this.clasificacion = res;
      }
    });
  }

  async logout() {
  await Preferences.clear();
  localStorage.clear(); //por si queda algo

  this.router.navigate(['/login']);
}

  async realizarApuesta(partido: any) {
  const { value } = await Preferences.get({ key: 'user' });
  
  if (!value) {
    alert('Debes estar logueado para apostar');
    return;
  }
  const user = JSON.parse(value);

  const homeGols = prompt(`¿Cuántos goles meterá el ${partido.home}?`);
  const awayGols = prompt(`¿Cuántos goles meterá el ${partido.away}?`);

  if (homeGols !== null && awayGols !== null) {
    this.partidosService.enviarApuesta(
      partido.id, 
      user.id, 
      parseInt(homeGols), 
      parseInt(awayGols)
    ).subscribe({
      next: (res) => alert('¡Apuesta registrada!'),
      error: (err) => alert('Error: ' + (err.error?.error || 'No se pudo registrar'))
    });
  }
}

  buscarPartido(event: any) {
    this.textoBuscar = event.detail.value.toLowerCase();
  }

  filtrarPorNombre(lista: any[]) {
    if (!this.textoBuscar) return lista;
    return lista.filter(p => 
      p.home.toLowerCase().includes(this.textoBuscar) || 
      p.away.toLowerCase().includes(this.textoBuscar)
    );
  }

  getEscudo(name: string) {
  const archivo = this.mapaEscudos[name];
  return archivo ? `assets/iconos-equipos/${archivo}.png` : '';
}


getUltimoEventoGol(partido: any): any {
  if (!partido.events || !Array.isArray(partido.events) || partido.events.length === 0) {
    return null;
  }
  const goles = partido.events.filter((evento: any) => evento.type === 'goal');
  return goles.length > 0 ? goles[goles.length - 1] : null;
}

//Estos dos se usan para cuando cambias el nombre dle usuaio en el perfil cuando vuelvas a home no lea el cache del antiguo nombre si no que coja el nuevo
ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
  const { value } = await Preferences.get({ key: 'user' });
  
  if (value) {
    const userData = JSON.parse(value);
    this.username = userData.username || 'Invitado';
  } else {
    this.username = 'Invitado';
  }
  }
}