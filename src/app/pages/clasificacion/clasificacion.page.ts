import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PartidosService } from '../../services/partidos';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.page.html',
  styleUrls: ['./clasificacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ClasificacionPage implements OnInit {

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
  clasificacion: any[] = [];
  partidosFiltrados: any[] = [];
  
  jornadas: number[] = Array.from({length: 38}, (_, i) => i + 1); 
  jornadaSeleccionada: number = 1; 
  
  // Guardamos la jornada real por la que va el servidor para poder volver a ella
  jornadaActualReal: number = 1; 

  private partidosService = inject(PartidosService);

  ngOnInit() {
    this.cargarClasificacion();
    this.obtenerJornadaActual(); 
  }

  cargarClasificacion() {
    this.partidosService.getStandings().subscribe(res => {
      this.clasificacion = res.sort((a: any, b: any) => b.pts - a.pts);
    });
  }

  obtenerJornadaActual() {
    this.partidosService.getSimulationState().subscribe({
      next: (state) => {
        if (state && state.currentJornada) {
          const jornadaMapeada = state.currentJornada > 38 ? 38 : state.currentJornada;
          this.jornadaSeleccionada = jornadaMapeada;
          
          this.jornadaActualReal = jornadaMapeada; 
        }
        this.cargarJornada();
      },
      error: () => {
        this.cargarJornada();
      }
    });
  }


  //para que el boton de volver a jornada actual funcione, si no estamos en la actual nos hace volver
  volverAJornadaActual() {
    if (this.jornadaSeleccionada !== this.jornadaActualReal) {
      this.jornadaSeleccionada = this.jornadaActualReal;
      this.cargarJornada();
    }
  }

  cargarJornada() {
    this.partidosFiltrados = [];
    this.partidosService.getPartidosPorJornada(this.jornadaSeleccionada).subscribe(res => {
      this.partidosFiltrados = res;
    });
  }

  getEscudo(name: string) {
  const archivo = this.mapaEscudos[name];
  if (!archivo) return ''; 
  return `assets/iconos-equipos/${archivo}.png`;
}
  
}
