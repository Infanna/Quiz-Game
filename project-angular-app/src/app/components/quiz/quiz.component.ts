import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommentService } from 'src/app/service/comment.service';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { ProfilemodalService } from 'src/app/service/profilemodal.service';
import { QuestionsService } from 'src/app/service/questions.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  imgSrc: string = 'https://cdn.discordapp.com/attachments/1026870373700083732/1029786860471464026/Group_26.png'

  searchText: string = "";
  quiz: any;
  comment: any;
  mycomment: string = ""
  alert_comment: boolean = false
  sum: number = 0;
  count!: string;
  user: any = {username : 'fewgg'}

  productForm = new FormGroup({
    owner: new FormControl(''),
    comment: new FormControl('', [Validators.required]),
  });

  get text() { return this.productForm.get('comment') }

  constructor(
    private dataService: DataService,
    private commentService: CommentService,
    private router: Router,
    private profile: ProfilemodalService,
    private questions : QuestionsService,
    
  ) {
    this.onLoading();
  }

  ngOnInit(): void {
    this.user = this.profile.getUser()
  }

  onLoading() {
    try {
      this.dataService.getAllQuiz().subscribe(
        data => {
          this.quiz = data.reverse();
          this.sum = 0;
          for (const i in data) {
            this.sum += data[i].count;
            if (this.sum >= 1000000) {
              this.count = String((this.sum / 1000000).toFixed(1)) + " M"
            } else if (this.sum >= 1000) {
              this.count = String((this.sum / 1000).toFixed(1)) + " k"
            } else {
              this.count = String(this.sum);
            }
          }
        },
        err => {
            console.log(err);
        }
      );
      this.commentService.getAllcomment().subscribe(
        data => {
          this.comment = data.reverse();
          console.log(this.comment)
        },
        err => {
          console.log(err);
        }
      );

    } catch (err) {
      console.log(err);
    }
  }

  addComment() {
    if (this.comment?.errors?.['required'] || this.productForm.value.comment == "") {
      this.alert_comment = true
    } else {
      this.commentService.addComment(
        {
        owner: this.user.username,
        comment: this.productForm.value.comment,
        }
      ).subscribe(
        data => {
          alert('Comment added successfully');
          this.productForm.reset();
          this.onLoading();
          this.alert_comment = false
        },
        err => {
          console.log(err);
        }
      );

    }
  }

  ShowTypeDisplay() {
    return (this.searchText).length > 0 ? "Searching . . ." : "Quiz"
  }

  editQuiz(index: any) {
    this.dataService.editQuiz(
      this.quiz[index]._id,
      {
        count: this.quiz[index].count + 1
      }
    ).subscribe(
      data => {
        this.questions.setQuestion(this.quiz[index])
        this.router.navigate(['/question']);
        console.log(data.count)
      },
      err => {
        console.log(err);
      }
    );
  }
}
