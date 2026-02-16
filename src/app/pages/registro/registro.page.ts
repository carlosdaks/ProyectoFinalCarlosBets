import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonText, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonButtons,IonContent, IonHeader, IonTitle, IonToolbar, 
    IonItem, IonLabel, IonInput, IonButton, IonText,
    CommonModule, FormsModule, RouterModule
  ]
})
export class RegistroPage {
  username = '';
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    const userData = { 
      username: this.username, 
      email: this.email, 
      password: this.password 
    };

    this.authService.registro(userData).subscribe({
      next: (res) => {
        //console.log('¡Usuario creado!', res);
        // Al adarle a registrar no vamos al login sino que directametne vamos a home
        this.router.navigate(['/home']);
      },
      error: (err) => {
        //console.error('Error al registrar', err);
        alert('Error: ' + (err.error?.error || 'No se pudo crear la cuenta'));
      }
    });
  }
}