import { Component, OnInit } from '@angular/core';
import { IParticlesProps } from 'ng-particles';
import { DeviceDetectorService } from 'ngx-device-detector';
import { loadFull } from 'tsparticles';
import { Container, Engine } from 'tsparticles-engine';

@Component({
  selector: 'app-background-particles-white',
  templateUrl: './background-particles-white.component.html',
  styleUrls: ['./background-particles-white.component.scss']
})
export class BackgroundParticlesWhiteComponent implements OnInit {
  public particleStyles!: any;
  public particleOptions!: IParticlesProps;

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.particleStyles = {
      position: 'fixed',
      width: '100%',
      height: '100%',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    const color: string = '#111111';
    const lineColor: string = '#444444';

    this.particleOptions = {
      fpsLimit: 30,
      detectRetina: true,
      background: {
        position: '50% 50%',
        repeat: 'no-repeat',
        size: 'cover'
      },
      fullScreen: {
        zIndex: 1
      },
      particles: {
        number: {
          value: this.deviceService.isMobile() ? 40 : 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: color
        },
        opacity: { value: 0.26 },
        links: {
          distance: 150,
          enable: true,
          color: {
            value: lineColor
          },
          opacity: 0.26
        },
        move: {
          enable: true,
          speed: 0.4
        },
        size: {
          random: true,
        }
      }
    };
  }

  particlesLoaded(container: Container): void {}

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
