import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish'

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Comment } from '../shared/comment';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

    @ViewChild('fform', {static: true}) commentFormDirective; // angualr-8
    //@ViewChild('fform') commentFormDirective; // angualr 6
    dishIds: string[];
    prev: string;
    next: string;
    dish: Dish;
    errMsg: string;
    comment: Comment;
    commentForm: FormGroup;
    
    constructor(
        private dishService: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private fb: FormBuilder,
        @Inject('BaseURL') BaseURL) {
            this.createForm();
    }


    formErrors = {
        'author': '',
        'comment': '',
        'rating': ''
      };
    
      validationMessages = {
        'author': {
          'required':      'Author Name is required.',
          'minlength':     'First Name must be at least 2 characters long.',
          'maxlength':     'FirstName cannot be more than 25 characters long.'
        },
        'comment': {
          'required':      'Last Name is required.',
          'minlength':     'Last Name must be at least 2 characters long.',
          'maxlength':     'Last Name cannot be more than 25 characters long.'
        },
      };
    
    ngOnInit() {
        this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
        .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    setPrevNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
      }
    
    goBack(): void {
        this.location.back();
    }

    createForm() {
        this.commentForm = this.fb.group({
          author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
          rating: [5],
          comment: ['', [Validators.required]],
        });
        this.commentForm.valueChanges
          .subscribe(data => this.onValueChanged(data));
    
          this.onValueChanged(); // (re)set validation messages now
      }
    
      onSubmit() {
        this.comment = this.commentForm.value;

        var tmpDate = new Date();
        this.comment.date = tmpDate.toISOString();

        this.dish.comments.push(this.comment);

        console.log(this.comment);
        this.commentForm.reset({
          author: '',
          rating: 5,
          comment: ''
        });
        this.commentFormDirective.resetForm();
      }
    
      onValueChanged(data?: any) {
        if (!this.commentForm) { return; }
        const form = this.commentForm;
        for (const field in this.formErrors) {
          if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] += messages[key] + ' ';
                }
              }
            }
          }
        }
      }
}
