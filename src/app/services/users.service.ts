import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userDTO } from '../models/usersDTO';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private userDataURL = '../../assets/fakeDB/employees.json';
  constructor(private http: HttpClient) { }

  getUserData():Observable<any>{   //Getting User Data from the Json File
    return this.http.get(this.userDataURL)
  }



}
