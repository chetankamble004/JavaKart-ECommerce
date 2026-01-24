import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">Create New Account</h4>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onRegister()">
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" [(ngModel)]="fullName" name="fullName" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" [(ngModel)]="username" name="username" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" [(ngModel)]="email" name="email" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Mobile</label>
                <input type="text" class="form-control" [(ngModel)]="mobile" name="mobile">
              </div>
              
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
              </div>
              
              <button type="submit" class="btn btn-success w-100">Register</button>
              
              <div class="mt-3 text-center">
                <p>Already have an account? <a routerLink="/login">Login here</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  fullName = '';
  username = '';
  email = '';
  mobile = '';
  password = '';
  
  onRegister() {
    console.log('Registration:', {
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      mobile: this.mobile
    });
    // TODO: Connect to backend
  }
}