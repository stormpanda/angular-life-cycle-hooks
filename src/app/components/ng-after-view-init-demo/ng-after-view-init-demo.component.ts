import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-ng-after-view-init-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngAfterViewInit Demo</h1>
        <p>Demonstrates DOM access and third-party library initialization</p>
        <button class="reset-btn" (click)="resetDemo()">Reset Demo</button>
      </div>

      <div class="demo-content">
        <div class="canvas-section">
          <h3>Canvas Drawing (Initialized in ngAfterViewInit)</h3>
          <canvas #drawingCanvas width="400" height="200"></canvas>
          <div class="canvas-controls">
            <button (click)="drawCircle()" [disabled]="!canvasReady">
              Draw Circle
            </button>
            <button (click)="drawSquare()" [disabled]="!canvasReady">
              Draw Square
            </button>
            <button (click)="clearCanvas()" [disabled]="!canvasReady">
              Clear Canvas
            </button>
          </div>
        </div>

        <div class="chart-section">
          <h3>Chart Container (Third-party library simulation)</h3>
          <div #chartContainer class="chart-container">
            <div class="chart-placeholder" *ngIf="!chartInitialized">
              Waiting for ngAfterViewInit to initialize chart...
            </div>
            <div class="chart-content" *ngIf="chartInitialized">
              <div
                class="chart-bar"
                *ngFor="let item of chartData"
                [style.height.px]="item.value * 3"
              >
                <span class="bar-label">{{ item.label }}</span>
                <span class="bar-value">{{ item.value }}</span>
              </div>
            </div>
          </div>
          <button (click)="updateChartData()" [disabled]="!chartInitialized">
            Update Chart Data
          </button>
        </div>

        <div class="input-focus-section">
          <h3>Auto-Focus Input (Focus set in ngAfterViewInit)</h3>
          <input
            #autoFocusInput
            type="text"
            [(ngModel)]="inputValue"
            placeholder="This input gets auto-focused"
          />
          <p class="focus-status">
            Input focused: {{ inputFocused ? 'Yes' : 'No' }}
          </p>
        </div>

        <div class="measurements-section">
          <h3>Element Measurements (Calculated in ngAfterViewInit)</h3>
          <div #measuredElement class="measured-element">
            This element's dimensions are measured in ngAfterViewInit
          </div>
          <div class="measurements" *ngIf="measurements">
            <p><strong>Width:</strong> {{ measurements.width }}px</p>
            <p><strong>Height:</strong> {{ measurements.height }}px</p>
            <p><strong>Offset Top:</strong> {{ measurements.offsetTop }}px</p>
            <p><strong>Offset Left:</strong> {{ measurements.offsetLeft }}px</p>
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>Lifecycle Logs</h3>
        <div class="logs-container">
          <div
            class="log-entry"
            *ngFor="let log of logger.logs; trackBy: trackByTimestamp"
          >
            <div class="log-header">
              <span class="component-name">{{ log.component }}</span>
              <span class="timestamp">{{
                log.timestamp | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
            <div class="log-data" *ngIf="log.data">
              <pre>{{ log.data | json }}</pre>
            </div>
          </div>
          <div class="no-logs" *ngIf="logger.logs.length === 0">
            No logs yet. Component lifecycle will start logging.
          </div>
        </div>
      </div>

      <div class="explanation">
        <h3>Key Points About ngAfterViewInit</h3>
        <ul>
          <li>
            <strong>When it runs:</strong> After Angular initializes component
            views and child views
          </li>
          <li>
            <strong>DOM Access:</strong> Safe to access ViewChild elements and
            manipulate DOM
          </li>
          <li>
            <strong>Third-party libraries:</strong> Perfect time to initialize
            libraries that need DOM elements
          </li>
          <li>
            <strong>ViewChild availability:</strong> All @ViewChild and
            @ViewChildren queries are resolved
          </li>
          <li>
            <strong>One-time execution:</strong> Runs only once per component
            instance
          </li>
          <li>
            <strong>Common use cases:</strong> Canvas setup, chart
            initialization, focus management, DOM measurements
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrl: './ng-after-view-init-demo.component.scss',
  providers: [LoggerService],
})
export class NgAfterViewInitDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawingCanvas') drawingCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('autoFocusInput') autoFocusInput!: ElementRef<HTMLInputElement>;
  @ViewChild('measuredElement') measuredElement!: ElementRef<HTMLDivElement>;

  canvasReady = false;
  chartInitialized = false;
  inputFocused = false;
  inputValue = '';
  measurements: any = null;

  chartData = [
    { label: 'A', value: 45 },
    { label: 'B', value: 67 },
    { label: 'C', value: 23 },
    { label: 'D', value: 89 },
    { label: 'E', value: 56 },
  ];

  private canvas?: CanvasRenderingContext2D | null;

  constructor(public logger: LoggerService) {
    this.logger.log(
      'NgAfterViewInitDemoComponent',
      'Constructor called - ViewChild elements not available yet'
    );
  }

  ngAfterViewInit(): void {
    this.logger.log(
      'NgAfterViewInitDemoComponent',
      'ngAfterViewInit called - Now safe to access ViewChild elements'
    );

    this.initializeCanvas();
    this.initializeChart();
    this.focusInput();
    this.measureElement();
  }

  ngOnDestroy(): void {
    this.logger.log('NgAfterViewInitDemoComponent', 'ngOnDestroy called');
  }

  private initializeCanvas(): void {
    if (this.drawingCanvas) {
      this.canvas = this.drawingCanvas.nativeElement.getContext('2d');
      if (this.canvas) {
        // Set up canvas
        this.canvas.fillStyle = '#f0f0f0';
        this.canvas.fillRect(0, 0, 400, 200);
        this.canvas.strokeStyle = '#333';
        this.canvas.lineWidth = 2;

        this.canvasReady = true;
        this.logger.log(
          'NgAfterViewInitDemoComponent',
          'Canvas initialized and ready for drawing'
        );
      }
    }
  }

  private initializeChart(): void {
    if (this.chartContainer) {
      // Simulate third-party chart library initialization
      setTimeout(() => {
        this.chartInitialized = true;
        this.logger.log(
          'NgAfterViewInitDemoComponent',
          'Chart library initialized (simulated)'
        );
      }, 1000);
    }
  }

  private focusInput(): void {
    if (this.autoFocusInput) {
      this.autoFocusInput.nativeElement.focus();
      this.inputFocused =
        document.activeElement === this.autoFocusInput.nativeElement;
      this.logger.log(
        'NgAfterViewInitDemoComponent',
        `Input auto-focused: ${this.inputFocused}`
      );
    }
  }

  private measureElement(): void {
    if (this.measuredElement) {
      const element = this.measuredElement.nativeElement;
      this.measurements = {
        width: element.offsetWidth,
        height: element.offsetHeight,
        offsetTop: element.offsetTop,
        offsetLeft: element.offsetLeft,
      };
      this.logger.log(
        'NgAfterViewInitDemoComponent',
        'Element measurements calculated',
        this.measurements
      );
    }
  }

  drawCircle(): void {
    if (this.canvas) {
      const x = Math.random() * 350 + 25;
      const y = Math.random() * 150 + 25;
      const radius = Math.random() * 20 + 10;

      this.canvas.beginPath();
      this.canvas.arc(x, y, radius, 0, 2 * Math.PI);
      this.canvas.strokeStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      this.canvas.stroke();

      this.logger.log(
        'NgAfterViewInitDemoComponent',
        `Circle drawn at (${x.toFixed(0)}, ${y.toFixed(
          0
        )}) with radius ${radius.toFixed(0)}`
      );
    }
  }

  drawSquare(): void {
    if (this.canvas) {
      const x = Math.random() * 350 + 25;
      const y = Math.random() * 150 + 25;
      const size = Math.random() * 30 + 20;

      this.canvas.strokeStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      this.canvas.strokeRect(x - size / 2, y - size / 2, size, size);

      this.logger.log(
        'NgAfterViewInitDemoComponent',
        `Square drawn at (${x.toFixed(0)}, ${y.toFixed(
          0
        )}) with size ${size.toFixed(0)}`
      );
    }
  }

  clearCanvas(): void {
    if (this.canvas) {
      this.canvas.fillStyle = '#f0f0f0';
      this.canvas.fillRect(0, 0, 400, 200);
      this.logger.log('NgAfterViewInitDemoComponent', 'Canvas cleared');
    }
  }

  updateChartData(): void {
    this.chartData = this.chartData.map((item) => ({
      ...item,
      value: Math.floor(Math.random() * 100) + 10,
    }));
    this.logger.log(
      'NgAfterViewInitDemoComponent',
      'Chart data updated',
      this.chartData
    );
  }

  resetDemo(): void {
    this.logger.clear();
    this.inputValue = '';
    this.clearCanvas();
    this.logger.log('NgAfterViewInitDemoComponent', 'Demo reset');
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
