import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="text-center">
      <h1>Welcome to JavaKart! 🛒</h1>
      <p class="lead">Your one-stop online shopping destination</p>
      
      <div class="mt-4">
        <a routerLink="/login" class="btn btn-primary btn-lg me-2">Login</a>
        <a routerLink="/register" class="btn btn-success btn-lg">Register</a>
      </div>
      
      <div class="row mt-5">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>🛒 Shop</h5>
              <p>Browse thousands of products</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>💰 Save</h5>
              <p>Best prices guaranteed</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>🚚 Fast Delivery</h5>
              <p>Quick shipping to your door</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}