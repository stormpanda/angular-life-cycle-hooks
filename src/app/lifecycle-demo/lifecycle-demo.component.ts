import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LifecycleChildComponent } from './child/child.component';

@Component({
  selector: 'app-lifecycle-demo',
  standalone: true,
  imports: [CommonModule, LifecycleChildComponent],
  templateUrl: './lifecycle-demo.component.html',
  styleUrl: './lifecycle-demo.component.scss'
})
export class LifecycleDemoComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit,
  AfterViewChecked, OnDestroy {
  @Input() inputValue = '';
  showChild = true;
  counter = 0;
  intervalId?: ReturnType<typeof setInterval>;
  log(message: string, data?: any) {
    data !== undefined ? console.log(message, data) : console.log(message);
  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.counter++;
        this.log(`Timer tick ${this.counter}`);
      }, 1000);
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.log('Timer stopped');
    }
  }

  toggleChild() {
    this.showChild = !this.showChild;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.log('LifecycleDemoComponent ngOnChanges', changes);
  }

  ngOnInit(): void {
    this.log('LifecycleDemoComponent ngOnInit');
  }

  ngDoCheck(): void {
    this.log('LifecycleDemoComponent ngDoCheck', this.inputValue);
  }

  ngAfterContentInit(): void {
    this.log('LifecycleDemoComponent ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    this.log('LifecycleDemoComponent ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    this.log('LifecycleDemoComponent ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    this.log('LifecycleDemoComponent ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    this.log('LifecycleDemoComponent ngOnDestroy');
    this.stopTimer();
  }
}
