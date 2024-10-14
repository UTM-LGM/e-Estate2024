import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Country } from '../_interface/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  addCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(this.baseUrl + '/countries/AddCountry', country)
  }

  getCountry(): Observable<Country[]> {
    return this.http.get<Country[]>(this.baseUrl + '/countries/GetCountries')
  }

  updateCountry(country: Country): Observable<Country> {
    return this.http.put<Country>(this.baseUrl + '/countries/UpdateCountry', country)
  }

  getCountryAsc(): Observable<Country[]> {
    return this.http.get<Country[]>(this.baseUrl + '/countries/GetCountriesAsc')
  }

  getAllCountry():Observable<any[]>{
    return this.http.get<any[]>('https://restcountries.com/v3.1/all');
  }
}
