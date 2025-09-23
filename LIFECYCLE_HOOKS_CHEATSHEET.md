# Angular Lifecycle Hooks Cheatsheet

## ngOnChanges

**Called when:** An `@Input()` property value changes  
**Parameters:** `SimpleChanges` object containing current and previous values  
**Frequency:** Every time an input property changes

**Description:**  
The first lifecycle hook to run, called whenever one or more data-bound input properties change. It provides a `SimpleChanges` object that maps each changed property name to a `SimpleChange` object holding the current and previous property values.

**Typical Use Cases:**

- React to input property changes and perform side effects
- Validate input data when it changes
- Transform or process input data before using it
- Compare previous and current values to determine what changed
- Initialize or update derived properties based on input changes

**Example:**

```typescript
ngOnChanges(changes: SimpleChanges) {
  if (changes['userId'] && !changes['userId'].firstChange) {
    this.loadUserData(changes['userId'].currentValue);
  }
}
```

---

## ngOnInit

**Called when:** Once after the first `ngOnChanges`  
**Parameters:** None  
**Frequency:** Once per component instance

**Description:**  
Called once after the component is initialized and its input properties are set for the first time. This is the perfect place for component initialization logic that should run only once.

**Typical Use Cases:**

- Initialize component properties and variables
- Fetch initial data from services
- Set up subscriptions to observables
- Initialize complex objects or arrays
- Perform one-time setup operations
- Start timers or intervals

**Example:**

```typescript
ngOnInit() {
  this.userService.getCurrentUser().subscribe(user => {
    this.currentUser = user;
  });
  this.initializeForm();
}
```

---

## ngDoCheck

**Called when:** During every change detection cycle  
**Parameters:** None  
**Frequency:** Very frequently (every change detection cycle)

**Description:**  
Runs during every change detection cycle and allows you to implement custom change detection logic. Use this hook sparingly as it can impact performance due to its frequency.

**Typical Use Cases:**

- Implement custom change detection for complex objects
- Detect changes in arrays or nested objects that Angular might miss
- Perform custom equality checks
- Update UI based on changes not detected by default change detection
- Debug change detection issues

**Example:**

```typescript
ngDoCheck() {
  if (JSON.stringify(this.complexObject) !== this.lastComplexObjectState) {
    this.onComplexObjectChange();
    this.lastComplexObjectState = JSON.stringify(this.complexObject);
  }
}
```

---

## ngAfterContentInit

**Called when:** Once after Angular projects external content into the component  
**Parameters:** None  
**Frequency:** Once per component instance

**Description:**  
Called once after Angular projects external content (content projection via `<ng-content>`) into the component's view. This is when `@ContentChild` and `@ContentChildren` queries are available.

**Typical Use Cases:**

- Access and manipulate projected content
- Initialize logic that depends on projected content
- Set up event listeners on projected elements
- Validate or process content children
- Initialize components that depend on content projection

**Example:**

```typescript
@ContentChild('projectedTemplate') projectedTemplate!: TemplateRef<any>;

ngAfterContentInit() {
  if (this.projectedTemplate) {
    // Work with the projected template
    this.hasProjectedContent = true;
  }
}
```

---

## ngAfterContentChecked

**Called when:** After every check of projected content  
**Parameters:** None  
**Frequency:** After every change detection cycle

**Description:**  
Called after every check of the component's projected content. This hook runs frequently and should be used carefully to avoid performance issues.

**Typical Use Cases:**

- React to changes in projected content
- Update component state based on content changes
- Perform validation on projected content
- Debug content projection issues
- Synchronize component state with projected content

**Example:**

```typescript
ngAfterContentChecked() {
  if (this.contentChildren.length !== this.previousContentCount) {
    this.updateContentLayout();
    this.previousContentCount = this.contentChildren.length;
  }
}
```

---

## ngAfterViewInit

**Called when:** After Angular initializes the component's views and child views  
**Parameters:** None  
**Frequency:** Once per component instance

**Description:**  
Called once after Angular initializes the component's view and all child views. This is when `@ViewChild` and `@ViewChildren` queries become available and DOM elements are fully rendered.

**Typical Use Cases:**

- Access and manipulate DOM elements
- Initialize third-party libraries that need DOM elements
- Set up event listeners on view elements
- Perform operations that require the view to be fully rendered
- Access child components and their methods
- Initialize charts, maps, or other visual components

**Example:**

```typescript
@ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

ngAfterViewInit() {
  this.initializeChart(this.canvas.nativeElement);
  this.setupEventListeners();
}
```

---

## ngAfterViewChecked

**Called when:** After every check of the component's views and child views  
**Parameters:** None  
**Frequency:** After every change detection cycle

**Description:**  
Called after every check of the component's view and all child views. This hook runs very frequently and should be used sparingly to avoid performance issues.

**Typical Use Cases:**

- React to view changes that affect layout
- Update component state based on view changes
- Perform custom view validation
- Synchronize component state with view state
- Debug view-related issues

**Example:**

```typescript
ngAfterViewChecked() {
  if (this.elementRef.nativeElement.scrollHeight !== this.lastScrollHeight) {
    this.adjustScrollPosition();
    this.lastScrollHeight = this.elementRef.nativeElement.scrollHeight;
  }
}
```

---

## ngOnDestroy

**Called when:** Just before Angular destroys the component  
**Parameters:** None  
**Frequency:** Once per component instance (at destruction)

**Description:**  
Called just before Angular destroys the component. This is the place to clean up resources, unsubscribe from observables, and perform other cleanup tasks to prevent memory leaks.

**Typical Use Cases:**

- Unsubscribe from observables and subscriptions
- Clear timers and intervals
- Remove event listeners
- Clean up resources and references
- Cancel ongoing HTTP requests
- Perform final data saves or cleanup operations

**Example:**

```typescript
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();

  if (this.timer) {
    clearInterval(this.timer);
  }

  this.removeEventListeners();
}
```

---

## Hook Execution Order

1. **ngOnChanges** - When input properties change
2. **ngOnInit** - After first ngOnChanges
3. **ngDoCheck** - During every change detection
4. **ngAfterContentInit** - After content projection (once)
5. **ngAfterContentChecked** - After content checking
6. **ngAfterViewInit** - After view initialization (once)
7. **ngAfterViewChecked** - After view checking
8. **ngOnDestroy** - Before component destruction

## Performance Tips

- **Avoid heavy operations** in frequently called hooks (`ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked`)
- **Use OnPush change detection** strategy when possible to reduce hook frequency
- **Unsubscribe properly** in `ngOnDestroy` to prevent memory leaks
- **Cache expensive calculations** to avoid repeated work
- **Use trackBy functions** with `*ngFor` to optimize list rendering
