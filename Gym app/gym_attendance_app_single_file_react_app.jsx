import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/*
  Single-file React app implementing the Gym Attendance Web App requested.
  - Tailwind CSS classes are used for styling (assumes Tailwind is set up in host project)
  - Uses localStorage to persist members, attendance, and users
  - Mock auth with Admin and Staff roles
  - Charts use recharts
  - Color theme and style guide followed via CSS variables and Tailwind classes

  Pages included:
  - /login
  - /dashboard
  - /members
  - /members/:id
  - /attendance
  - /logs
  - /analytics
  
  Important: This file is designed as a starting point. You can split into components/files as needed.
*/

// Theme CSS variables (can be placed in a global stylesheet)
const themeStyles = `
:root{
  --primary: #4F46E5; /* Indigo */
  --secondary: #10B981; /* Green */
  --accent: #F59E0B; /* Amber */
  --bg-light: #F9FAFB;
  --bg-dark: #1F2937;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --card: #FFFFFF;
  --border: #E5E7EB;
  --radius: 8px;
  --gap: 20px;
}
`;

// Helper functions
const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

const saveToStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Defaults
const defaultUsers = [
  { id: "u-admin", name: "Admin", role: "admin", username: "admin", password: "admin" },
  { id: "u-staff", name: "Staff", role: "staff", username: "staff", password: "staff" },
];

const sampleMembers = [
  { id: "M-001", name: "Amit Patel", phone: "+91 98765 43210", email: "amit@example.com", membershipType: "Monthly", joinDate: "2025-08-01", status: "active" },
  { id: "M-002", name: "Sneha Desai", phone: "+91 91234 56789", email: "sneha@example.com", membershipType: "Quarterly", joinDate: "2025-06-15", status: "active" },
  { id: "M-003", name: "Rohit Sharma", phone: "+91 99887 66554", email: "rohit@example.com", membershipType: "Monthly", joinDate: "2025-11-01", status: "inactive" },
];

// Initialize storage if empty
if (!localStorage.getItem("gym_users")) saveToStorage("gym_users", defaultUsers);
if (!localStorage.getItem("gym_members")) saveToStorage("gym_members", sampleMembers);
if (!localStorage.getItem("gym_attendance")) saveToStorage("gym_attendance", {}); // { date: { memberId: { status, markedBy, markedAt } } }
if (!localStorage.getItem("gym_audit")) saveToStorage("gym_audit", []);

/* ----------------------- Auth Context (simple) ----------------------- */
const useAuth = () => {
  const [user, setUser] = useState(loadFromStorage("gym_current_user", null));
  useEffect(() => saveToStorage("gym_current_user", user), [user]);
  return { user, setUser };
};

/* ----------------------- UI Bits ----------------------- */
const Icon = ({ name, className = "w-5 h-5" }) => {
  // minimal icon switch (use lucide-react or similar in real project)
  if (name === "users") return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "calendar") return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 2v4M8 2v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "dashboard") return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 13h8V3H3v10zM13 21h8v-7h-8v7zM13 3v7h8V3h-8zM3 21h8v-4H3v4z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "log") return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return null;
};

const Toast = ({ message, onClose }) => (
  <div className="fixed right-6 bottom-6 bg-white shadow-lg border" style={{ borderColor: "var(--border)", borderRadius: 12, padding: 12 }}>
    <div className="text-sm text-gray-800">{message}</div>
    <div className="text-xs text-gray-500 mt-1 cursor-pointer text-right" onClick={onClose}>Dismiss</div>
  </div>
);

/* ----------------------- App Components ----------------------- */
const AppShell = ({ children, auth, onLogout }) => {
  const { user } = auth;
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-light)" }}>
      <style>{themeStyles}</style>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary)", color: "white" }}>
              <strong>G</strong>
            </div>
            <div>
              <div className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Gym Attendance</div>
              <div className="text-sm text-gray-500">Simple • Clean • Modern</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-3">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/members">Members</NavLink>
              <NavLink to="/attendance">Attendance</NavLink>
              <NavLink to="/logs">Logs</NavLink>
              <NavLink to="/analytics">Analytics</NavLink>
            </nav>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user ? `${user.name} • ${user.role}` : "Not logged"}</div>
              {user && <button className="px-3 py-1 rounded" style={{ backgroundColor: "var(--border)" }} onClick={onLogout}>Logout</button>}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="px-3 py-1 rounded text-sm" style={{ color: "var(--text-primary)" }}>{children}</Link>
);

/* ----------------------- Pages ----------------------- */
const LoginPage = ({ auth }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const users = loadFromStorage("gym_users", []);
    const u = users.find(x => x.username === username && x.password === password);
    if (!u) return setError("Invalid credentials");
    auth.setUser(u);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input className="w-full p-3 rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" className="w-full p-3 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded text-white" style={{ backgroundColor: "var(--primary)" }}>Sign in</button>
            <button type="button" className="flex-1 py-2 rounded border" onClick={() => { setUsername("admin"); setPassword("admin"); }}>Fill Admin</button>
          </div>
        </form>
        <div className="text-sm text-gray-500 mt-3">Staff demo: staff / staff</div>
      </div>
    </div>
  );
};

const Dashboard = ({ auth }) => {
  const members = loadFromStorage("gym_members", []);
  const attendance = loadFromStorage("gym_attendance", {});

  // compute today's present
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = attendance[today] || {};
  const presentCount = Object.values(todayRecords).filter(r => r.status === "Present").length;
  const activeMembersCount = members.filter(m => m.status === "active").length;

  // small chart dataset (last 7 days)
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().slice(0, 10);
    const rec = attendance[k] || {};
    const p = Object.values(rec).filter(r => r.status === "Present").length;
    return { date: k.slice(5), present: p };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2 p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overview</h3>
          <div className="text-sm text-gray-500">Today: {today}</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Active Members" value={activeMembersCount} />
          <StatCard title="Present Today" value={presentCount} accent="var(--secondary)" />
          <StatCard title="Pending" value={members.filter(m=>m.status!=="active").length} accent="var(--accent)" />
        </div>

        <div className="mt-6" style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={last7} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="var(--primary)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-col gap-3">
          <Link to="/members" className="px-4 py-2 rounded" style={{ backgroundColor: "var(--primary)", color: "white" }}>Manage Members</Link>
          <Link to="/attendance" className="px-4 py-2 rounded border" style={{ borderColor: "var(--border)" }}>Mark Attendance</Link>
          <Link to="/analytics" className="px-4 py-2 rounded" style={{ backgroundColor: "var(--secondary)", color: "white" }}>View Analytics</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, accent }) => (
  <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold" style={{ color: accent || "var(--text-primary)" }}>{value}</div>
  </div>
);

/* ----------------------- Members Page ----------------------- */
const MembersPage = ({ auth }) => {
  const [members, setMembers] = useState(loadFromStorage("gym_members", []));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [toast, setToast] = useState("");

  useEffect(() => saveToStorage("gym_members", members), [members]);

  const filtered = members.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.id.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const display = filtered.slice((page-1)*perPage, page*perPage);

  const handleAdd = () => {
    const id = `M-${String(members.length + 1).padStart(3, '0')}`;
    const newM = { id, name: "New Member", phone: "", email: "", membershipType: "Monthly", joinDate: new Date().toISOString().slice(0,10), status: "active" };
    setMembers([newM, ...members]);
    setToast("Member added");
  };

  const handleDelete = (id) => {
    if (!confirm("Delete member?")) return;
    setMembers(members.filter(m => m.id !== id));
    setToast("Member deleted");
  };

  const updateMember = (id, patch) => setMembers(members.map(m => m.id === id ? { ...m, ...patch } : m));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Members</h2>
        <div className="flex gap-2">
          <input className="p-2 rounded border" placeholder="Search by name or ID" value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="px-3 py-2 rounded" style={{ backgroundColor: "var(--primary)", color: "white" }} onClick={handleAdd}>Add Member</button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow" style={{ border: `1px solid var(--border)` }}>
        <table className="min-w-full divide-y" style={{ backgroundColor: "var(--card)" }}>
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Membership</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {display.map((m, idx) => (
              <tr key={m.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3">{m.id}</td>
                <td className="px-4 py-3"><Link to={`/members/${m.id}`} className="font-medium" style={{ color: "var(--primary)" }}>{m.name}</Link></td>
                <td className="px-4 py-3">{m.phone}</td>
                <td className="px-4 py-3">{m.membershipType}</td>
                <td className="px-4 py-3">{m.status}</td>
                <td className="px-4 py-3">
                  <button className="px-2 py-1 rounded mr-2 border" onClick={()=>updateMember(m.id, { status: m.status === 'active' ? 'inactive' : 'active' })}>Toggle</button>
                  <button className="px-2 py-1 rounded border" onClick={()=>handleDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <button className="px-3 py-1 rounded border" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={()=>setToast("")} />}
    </div>
  );
};

const MemberProfile = ({ auth }) => {
  const { id } = useParams();
  const [members, setMembers] = useState(loadFromStorage("gym_members", []));
  const attendance = loadFromStorage("gym_attendance", {});
  const member = members.find(m => m.id === id);
  const [toast, setToast] = useState("");

  if (!member) return <div>Member not found</div>;

  // compute stats
  const allDates = Object.keys(attendance).sort();
  let present=0, absent=0, leave=0;
  const trend = [];
  const last30 = allDates.slice(-30);
  last30.forEach(d => {
    const rec = attendance[d][id];
    if (!rec) { absent++; trend.push({ date: d.slice(5), v: 0 }); }
    else if (rec.status === 'Present') { present++; trend.push({ date: d.slice(5), v: 1 }); }
    else if (rec.status === 'Leave') { leave++; trend.push({ date: d.slice(5), v: 0.5 }); }
    else { absent++; trend.push({ date: d.slice(5), v: 0 }); }
  });
  const attendancePct = ((present / Math.max(1, (present + absent + leave))) * 100).toFixed(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{member.name} • {member.id}</h2>
        <div className="text-sm text-gray-500">Joined: {member.joinDate}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-500">Attendance %</div>
              <div className="text-3xl font-bold" style={{ color: "var(--primary)" }}>{attendancePct}%</div>
            </div>
            <div className="text-sm text-gray-500">Present {present} • Absent {absent} • Leave {leave}</div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
          <h4 className="font-semibold mb-2">Last 30 Days Summary</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>Present: {present}</li>
            <li>Absent: {absent}</li>
            <li>Leave: {leave}</li>
            <li>Attendance %: {attendancePct}%</li>
          </ul>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={()=>setToast("")} />}
    </div>
  );
};

/* ----------------------- Attendance Page ----------------------- */
const AttendancePage = ({ auth }) => {
  const { user } = auth;
  const [members, setMembers] = useState(loadFromStorage("gym_members", []));
  const [attendance, setAttendance] = useState(loadFromStorage("gym_attendance", {}));
  const [audit, setAudit] = useState(loadFromStorage("gym_audit", []));
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [toast, setToast] = useState("");

  useEffect(() => saveToStorage("gym_attendance", attendance), [attendance]);
  useEffect(() => saveToStorage("gym_audit", audit), [audit]);

  const activeMembers = members.filter(m => m.status === "active");
  const recForDate = attendance[date] || {};

  const toggleStatus = (memberId) => {
    const cur = recForDate[memberId]?.status || 'Absent';
    const next = cur === 'Present' ? 'Absent' : 'Present';
    const updated = { ...(attendance[date] || {}), [memberId]: { status: next, markedBy: user?.id || 'unknown', markedAt: new Date().toISOString() } };
    setAttendance({ ...attendance, [date]: updated });
  };

  const setStatus = (memberId, status) => {
    const updated = { ...(attendance[date] || {}), [memberId]: { status, markedBy: user?.id || 'unknown', markedAt: new Date().toISOString() } };
    setAttendance({ ...attendance, [date]: updated });
  };

  const markAllPresent = () => {
    const updated = { ...(attendance[date] || {}) };
    activeMembers.forEach(m => updated[m.id] = { status: 'Present', markedBy: user?.id || 'unknown', markedAt: new Date().toISOString() });
    setAttendance({ ...attendance, [date]: updated });
    setToast('All marked present');
  };

  const saveBulk = () => {
    // audit
    const entry = { id: uid(), date, by: user?.id || 'unknown', at: new Date().toISOString() };
    setAudit([entry, ...audit]);
    setToast('Attendance saved');
  };

  const canEditPrevious = user?.role === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendance</h2>
        <div className="flex gap-2 items-center">
          <input type="date" className="p-2 border rounded" value={date} onChange={e=>setDate(e.target.value)} />
          <button className="px-3 py-2 rounded" style={{ backgroundColor: "var(--primary)", color: "white" }} onClick={markAllPresent}>Mark All Present</button>
          <button className="px-3 py-2 rounded border" onClick={saveBulk}>Save</button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow" style={{ border: `1px solid var(--border)` }}>
        <table className="min-w-full">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeMembers.map((m, idx) => {
              const rec = recForDate[m.id];
              const st = rec?.status || 'Absent';
              return (
                <tr key={m.id} className={idx%2===0? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3">{idx+1}</td>
                  <td className="px-4 py-3">{m.name} <div className="text-xs text-gray-400">{m.id}</div></td>
                  <td className="px-4 py-3">{st}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 rounded" onClick={()=>setStatus(m.id, 'Present')}>Present</button>
                      <button className="px-2 py-1 rounded" onClick={()=>setStatus(m.id, 'Absent')}>Absent</button>
                      <button className="px-2 py-1 rounded" onClick={()=>setStatus(m.id, 'Leave')}>Leave</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-500">Audit: last saved by {audit[0]?.by || '—'} at {audit[0]?.at ? new Date(audit[0].at).toLocaleString() : '—'}</div>
      {toast && <Toast message={toast} onClose={()=>setToast("")} />}
    </div>
  );
};

/* ----------------------- Logs Page ----------------------- */
const LogsPage = ({ auth }) => {
  const [attendance] = useState(loadFromStorage("gym_attendance", {}));
  const [members] = useState(loadFromStorage("gym_members", []));
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filterMember, setFilterMember] = useState("");

  const flatten = useMemo(() => {
    const arr = [];
    Object.entries(attendance).forEach(([date, recs]) => {
      Object.entries(recs).forEach(([memberId, rec]) => {
        arr.push({ date, memberId, status: rec.status, markedBy: rec.markedBy, markedAt: rec.markedAt });
      });
    });
    return arr.sort((a,b)=> b.date.localeCompare(a.date));
  }, [attendance]);

  const filtered = flatten.filter(r => {
    if (filterMember && r.memberId !== filterMember) return false;
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    return true;
  });

  const exportCSV = () => {
    const header = ['date','memberId','memberName','status','markedBy','markedAt'];
    const rows = filtered.map(r => [r.date, r.memberId, members.find(m=>m.id===r.memberId)?.name || '', r.status, r.markedBy, r.markedAt]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `attendance_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const totals = filtered.reduce((acc, r) => { acc[r.status] = (acc[r.status]||0)+1; return acc; }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Attendance Logs</h2>
        <div className="flex gap-2">
          <select className="p-2 border rounded" value={filterMember} onChange={e=>setFilterMember(e.target.value)}>
            <option value="">All members</option>
            {members.map(m=> <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
          </select>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="p-2 border rounded" />
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="p-2 border rounded" />
          <button className="px-3 py-2 rounded" style={{ backgroundColor: "var(--primary)", color: "white" }} onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow" style={{ border: `1px solid var(--border)` }}>
        <table className="min-w-full">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Marked By</th>
              <th className="px-4 py-3">At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={`${r.date}-${r.memberId}-${i}`} className={i%2===0? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{members.find(m=>m.id===r.memberId)?.name || r.memberId}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.markedBy}</td>
                <td className="px-4 py-3">{r.markedAt ? new Date(r.markedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-600">Totals for selection — Present: {totals['Present']||0}, Absent: {totals['Absent']||0}, Leave: {totals['Leave']||0}</div>
    </div>
  );
};

/* ----------------------- Analytics ----------------------- */
const AnalyticsPage = ({ auth }) => {
  const members = loadFromStorage("gym_members", []);
  const attendance = loadFromStorage("gym_attendance", {});

  // daily active members for last 14 days
  const days = [...Array(14)].map((_, i)=>{
    const d = new Date(); d.setDate(d.getDate() - (13 - i)); const k = d.toISOString().slice(0,10);
    const rec = attendance[k] || {}; const p = Object.values(rec).filter(r=>r.status==='Present').length; return { date: k.slice(5), present: p };
  });

  // weekly attendance bar chart (last 4 weeks)
  const weeks = [...Array(4)].map((_, wi)=>{
    const end = new Date(); end.setDate(end.getDate() - (wi*7));
    const start = new Date(end); start.setDate(end.getDate()-6);
    let present=0; let total=0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)){
      const k = d.toISOString().slice(0,10);
      const rec = attendance[k] || {}; present += Object.values(rec).filter(r=>r.status==='Present').length; total += Object.keys(rec).length;
    }
    return { label: `${start.toISOString().slice(5,10)}-${end.toISOString().slice(5,10)}`, present };
  }).reverse();

  // member-wise attendance %
  const memberStats = members.map(m=>{
    let total=0, present=0;
    Object.values(attendance).forEach(day=>{ if (day[m.id]) { total++; if (day[m.id].status==='Present') present++; }});
    const pct = total? Math.round((present/total)*100) : 0; return { id: m.id, name: m.name, pct, present, total };
  }).sort((a,b)=> b.pct - a.pct);

  const top5 = memberStats.slice(0,5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold mb-3">Daily Active Members (14 days)</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={days}><XAxis dataKey="date"/><YAxis/><Tooltip/><Line dataKey="present" stroke="var(--primary)"/></LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold mb-3">Weekly Attendance (last 4 weeks)</h3>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeks}><XAxis dataKey="label"/><YAxis/><Tooltip/><Bar dataKey="present" fill="var(--secondary)"/></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow col-span-2" style={{ backgroundColor: "var(--card)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold mb-3">Top 5 Most Consistent Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {top5.map(m=> (
            <div key={m.id} className="p-3 rounded" style={{ border: `1px solid var(--border)` }}>
              <div className="text-sm text-gray-500">{m.name}</div>
              <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{m.pct}%</div>
              <div className="text-xs text-gray-400">{m.present}/{m.total || 0} present</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ----------------------- Root App ----------------------- */
const App = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const handleLogout = () => {
    auth.setUser(null);
    navigate('/login');
  };

  useEffect(()=>{
    if (!auth.user) navigate('/login');
  }, []);

  return (
    <AppShell auth={auth} onLogout={handleLogout}>
      <Routes>
        <Route path="/login" element={<LoginPage auth={auth} />} />
        <Route path="/dashboard" element={auth.user ? <Dashboard auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/members" element={auth.user ? <MembersPage auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/members/:id" element={auth.user ? <MemberProfile auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={auth.user ? <AttendancePage auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/logs" element={auth.user ? <LogsPage auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={auth.user ? <AnalyticsPage auth={auth} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>

      {toast && <Toast message={toast} onClose={()=>setToast("")} />}
    </AppShell>
  );
};

/* ----------------------- Root render (export default) ----------------------- */
export default function RootApp(){
  return (
    <Router>
      <App />
    </Router>
  );
}
