import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ccisduevrkdkeapjetkf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXNkdWV2cmtka2VhcGpldGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTUwNjgsImV4cCI6MjEwMjYzMTA2OH0.usKo15cehyzVdUtkfcOrOYFJ1wF8NX070fHpaYhrBMQ"; // paste full anon key here
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [attendees, setAttendees] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  const fetchAttendees = async () => {
    const { data, error } = await supabase.from("attendees").select("*");
    if (!error) setAttendees(data || []);
  };

  useEffect(() => {
    fetchAttendees();

    const channel = supabase
      .channel("attendees-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "attendees" }, (payload) =>
        setAttendees((prev) => [...prev, payload.new])
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "attendees" }, (payload) =>
        setAttendees((prev) => prev.map((a) => (a.id === payload.new.id ? payload.new : a)))
      )
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "attendees" }, (payload) =>
        setAttendees((prev) => prev.filter((a) => a.id !== payload.old.id))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddAttendee = async () => {
  if (!newName || !newEmail) return;
  const { error } = await supabase
    .from("attendees")
    .insert([{ name: newName, email: newEmail, checked_in: false }]);

  if (!error) {
    await fetchAttendees();     // refresh local state
    setFilter("pending");       // force view to Pending
  } else {
    console.error("Insert error:", error);
  }

  setNewName("");
  setNewEmail("");
};

  const handleCheckIn = async (id) => {
    const { error } = await supabase.from("attendees").update({ checked_in: true }).eq("id", id);
    if (!error) {
      await fetchAttendees();
      // stay on current filter, don’t auto-switch
    }
  };

  const handleRemove = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove attendee "${name}"?`);
    if (confirmDelete) {
      const { error } = await supabase.from("attendees").delete().eq("id", id);
      if (!error) await fetchAttendees();
    }
  };

  const startEdit = (attendee) => {
    setEditingId(attendee.id);
    setEditName(attendee.name);
    setEditEmail(attendee.email);
  };

  const saveEdit = async (id) => {
    const { error } = await supabase
      .from("attendees")
      .update({ name: editName, email: editEmail })
      .eq("id", id);
    if (!error) await fetchAttendees();
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Checked In", "Joined"];
    const rows = attendees.map((a) => [
      a.name,
      a.email,
      a.checked_in ? "Yes" : "No",
      new Date(a.created_at).toLocaleString(),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = attendees.length;
  const checkedIn = attendees.filter((a) => a.checked_in).length;
  const pending = total - checkedIn;

  const filteredAttendees = attendees
    .filter((a) =>
      filter === "checked" ? a.checked_in : filter === "pending" ? !a.checked_in : true
    )
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLast = currentPage * attendeesPerPage;
  const indexOfFirst = indexOfLast - attendeesPerPage;
  const currentAttendees = filteredAttendees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);

  return (
    <div className="dashboard">
      <h1>🎟️ Event Check-In Dashboard</h1>

      <div style={{ marginBottom: "15px", fontWeight: "bold" }}>
        📊 Stats: {pending} pending, {checkedIn} checked in (Total: {total})
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("checked")}>✅ Checked In</button>
        <button onClick={() => setFilter("pending")}>⏳ Pending</button>
        <button onClick={() => setFilter("all")}>📋 All</button>
        <button onClick={fetchAttendees} style={{ marginLeft: "10px" }}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleAddAttendee}>➕ Add Attendee</button>
        <button onClick={exportCSV} style={{ marginLeft: "10px" }}>
          📤 Export CSV
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Joined</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Status</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAttendees.map((a) => (
            <tr key={a.id}>
              {editingId === a.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </td>
                  <td colSpan="2">{new Date(a.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => saveEdit(a.id)}>💾 Save</button>
                    <button onClick={cancelEdit}>❌ Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                  <td>{a.checked_in ? "✅ Checked In" : "⏳ Pending"}</td>
                                    <td>
                    {filter === "pending" && !a.checked_in ? (
                      <>
                        <button onClick={() => handleCheckIn(a.id)}>Check In</button>
                        <button onClick={() => startEdit(a)}>✏️ Edit</button>
                        <button onClick={() => handleRemove(a.id, a.name)}>🗑️ Remove</button>
                      </>
                    ) : (
                      <>
                        {!a.checked_in && (
                          <button onClick={() => handleCheckIn(a.id)}>Check In</button>
                        )}
                        <button onClick={() => startEdit(a)}>✏️ Edit</button>
                        <button onClick={() => handleRemove(a.id, a.name)}>🗑️ Remove</button>
                      </>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

