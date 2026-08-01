import { getTaskStatus } from "../../utils/taskStatus";
export default function TaskStats({ tasks }) {
  const total = tasks.length;
const completed = tasks.filter(
  (task) => getTaskStatus(task) === "completed"
).length;

const pending = tasks.filter(
  (task) => getTaskStatus(task) === "pending"
).length;

const overdue = tasks.filter(
  (task) => getTaskStatus(task) === "overdue"
).length;

  const cards = [
    { title: "Total", value: total },
    { title: "Pending", value: pending },
    { title: "Completed", value: completed },
    { title: "Overdue", value: overdue },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-ink-600 bg-ink-800 p-5"
        >
          <p className="text-sm text-gray-400">{card.title}</p>

          <h2 className="text-3xl font-bold mt-2 text-white">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}