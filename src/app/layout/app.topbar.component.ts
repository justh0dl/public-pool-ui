import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    // ✅ THEME STATE
    public currentTheme: 'gold' | 'white' = 'gold';

    constructor(public layoutService: LayoutService) { }

    ngOnInit(): void {
        this.currentTheme = this.getSavedTheme();

        // listen for theme changes (from splash toggle)
        window.addEventListener('themeChanged', () => {
            this.currentTheme = this.getSavedTheme();
        });
    }

    private getSavedTheme(): 'gold' | 'white' {
        const savedTheme = localStorage.getItem('public-pool-theme');
        return savedTheme === 'white' ? 'white' : 'gold';
    }
}
