import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { userDTO } from 'src/app/models/usersDTO';
import { UsersService } from 'src/app/services/users.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit, AfterViewInit {


  modalRef?: BsModalRef;
  usersData:userDTO[] = [];
  userRole:userDTO[] = [];
  seniorUsers:userDTO[] = [];
  wfmUsers:userDTO[] = [];
  searchingUser:boolean = false;
  searchedUsers:userDTO[] = [];


  constructor(
    private userService:UsersService,
    private modalService: BsModalService
    ) { }



  @ViewChild('searchInput', {static: true}) input:ElementRef;//Getting the refrence of the search input in the HTML
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

  ngAfterViewInit(){
    fromEvent<userDTO>(this.input.nativeElement, 'keyup')//Method for filter
    .pipe(
      map(e => e['target'].value),
      debounceTime(200),
      distinctUntilChanged(),
      map((search) => {return this.searchUser(search)})
    )
    .subscribe(
      res => {
        if(res.length <= 0){
          this.searchingUser = false;
        }else{
          this.searchingUser = true;
          this.searchedUsers = res;
        }
      })
  }


  searchUser(value:string){
    return this.usersData.filter(el => el.firstName === value);
}

deleteFromSearch(index, userType, firstName){//Delete User from Search Table
  this.searchedUsers.splice(index, 1);
  userType === 1 ? this.deleteUser(this.findIndex(this.userRole, firstName))
  : userType === 2 ? this.deleteSeniorUser(this.findIndex(this.seniorUsers, firstName))
  : userType === 3 ? this.deleteWFMUser(this.findIndex(this.wfmUsers, firstName))
  :null;
}

findIndex(arr:userDTO[], value){ // Finding the Index of the user
  return arr.findIndex((el) => {el.firstName === value});
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



  addUserForm = new FormGroup({ // Form for adding user
    role:new FormControl('', [Validators.required]),
    firstName:new FormControl('', [Validators.required]),
    lastName:new FormControl('', [Validators.required])
  });


  convertStringToNumber(value){//converting the role property from string to number
    return parseInt(value)
  }



  addUser(){  // Adding Users according to the Role
    let data:userDTO = this.addUserForm.value;
    data.role = this.convertStringToNumber(data.role)
    if(data.role === 1){
      this.checkExistingUser(this.userRole, data.firstName) ? alert('User is already registered'): this.userRole.push(data) && this.usersData.push(data);

    };

    if(data.role === 2){
      this.checkExistingUser(this.seniorUsers, data.firstName) ? alert('User is already registered'): this.seniorUsers.push(data) && this.usersData.push(data);
    };

    if(data.role === 3){
      this.checkExistingUser(this.wfmUsers, data.firstName) ? alert('User is already registered'): this.wfmUsers.push(data) && this.usersData.push(data);
    };

    this.addUserForm.reset();
  }

  checkExistingUser(arr:userDTO[], firstName:string){ // Checking for eny Existing User
    return arr.find(el => el.firstName === firstName)
  }






}
