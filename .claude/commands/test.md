---
description: /test — Generate tests for the specified file or feature. Covers happy path, error cases, and edge cases.
---

Generate tests for: $ARGUMENTS

If no argument is given, ask which file or feature to test.

---

## What to generate

For every function, API route, or component specified, write tests covering:

### 1. Happy path
The normal successful case — inputs are valid, DB responds correctly, UI renders as expected.

```ts
it('returns all active employees on GET /api/employees', async () => {
  // mock the DB pool to return sample rows
  // call the route handler
  // assert status 200
  // assert data array contains expected employees
  // assert error is null
})
```

### 2. Error cases
What happens when things go wrong — DB fails, network error, server returns 500.

```ts
it('returns 500 when the database throws', async () => {
  // mock pool.request().query to throw
  // call the route handler
  // assert status 500
  // assert data is null
  // assert error message is present
})
```

### 3. Edge cases
Boundary conditions and unusual inputs.

```ts
// For search:
it('returns full list when search query is empty string', ...)
it('returns full list when search query is only whitespace', ...)
it('returns empty array when no employees match the search', ...)

// For add employee:
it('returns 400 when a required field is missing', ...)
it('returns 409 when email already exists', ...)

// For deactivate:
it('returns 404 when employee ID does not exist', ...)
```

---

## Rules for generated tests

- Use **Jest** as the test runner (matches Next.js default setup).
- Mock the DB pool — never connect to a real database in tests.
- Mock `fetch` for client-side component tests.
- Each test has one assertion focus — do not combine multiple concerns in one test.
- Test file goes next to the file being tested with a `.test.ts` or `.test.tsx` suffix.
- No `any` types in test code — same TypeScript rules apply.

---

## Output

Write the test file to disk. Confirm the file path and how to run it:
```bash
npx jest <test-file-path>
```
