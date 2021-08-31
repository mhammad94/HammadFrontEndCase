import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { userDTO } from 'src/app/models/usersDTO';
import { UsersService } from 'src/app/services/users.service';
import { filter, map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  constructor(
    private userService:UsersService,
    private modalService: BsModalService
    ) { }

    modalRef?: BsModalRef;

  usersData:userDTO[] = [];
  userRole:userDTO[] = [];
  seniorUsers:userDTO[] = [];
  wfmUsers:userDTO[] = [];


  ngOnInit(): void {
    this.userService.getUserData()
    .pipe(
      map((res:userDTO[]) => {
       return res['users']
      })
        )
    .subscribe(res => {
      this.usersData = res; // Pushing the response array in the local comaponent array
      this.userRole = this.usersData.filter(el => { return el.role == 1});
      this.seniorUsers = this.usersData.filter(el => {return el.role == 2}); //filtering the users based on role
      this.wfmUsers = this.usersData.filter(el => {return el.role == 3});
    })


  }


  deleteUser(index){ // Delete User
    this.userRole.splice(index, 1);
  }


  deleteSeniorUser(index){ //Delete Senior User
    this.seniorUsers.splice(index, 1)
  }

  deleteWFMUser(index){ //Delete WFM User
    this.wfmUsers.splice(index, 1)
  }


  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }



  addUserForm = new FormGroup({
    role:new FormControl('', [Validators.required]),
    firstName:new FormControl('', [Validators.required]),
    lastName:new FormControl('', [Validators.required])
  });


  convertStringToNumber(value){
    return parseInt(value)
  }

  addUser(){  // Adding Users according to the Role
    let data:userDTO = this.addUserForm.value;
    data.role = this.convertStringToNumber(data.role)
    if(data.role === 1){
      this.userRole.push(data)
    };

    if(data.role === 2){
      this.seniorUsers.push(data);
    }

    if(data.role === 3){
      this.wfmUsers.push(data);
    }
  }






}
