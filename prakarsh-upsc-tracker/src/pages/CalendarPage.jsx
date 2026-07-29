import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import DayPanel from "../components/calendar/DayPanel";

export default function CalendarPage() {
  const { tasks, subjects } = useData();
  const [selectedDate, setSelectedDate] = useState(null);

  const events = useMemo(
    () =>
      tasks.map((t) => {
        const subject = subjects.find((item) => item.id === t.subjectId);
        return {
          id: t.id,
          title: `${t.label}: ${t.lectureName}`,
          date: t.date,
          backgroundColor: subject?.color || "#8B9296",
          extendedProps: { task: t },
        };
      }),
    [tasks, subjects]
  );

  const tasksForSelected = useMemo(() => {
    if (!selectedDate) return [];
    return tasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => a.revisionNumber - b.revisionNumber);
  }, [selectedDate, tasks]);

  return (
    <div className="space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-display font-semibold text-parchment-50">Calendar</h1>
        <p className="text-sm text-parchment-500 mt-1">
          Every revision your lectures generate, laid out on the month. Click any date to see the details.
        </p>
      </div>

      <Card className="p-3 sm:p-5 animate-fadeUp" style={{ animationDelay: "80ms" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          dayMaxEvents={3}
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          dateClick={(info) => setSelectedDate(info.dateStr)}
          eventClick={(info) => setSelectedDate(dayjs(info.event.startStr).format("YYYY-MM-DD"))}
          eventContent={(arg) => (
            <div className="px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate w-full"
                 style={{ background: `${arg.event.backgroundColor}22`, color: arg.event.backgroundColor }}>
              {arg.event.title}
            </div>
          )}
        />
      </Card>

      <DayPanel date={selectedDate} tasks={tasksForSelected} onClose={() => setSelectedDate(null)} />
    </div>
  );
}
