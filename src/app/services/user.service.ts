import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Observer } from 'rxjs';
import { IPollData } from '../interfaces/IPollData';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {


  
  private apiUrl = 'http://localhost:5001'
  private token: string | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(private http:HttpClient,private router:Router,@Inject(PLATFORM_ID) private platformId: Object) { }

  logout():void{
    this.token = null;
    localStorage.removeItem('userToken');
    this.router.navigate(['/login'])
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.token) {
        this.token = localStorage.getItem('userToken');
      }
    }
    return this.token;
  }
  

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const isTrue =  token ? !this.jwtHelper.isTokenExpired(token) : false;
      console.log(isTrue);
      return isTrue
      
    }
    return false;  // default to not logged in if not in browser context
  }
  signup(data:Object):Observable<string>{
    return this.http.post<string>(`${this.apiUrl}/signup`,data)
  }

  login(data:Object):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/login`,data)
  }

  createPoll(pollData:IPollData):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/createPoll`,pollData)
  }

  getPolls(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getPolls`);
  }

  getPollById(id:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/poll/${id}`)
  }

  getMyPolls(id:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/myPolls/${id}`)
  }
  // user.service.ts

updateVote(pollId: string, optionText: string, userId: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/vote/${pollId}`, { optionText, userId });
}


}
