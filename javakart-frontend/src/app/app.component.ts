import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">JavaKart</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/">Home</a>
          <a class="nav-link" routerLink="/login">Login</a>
          <a class="nav-link" routerLink="/register">Register</a>
        </div>
      </div>
    </nav>
    
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'javakart-frontend';
}