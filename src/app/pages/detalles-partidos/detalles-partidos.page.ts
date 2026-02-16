import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidosService } from '../../services/partidos';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-detalles-partidos',
  templateUrl: './detalles-partidos.page.html',
  styleUrls: ['./detalles-partidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class DetallesPartidosPage implements OnInit {
  match: any;
  //apra las apuestas
  golesHome: number = 0;
  golesAway: number = 0;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private partidosService = inject(PartidosService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarInfoPartido(id);
    }
  }

  cargarInfoPartido(id: string) {
    this.partidosService.getMatchById(id).subscribe({
      next: (res) => {
        this.match = res;
      },
      error: (err) => console.error('Error al obtener detalle:', err)
    });
  }

  ajustarGoles(equipo: string, valor: number) {
    if (equipo === 'home') {
      this.golesHome = Math.max(0, this.golesHome + valor);
    } else {
      this.golesAway = Math.max(0, this.golesAway + valor);
    }
  }

  async enviarMiApuesta() {
  
    const { value } = await Preferences.get({ key: 'user' });
    const userData = JSON.parse(value || '{}');
    
    if (!userData.id) {
      alert('Error: No se ha encontrado la sesión del usuario');
      return;
    }

    this.partidosService.enviarApuesta(
      this.match.id,
      userData.id,
      this.golesHome,
      this.golesAway
    ).subscribe({
      next: () => {
        alert('Apuesta enviada correctamente');
        this.router.navigate(['/home']);
      },
      error: (err) => alert('No se pudo enviar: ' + (err.error?.error || 'Error desconocido'))
    });
}
  
}