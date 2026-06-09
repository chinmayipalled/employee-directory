# SPEC.md — Employee Directory

---

## Feature 1: View Employees

### Goal
Display all active employees from the database when the page loads.

### Acceptance Criteria
- [ ] All active employees (`IsActive = 1`) are loaded from the database on page load
- [ ] Each row displays **Full Name** (FirstName + LastName combined)
- [ ] Each row displays **Department**
- [ ] Each row displays **Job Title**
- [ ] Each row displays **Hire Date** formatted as a readable date (e.g. `Mar 15, 2021`)
- [ ] Each row displays a **Status badge** — green `Active` badge for active employees
- [ ] Inactive employees (`IsActive = 0`) are **not shown** in the list
- [ ] A loading state is shown while data is being fetched
- [ ] If no active employees exist, display: `No employees found.`
- [ ] Table has clear column headers: Full Name, Department, Job Title, Hire Date, Status

---

## Feature 2: Search Employees

### Goal
Allow users to filter the employee table in real time as they type a name, without reloading the page or hitting the server.

### Acceptance Criteria
- [ ] A search input is visible above the employee table at all times
- [ ] Placeholder text reads: `Search by name…`
- [ ] As the user types, the table filters to show only employees whose First Name or Last Name contains the search term (case-insensitive)
- [ ] Filtering is instant — no submit button, no page reload, no API call per keystroke
- [ ] Clearing the input restores the full employee list
- [ ] Searching with only whitespace shows the full list (trimmed empty string = no filter)
- [ ] If no employees match the search, display: `No employees match your search.`
- [ ] Search input has `aria-label` of `Search employees by name` for accessibility

---

## Feature 3: Add Employee

### Goal
Allow users to add a new employee via a form. The new employee appears in the table immediately after saving.

### Acceptance Criteria
- [ ] An **Add Employee** button is visible above the table
- [ ] Clicking the button opens a **modal form**
- [ ] The form collects the following fields:
  - First Name (required)
  - Last Name (required)
  - Email (required, must be valid email format)
  - Department (required)
  - Job Title (required)
  - Hire Date (required)
- [ ] All fields are validated before submission — empty required fields show an error message
- [ ] On successful save, the modal closes and the new employee appears in the table without a page reload
- [ ] The new employee is saved to the database with `IsActive = 1` by default
- [ ] If the email already exists in the database, display an error: `Email already in use.`
- [ ] A loading/submitting state is shown on the Save button while the request is in flight
- [ ] Closing the modal (cancel or X button) discards the form without saving

---

## Feature 4: Deactivate Employee

### Goal
Allow users to mark an employee as inactive. The employee disappears from the table. No record is ever deleted from the database.

### Acceptance Criteria
- [ ] Each employee row has a **Deactivate** button
- [ ] Clicking Deactivate shows a **confirmation dialog** before taking any action
- [ ] The confirmation dialog displays: `Are you sure you want to deactivate [Full Name]?`
- [ ] The dialog has a **Confirm** button and a **Cancel** button
- [ ] Clicking Cancel closes the dialog and does nothing
- [ ] Clicking Confirm sets `IsActive = 0` for that employee in the database
- [ ] After confirmation, the row is **removed from the table** without a page reload
- [ ] The employee record is **never deleted** from the database — only `IsActive` is updated
- [ ] A loading state is shown on the Confirm button while the request is in flight
- [ ] If the deactivation request fails, display an error message and keep the row in the table
