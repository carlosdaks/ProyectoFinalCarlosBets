import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PartidosService } from '../../services/partidos';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RankingPage implements OnInit {
  usuarios: any[] = [];
  private partidosService = inject(PartidosService);

  ngOnInit() {
    this.cargarRankingDeUsuarios();
  }

  cargarRankingDeUsuarios() {
    this.partidosService.getLeaderboard().subscribe({
      next: (res) => {
        this.usuarios = res;
      },
      error: (err) => console.error('Error al cargar el ranking:', err)
    });
  }
}