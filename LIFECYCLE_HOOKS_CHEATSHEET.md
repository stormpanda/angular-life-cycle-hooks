# Angular Lifecycle Hooks Cheatsheet

| Hook | Description |
| --- | --- |
| **ngOnChanges** | Called when an `@Input()` property value changes. Provides a `SimpleChanges` object of current and previous values. |
| **ngOnInit** | Invoked once after the first `ngOnChanges`. Use it for component initialization. |
| **ngDoCheck** | Runs during every change detection cycle and lets you implement custom change detection. |
| **ngAfterContentInit** | Called once after Angular projects external content into the component. |
| **ngAfterContentChecked** | Invoked after every check of projected content. |
| **ngAfterViewInit** | Runs after Angular initializes the component's views and child views. |
| **ngAfterViewChecked** | Called after every check of the component's views and child views. |
| **ngOnDestroy** | Invoked just before Angular destroys the component; use it for cleanup. |

