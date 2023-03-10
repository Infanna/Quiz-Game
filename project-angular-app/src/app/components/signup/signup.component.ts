import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { json } from 'body-parser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  profileForm = new FormGroup({
    picture: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    sex: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    birthyear: new FormControl('', [Validators.required, Validators.pattern('[0-9]{4}'), Validators.max(2022), Validators.min(1900)]),
    phonenumber: new FormControl('', [Validators.required, Validators.pattern('[0][0-9]{9}')]),
    username: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),

  });

  get email() { return this.profileForm.get('email'); }
  get phonenumber() { return this.profileForm.get('phonenumber'); }
  get password() { return this.profileForm.get('password'); }
  get confirmpass() { return this.profileForm.get('confirmpass'); }

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  previewLoaded: boolean = false;

  onChangeImg(e: any) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewLoaded = true;
        this.profileForm.patchValue({
          picture: reader.result?.toString() || ""
        })
      }
    }
  }

  resetForm() {
    this.profileForm.reset();
    this.previewLoaded = false;
  }

  onClickSubmit() {
    if (!this.profileForm.invalid) {
      //unknown -> any
      const signupjson: JSON = <JSON><any>{
        picture: this.profileForm.value.picture || '',
        title: this.profileForm.value.title || '',
        name: this.profileForm.value.firstName + ' ' + this.profileForm.value.lastName || '',
        sex: this.profileForm.value.sex || '',
        birthyear: parseInt(this.profileForm.value.birthyear || ''),
        phonenumber: this.profileForm.value.phonenumber || '',
        username: this.profileForm.value.username || '',
        email: this.profileForm.value.email || '',
        password: this.profileForm.value.password || ''
      }

      this.http.post('http://localhost:3000/user/signup', signupjson
      )
        .subscribe({
          next: (data) => {
            if ((<any>Object).values(data)[0] != false) {
              console.log((<any>Object).values(data)[0])
              console.log((<any>Object).values(data)[1])

              alert("sign up success!")
              this.router.navigate(['./signin']);

            } else {
              alert("cannot sign up")

            }
          },
          error: (error) => {
            Swal.fire({
              title: error.error.error,
              icon: 'warning',
            })
          }
        })

    } else {
      alert("check your infos and try again!")
    }

  }

  pathhome() {
    this.router.navigate(['/home']);
  }


}
