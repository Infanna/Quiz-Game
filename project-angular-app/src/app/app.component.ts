import { Component, OnInit } from '@angular/core';
import { ProfilemodalService } from './service/profilemodal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-test';

  token!: string

  constructor(
  ) {}

  ngOnInit(): void {
  }

  //signin 68
  haveToken(){
    this.token = localStorage.getItem('token') || ''
  }
  
}
