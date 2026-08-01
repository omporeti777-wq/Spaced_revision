import { useState } from "react";
import { useData } from "../../context/DataContext";

const CATEGORIES = [
  "Study",
  "College",
  "Personal",
  "Health",
  "Finance",
  "Other",
];

const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskForm() {
  const { addPersonalTask } = useData();

  const [form, setForm] = useState({
    title: "",
    category: "Personal",
    priority: "Medium",
    deadline: "",
    deadlineTime: "",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return;

    addPersonalTask(form);

    setForm({
      title: "",
      category: "Personal",
      priority: "Medium",
      deadline: "",
      deadlineTime: "",
      notes: "",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="title"
        placeholder="Task title..."
        value={form.title}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <div className="grid grid-cols-2 gap-3">

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="rounded-lg border p-3"
        >
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="rounded-lg border p-3"
        />

        <input
          type="time"
          name="deadlineTime"
          value={form.deadlineTime}
          onChange={handleChange}
          className="rounded-lg border p-3"
        />

      </div>

      <textarea
        rows="4"
        name="notes"
        placeholder="Notes..."
        value={form.notes}
        onChange={handleChange}
        className="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-3 text-white"
      >
        Add Task
      </button>

    </form>
  );
}