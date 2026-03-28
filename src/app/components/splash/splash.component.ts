import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, Observable, shareReplay, startWith, Subject, takeUntil } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { AppService } from '../../services/app.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { bitcoinAddressValidator } from '../../validators/bitcoin-address.validator';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {

  public address: FormControl;

  public chartData$: Observable<any>;
  public blockData$: Observable<any>;
  public userAgents$: Observable<any>;
  public highScores$: Observable<any>;
  public uptime$: Observable<string>;

  public homeStats$: Observable<any>;

  public chartOptions: any;

  public stratumURL = '';
  public poolHashrate: string = '';
  public currentTheme: 'gold' | 'white' = 'gold';
  public particlesEnabled = true;

  private info$: Observable<any>;
  private networkInfo: any;

  private readonly destroy$ = new Subject<void>();
  private readonly themeRefresh$ = new Subject<void>();
  private readonly themeStorageKey = 'public-pool-theme';

  private readonly themeChangedHandler = () => {
    this.currentTheme = this.getSavedTheme();
    this.buildChartOptions();
    this.themeRefresh$.next();
  };

  constructor(
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService
  ) {

    this.info$ = this.appService.getInfo().pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    if (environment.STRATUM_URL.length > 1) {
      this.stratumURL = environment.STRATUM_URL;
    } else {
      this.stratumURL = window.location.hostname + ':3333';
    }

    this.blockData$ = this.info$.pipe(map(info => info.blockData));
    this.userAgents$ = this.info$.pipe(map(info => info.userAgents));
    this.highScores$ = this.info$.pipe(map(info => info.highScores));
    this.uptime$ = this.info$.pipe(map(info => info.uptime));

    this.info$
      .pipe(takeUntil(this.destroy$))
      .subscribe(info => {
        const userAgents = info?.userAgents || [];
        const totalHashRate = userAgents.reduce((sum: number, ua: any) => {
          return sum + (Number(ua.totalHashRate) || 0);
        }, 0);

        this.poolHashrate = HashSuffixPipe.transform(totalHashRate);
        this.cdr.detectChanges();
      });

    this.homeStats$ = combineLatest([
      this.info$,
      this.appService.getNetworkInfo()
    ]).pipe(
      map(([info, networkInfo]) => {

        const bestDifficulty = Math.max(
          ...(info.highScores || []).map((s: any) => Number(s.bestDifficulty || 0))
        );

        const networkDifficulty = networkInfo?.difficulty || 0;

        const networkHashRate =
          networkInfo?.networkhashps ||
          networkInfo?.hashrate ||
          0;

        const blockHeight =
          networkInfo?.blocks ||
          networkInfo?.height ||
          0;

        const weight =
          info?.weight ||
          networkInfo?.weight ||
          null;

        return {
          bestDifficulty,
          bestDifficultyExact: bestDifficulty?.toLocaleString(),

          networkDifficulty,
          networkDifficultyExact: networkDifficulty?.toLocaleString(),

          networkHashRate,
          networkHashRateExact: networkHashRate?.toLocaleString(),

          blockHeight,

          weight,
          weightExact: weight ? weight.toLocaleString() : null
        };

      })
    );

    this.chartData$ = combineLatest([
      this.appService.getInfoChart(),
      this.appService.getNetworkInfo(),
      this.themeRefresh$.pipe(startWith(null))
    ]).pipe(
      map(([chartData, networkInfo]) => {
        this.networkInfo = networkInfo;

        const theme = this.getSavedTheme();
        const documentStyle = getComputedStyle(document.documentElement);

        return {
          labels: chartData.map((d: any) => d.label),
          datasets: [
            {
              label: 'Quantum Sniper Pool Hashrate',
              data: chartData.map((d: any) => d.data),
              fill: false,
              backgroundColor: theme === 'white' ? '#111111' : documentStyle.getPropertyValue('--primary-color'),
              borderColor: theme === 'white' ? '#111111' : '#118385',
              tension: 0.4,
              pointRadius: 2,
              borderWidth: 1
            }
          ]
        };
      })
    );

    this.address = new FormControl(null, bitcoinAddressValidator());

    this.buildChartOptions();
  }

  ngOnInit(): void {
    this.currentTheme = this.getSavedTheme();
    this.applyTheme(this.currentTheme);
    window.addEventListener('themeChanged', this.themeChangedHandler);

    this.localStorageService.particles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((enabled) => {
        this.particlesEnabled = enabled;
      });
  }

  ngOnDestroy(): void {
    window.removeEventListener('themeChanged', this.themeChangedHandler);
    this.destroy$.next();
    this.destroy$.complete();
  }

  public setTheme(theme: 'gold' | 'white'): void {
    this.currentTheme = theme;
    localStorage.setItem(this.themeStorageKey, theme);
    this.applyTheme(theme);
  }

  public setParticles(enabled: boolean): void {
    this.localStorageService.setParticles(enabled);
  }

  public applyTheme(theme: 'gold' | 'white'): void {
    document.body.classList.remove('theme-gold', 'theme-white');
    document.body.classList.add(theme === 'white' ? 'theme-white' : 'theme-gold');

    this.buildChartOptions();
    this.themeRefresh$.next();

    window.dispatchEvent(new CustomEvent('themeChanged'));
  }

  private getSavedTheme(): 'gold' | 'white' {
    const savedTheme = localStorage.getItem(this.themeStorageKey);
    return savedTheme === 'white' ? 'white' : 'gold';
  }

  private buildChartOptions(): void {
    const theme = this.getSavedTheme();

    if (theme === 'white') {
      this.chartOptions = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#111111'
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            ticks: {
              color: '#111111'
            },
            grid: {
              color: '#d8d8d8',
              drawBorder: false,
              display: true
            }
          },
          y: {
            ticks: {
              color: '#111111',
              callback: (value: number) => {
                return HashSuffixPipe.transform(value) + ' - ' + AverageTimeToBlockPipe.transform(value, this.networkInfo?.difficulty);
              }
            },
            grid: {
              color: '#d8d8d8',
              drawBorder: false
            },
            type: 'logarithmic',
          }
        }
      };

      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            display: true
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return HashSuffixPipe.transform(value) + ' - ' + AverageTimeToBlockPipe.transform(value, this.networkInfo?.difficulty);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          type: 'logarithmic',
        }
      }
    };
  }
}
