import { useState, useMemo } from "react";
import { FiClipboard, FiPlus } from "react-icons/fi";
import { useData } from "../context/DataContext";
import TaskHeader from "../components/tasks/TaskHeader";
import TaskStats from "../components/tasks/TaskStats";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskForm from "../components/tasks/TaskForm";
import { TASK_CATEGORIES } from "../data/taskCategories";
import TaskList from "../components/tasks/TaskList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getTaskStatus } from "../utils/taskStatus";

export default function PersonalTasks() {
  const { personalTasks = [] } = useData();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "completed" | "overdue"
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    return personalTasks.filter((task) => {
      const status = getTaskStatus(task);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && status === "pending") ||
        (statusFilter === "completed" && status === "completed") ||
        (statusFilter === "overdue" && status === "overdue");

      const matchesCategory =
        categoryFilter === "All" || task.category === categoryFilter;

      return matchesStatus && matchesCategory;
    });
  }, [personalTasks, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <TaskHeader
        showForm={showForm}
        onNewTask={() => setShowForm((prev) => !prev)}
      />

      {/* KPI Stats */}
      <TaskStats tasks={personalTasks} />

      {/* New Task Form */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* Filter Toolbar */}
      <Card className="p-4 bg-ink-800/80 animate-fadeUp">
        <TaskFilters
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          activeCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={TASK_CATEGORIES}
        />
      </Card>

      {/* Task List */}
      <Card className="p-5 sm:p-6 animate-fadeUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-parchment-50">
            {statusFilter === "all"
              ? "All Tasks"
              : statusFilter === "pending"
              ? "Pending Tasks"
              : statusFilter === "completed"
              ? "Completed Tasks"
              : "Overdue Tasks"}
            <span className="text-xs text-parchment-400 font-mono ml-2 font-normal">
              ({filteredTasks.length})
            </span>
          </h2>

          {!showForm && (
            <Button
              variant="secondary"
              icon={FiPlus}
              onClick={() => setShowForm(true)}
              className="text-xs py-1.5 px-3"
            >
              Add Task
            </Button>
          )}
        </div>

        <TaskList
          tasks={filteredTasks}
          showDate
          emptyIcon={FiClipboard}
          emptyTitle={
            statusFilter === "completed"
              ? "No completed tasks yet"
              : statusFilter === "overdue"
              ? "No overdue tasks"
              : "No tasks found"
          }
          emptyBody={
            personalTasks.length === 0
              ? "You haven't created any personal study tasks yet. Click '+ New Task' above to get started."
              : "No tasks match the selected filter criteria."
          }
        />
      </Card>
    </div>
  );
}