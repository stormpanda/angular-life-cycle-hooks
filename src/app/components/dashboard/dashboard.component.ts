import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  hooks = [
    {
      name: 'ngOnChanges',
      route: '/ngonchanges',
      description: 'Called when @Input() properties change',
      frequency: 'When input changes',
      color: '#ff6b6b',
    },
    {
      name: 'ngOnInit',
      route: '/nginit',
      description: 'Component initialization after first ngOnChanges',
      frequency: 'Once per instance',
      color: '#4ecdc4',
    },
    {
      name: 'ngDoCheck',
      route: '/ngdocheck',
      description: 'Custom change detection implementation',
      frequency: 'Every change detection cycle',
      color: '#45b7d1',
    },
    {
      name: 'ngAfterContentInit',
      route: '/ngaftercontentinit',
      description: 'After content projection initialization',
      frequency: 'Once per instance',
      color: '#96ceb4',
    },
    {
      name: 'ngAfterContentChecked',
      route: '/ngaftercontentchecked',
      description: 'After every projected content check',
      frequency: 'Every change detection cycle',
      color: '#feca57',
    },
    {
      name: 'ngAfterViewInit',
      route: '/ngafterviewinit',
      description: 'After view and child views initialization',
      frequency: 'Once per instance',
      color: '#ff9ff3',
    },
    {
      name: 'ngAfterViewChecked',
      route: '/ngafterviewchecked',
      description: 'After every view check',
      frequency: 'Every change detection cycle',
      color: '#a8e6cf',
    },
    {
      name: 'ngOnDestroy',
      route: '/ngondestroy',
      description: 'Cleanup before component destruction',
      frequency: 'Once before destruction',
      color: '#ff8b94',
    },
  ];

  executionOrder = [
    'ngOnChanges',
    'ngOnInit',
    'ngDoCheck',
    'ngAfterContentInit',
    'ngAfterContentChecked',
    'ngAfterViewInit',
    'ngAfterViewChecked',
    'ngOnDestroy',
  ];
}
