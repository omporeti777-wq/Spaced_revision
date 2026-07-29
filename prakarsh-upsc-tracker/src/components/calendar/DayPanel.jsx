import Modal from "../ui/Modal";
import TaskList from "../tasks/TaskList";
import { friendlyDate } from "../../utils/dateHelpers";
import { FiCalendar } from "react-icons/fi";

export default function DayPanel({ date, tasks, onClose }) {
  return (
    <Modal open={!!date} onClose={onClose} title={date ? friendlyDate(date) : ""} side>
      <TaskList
        tasks={tasks}
        emptyIcon={FiCalendar}
        emptyTitle="No revisions scheduled"
        emptyBody="Nothing was scheduled to be learned or revised on this date."
      />
    </Modal>
  );
}
