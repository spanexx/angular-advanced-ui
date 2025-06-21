# Advanced Angular Data Table Component

A highly flexible, feature-rich Angular data table for enterprise applications. Supports dynamic columns, server-side operations, advanced filtering, virtual scroll, accessibility, and more.

---

## Features

- Dynamic columns via `@Input()`
- Server-side pagination, sorting, and filtering
- Global search and per-column filters (text, select, range, date)
- Multi-column sorting (Shift+Click)
- Custom cell templates and conditional formatting
- Row selection (single/multiple), bulk actions, and row actions
- Export to CSV/Excel (current view, all, or selected rows)
- Import from CSV/Excel
- Virtual scrolling for large datasets
- Responsive layout and ARIA accessibility
- Debounced filtering
- Loading, error, and empty states

---

## Usage Example (Recommended: Server-Side Fetching)

```typescript
// In your component:
columns = [/* ...column definitions... */];
fetchDataFn = (page, size, sort, filter) => this.myService.getData(page, size, sort, filter);
rowActions = [/* ...row actions... */];
```

```html
<app-data-table
  [columnDefinitions]="columns"
  [fetchDataService]="fetchDataFn"
  [selectionMode]="'multiple'"
  [rowActions]="rowActions"
  [rowIdField]="'id'">
</app-data-table>
```

---

## Inputs

| Input              | Type      | Description |
|--------------------|-----------|-------------|
| `columnDefinitions`| `ColumnDefinition[]` | Column config (header, field, filterType, etc.) |
| `fetchDataService` | `(page, size, sort, filter) => Observable<{data, total}>` | **Required.** Server fetch function for all datasets |
| `customFetch`      | Same as above | Alternative fetch function |
| `selectionMode`    | `'single', 'multiple', 'none'` | Row selection mode |
| `rowActions`       | `Array<{icon, label, action, color}>` | Row action buttons |
| `rowIdField`       | `string`   | Unique row id field (default: 'id') |

---

## Outputs

- (For custom row/bulk actions, use `onRowAction` and `onBulkAction` methods or extend the component.)

---

## Filtering

- Text, select, date, and range filters supported per column.
- Min/Max fields filter numeric columns by range.
- Filters only apply when "Apply Filters" is clicked.

---

## Export/Import

- Export current view, all data, or selected rows to CSV/Excel.
- Import from CSV/Excel (server-side processing).

---

## Accessibility & Responsiveness

- ARIA roles, keyboard navigation, and responsive layout for all devices.

---

## Virtual Scrolling

- Uses Angular CDK for efficient rendering of large datasets.

---

## Customization

- Use `cellTemplate` in column definitions for custom cell rendering.
- Use `cellClass` and `cellStyle` for conditional formatting.

---

## Development & Storybook

- For interactive demos, see Storybook integration (coming soon).

---

## License

MIT
