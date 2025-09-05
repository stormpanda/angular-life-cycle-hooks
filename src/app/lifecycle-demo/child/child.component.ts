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

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  templateUrl: './child.component.html',
  styleUrl: './child.component.scss'
})
export class LifecycleChildComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() inputValue = '';

  ngOnChanges(changes: SimpleChanges): void {
    console.log('LifecycleChildComponent ngOnChanges', changes);
  }

  ngOnInit(): void {
    console.log('LifecycleChildComponent ngOnInit');
  }

  ngDoCheck(): void {
    console.log('LifecycleChildComponent ngDoCheck', this.inputValue);
  }

  ngAfterContentInit(): void {
    console.log('LifecycleChildComponent ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('LifecycleChildComponent ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('LifecycleChildComponent ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('LifecycleChildComponent ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    console.log('LifecycleChildComponent ngOnDestroy');
  }
}
