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
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

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

  const isWeekly = viewMode === "weekly";

  // Mode configuration settings
  const modeConfig = {
    taskMax: isWeekly ? 900 : 180, // 15 hours (weekly) vs 3 hours (daily)
    taskStep: isWeekly ? 30 : 15, // 30-min steps (weekly) vs 15-min steps (daily)
    taskTicks: isWeekly
      ? ["0h", "5h", "10h", "15h"]
      : ["0m", "1h", "2h", "3h"],
    teachingMax: isWeekly ? 20 : 6, // 20 hours (weekly) vs 6 hours (daily)
    teachingStep: 0.5,
    teachingTicks: isWeekly
      ? ["0h", "5h", "10h", "15h", "20h"]
      : ["0h", "1h", "2h", "3h", "4h", "5h", "6h"],
  };

  // Switch tab and automatically rescale existing values roughly to fit new mode
  const handleModeChange = (mode: "daily" | "weekly") => {
    if (mode === viewMode) return;

    if (mode === "weekly") {
      // Scale daily inputs up to weekly (~5x)
      setTaskTimes((prev) => {
        const updated: Record<string, number> = {};
        Object.keys(prev).forEach((key) => {
          updated[key] = Math.min(1200, prev[key] * 5);
        });
        return updated;
      });
      setTeachingHours((prev) => Math.min(30, prev * 5));
    } else {
      // Scale weekly inputs down to daily (/5)
      setTaskTimes((prev) => {
        const updated: Record<string, number> = {};
        Object.keys(prev).forEach((key) => {
          updated[key] = Math.min(240, Math.round((prev[key] / 5) / 15) * 15);
        });
        return updated;
      });
      setTeachingHours((prev) => Math.min(6, Math.round((prev / 5) * 2) / 2));
    }

    setViewMode(mode);
  };

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

  // Compute total time across all task fields
  const taskMinutes = Object.values(taskTimes).reduce(
    (acc, val) => acc + val,
    0
  );
  const totalMinutes = taskMinutes;

  const handleSubmit = async () => {
    const formattedTaskTimes: Record<string, number> = {};
    Object.keys(taskTimes).forEach((key) => {
      formattedTaskTimes[key] = Number(taskTimes[key]) || 0;
    });

    const payload = {
      mode: viewMode,
      taskTimes: formattedTaskTimes, // Task durations in minutes
      teachingHours: Number(teachingHours) * 60 || 0, // Teaching duration converted to minutes
      neglectedDuties: neglectedDuties.trim(),
      submittedAt: new Date().toISOString(),
    };

    console.log("Submitting payload:", payload);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Teacher Workload Logger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track classroom and administrative time allocation
          </p>
        </div>

        {/* Animated Daily / Weekly Toggle Switcher */}
        <div className="relative inline-flex p-1 bg-slate-200/80 rounded-lg self-start sm:self-auto select-none">
          {/* Animated Sliding Background Pill */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300 ease-out ${
              isWeekly ? "translate-x-full" : "translate-x-0"
            }`}
          />

          <button
            type="button"
            onClick={() => handleModeChange("daily")}
            className={`relative z-10 w-28 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              !isWeekly ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Daily Mode
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("weekly")}
            className={`relative z-10 w-28 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              isWeekly ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Weekly Mode
          </button>
        </div>
      </header>

      {/* Main Horizontal Layout Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Sliders Section */}
        <div className="lg:col-span-2 bg-white border border-slate-200  p-6 space-y-6 ">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-700">
              Allocated Task Time ({isWeekly ? "Weekly" : "Daily"})
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 ">
              Total {isWeekly ? "This Week" : "Today"}: {formatTime(totalMinutes)}
            </span>
          </div>

          {/* Task Category Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASK_CATEGORIES.map((task) => {
              const currentMins = taskTimes[task.id] || 0;
              return (
                <div
                  key={task.id}
                  className={`p-4 border  transition-colors ${
                    currentMins > 0
                      ? "border-red-200 bg-white"
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

                  {/* Dynamic Range Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="0"
                      max={modeConfig.taskMax}
                      step={modeConfig.taskStep}
                      value={currentMins}
                      onChange={(e) =>
                        handleSliderChange(task.id, Number(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200  appearance-none cursor-pointer accent-red-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      {modeConfig.taskTicks.map((tick, idx) => (
                        <span key={idx}>{tick}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Teaching Hours + Neglected Duties + Submit */}
        <div className="bg-white border border-slate-200  p-6 space-y-4  lg:sticky lg:top-6">
          <div
            className={`p-4 border  transition-colors ${
              teachingHours > 0
                ? "border-amber-400 bg-white"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <label className="font-medium text-sm text-slate-800">
                Face-to-Face Teaching ({isWeekly ? "Weekly" : "Daily"})
              </label>
              <span className="font-mono font-bold text-sm text-amber-700">
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
                max={modeConfig.teachingMax}
                step={modeConfig.teachingStep}
                value={teachingHours}
                onChange={(e) => setTeachingHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-200  appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                {modeConfig.teachingTicks.map((tick, idx) => (
                  <span key={idx}>{tick}</span>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-base font-semibold text-slate-700">
            Duties Deprioritised / Neglected
          </h2>
          <p className="text-xs text-slate-500">
            Describe any essential tasks you did not have time to complete{" "}
            {isWeekly ? "this week" : "today"}.
          </p>
          <textarea
            value={neglectedDuties}
            onChange={(e) => setNeglectedDuties(e.target.value)}
            placeholder={
              isWeekly
                ? "e.g., Lacked time to complete term planning notes and had to push back parent calls for Year 9..."
                : "e.g., Lacked time to log admin chronicle notes for student behavior in Period 4..."
            }
            className="w-full p-3 border border-slate-200  text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 h-48 resize-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium   transition cursor-pointer"
          >
            Submit {isWeekly ? "Weekly" : "Daily"} Log
          </button>
        </div>
      </div>
    </div>
  );
}