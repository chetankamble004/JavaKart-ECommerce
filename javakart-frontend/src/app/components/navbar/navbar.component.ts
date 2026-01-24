import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
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
  `
})
export class NavbarComponent {}