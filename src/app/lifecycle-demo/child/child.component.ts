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

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class LifecycleChildComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit,
  AfterViewChecked, OnDestroy {
  @Input() inputValue = '';
  logs: string[] = [];
  childValue = '';
  counter = 0;
  intervalId?: ReturnType<typeof setInterval>;

  log(message: string, data?: any) {
    this.logs.push(data ? `${message} ${JSON.stringify(data)}` : message);
    data !== undefined ? console.log(message, data) : console.log(message);
  }

  startTimer() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.counter++;
        this.log(`Child timer tick ${this.counter}`);
      }, 1000);
    }
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.log('Child timer stopped');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.log('LifecycleChildComponent ngOnChanges', changes);
  }

  ngOnInit(): void {
    this.log('LifecycleChildComponent ngOnInit');
  }

  ngDoCheck(): void {
    this.log('LifecycleChildComponent ngDoCheck', this.inputValue);
  }

  ngAfterContentInit(): void {
    this.log('LifecycleChildComponent ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    this.log('LifecycleChildComponent ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    this.log('LifecycleChildComponent ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    this.log('LifecycleChildComponent ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    this.log('LifecycleChildComponent ngOnDestroy');
    this.stopTimer();
  }
}
