import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistorialPage implements OnInit {
  apuestas: any[] = [];
  puntosTotales: number = 0;
  winrate: number = 0;
  totalPorras: number = 0;

  private http = inject(HttpClient);

  ngOnInit() {
    this.cargarHistorial();
  }

  async cargarHistorial() {
    const { value } = await Preferences.get({ key: 'user' });
    
    if (!value) return;
    const user = JSON.parse(value);

    this.http.get<any[]>(`${environment.apiUrl}/bets/user/${user.id}`).subscribe({
      next: (res) => {
        // Invertimos el orden para mostrar las más recientes primero
        this.apuestas = res.reverse(); 
        this.calcularStats();
      },
      error: (err) => console.error('Error cargando historial', err)
    });
}

  //para sacar el % de winrate
  calcularStats() {
    this.totalPorras = this.apuestas.length;
    this.puntosTotales = this.apuestas.reduce((acc, current) => acc + (current.pointsEarned || 0), 0);
    
    if (this.totalPorras > 0) {
      const ganadas = this.apuestas.filter(a => a.pointsEarned > 0).length;
      this.winrate = Math.round((ganadas / this.totalPorras) * 100);
    }
  }
}