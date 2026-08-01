
import { useData } from "../context/DataContext";
import TaskForm from "../components/tasks/TaskForm";
import { useState } from "react";
import TaskHeader from "../components/tasks/TaskHeader";
import TaskStats from "../components/tasks/TaskStats";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";

export default function PersonalTasks() {
  const { personalTasks } = useData();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8">

      <TaskHeader
  onNewTask={() => setShowForm((prev) => !prev)}
/>

<TaskStats tasks={personalTasks} />

<TaskFilters />

      {showForm && <TaskForm />}

      <hr className="border-gray-700" />

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Tasks
        </h2>

       <TaskList tasks={personalTasks} />
      </div>

    </div>
  );
}