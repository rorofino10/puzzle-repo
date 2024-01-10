import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  RendererFactory2,
  inject,
} from '@angular/core';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

export type ColorThemes = 'blue' | 'red' | 'violet' | 'gray' | 'orange';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  private _platformId = inject(PLATFORM_ID);
  // A.2 we use Angular's renderer to add/remove the dark class from the html element
  private _renderer = inject(RendererFactory2).createRenderer(null, null);
  // A.3 we use Angular's DOCUMENT injection token to avoid directly accessing the document object
  private _document = inject(DOCUMENT);

  // B. Initializing our in memory theme store
  // B.1 we want to give every subscriber the current value of our theme
  // even if they subscribe after the first value was emitted
  private _lightingTheme$ = new ReplaySubject<'light' | 'dark'>(1);
  // B.2 we expose the current theme so our app can access it and e.g. show
  // a different icon for the button to toggle it
  public lightingTheme$ = this._lightingTheme$.asObservable();
  // B.3 this emits when the service is destroyed and used to clean up subscriptions
  private _colorTheme$ = new ReplaySubject<ColorThemes>(1);
  // B.2 we expose the current theme so our app can access it and e.g. show
  // a different icon for the button to toggle it
  public colorTheme$ = this._colorTheme$.asObservable();

  private _destroyed$ = new Subject<void>();

  // C. Sync and listen to theme changes on service creation
  constructor() {
    // we check the current value in the localStorage to see what theme was set
    // by the code in the index.html file and load that into our _theme$ replaysubject
    this.syncThemeFromLocalStorage();
    // we also immediately subscribe to our theme$ variable and add/remove
    // the dark class from the html element
    this.toggleClassOnThemeChanges();
    this.changeColorOnThemeChanges();
  }

  // C.1 sync with the theme set in the localStorage by our index.html script tag
  private syncThemeFromLocalStorage(): void {
    // if we are in the browser we know we have access to localstorage
    if (isPlatformBrowser(this._platformId)) {
      // we load the appropriate value from the localStorage into our _theme$ replaysubject
      this._lightingTheme$.next(
        localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
      );
    }
  }
  // C.2 Subscribe to theme changes until the service is destroyed
  // and add/remove class from html element
  private toggleClassOnThemeChanges(): void {
    // until our service is destroyed we subscribe to all changes in the theme$ variable
    this.lightingTheme$.pipe(takeUntil(this._destroyed$)).subscribe((theme) => {
      // if it is dark we add the dark class to the html element
      if (theme === 'dark') {
        this._renderer.addClass(this._document.documentElement, 'dark');
      } else {
        // else if is added already, we remove it
        if (this._document.documentElement.className.includes('dark')) {
          this._renderer.removeClass(this._document.documentElement, 'dark');
        }
      }
    });
  }

  private changeColorOnThemeChanges(): void {
    this.colorTheme$.pipe(takeUntil(this._destroyed$)).subscribe((theme) => {
      // if it is dark we add the dark class to the html element
      const element = this._document.body;

      // Get all classes as an array
      const classesToRemove = element.className.split(' ');
      // Loop through the classes and remove them
      classesToRemove.forEach((className) => {
        if (!className) return;
        this._renderer.removeClass(element, className);
      });
      this._renderer.addClass(element, `theme-${theme}`);
    });
  }

  public setColorTheme(theme: ColorThemes) {
    this._colorTheme$.next(theme);
  }

  // D. Expose a public function that allows us to change the theme from anywhere in our application
  public toggleDarkMode(): void {
    const newTheme =
      localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    this._lightingTheme$.next(newTheme);
  }

  // E. Clean up our subscriptions when the service gets destroyed
  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
