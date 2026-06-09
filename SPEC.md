# SPEC.md — Search by Name

## Feature: Search by Name

### Goal
Allow users to filter the employee table in real time as they type a name, without reloading the page or hitting the server.

---

### Acceptance Criteria

**Search behavior**
- [ ] A text input is visible above the employee table at all times.
- [ ] As the user types, the table instantly filters to show only employees whose `FirstName` or `LastName` contains the search term (case-insensitive).
- [ ] Filtering happens on the already-loaded employee list in client state — no API call is made per keystroke.
- [ ] Clearing the search input restores the full employee list.
- [ ] The search input has a visible placeholder: `Search by name…`

**Edge cases**
- [ ] Searching with only whitespace returns the full list (treat trimmed empty string as no filter).
- [ ] If the filtered result is empty, display a message: `No employees match your search.`
- [ ] Search still works while an add-employee action is in flight (state isolation).

**Performance**
- [ ] No debounce required — filtering is synchronous on the in-memory array.

**Accessibility**
- [ ] The search input has an accessible `aria-label` of `Search employees by name`.

---

### Data Contract

The feature operates on the `Employee` type (defined in `types/employee.ts`):

```ts
interface Employee {
  EmployeeId: number
  FirstName: string
  LastName: string
  Email: string
  Department: string
  JobTitle: string
  HireDate: Date
  IsActive: boolean
}
```

The search filter is applied to `FirstName` and `LastName` only.
No new fields are needed for this feature.

---

### API Contract

**None.** Search is entirely client-side. No new API endpoints are created for this feature.

The employee list is fetched once on page load (covered by the View Employees feature or the initial data load in `page.tsx`). This spec assumes that list is available in a `useState` array on the client.

---

### UI Behavior

1. Page loads → full employee list is fetched and stored in `employees` state.
2. A `searchQuery` state (string, default `""`) is initialized.
3. The search input is rendered above the table, bound to `searchQuery` via `onChange`.
4. A derived value `filteredEmployees` is computed on every render:
   ```ts
   const filteredEmployees = employees.filter(emp =>
     `${emp.FirstName} ${emp.LastName}`
       .toLowerCase()
       .includes(searchQuery.trim().toLowerCase())
   )
   ```
5. The table renders `filteredEmployees`, not `employees`.
6. If `filteredEmployees.length === 0` and `searchQuery.trim() !== ""`, render the empty message instead of the table body.

**Component responsibility:**
- `SearchInput` component — controlled input, emits `onSearch(query: string)` callback.
- `EmployeeTable` component — receives `employees: Employee[]` as a prop and renders them.
- `app/page.tsx` — owns `employees` state, `searchQuery` state, and the filter logic.

---

### SQL Queries

**None.** This feature adds no new SQL queries. The existing `SELECT` query for loading employees (from View Employees) provides the data.

---

### Component Files

| File | Role |
|---|---|
| `components/SearchInput.tsx` | Controlled search input with label/aria |
| `components/EmployeeTable.tsx` | Renders a list of `Employee[]` as a table |
| `app/page.tsx` | Owns state, filter logic, wires components |

---

### Out of Scope

- Server-side search / API search endpoint.
- Debouncing or throttling.
- Searching by Department, Job Title, or any field other than name.
- Highlighting matched characters in the results.
- Sorting the filtered results.
- Pagination.
