import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; 
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] 
})
export class LoginPage {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    const creds = { email: this.email, password: this.password };
    
    this.authService.login(creds).subscribe({
      next: (res) => {
        console.log('Login OK', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error', err);
        alert('Fallo al entrar. Revisa la consola.');
      }
    });
  }
}