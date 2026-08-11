'use client';

import React, { useState } from 'react';

// Your specified Australian school task categories
const TASK_CATEGORIES = [
  { id: 'marking', label: 'Marking', description: 'Assessment grading & feedback' },
  { id: 'dis_and_inc', label: 'Disability and Inclusion', description: 'ILP updates, documentation, & differentiation' },
  { id: 'compass', label: 'Compass', description: 'Chronicle entries, attendance, school admin' },
  { id: 'planning', label: 'Planning', description: 'Unit/lesson prep & resource creation' },
  { id: 'google_sites', label: 'Google Sites', description: 'Class site maintenance & digital learning spaces' },
  { id: 'parent', label: 'Parent Communication', description: 'Calling, emailing, or corresponding with parents' }
];

export default function MultiFieldWorkloadLogger() {
  // Store time spent in minutes for each task ID
  const [taskTimes, setTaskTimes] = useState<Record<string, number>>({
    marking: 0,
    dis_and_inc: 0,
    compass: 0,
    planning: 0,
    google_sites: 0,
    parent: 0,
  });

  const [neglectedDuties, setNeglectedDuties] = useState('');

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

  // Compute total time across all fields
  const totalMinutes = Object.values(taskTimes).reduce((acc, val) => acc + val, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Teacher Workload Logger</h1>
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
            const currentMins = taskTimes[task.id] || 0;
            return (
              <div 
                key={task.id} 
                className={`p-4 border transition-colors ${
                  currentMins > 0 ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <label className="font-medium text-sm text-slate-800">{task.label}</label>
                  <span className="font-mono font-bold text-sm text-blue-700">
                    {formatTime(currentMins)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{task.description}</p>

                {/* Range Slider Control */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="240" // Max 8 hours (480 mins)
                    step="15"  // Moves in 15-minute intervals
                    value={currentMins}
                    onChange={(e) => handleSliderChange(task.id, Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
      </div>

      {/* Neglected Duties Section */}
      <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-4">
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