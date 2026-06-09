---
description: /explain — Explains code in plain English. Works for TypeScript, SQL, and legacy VB.NET / ASP.NET WebForms code.
---

Explain the following code in plain English: $ARGUMENTS

If no argument is given, ask the user to paste the code or provide a file path.

---

## How to explain

Read the code carefully. Then explain it in three parts:

### 1. What it does (one sentence)
State the purpose in plain English — no jargon, no code terms.

Example:
> "This function fetches all employees from the database who are still active and returns them as a JSON list."

### 2. How it works (step by step)
Walk through the logic line by line or block by block. Use numbered steps.

Example:
> 1. Opens a connection to the database using the shared connection pool.
> 2. Runs a SELECT query filtered to only rows where IsActive = 1.
> 3. Maps each database row to an Employee object.
> 4. Returns the list wrapped in a { data, error } response envelope.

### 3. What to watch out for
Flag anything that is:
- A potential bug or edge case
- A legacy pattern that works differently in modern code
- A SQL or security concern
- Confusing or non-obvious behavior

---

## Legacy VB.NET / ASP.NET WebForms guide

This project is migrating from a legacy ASP.NET WebForms + SQL Server app. When explaining legacy code, also map the old pattern to the modern Next.js equivalent.

| Legacy (VB.NET / WebForms) | Modern equivalent (Next.js) |
|---|---|
| `Code-behind (.aspx.vb)` | API route (`app/api/.../route.ts`) |
| `SqlConnection / SqlCommand` | `mssql` pool + `request.query()` |
| `DataGrid / GridView` | React component rendering a `<table>` |
| `Response.Write(...)` | `NextResponse.json(...)` |
| `Session["key"]` | `useState` or server session |
| `Page_Load` event | `useEffect` or Server Component fetch |
| `TextBox.Text` | Controlled `<input>` with `useState` |
| `Button_Click` event handler | `onClick` handler in React |
| `Protected Sub` | `function` or `async function` |
| `Dim x As String` | `const x: string` |

Use this table when explaining legacy code so the reader understands both what the old code does and how it would be written today.
