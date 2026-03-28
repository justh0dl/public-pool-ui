import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { combineLatest, map, Observable, shareReplay, startWith, Subject } from 'rxjs';

import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { AppService } from '../../services/app.service';
import { ClientService } from '../../services/client.service';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  public address: string;

  public clientInfo$: Observable<any>;
  public chartData$: Observable<any>;

  public chartOptions: any;

  public networkInfo$: Observable<any>;
  private networkInfo: any;

  @ViewChild('dataTable') dataTable!: Table;

  public expandedRows$: Observable<any>;

  private readonly themeRefresh$ = new Subject<void>();

  private readonly dashboardThemeChangedHandler = () => {
    this.buildChartOptions();
    this.themeRefresh$.next();
  };

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private appService: AppService
  ) {

    this.networkInfo$ = this.appService.getNetworkInfo().pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.address = this.route.snapshot.params['address'];
    this.clientInfo$ = this.clientService.getClientInfo(this.address).pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.expandedRows$ = this.clientInfo$.pipe(map((info: any) => {
      return info.workers.reduce((pre: any, cur: any) => { pre[cur.name] = true; return pre; }, {});
    }));

    this.chartData$ = combineLatest([
      this.clientService.getClientInfoChart(this.address),
      this.networkInfo$,
      this.themeRefresh$.pipe(startWith(undefined))
    ]).pipe(
      map(([chartData, networkInfo]) => {

        this.networkInfo = networkInfo;
        const theme = this.getSavedTheme();
        const documentStyle = getComputedStyle(document.documentElement);
        const GROUP_SIZE = 12;

        let hourlyData = [];

        for (let i = GROUP_SIZE; i < chartData.length; i += GROUP_SIZE) {
          let sum = 0;
          for (let j = GROUP_SIZE - 1; j >= 0; j--) {
            sum += parseInt(chartData[i - j].data);
          }
          sum = sum / GROUP_SIZE;
          hourlyData.push({ y: sum, x: chartData[i].label });
        }

        const data = chartData.map((d: any) => { return { y: d.data, x: d.label } });

        return {
          labels: chartData.map((d: any) => d.label),
          datasets: [
            {
              type: 'line',
              label: '2 Hour',
              data: hourlyData,
              fill: false,
              backgroundColor: theme === 'white' ? '#666666' : documentStyle.getPropertyValue('--yellow-600'),
              borderColor: theme === 'white' ? '#666666' : documentStyle.getPropertyValue('--yellow-600'),
              tension: .4,
              pointRadius: 1,
              borderWidth: 1
            },
            {
              type: 'line',
              label: '10 Minute',
              data: data,
              fill: false,
              backgroundColor: theme === 'white' ? '#111111' : documentStyle.getPropertyValue('--primary-color'),
              borderColor: theme === 'white' ? '#111111' : '#118385',
              tension: .4,
              pointRadius: 1,
              borderWidth: 1
            },
          ]
        };
      })
    );

    this.buildChartOptions();
  }

  ngOnInit(): void {
    window.addEventListener('themeChanged', this.dashboardThemeChangedHandler);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    window.removeEventListener('themeChanged', this.dashboardThemeChangedHandler);
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
              unit: 'hour',
            },
            ticks: {
              color: '#555555'
            },
            grid: {
              color: '#d8d8d8',
              drawBorder: false,
              display: true
            }
          },
          y: {
            ticks: {
              color: '#555555',
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
            unit: 'hour',
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
          }
        }
      }
    };
  }

  public getSessionCount(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    return workersByName.length;
  }

  public getTotalHashRate(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    const sum = workersByName.reduce((pre, cur) => {
      return pre += Math.floor(cur.hashRate);
    }, 0);
    return Math.floor(sum);
  }

  public getBestDifficulty(name: string, workers: any[]) {
    const workersByName = workers.filter(w => w.name == name);
    const best = workersByName.reduce((pre, cur) => {
      if (cur.bestDifficulty > pre) {
        return cur.bestDifficulty;
      }
      return pre;
    }, 0);

    return best;
  }

  public getTotalUptime(name: string, workers: any[]) {
    const now = new Date().getTime();
    const workersByName = workers.filter(w => w.name == name);
    const sum = workersByName.reduce((pre, cur) => {
      return pre += now - new Date(cur.startTime).getTime();
    }, 0);
    return new Date(now - sum);
  }
}
