import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Login to JavaKart</h4>
          </div>
          <div class="card-body">
            <form (ngSubmit)="onLogin()">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" class="form-control" [(ngModel)]="username" name="username" required>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
              </div>
              
              <button type="submit" class="btn btn-primary w-100">Login</button>
              
              <div class="mt-3 text-center">
                <p>Don't have an account? <a routerLink="/register">Register here</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  username = '';
  password = '';
  
  onLogin() {
    console.log('Login attempt:', this.username);
    // TODO: Connect to backend
  }
}