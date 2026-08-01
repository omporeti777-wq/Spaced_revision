export default function TaskHeader({ onNewTask }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Personal Tasks
        </h1>

        <p className="text-gray-400 mt-2">
          Stay organized with your daily work and deadlines.
        </p>
      </div>

      <button
        onClick={onNewTask}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
      >
        + New Task
      </button>

    </div>
  );
}   