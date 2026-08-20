"use client";

import React, { useState } from "react";

// Your specified Australian school task categories
const TASK_CATEGORIES = [
  {
    id: "prep_and_logistics",
    label: "Classroom Prep & Logistics",
    description:
      "Printing, materials, seating plans, digital learning spaces, and physical class setup",
  },
  {
    id: "curriculum_planning",
    label: "Curriculum & Event Planning",
    description:
      "Lesson/unit prep, resource creation, face-to-face planning, & custom event/disruption planning",
  },
  {
    id: "marking_and_feedback",
    label: "Marking & Assessment",
    description: "Assessment grading, feedback, and student evaluation",
  },
  {
    id: "disability_and_inclusion",
    label: "Disability & Inclusion",
    description:
      "ILP updates, documentation, accessibility adjustments, & specialized support",
  },
  {
    id: "wellbeing_and_behaviour",
    label: "Wellbeing & Behaviour Management",
    description:
      "Restoratives, positive education, pastoral care, & student behaviour management",
  },
  {
    id: "parent_comm",
    label: "Parent Communication",
    description: "Calling, emailing, or corresponding with parents/carers",
  },
  {
    id: "staff_comm",
    label: "Staff Communication",
    description:
      "Staff emails, department/all-staff meetings, & internal collaboration",
  },
  {
    id: "admin_and_edupay",
    label: "School Admin & Compliance",
    description:
      "Chronicle entries, attendance, leave, eduPay, & general school admin",
  },
];

export default function MultiFieldWorkloadLogger() {
  // Store time spent in minutes for each task ID
  const [taskTimes, setTaskTimes] = useState<Record<string, number>>({
    prep_and_logistics: 0,
    curriculum_planning: 0,
    marking_and_feedback: 0,
    disability_and_inclusion: 0,
    wellbeing_and_behaviour: 0,
    parent_comm: 0,
    staff_comm: 0,
    admin_and_edupay: 0,
  });

  // Store face-to-face teaching hours
  const [teachingHours, setTeachingHours] = useState<number>(0);

  const [neglectedDuties, setNeglectedDuties] = useState("");

  // Handle direct changes from the range slider
  const handleSliderChange = (taskId: string, minutes: number) => {
    setTaskTimes((prev) => ({
      ...prev,
      [taskId]: minutes,
    }));
  };

  // Convert minutes into readable hours + mins format
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  // Compute total time across all fields (out-of-class + teaching)
  const taskMinutes = Object.values(taskTimes).reduce(
    (acc, val) => acc + val,
    0,
  );
  const totalMinutes = taskMinutes;

  const handleSubmit = async () => {
    // Explicitly parse values to guarantee number types
    const formattedTaskTimes: Record<string, number> = {};
    Object.keys(taskTimes).forEach((key) => {
      formattedTaskTimes[key] = Number(taskTimes[key]) || 0;
    });

    const payload = {
      taskTimes: formattedTaskTimes, // Object of numerical task durations (in minutes)
      teachingHours: Number(teachingHours) * 60 || 0, // Number representation of teaching hours
      neglectedDuties: neglectedDuties.trim(), // String text input
      submittedAt: new Date().toISOString(),
    };

    console.log("Submitting payload:", payload);

    // Replace this section with your API endpoint POST request (e.g., fetch('/api/log', ...))
    //alert("Log submitted successfully!\n" + payload);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Teacher Workload Logger
        </h1>
      </header>

      {/* Main Horizontal Layout Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Sliders Section (Takes up 2/3 space on large screens) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-700">
              Allocated Task Time
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-full">
              Total Today: {formatTime(totalMinutes)}
            </span>
          </div>

          {/* Task Category Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASK_CATEGORIES.map((task) => {
              const currentMins = taskTimes[task.id] || 0;
              return (
                <div
                  key={task.id}
                  className={`p-4 border transition-colors ${
                    currentMins > 0
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <label className="font-medium text-sm text-slate-800">
                      {task.label}
                    </label>
                    <span className="font-mono font-bold text-sm text-red-700">
                      {formatTime(currentMins)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    {task.description}
                  </p>

                  {/* Range Slider Control */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max="240"
                      step="15"
                      value={currentMins}
                      onChange={(e) =>
                        handleSliderChange(task.id, Number(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>0m</span>
                      <span>1h</span>
                      <span>2h</span>
                      <span>3h</span>
                      <span>4h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Face-to-Face Teaching Hours Slider */}
        </div>

        {/* Right Column: Neglected Duties + Submit (Takes up 1/3 space & stays sticky on scroll) */}
        <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-4 lg:sticky lg:top-6">
          <div
            className={`p-4 border transition-colors ${
              teachingHours > 0
                ? "border-indigo-200 bg-indigo-50/30"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <label className="font-medium text-sm text-slate-800">
                Face-to-Face Teaching Hours
              </label>
              <span className="font-mono font-bold text-sm text-indigo-700">
                {teachingHours} {teachingHours === 1 ? "hour" : "hours"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Direct classroom instruction and duty time
            </p>

            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={teachingHours}
                onChange={(e) => setTeachingHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>0h</span>
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h</span>
                <span>5h</span>
                <span>6h</span>
              </div>
            </div>
          </div>
          <h2 className="text-base font-semibold text-slate-700">
            Duties Deprioritised / Neglected
          </h2>
          <p className="text-xs text-slate-500">
            Describe any essential tasks you did not have time to complete
            today.
          </p>
          <textarea
            value={neglectedDuties}
            onChange={(e) => setNeglectedDuties(e.target.value)}
            placeholder="e.g., Lacked time to log admin chronicle notes for student behavior in Period 4, and couldn't update Google Sites unit page..."
            className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 h-48 resize-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition cursor-pointer"
          >
            Submit Daily Log
          </button>
        </div>
      </div>
    </div>
  );
}
