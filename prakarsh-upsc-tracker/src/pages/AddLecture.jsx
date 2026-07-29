import { useState } from "react";
import Card from "../components/ui/Card";
import LectureForm from "../components/lecture/LectureForm";

export default function AddLecture() {
  const [lastSaved, setLastSaved] = useState(null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-display font-semibold text-parchment-50">Add a lecture</h1>
        <p className="text-sm text-parchment-500 mt-1">
          Log a lecture once — the full revision schedule is generated for you.
        </p>
      </div>

      <Card className="p-6 sm:p-8 animate-fadeUp" style={{ animationDelay: "80ms" }}>
        <LectureForm onSaved={setLastSaved} />
      </Card>

      {lastSaved && (
        <Card className="p-5 animate-fadeUp border-teal-600/40">
          <p className="text-sm text-parchment-300">
            <span className="text-teal-300 font-medium">{lastSaved.lectureName}</span> saved under{" "}
            <span className="text-parchment-100">{lastSaved.subject}</span>. Its revisions now appear on the
            Calendar and will surface under Today's Tasks when due.
          </p>
        </Card>
      )}
    </div>
  );
}
