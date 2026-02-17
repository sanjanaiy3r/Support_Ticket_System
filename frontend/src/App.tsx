import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000/api";

export default function App() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("low");

  const [loadingClassify, setLoadingClassify] = useState(false);

  // -----------------------------
  // FETCH TICKETS
  // -----------------------------
  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/tickets/`);
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // -----------------------------
  // FETCH STATS
  // -----------------------------
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/tickets/stats/`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  // -----------------------------
  // CLASSIFY DESCRIPTION
  // -----------------------------
  const classifyTicket = async () => {
    if (!description.trim()) return;

    try {
      setLoadingClassify(true);

      const res = await fetch(`${API_BASE}/tickets/classify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        console.error("Classification failed:", res.status);
        return;
      }

      const data = await res.json();

      if (data.suggested_category) {
        setCategory(data.suggested_category);
      }

      if (data.suggested_priority) {
        setPriority(data.suggested_priority);
      }

    } catch (error) {
      console.error("Error classifying ticket:", error);
    } finally {
      setLoadingClassify(false);
    }
  };

  // -----------------------------
  // SUBMIT TICKET
  // -----------------------------
  const submitTicket = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      await fetch(`${API_BASE}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          status: "open",
        }),
      });

      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("low");

      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  // -----------------------------
  // UPDATE STATUS
  // -----------------------------
  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`${API_BASE}/tickets/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div style={{ padding: 30 }}>
      <h1>Support Ticket System</h1>

      <h2>Create Ticket</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      
      <textarea
  placeholder="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="billing">Billing</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
        <option value="general">General</option>
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <br /><br />
      <button onClick={submitTicket}>Submit</button>

      <hr />

      <h2>Tickets</h2>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10,
          }}
        >
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>Category: {ticket.category}</p>
          <p>Priority: {ticket.priority}</p>
          <p>Status: {ticket.status}</p>

          <select
            value={ticket.status}
            onChange={(e) => updateStatus(ticket.id, e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}

      <hr />

      <h2>Stats</h2>

      {stats && (
        <div>
          <p>Total Tickets: {stats.total_tickets}</p>
          <p>Open Tickets: {stats.open_tickets}</p>
          <p>Avg per Day: {stats.avg_tickets_per_day}</p>

          <pre>{JSON.stringify(stats.priority_breakdown, null, 2)}</pre>
          <pre>{JSON.stringify(stats.category_breakdown, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
