import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(async (res) => {
        if (res.token) {
          await Preferences.set({ key: 'token', value: res.token });
          await Preferences.set({ key: 'user', value: JSON.stringify(res.user) });
        }
      })
    );
  }

  registro(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(async (res) => {
        if (res.token) {
          await Preferences.set({ key: 'token', value: res.token });
          await Preferences.set({ key: 'user', value: JSON.stringify(res.user) });
        }
      })
    );
  }

  // cerrar sesion y limpiar tood
  async logout() {
    await Preferences.clear();
  }
}