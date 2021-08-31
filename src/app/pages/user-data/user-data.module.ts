import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDataRoutingModule } from './user-data-routing.module';
import { UserDataComponent } from './user-data.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserDataComponent
  ],
  imports: [
    CommonModule,
    UserDataRoutingModule,
    NgbModule,
    ModalModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class UserDataModule { }
