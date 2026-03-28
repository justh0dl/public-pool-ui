import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, shareReplay, startWith, Subject } from 'rxjs';

import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { WorkerService } from '../../services/worker.service';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss']
})
export class WorkerComponent implements OnInit, OnDestroy {

  public workerInfo$: Observable<any>;
  public chartData$: Observable<any>;
  public chartOptions: any;

  public networkInfo$: Observable<any>;
  private networkInfo: any;

  private readonly themeRefresh$ = new Subject<void>();

  private readonly workerThemeChangedHandler = () => {
    this.buildChartOptions();
    this.themeRefresh$.next();
  };

  constructor(
    private workerService: WorkerService,
    private route: ActivatedRoute,
    private appService: AppService
  ) {

    this.workerInfo$ = this.workerService.getWorkerInfo(
      this.route.snapshot.params['address'],
      this.route.snapshot.params['workerName'],
      this.route.snapshot.params['workerId']
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.networkInfo$ = this.appService.getNetworkInfo().pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.chartData$ = combineLatest([
      this.workerInfo$,
      this.networkInfo$,
      this.themeRefresh$.pipe(startWith(undefined))
    ]).pipe(
      map(([workerInfo, networkInfo]) => {
        this.networkInfo = networkInfo;

        const theme = this.getSavedTheme();
        const documentStyle = getComputedStyle(document.documentElement);

        return {
          labels: workerInfo.chartData.map((d: any) => d.label),
          datasets: [
            {
              label: workerInfo.name,
              data: workerInfo.chartData.map((d: any) => d.data),
              fill: false,
              backgroundColor: theme === 'white'
                ? '#111111'
                : documentStyle.getPropertyValue('--primary-color'),
              borderColor: theme === 'white'
                ? '#111111'
                : documentStyle.getPropertyValue('--primary-color'),
              tension: 0.4,
              pointRadius: 1,
              borderWidth: 1
            }
          ]
        };
      })
    );

    this.buildChartOptions();
  }

  ngOnInit(): void {
    window.addEventListener('themeChanged', this.workerThemeChangedHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('themeChanged', this.workerThemeChangedHandler);
  }

  private getSavedTheme(): 'gold' | 'white' {
    const savedTheme = localStorage.getItem('public-pool-theme');
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
              unit: 'day'
            },
            ticks: {
              color: '#111111'
            },
            grid: {
              color: '#d8d8d8',
              drawBorder: false
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
            }
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
            unit: 'day'
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
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
          }
        }
      }
    };
  }
}
