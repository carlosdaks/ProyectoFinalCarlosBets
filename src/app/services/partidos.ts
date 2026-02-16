import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {
  // cliente htpp para poder hacer peticiones
  private http = inject(HttpClient);
  // Aqui traigo la url del localhost, para hacer las pruebas del environment
  private apiUrl = environment.apiUrl; //es localhost

  constructor() { }

//los partidos
getPartidos() {
  return this.http.get<any[]>(`${this.apiUrl}/matches`);
}

//clasificaicon
  getStandings() {
  return this.http.get<any[]>(`${this.apiUrl}/league/standings`);
}
enviarApuesta(matchId: number, userId: number, homeScore: number, awayScore: number) {
  const body = {
    userId: userId,
    matchId: matchId,
    homeScore: homeScore,
    awayScore: awayScore
  };
  // el interceptor envia la apuesta con el token de usuario
  return this.http.post(`${this.apiUrl}/bets`, body);
}

getMatchById(id: string) {
  return this.http.get<any>(`${this.apiUrl}/matches/${id}`);
}

getLeaderboard() {
  return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
}

getSimulationState() {
  return this.http.get<any>(`${this.apiUrl}/simulation/state`);
}

getPartidosPorJornada(jornada: number) {
  return this.http.get<any[]>(`${this.apiUrl}/league/results/${jornada}`);
}
}