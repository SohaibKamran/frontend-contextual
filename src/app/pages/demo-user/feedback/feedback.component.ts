import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router) { }

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      feedback: ['', Validators.required]
    });
  }

  submit() {
    if (this.feedbackForm.valid) {
      this.submitted = true;
      const body = {
        userId: localStorage.getItem('userId'),
        feedback: this.feedbackForm.get('feedback').value
      };
      this.apiService.sendRequest(requests.sendFeedback, 'post', body).subscribe((res: any) => {});
    }
    this.router.navigate(['/user/player']);
  }
}
