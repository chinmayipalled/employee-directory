---
name: feedback
description: User preferences and approach corrections observed across sessions
metadata:
  type: feedback
---

## Keep responses concise

User prefers short, direct answers. Don't pad responses with narration of what you're doing — just do it and state the result.

**Why:** Observed across the session — user uses short messages and expects matching brevity back.
**How to apply:** One sentence of context, then the tool call or output. No trailing summaries unless something went wrong.

---

## Don't investigate what was already resolved

Once a root cause is found and fixed (e.g. DB connection), don't re-investigate it in a future session. Jump straight to the known working config.

**Why:** The DB connection debugging took many rounds. The fix is documented in [[db-rules]].
**How to apply:** Before any DB connection work, read db-rules.md first. The answer is already there.

---

## Plan first, code second — user explicitly controls when implementation starts

User asked for a spec and a plan before any implementation. When the user says "suggest and create a plan, do not initiate anything or code anything" — produce only the spec/plan, then wait for explicit approval.

**Why:** User said this directly during the Departments/Tickets planning session.
**How to apply:** When asked to plan, output the plan and wait. Do not start writing files until the user says to proceed.

---

## User runs DB scripts in SSMS manually

The user executes SQL scripts (setup.sql, migrations) themselves via SSMS connected to SQLEXPRESS. Do not try to run SQL scripts via sqlcmd on their behalf for schema changes — write the script and tell them to run it.

**Why:** setup.sql was run by the user manually; they confirmed it with "done".
**How to apply:** For any migration script, write it to `database/` and tell the user to run it in SSMS.
