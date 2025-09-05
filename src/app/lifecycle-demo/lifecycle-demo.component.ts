import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-lifecycle-demo',
  standalone: true,
  templateUrl: './lifecycle-demo.component.html',
  styleUrl: './lifecycle-demo.component.scss'
})
export class LifecycleDemoComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('LifecycleDemoComponent ngOnChanges', changes);
  }

  ngOnInit(): void {
    console.log('LifecycleDemoComponent ngOnInit');
  }

  ngDoCheck(): void {
    console.log('LifecycleDemoComponent ngDoCheck');
  }

  ngAfterContentInit(): void {
    console.log('LifecycleDemoComponent ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('LifecycleDemoComponent ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('LifecycleDemoComponent ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('LifecycleDemoComponent ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    console.log('LifecycleDemoComponent ngOnDestroy');
  }
}

