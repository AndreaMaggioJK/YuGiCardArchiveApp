import { Injectable } from "@angular/core";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { Card } from "./card";
import { HttpClient, HttpParams,HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { environment } from "src/enviroments/enviroment";
import { AuthService } from "./auth/auth.service";



@Injectable({providedIn: 'root'})
export class CardService{
    private apiServerUrl = environment.apiBaseUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}


    public getAllCards(): Observable<Card[]>{
        const url = `${this.apiServerUrl}/cards/all`;
        return this.http.get<Card[]>(url);

    }

    public getTopCards(page: number): Observable<Card[]>{
        const url = `${this.apiServerUrl}/cards/getTop?number=${page}`;
        return this.http.get<Card[]>(url);

    }

    public getFilteredCards(name: string, attribute: string, monsterType: string, cardType: string,
                            levelRankFrom: number, levelRankTo: number, pendulumFrom: number, pendulumTo: number,
                            linkFrom: number, linkTo: number, atkFrom: number, atkTo: number,
                            defFrom: number, defTo: number, icon: string
        ): Observable<Card[]>{
        let params = new HttpParams()
        var paramNames = ['name', 'attribute',  'icon', 'monsterType', 'cardType', 'levelRankFrom', 'levelRankTo',
                            'pendulumFrom', 'pendulumTo', 'linkFrom', 'linkTo', 'atkFrom', 'atkTo', 'defFrom', 'defTo'];
        var paramValues = [name, attribute, icon, monsterType, cardType, levelRankFrom, levelRankTo,
                        pendulumFrom,pendulumTo, linkFrom, linkTo, atkFrom, atkTo, defFrom, defTo];
        
        paramNames.forEach(
            function(paramName, index){
                var paramValue = paramValues[index];
                if(paramValue !== null && paramValue !== ''){
                    params = params.set(paramName, paramValue);
                    
                }
            }
        );

        const url = `${this.apiServerUrl}/cards/filter`;
        return this.http.get<Card[]>(url, {params});
    }


    
    deleteCardByName(name: string): Observable<boolean> {
        const url = `${this.apiServerUrl}/cards/s/delete?name=${name}`;
        return this.http.delete<boolean>(url);
    }
      
    addCard(card: Card): Observable<Card>{
        const url = `${this.apiServerUrl}/cards/s/add`;
        return this.http.post<Card>(url, card);
    } 
      
      


    
}