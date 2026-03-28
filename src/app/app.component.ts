import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'public-pool-ui';

  public particles$: Observable<boolean>;
  public currentTheme: 'gold' | 'white' = 'gold';

  constructor(private localService: LocalStorageService) {
    this.particles$ = this.localService.particles$;
  }

  ngOnInit(): void {
    this.currentTheme = this.getSavedTheme();
    this.applyTheme(this.currentTheme);

    window.addEventListener('themeChanged', () => {
      this.currentTheme = this.getSavedTheme();
      this.applyTheme(this.currentTheme);
    });
  }

  private getSavedTheme(): 'gold' | 'white' {
    const savedTheme = localStorage.getItem('public-pool-theme');
    return savedTheme === 'white' ? 'white' : 'gold';
  }

  private applyTheme(theme: 'gold' | 'white'): void {
    document.body.classList.remove('theme-gold', 'theme-white');
    document.body.classList.add(theme === 'white' ? 'theme-white' : 'theme-gold');
  }
}
