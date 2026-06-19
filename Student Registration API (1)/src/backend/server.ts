/**
 * ============================================================
 * Student Registration API — server.ts  (Node.js + Express.js)
 * This file is meant to be run as a standalone Node.js server.
 * Copy it out of the React project into its own folder and
 * follow the setup steps in the project documentation UI.
 * ============================================================
 */

// ── 1. Dependencies ──────────────────────────────────────────
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ── 2. Types ─────────────────────────────────────────────────
interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ── 3. Middleware ─────────────────────────────────────────────
app.use(express.json());       // Parse incoming JSON bodies
app.use(cors());               // Allow cross-origin requests

// ── 4. In-memory data store ───────────────────────────────────
// Temporary array acting as a lightweight "database".
// All data is lost when the server restarts.
let students: Student[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "Computer Science" },
  { id: 2, name: "Bob Smith",     email: "bob@example.com",   course: "Mathematics"      },
];
let nextId = 3;

// ── 5. Validation helpers ─────────────────────────────────────

/** Only alphabetic characters and single spaces between words. */
function isValidName(name: string): boolean {
  return /^[A-Za-z]+( [A-Za-z]+)*$/.test(name.trim());
}

/** Standard email format: user@domain.tld */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Validates all student fields; returns empty array when valid. */
function validateStudent(body: Partial<Student>): ValidationResult {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required.");
  } else if (!isValidName(body.name)) {
    errors.push("Name must contain only alphabetic characters.");
  }

  if (!body.email || body.email.trim() === "") {
    errors.push("Email is required.");
  } else if (!isValidEmail(body.email)) {
    errors.push("Email must be in a valid format (e.g. user@domain.com).");
  }

  if (!body.course || body.course.trim() === "") {
    errors.push("Course is required.");
  }

  return { valid: errors.length === 0, errors };
}

// ── 6. Routes ─────────────────────────────────────────────────

/**
 * GET /students
 * Returns all registered students.
 * 200 – success | 500 – server error
 */
app.get("/students", (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (err: unknown) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (err as Error).message,
    });
  }
});

/**
 * POST /students
 * Registers a new student.
 * Body: { name, email, course }
 * 201 – created | 400 – validation error | 500 – server error
 */
app.post("/students", (req: Request, res: Response) => {
  try {
    const { name, email, course } = req.body as Partial<Student>;
    const { valid, errors } = validateStudent({ name, email, course });

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors,
      });
    }

    const newStudent: Student = {
      id: nextId++,
      name: name!.trim(),
      email: email!.trim().toLowerCase(),
      course: course!.trim(),
    };
    students.push(newStudent);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: newStudent,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: (err as Error).message,
    });
  }
});

// ── 7. 404 handler ────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

// ── 8. Global error handler ───────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred.",
    error: err.message,
  });
});

// ── 9. Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Student Registration API → http://localhost:${PORT}`);
});

export default app;
