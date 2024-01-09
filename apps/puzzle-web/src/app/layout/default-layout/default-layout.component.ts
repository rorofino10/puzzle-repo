import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'puzzle-repo-default-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
})
export class DefaultLayoutComponent {}
