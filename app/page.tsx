'use client';

import React, { useState } from 'react';

// Your specified Australian school task categories
const TASK_CATEGORIES = [
  { id: 'marking', label: 'Marking', description: 'Assessment grading & feedback' },
  { id: 'ilp', label: 'ILP Management', description: 'Individual Learning Plan updates & documentation' },
  { id: 'compass', label: 'Compass', description: 'Chronicle entries, attendance, school admin' },
  { id: 'behaviour', label: 'Student Behaviour Management', description: 'Incident logging, follow-ups, restorative talks' },
  { id: 'planning', label: 'Planning', description: 'Unit/lesson prep & resource creation' },
  { id: 'google_sites', label: 'Google Sites', description: 'Class site maintenance & digital learning spaces' },
];

export default function MultiFieldWorkloadLogger() {
  // Store time spent in minutes for each task ID
  const [taskTimes, setTaskTimes] = useState<Record<string, number>>({
    marking: 0,
    ilp: 0,
    compass: 0,
    behaviour: 0,
    planning: 0,
    google_sites: 0,
  });

  const [neglectedDuties, setNeglectedDuties] = useState('');

  // Increment or decrement time in 15-minute increments (min 0)
  const adjustTime = (taskId: string, deltaMinutes: number) => {
    setTaskTimes((prev) => ({
      ...prev,
      [taskId]: Math.max(0, prev[taskId] + deltaMinutes),
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

  // Compute total time across all fields
  const totalMinutes = Object.values(taskTimes).reduce((acc, val) => acc + val, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Teacher Workload Logger</h1>
        <p className="text-slate-500 text-sm">Log time spent outside face-to-face teaching for today.</p>
      </header>

      {/* Main Multi-Field Time Allocation Card */}
      <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6 mb-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="text-base font-semibold text-slate-700">Allocated Task Time</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            Total Today: {formatTime(totalMinutes)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TASK_CATEGORIES.map((task) => {
            const currentMins = taskTimes[task.id];
            return (
              <div 
                key={task.id} 
                className={`p-4 border transition-colors ${
                  currentMins > 0 ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <label className="font-medium text-sm text-slate-800">{task.label}</label>
                  <span className="font-mono font-bold text-sm text-slate-700">
                    {formatTime(currentMins)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{task.description}</p>

                {/* Quick-adjustment button row */}
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => adjustTime(task.id, -30)}
                    disabled={currentMins === 0}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded text-xs font-semibold text-slate-600"
                  >
                    -30m
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustTime(task.id, -15)}
                    disabled={currentMins === 0}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded text-xs font-semibold text-slate-600"
                  >
                    -15m
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustTime(task.id, 15)}
                    className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-semibold"
                  >
                    +15m
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustTime(task.id, 30)}
                    className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-semibold"
                  >
                    +30m
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Neglected Duties Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-700">Duties Deprioritised / Neglected</h2>
        <p className="text-xs text-slate-500">
          Describe any essential tasks you did not have time to complete today.
        </p>
        <textarea
          value={neglectedDuties}
          onChange={(e) => setNeglectedDuties(e.target.value)}
          placeholder="e.g., Lacked time to log Compass chronicle notes for student behavior in Period 4, and couldn't update Google Sites unit page..."
          className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px]"
        />

        <button
          type="button"
          onClick={() => alert('Log submitted successfully!')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition"
        >
          Submit Daily Log
        </button>
      </div>
    </div>
  );
}