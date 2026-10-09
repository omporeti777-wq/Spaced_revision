import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "../../data/taskCategories";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function TaskForm({ onClose }) {
  const { addPersonalTask } = useData();

  const [form, setForm] = useState({
    title: "",
    category: "Study",
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
      category: "Study",
      priority: "Medium",
      deadline: "",
      deadlineTime: "",
      notes: "",
    });

    onClose?.();
  }

  return (
    <Card className="p-5 sm:p-6 border border-ink-600 bg-ink-800/90 shadow-card animate-fadeUp">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-parchment-50 text-base">
          Create New Task
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-parchment-400 hover:text-parchment-100 p-1"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Task Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Solve GS-1 mock test questions 1-50"
            value={form.title}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input-field"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Due Date (Optional)</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="label-text">Due Time (Optional)</label>
            <input
              type="time"
              name="deadlineTime"
              value={form.deadlineTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Notes or Resources</label>
          <textarea
            rows="3"
            name="notes"
            placeholder="Key pages, chapter references, or notes..."
            value={form.notes}
            onChange={handleChange}
            className="input-field resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" icon={FiPlus}>
            Add Task
          </Button>
          {onClose && (
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}