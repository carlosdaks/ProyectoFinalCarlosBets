import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { 
  IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonContent, IonCard, IonCardContent, IonSpinner, IonIcon } from "@ionic/angular/standalone"; 

@Component({
  selector: 'app-detalles-equipos',
  templateUrl: './detalles-equipos.page.html',
  styleUrls: ['./detalles-equipos.page.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule, RouterModule, HttpClientModule,
    IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonBackButton, IonContent, IonCard, IonCardContent, IonSpinner
  ]
})
export class DetallesEquiposPage implements OnInit {
  nombreEquipo: string = '';
  listaJugadores: any[] = [];
  estadisticas: any = null;
  cargando: boolean = true;

  mapaEscudos: any = {
    "Real Madrid": "real_madrid", "FC Barcelona": "fc_barcelona",
    "Atlético Madrid": "atletico", "Real Sociedad": "real_sociedad",
    "Villarreal": "villarreal", "Real Betis": "betis",
    "Athletic Club": "athletic", "Sevilla FC": "sevilla",
    "Osasuna": "osassuna", "Girona FC": "girona",
    "Rayo Vallecano": "rayo", "Celta de Vigo": "celta",
    "Valencia CF": "valencia", "Getafe CF": "getafe",
    "RCD Mallorca": "mallorca", "UD Las Palmas": "las_palmas",
    "Deportivo Alavés": "alaves", "Granada CF": "granada",
    "Cádiz CF": "cadiz", "UD Almería": "almeria"
  };

  private API_URL = environment.apiUrl; 

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.nombreEquipo = this.route.snapshot.paramMap.get('nombre') || '';
    if (this.nombreEquipo) {
      this.cargarTodo();
    }
  }

  cargarTodo() {
    this.cargando = true;
    this.http.get<any[]>(`${this.API_URL}/league/standings`).subscribe(res => {
      // buscamos nuestro equipo en la tabla general
      this.estadisticas = res.find(e => e.name === this.nombreEquipo);
      // para coger a los jugadores de cada equipo
      this.http.get<any[]>(`${this.API_URL}/teams/${this.nombreEquipo}/players`).subscribe(players => {
        this.listaJugadores = players;
        this.cargando = false;
      });
    }, error => {
      console.error("Error en la API:", error);
      this.cargando = false;
    });
  }

  getEscudo(nombre: string) {
    const archivo = this.mapaEscudos[nombre];
    return archivo ? `assets/iconos-equipos/${archivo}.png` : '';
  }
}