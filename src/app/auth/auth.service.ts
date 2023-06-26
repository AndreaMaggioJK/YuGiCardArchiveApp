import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/enviroments/enviroment";
import axios from "axios";
import { Response } from "./response";
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({providedIn: 'root'})
export class AuthService{
    
    
    private apiServerUrl = environment.apiBaseUrl;

    constructor(
        private http: HttpClient
    ){}

    public async register(nickName: string,email: string, pw: string): Promise<string>{
        const url = `${this.apiServerUrl}/cards/auth/register`;
        try {
          const response: any = await this.http.post(url, {nickName, email, pw }).toPromise();          
          return "OK";
          
        } catch (error) {
          return "ERROR: "+error;
        }
    }


    public async auth(email: string, pw: string): Promise<string>{
        const url = `${this.apiServerUrl}/cards/auth/authenticate`;

        try {
            const response: any = await this.http.post(url, { email, pw }).toPromise();
            if (response && response.access_token) {
                this.setAccessToken(response.access_token);
                this.setRefreshToken(response.refresh_token);
            }
            return "OK";
            
        } catch (error) {
            if (error instanceof HttpErrorResponse) {
                switch(error.status){
                    case 403:
                        //alert("Access denied");
                        return "AccessDenied";
                        break;
                    case 0:
                        //alert("Server is down");
                        return "ServerDown";
                        break
                    default:
                        return 'ERROR';
                        throw error;
                }
              } else {
                console.error('API request failed:', error);
                throw error;
              }
        }
    }


    public async refreshToken(): Promise<void> {
        const url = `${this.apiServerUrl}/cards/auth/refresh-token`;
      
        const refreshToken = this.getRefreshToken();
      
        try {
          const response: any = await this.http.post(url, refreshToken).toPromise();
      
          if (response && response.access_token) {
            this.setAccessToken(response.access_token);
          } else {
            throw new Error('AccessTokenNotFound');
          }
        } catch (error) {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 403:
                throw new Error('TokenExpired');
              case 0:
                throw new Error('ServerDown');
              default:
                throw error;
            }
          } else {
            throw error;
          }
        }
    }
      
    public async logOut() {
      const url = `${this.apiServerUrl}/cards/auth/log-out`;
      const accessToken = this.getAccessToken();
      try {
        const response: any = await this.http.post(url, accessToken).toPromise();
        if(response){
          this.removeAccessToken();
          this.removeRefreshToken();
        }else{
          console.error('Log out failed');
        }
        
      } catch (error) {
        console.error('API request failed:', error);
      }
    }


    setAccessToken(token: string): void {
        localStorage.setItem('access_token', token);
      }
      
    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }
    
    removeAccessToken(): void {
        localStorage.removeItem('access_token');
    }

    setRefreshToken(token: string): void{
        localStorage.setItem('refresh_token', token);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }
    
    removeRefreshToken(): void {
        localStorage.removeItem('refresh_token');
    }
}