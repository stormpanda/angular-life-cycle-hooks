import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, delay, interval, of } from 'rxjs';
import { LoggerService } from '../../services/logger.service';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-ng-on-init-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ng-on-init-demo.component.html',
  styleUrl: './ng-on-init-demo.component.scss',
  providers: [LoggerService],
})
export class NgOnInitDemoComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  // Timer demonstration
  counter = 0;
  timerSubscription?: Subscription;

  // Form initialization
  userForm = {
    name: '',
    email: '',
    message: '',
  };

  // Configuration
  config = {
    apiDelay: 1500,
    timerInterval: 1000,
    maxPosts: 5,
  };

  constructor(private http: HttpClient, public logger: LoggerService) {
    this.logger.log(
      'NgOnInitDemoComponent',
      'Constructor called - Component instance created'
    );
    this.logger.log(
      'NgOnInitDemoComponent',
      'Constructor: Properties initialized but HTTP calls should wait for ngOnInit'
    );
  }

  ngOnInit(): void {
    this.logger.log(
      'NgOnInitDemoComponent',
      'ngOnInit called - Perfect time for initialization!'
    );

    // Initialize form with default values
    this.initializeForm();

    // Fetch initial data
    this.loadInitialData();

    // Start timer
    this.startTimer();

    // Simulate complex initialization
    this.performComplexInitialization();
  }

  ngOnDestroy(): void {
    this.logger.log(
      'NgOnInitDemoComponent',
      'ngOnDestroy called - Cleaning up resources'
    );

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.logger.log('NgOnInitDemoComponent', 'Timer subscription cleaned up');
    }
  }

  private initializeForm(): void {
    this.userForm = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      message: 'Hello from NgOnInit!',
    };
    this.logger.log(
      'NgOnInitDemoComponent',
      'Form initialized with default values',
      this.userForm
    );
  }

  private loadInitialData(): void {
    this.logger.log(
      'NgOnInitDemoComponent',
      'Starting to load initial data...'
    );
    this.isLoading = true;

    // Simulate API calls
    this.loadPosts();
    this.loadUsers();
  }

  private loadPosts(): void {
    this.logger.log('NgOnInitDemoComponent', 'Fetching posts...');

    // Simulate HTTP call with delay
    this.simulateHttpCall<Post[]>(
      [
        {
          id: 1,
          title: 'Getting Started with Angular',
          body: 'Angular is a powerful framework...',
          userId: 1,
        },
        {
          id: 2,
          title: 'Understanding Lifecycle Hooks',
          body: 'Lifecycle hooks provide visibility...',
          userId: 2,
        },
        {
          id: 3,
          title: 'Component Communication',
          body: 'Components can communicate through...',
          userId: 1,
        },
        {
          id: 4,
          title: 'RxJS and Observables',
          body: 'Reactive programming with RxJS...',
          userId: 3,
        },
        {
          id: 5,
          title: 'Angular Best Practices',
          body: 'Following best practices ensures...',
          userId: 2,
        },
      ].slice(0, this.config.maxPosts)
    ).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.logger.log(
          'NgOnInitDemoComponent',
          `Successfully loaded ${posts.length} posts`,
          posts
        );
        this.checkLoadingComplete();
      },
      error: (error) => {
        this.error = 'Failed to load posts';
        this.logger.log('NgOnInitDemoComponent', 'Error loading posts', error);
        this.checkLoadingComplete();
      },
    });
  }

  private loadUsers(): void {
    this.logger.log('NgOnInitDemoComponent', 'Fetching users...');

    // Simulate HTTP call with delay
    this.simulateHttpCall<User[]>([
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
      { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
    ]).subscribe({
      next: (users) => {
        this.users = users;
        this.logger.log(
          'NgOnInitDemoComponent',
          `Successfully loaded ${users.length} users`,
          users
        );
        this.checkLoadingComplete();
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.logger.log('NgOnInitDemoComponent', 'Error loading users', error);
        this.checkLoadingComplete();
      },
    });
  }

  private simulateHttpCall<T>(data: T): Observable<T> {
    return of(data).pipe(delay(this.config.apiDelay));
  }

  private checkLoadingComplete(): void {
    if (this.posts.length > 0 && this.users.length > 0) {
      this.isLoading = false;
      this.logger.log(
        'NgOnInitDemoComponent',
        'All initial data loaded successfully'
      );
    }
  }

  private startTimer(): void {
    this.logger.log('NgOnInitDemoComponent', 'Starting timer subscription...');

    this.timerSubscription = interval(this.config.timerInterval).subscribe(
      () => {
        this.counter++;
        this.logger.log('NgOnInitDemoComponent', `Timer tick: ${this.counter}`);
      }
    );
  }

  private performComplexInitialization(): void {
    this.logger.log(
      'NgOnInitDemoComponent',
      'Performing complex initialization...'
    );

    // Simulate complex calculations or setup
    setTimeout(() => {
      this.logger.log(
        'NgOnInitDemoComponent',
        'Complex initialization completed'
      );
    }, 500);
  }

  // User actions
  refreshData(): void {
    this.logger.log('NgOnInitDemoComponent', 'User requested data refresh');
    this.posts = [];
    this.users = [];
    this.error = null;
    this.loadInitialData();
  }

  resetForm(): void {
    this.logger.log('NgOnInitDemoComponent', 'User reset form');
    this.initializeForm();
  }

  submitForm(): void {
    this.logger.log('NgOnInitDemoComponent', 'Form submitted', this.userForm);
  }

  resetDemo(): void {
    this.logger.clear();
    this.counter = 0;
    this.posts = [];
    this.users = [];
    this.error = null;
    this.isLoading = false;

    // Stop and restart timer
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.logger.log(
      'NgOnInitDemoComponent',
      'Demo reset - restarting initialization...'
    );
    this.ngOnInit();
  }

  getUserName(userId: number): string {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
