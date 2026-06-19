import { useState } from "react";
import { Play, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  count?: number;
  data?: Student | Student[];
  errors?: string[];
  status: number;
}

// ── Validation (mirrors server-side logic) ────────────────────
function isValidName(name: string) {
  return /^[A-Za-z]+( [A-Za-z]+)*$/.test(name.trim());
}
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ── In-browser mock store ─────────────────────────────────────
let mockStudents: Student[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "Computer Science" },
  { id: 2, name: "Bob Smith",     email: "bob@example.com",   course: "Mathematics"      },
];
let mockNextId = 3;

function mockGet(): ApiResponse {
  return {
    success: true,
    count: mockStudents.length,
    data: [...mockStudents],
    status: 200,
  };
}

function mockPost(body: { name: string; email: string; course: string }): ApiResponse {
  const errors: string[] = [];
  if (!body.name.trim()) errors.push("Name is required.");
  else if (!isValidName(body.name)) errors.push("Name must contain only alphabetic characters.");
  if (!body.email.trim()) errors.push("Email is required.");
  else if (!isValidEmail(body.email)) errors.push("Email must be in a valid format.");
  if (!body.course.trim()) errors.push("Course is required.");

  if (errors.length) {
    return { success: false, message: "Validation failed.", errors, status: 400 };
  }
  const student: Student = {
    id: mockNextId++,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    course: body.course.trim(),
  };
  mockStudents.push(student);
  return { success: true, message: "Student registered successfully.", data: student, status: 201 };
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ code }: { code: number }) {
  const color =
    code < 300 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" :
    code < 500 ? "text-amber-400 bg-amber-400/10 border-amber-400/30" :
                 "text-red-400 bg-red-400/10 border-red-400/30";
  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-mono font-semibold ${color}`}>
      {code}
    </span>
  );
}

// ── GET tester ────────────────────────────────────────────────
export function GetTester() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse(mockGet());
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 font-mono">
          GET
        </span>
        <code className="text-slate-300 text-sm font-mono">/students</code>
        <button
          onClick={run}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Play size={13} />
          {loading ? "Sending…" : "Send"}
        </button>
      </div>

      {response && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
            {response.success
              ? <CheckCircle size={14} className="text-emerald-400" />
              : <XCircle size={14} className="text-red-400" />}
            <span className="text-xs text-slate-400">Response</span>
            <StatusBadge code={response.status} />
          </div>
          <pre className="p-4 text-sm text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── POST tester ───────────────────────────────────────────────
export function PostTester() {
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      setResponse(mockPost(form));
      setLoading(false);
    }, 400);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 font-mono">
          POST
        </span>
        <code className="text-slate-300 text-sm font-mono">/students</code>
      </div>

      {/* Request body builder */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
          <span className="text-xs text-slate-400">Request Body (JSON)</span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { key: "name",   placeholder: 'e.g. "Jane Doe"',           label: "name"   },
            { key: "email",  placeholder: 'e.g. "jane@example.com"',   label: "email"  },
            { key: "course", placeholder: 'e.g. "Computer Science"',   label: "course" },
          ].map(({ key, placeholder, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono w-16 shrink-0">{label}</span>
              <input
                className={inputClass}
                placeholder={placeholder}
                value={(form as Record<string, string>)[key]}
                onChange={set(key)}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        <Play size={13} />
        {loading ? "Sending…" : "Send Request"}
      </button>

      {response && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
            {response.success
              ? <CheckCircle size={14} className="text-emerald-400" />
              : <AlertCircle size={14} className="text-amber-400" />}
            <span className="text-xs text-slate-400">Response</span>
            <StatusBadge code={response.status} />
          </div>
          <pre className="p-4 text-sm text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
