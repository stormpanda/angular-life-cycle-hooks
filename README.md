# AngularLifeCycleHooks

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Lifecycle Hooks Demo

This project includes a `LifecycleDemoComponent` and a nested `LifecycleChildComponent` that showcase Angular's lifecycle hooks:

- **OnChanges** – triggered when Angular sets or resets data-bound `@Input()` properties.
- **OnInit** – runs once after the first `ngOnChanges` and initializes component logic.
- **DoCheck** – allows custom change detection during every change detection cycle.
- **AfterContentInit** – fires after Angular projects external content into the component.
- **AfterContentChecked** – runs after Angular checks projected content.
- **AfterViewInit** – called after Angular initializes the component's views and child views.
- **AfterViewChecked** – executes after Angular checks the component's views and child views.
- **OnDestroy** – invoked just before Angular destroys the component.

### Running the demo

1. Start the development server:

   ```bash
   ng serve
   ```

2. Navigate to [http://localhost:4200/lifecycle-demo](http://localhost:4200/lifecycle-demo) and open the browser's developer console to view lifecycle hook logs.

### Example console output

```text
LifecycleDemoComponent ngOnInit
LifecycleChildComponent ngOnInit
LifecycleDemoComponent ngAfterViewInit
LifecycleChildComponent ngAfterViewInit
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
