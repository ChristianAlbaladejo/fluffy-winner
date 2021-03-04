import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const USER = '';

@Injectable()
export class ApiService {
    public url: string;
    public identify;
    public stats;
    public token;
    constructor(public _http: HttpClient) {}

    async getUserData(id): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY });
        let tokenvalue = JSON.parse(token.value)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8"',
            'Authorization': 'Bearer ' + tokenvalue.jwt
        });

        return this._http.get('https://libromatriculas.herokuapp.com/users/'+id, { headers: headers });
    }

    async addCar(car): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY });
        let tokenvalue = JSON.parse(token.value)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenvalue.jwt,
            'Accept':'*/*'
        });

        return this._http.post('https://libromatriculas.herokuapp.com/cars/',car , { headers: headers });
    }

    async updateCar(car): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY });
        let tokenvalue = JSON.parse(token.value)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenvalue.jwt,
            'Accept': '*/*'
        });

        return this._http.put('https://libromatriculas.herokuapp.com/cars/'+car.id, car, { headers: headers });
    }

    async deleteCar(car): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY });
        let tokenvalue = JSON.parse(token.value)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenvalue.jwt,
            'Accept': '*/*'
        });

        return this._http.delete('https://libromatriculas.herokuapp.com/cars/' + car, { headers: headers });
    }

    async getCar(car): Promise<Observable<any>> {
        let token = await Storage.get({ key: TOKEN_KEY });
        let tokenvalue = JSON.parse(token.value)
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenvalue.jwt,
            'Accept': '*/*'
        });

        return this._http.get('https://libromatriculas.herokuapp.com/cars/'+ car, { headers: headers });
    }
}