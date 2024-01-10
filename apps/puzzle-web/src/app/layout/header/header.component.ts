import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  ColorThemes,
  ThemingService,
} from '../../core/theming/theming.service';

@Component({
  selector: 'layout-header',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public themingService = inject(ThemingService);

  public toggleDarkMode() {
    this.themingService.toggleDarkMode();
  }

  public setColorTheme(theme: ColorThemes) {
    this.themingService.setColorTheme(theme);
  }
}
