export default function TaskFilters() {
  return (
    <div className="flex gap-3 flex-wrap">
      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
        All
      </button>

      <button className="px-4 py-2 rounded-lg bg-gray-700 text-white">
        Pending
      </button>

      <button className="px-4 py-2 rounded-lg bg-gray-700 text-white">
        Completed
      </button>

      <button className="px-4 py-2 rounded-lg bg-gray-700 text-white">
        Overdue
      </button>
    </div>
  );
}