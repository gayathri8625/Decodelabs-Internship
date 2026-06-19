// MARKER-MAKE-KIT-INVOKED
// MARKER-MAKE-KIT-DISCOVERY-READ
import { useState } from "react";
import {
  Server, BookOpen, Terminal, Cloud, ChevronRight,
  FolderTree, CheckCircle, Layers,
} from "lucide-react";
import { CodeBlock } from "./components/CodeBlock";
import { GetTester, PostTester } from "./components/ApiTester";

// ── Section header component ──────────────────────────────────
function SectionTitle({ icon: Icon, title, subtitle }: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0 mt-0.5">
        <Icon size={18} className="text-indigo-400" />
      </div>
      <div>
        <h2 className="text-slate-100 font-semibold text-lg">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Tab navigation ────────────────────────────────────────────
const TABS = [
  { id: "overview",    label: "Overview",    icon: BookOpen   },
  { id: "structure",  label: "Structure",   icon: FolderTree },
  { id: "endpoints",  label: "Endpoints",   icon: Layers     },
  { id: "tester",     label: "API Tester",  icon: Terminal   },
  { id: "postman",    label: "Postman",     icon: Server     },
  { id: "deploy",     label: "Deploy",      icon: Cloud      },
];

// ── Code snippets ─────────────────────────────────────────────
const SERVER_CODE = `/**
 * server.js — Student Registration API (Node.js + Express.js)
 */
const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Types & store ────────────────────────────────────────────
let students = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "CS"   },
  { id: 2, name: "Bob Smith",     email: "bob@example.com",   course: "Math" },
];
let nextId = 3;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Validation helpers ───────────────────────────────────────
const isValidName  = n => /^[A-Za-z]+( [A-Za-z]+)*$/.test(n.trim());
const isValidEmail = e => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e.trim());

function validateStudent({ name, email, course }) {
  const errors = [];
  if (!name?.trim())           errors.push("Name is required.");
  else if (!isValidName(name)) errors.push("Name must contain only alphabetic characters.");
  if (!email?.trim())           errors.push("Email is required.");
  else if (!isValidEmail(email)) errors.push("Email must be in a valid format.");
  if (!course?.trim())          errors.push("Course is required.");
  return errors;
}

// ── GET /students ────────────────────────────────────────────
app.get("/students", (req, res) => {
  try {
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ── POST /students ───────────────────────────────────────────
app.post("/students", (req, res) => {
  try {
    const errors = validateStudent(req.body);
    if (errors.length)
      return res.status(400).json({ success: false, message: "Validation failed.", errors });

    const student = { id: nextId++, ...req.body };
    students.push(student);
    res.status(201).json({ success: true, message: "Student registered.", data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: \`Route \${req.method} \${req.path} not found.\` }));

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => console.log(\`API running → http://localhost:\${PORT}\`));`;

const INSTALL_COMMANDS = `# 1. Create project folder
mkdir student-registration-api && cd student-registration-api

# 2. Initialise package.json
npm init -y

# 3. Install production dependencies
npm install express cors

# 4. Install dev dependencies (for TypeScript variant)
npm install --save-dev typescript ts-node @types/node @types/express @types/cors nodemon

# 5. Add start scripts to package.json
#    "start": "node server.js",
#    "dev":   "nodemon server.js"

# 6. Run the server
npm run dev`;

const POSTMAN_STEPS = `# ── GET /students ──────────────────────────────────────────
Method : GET
URL    : http://localhost:3000/students
Headers: (none required)

Expected Response (200):
{
  "success": true,
  "count": 2,
  "data": [ { "id": 1, "name": "Alice Johnson", ... }, ... ]
}

# ── POST /students (valid request) ──────────────────────────
Method : POST
URL    : http://localhost:3000/students
Headers: Content-Type: application/json
Body   :
{
  "name":   "Jane Doe",
  "email":  "jane@example.com",
  "course": "Data Science"
}

Expected Response (201):
{
  "success": true,
  "message": "Student registered successfully.",
  "data": { "id": 3, "name": "Jane Doe", ... }
}

# ── POST /students (validation error) ───────────────────────
Body:
{ "name": "123Invalid", "email": "not-an-email", "course": "" }

Expected Response (400):
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Name must contain only alphabetic characters.",
    "Email must be in a valid format.",
    "Course is required."
  ]
}`;

const RENDER_DEPLOY = `# ── Deploy to Render (free tier) ───────────────────────────
1. Push your project to a GitHub repository.

2. Go to https://render.com → New → Web Service.

3. Connect your GitHub repo.

4. Configure:
   Name       : student-registration-api
   Environment: Node
   Build Cmd  : npm install
   Start Cmd  : node server.js
   Plan       : Free

5. Click "Create Web Service".
   Render builds and deploys automatically.

# ── Deploy to Vercel (serverless) ────────────────────────────
# Wrap app.listen in a check:
# if (require.main === module) app.listen(PORT, ...);
# Then add vercel.json:
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}

# CLI deploy:
npx vercel --prod

# ── Environment variables ────────────────────────────────────
# Set PORT in the dashboard (Render / Vercel) — the server
# reads process.env.PORT automatically.`;

// ── Main app ──────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
            <Server size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-slate-100 font-bold text-base leading-tight">
              Student Registration API
            </h1>
            <p className="text-slate-500 text-xs">Node.js · Express.js · REST</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              v1.0.0
            </span>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-8">

        {/* ────────────────── OVERVIEW ────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <SectionTitle icon={BookOpen} title="Project Overview" subtitle="What is Student Registration API?" />

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Runtime",     value: "Node.js 18+",   color: "text-green-400"  },
                { label: "Framework",   value: "Express.js 4",  color: "text-yellow-400" },
                { label: "Data Store",  value: "In-memory Array", color: "text-blue-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-slate-500 text-xs mb-1">{label}</p>
                  <p className={`font-semibold text-sm ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <p className="text-slate-300 font-medium text-sm mb-4">Features</p>
              {[
                "REST API with GET and POST endpoints",
                "Input validation — alphabetic names, email format, no empty fields",
                "Proper HTTP status codes: 200, 201, 400, 500",
                "JSON request / response throughout",
                "CORS enabled for cross-origin frontend access",
                "Global error handling middleware",
                "Production-ready structure with inline comments",
              ].map(f => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-slate-400">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>

            <SectionTitle icon={Terminal} title="Installation" subtitle="Set up the project locally" />
            <CodeBlock code={INSTALL_COMMANDS} language="bash" label="Terminal" />

            <SectionTitle icon={BookOpen} title="Server Code" subtitle="Complete server.js" />
            <CodeBlock code={SERVER_CODE} language="javascript" label="server.js" />
          </div>
        )}

        {/* ────────────────── STRUCTURE ────────────────── */}
        {activeTab === "structure" && (
          <div className="space-y-6">
            <SectionTitle icon={FolderTree} title="Project Structure" subtitle="Recommended folder layout" />
            <CodeBlock
              code={`student-registration-api/
├── server.js            ← Main Express application
├── package.json         ← Dependencies & scripts
├── package-lock.json
├── .env                 ← PORT=3000  (do not commit)
├── .gitignore           ← node_modules, .env
└── README.md            ← Project documentation`}
              language="text"
              label="Folder structure"
            />

            <SectionTitle icon={BookOpen} title="package.json Scripts" />
            <CodeBlock
              code={`{
  "name": "student-registration-api",
  "version": "1.0.0",
  "description": "REST API for student registration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev":   "nodemon server.js"
  },
  "dependencies": {
    "cors":    "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`}
              language="json"
              label="package.json"
            />

            <SectionTitle icon={BookOpen} title=".gitignore" />
            <CodeBlock code={`node_modules/\n.env\n*.log`} language="text" label=".gitignore" />
          </div>
        )}

        {/* ────────────────── ENDPOINTS ────────────────── */}
        {activeTab === "endpoints" && (
          <div className="space-y-8">
            <SectionTitle icon={Layers} title="API Endpoints" subtitle="Base URL: http://localhost:3000" />

            {/* GET */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 font-mono">GET</span>
                <code className="text-slate-200 text-sm font-mono">/students</code>
                <span className="ml-auto text-slate-500 text-xs">Fetch all students</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-slate-500 text-xs mb-2">Response — 200 OK</p>
                  <CodeBlock
                    code={`{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "course": "Computer Science" },
    { "id": 2, "name": "Bob Smith",     "email": "bob@example.com",   "course": "Mathematics"      }
  ]
}`}
                    language="json"
                  />
                </div>
              </div>
            </div>

            {/* POST */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 font-mono">POST</span>
                <code className="text-slate-200 text-sm font-mono">/students</code>
                <span className="ml-auto text-slate-500 text-xs">Register a student</span>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-slate-500 text-xs mb-2">Request Body</p>
                  <CodeBlock
                    code={`{
  "name":   "Jane Doe",          // Required. Alphabets only.
  "email":  "jane@example.com",  // Required. Valid email format.
  "course": "Data Science"       // Required. Non-empty string.
}`}
                    language="json"
                  />
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">Response — 201 Created</p>
                  <CodeBlock
                    code={`{
  "success": true,
  "message": "Student registered successfully.",
  "data": { "id": 3, "name": "Jane Doe", "email": "jane@example.com", "course": "Data Science" }
}`}
                    language="json"
                  />
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-2">Response — 400 Validation Error</p>
                  <CodeBlock
                    code={`{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Name must contain only alphabetic characters.",
    "Email must be in a valid format.",
    "Course is required."
  ]
}`}
                    language="json"
                  />
                </div>
              </div>
            </div>

            {/* Status codes */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
              <p className="text-slate-300 font-medium text-sm mb-3">HTTP Status Codes</p>
              {[
                { code: "200", label: "OK",                   desc: "GET request succeeded",       color: "text-emerald-400" },
                { code: "201", label: "Created",              desc: "Student registered",           color: "text-emerald-400" },
                { code: "400", label: "Bad Request",          desc: "Validation failed",            color: "text-amber-400"   },
                { code: "404", label: "Not Found",            desc: "Route does not exist",         color: "text-amber-400"   },
                { code: "500", label: "Internal Server Error",desc: "Unexpected server-side error", color: "text-red-400"     },
              ].map(({ code, label, desc, color }) => (
                <div key={code} className="flex items-center gap-3 text-sm">
                  <code className={`font-mono font-bold w-10 shrink-0 ${color}`}>{code}</code>
                  <span className="text-slate-300 w-40 shrink-0">{label}</span>
                  <span className="text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── TESTER ────────────────── */}
        {activeTab === "tester" && (
          <div className="space-y-8">
            <SectionTitle
              icon={Terminal}
              title="Interactive API Tester"
              subtitle="Simulate real API calls directly in the browser (no server needed)"
            />

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight size={14} className="text-blue-400" />
                <p className="text-slate-300 text-sm font-medium">GET /students</p>
              </div>
              <GetTester />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight size={14} className="text-emerald-400" />
                <p className="text-slate-300 text-sm font-medium">POST /students</p>
              </div>
              <PostTester />
            </div>
          </div>
        )}

        {/* ────────────────── POSTMAN ────────────────── */}
        {activeTab === "postman" && (
          <div className="space-y-6">
            <SectionTitle icon={Server} title="Postman Testing Guide" subtitle="Step-by-step instructions" />

            {[
              {
                step: "1",
                title: "Install & Open Postman",
                body: "Download Postman from https://postman.com. Create a free account or use the desktop app without signing in.",
              },
              {
                step: "2",
                title: "Start your local server",
                body: "Run `npm run dev` in the project folder. You should see: API running → http://localhost:3000",
              },
              {
                step: "3",
                title: "Create a new Collection",
                body: 'Click "Collections" → "+". Name it "Student Registration API".',
              },
              {
                step: "4",
                title: "Add requests and test",
                body: "Add the GET and POST requests shown below. Send each one and verify the response.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-medium">{title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{body}</p>
                </div>
              </div>
            ))}

            <CodeBlock code={POSTMAN_STEPS} language="bash" label="Postman requests" />
          </div>
        )}

        {/* ────────────────── DEPLOY ────────────────── */}
        {activeTab === "deploy" && (
          <div className="space-y-6">
            <SectionTitle icon={Cloud} title="Deployment Guide" subtitle="Deploy to Render, Vercel, or Railway" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { platform: "Render",   pros: "Free tier, auto-deploy from GitHub, no cold-start on paid",        color: "text-purple-400" },
                { platform: "Vercel",   pros: "Serverless functions, global CDN, instant preview URLs",            color: "text-slate-200"  },
                { platform: "Railway",  pros: "Simple dashboard, built-in DB add-ons, generous free hours",       color: "text-pink-400"   },
              ].map(({ platform, pros, color }) => (
                <div key={platform} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className={`font-semibold text-sm mb-1 ${color}`}>{platform}</p>
                  <p className="text-slate-500 text-xs">{pros}</p>
                </div>
              ))}
            </div>

            <CodeBlock code={RENDER_DEPLOY} language="bash" label="Deployment steps" />

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-amber-400 text-sm font-medium mb-1">Note on in-memory storage</p>
              <p className="text-slate-400 text-sm">
                The current implementation stores data in a JavaScript array, which is cleared on every
                server restart or deployment. For persistent storage, replace the array with a database
                like <span className="text-slate-200">PostgreSQL (via Supabase)</span> or{" "}
                <span className="text-slate-200">MongoDB Atlas</span>.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 py-4 text-center text-slate-600 text-xs">
        Student Registration API · Node.js + Express.js · Built for learning
      </footer>
    </div>
  );
}
