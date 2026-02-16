import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  user: any = {};
  nuevoNombre: string = '';
  avatarSeleccionado: string = '';
  opcionesAvatar: string[] = [];

  private http = inject(HttpClient);
  private toastCtrl = inject(ToastController);

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'user' });
    
    if (value) {
      this.user = JSON.parse(value);
      this.nuevoNombre = this.user.username;
      
      this.generarAvataresRandom();

      if (this.user.avatar && this.user.avatar.startsWith('http')) {
        this.avatarSeleccionado = this.user.avatar;
      } else {
        // Usamos el username para que el avatar sea unico para cada usuario
        this.avatarSeleccionado = `https://api.dicebear.com/7.x/bottts/svg?seed=${this.user.username}`;
      }
    }
  }

  async guardarCambios() {
  const body = {
    username: this.nuevoNombre,
    avatar: this.avatarSeleccionado
  };

  this.http.put(`${environment.apiUrl}/users/${this.user.id}`, body)
    .subscribe({
      next: async (res: any) => {
        const updatedUser = { ...this.user, ...res };
        this.user = updatedUser; 

        await Preferences.set({
          key: 'user',
          value: JSON.stringify(updatedUser)
        });
        
        this.mostrarToast('Perfil actualizado correctamente');
      },
      error: () => this.mostrarToast('Error al actualizar el perfil')
    });
}

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  generarAvataresRandom() {
    this.opcionesAvatar = [];
    const estilos = ['avataaars', 'bottts', 'pixel-art', 'adventurer'];
    const estiloAleatorio = estilos[Math.floor(Math.random() * estilos.length)];
    //generamos 8 imagenes random
    for (let i = 0; i < 8; i++) {
      const randomSeed = Math.random().toString(36).substring(7);
      const url = `https://api.dicebear.com/7.x/${estiloAleatorio}/svg?seed=${randomSeed}`;
      this.opcionesAvatar.push(url);
    }
  }

  seleccionarAvatar(url: string) {
    this.avatarSeleccionado = url;
  }
}