import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly particlesStorageKey = 'particles-enabled';

  private readonly particlesSubject = new BehaviorSubject<boolean>(this.getInitialParticlesValue());
  public particles$ = this.particlesSubject.asObservable();

  constructor() {}

  public setParticles(enabled: boolean): void {
    localStorage.setItem(this.particlesStorageKey, JSON.stringify(enabled));
    this.particlesSubject.next(enabled);
  }

  public getParticles(): boolean {
    return this.particlesSubject.value;
  }

  private getInitialParticlesValue(): boolean {
    const saved = localStorage.getItem(this.particlesStorageKey);

    if (saved === null) {
      return true;
    }

    return saved === 'true';
  }
}
