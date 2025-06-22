# Dynamic Form Angular Component

A flexible, schema-driven Angular form component for rapid UI prototyping and dynamic form rendering. Supports all common field types, validation, conditional logic, async hooks, and more.

---

## Features

- Schema-driven form generation
- Supports text, email, number, date, select, checkbox, and password fields
- Custom validators, async validators, and cross-field validation
- Conditional field visibility
- Loading and disabled states
- Pre-submit and post-submit hooks (async supported)
- Reset and error handling
- Fully accessible and responsive
- Material Design UI

---

## Usage Example

```typescript
import { DynamicField } from './dynamic-form/dynamic-form';

schema: DynamicField[] = [
  { key: 'email', label: 'Email', type: 'email', validators: ['required', 'email'] },
  { key: 'password', label: 'Password', type: 'password', validators: ['required', 'minLength'] },
  { key: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox' },
  { key: 'reason', label: 'Why?', type: 'text', condition: { field: 'subscribe', value: true } }
];

preSubmit = (formValue) => {
  // e.g. async check or data manipulation
  return of(true);
};

postSubmit = (formValue) => {
  // e.g. show notification
  return of();
};
```

```html
<lib-dynamic-form
  [schema]="schema"
  [loading]="isSubmitting"
  [preSubmit]="preSubmit"
  [postSubmit]="postSubmit"
  (submitForm)="handleSubmit($event)"
></lib-dynamic-form>
```

---

## Inputs

| Input         | Type                                      | Description                                                      |
|-------------- |-------------------------------------------|------------------------------------------------------------------|
| `schema`      | `DynamicField[]`                          | **Required.** Array of field definitions                         |
| `disabled`    | `boolean`                                 | Disable all fields                                               |
| `loading`     | `boolean`                                 | Show loading spinner and disable submit                          |
| `preSubmit`   | `(formValue) => Observable<boolean>`       | Async hook before submit. Return `false` to block submission     |
| `postSubmit`  | `(formValue) => Observable<void>`          | Async hook after submit                                          |

---

## Outputs

| Output         | Type                | Description                                 |
|----------------|---------------------|---------------------------------------------|
| `submitForm`   | `EventEmitter<any>` | Emits form value on successful submission   |

---

## Field Schema (`DynamicField`)

| Property        | Type                                      | Description                                  |
|-----------------|-------------------------------------------|----------------------------------------------|
| `key`           | `string`                                  | **Required.** Field name                     |
| `label`         | `string`                                  | **Required.** Field label                    |
| `type`          | `'text' | 'email' | 'number' | ...`        | **Required.** Field type                     |
| `defaultValue`  | `any`                                     | Initial value                                |
| `options`       | `{ value: any, label: string }[]`          | For select fields                            |
| `validators`    | `('required' | 'email' | ...)[]`           | Built-in validators                          |
| `errorMessages` | `{ [validator: string]: string }`          | Custom error messages                        |
| `condition`     | `{ field: string, value: any }`            | Show only if another field matches value     |
| `crossValidators`| `ValidatorFn[]`                           | Cross-field validators                       |
| `asyncValidators`| `AsyncValidatorFn[]`                      | Async validators                             |

---

## Advanced Features

- **Conditional Fields:** Use `condition` to show/hide fields based on other values.
- **Custom Validation:** Use `crossValidators` and `asyncValidators` for advanced logic.
- **Hooks:** Use `preSubmit` and `postSubmit` for async checks, notifications, etc.
- **Reset:** Call `resetForm()` method to reset to defaults.

---

## Accessibility & Responsiveness

- Uses Angular Material for accessible, responsive UI.
- ARIA attributes and keyboard navigation supported.

---

## Storybook Integration

Interactive demos and usage examples are available in Storybook (coming soon).

---

## License

MIT
