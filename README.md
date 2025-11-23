# Scheduling Visualizer

Scheduling Visualizer is an interactive educational web app that demonstrates CPU and real-time scheduling algorithms using an animated, modern UI. It is intended for students and developers who want to explore how different scheduling policies affect execution order, response times, and deadlines.

Key features

- Visualize scheduling behavior with a Gantt-style timeline.
- Support for both non-preemptive and preemptive CPU scheduling algorithms.
- Simple text-based process input with support for periodic tasks and deadlines.
- Shader-based animated background for an engaging presentation (can be disabled).

Implemented algorithms

- FCFS — First-Come, First-Served (non-preemptive)
- SJF — Shortest Job First (non-preemptive)
- SRTF — Shortest Remaining Time First (preemptive)
- Round Robin — time-sliced preemptive scheduling
- Rate Monotonic (RM) — fixed-priority periodic scheduling by period
- Earliest Deadline First (EDF) — dynamic-priority scheduling by earliest absolute deadline

Project layout (important files)

- `src/App.jsx` — top-level router and app wrapper
- `src/main.jsx` — application bootstrap
- `src/pages/RunAlgo.jsx` — UI for entering processes and running algorithms
- `src/pages/Home.jsx`, `src/pages/About.jsx` — informational pages
- `src/components/GanttChart.jsx` — renders the timeline visualization
- `src/components/DiskCylinder.jsx` — simple process list / indicator used alongside the chart
- `src/components/FaultyTerminal.jsx` — shader-based animated background (optional)
- `src/algorithms/*` — scheduling implementations (each algorithm in its own module)

Input format (Run page)

Enter one process per line using the following CSV-like format:

```
pid,arrival,burst[,period][,deadline]
```

Examples

- `P1,0,5` — process P1 arrives at time 0 and needs 5 units of CPU
- `P2,2,3` — process P2 arrives at time 2 and needs 3 units of CPU
- `T1,0,2,10` — periodic task T1: arrival 0, burst 2, period 10
- `J1,0,4,,8` — job J1: arrival 0, burst 4, hard deadline at time 8 (period omitted)

When using Round Robin, also set the `Quantum` value in the UI.

How it works (high-level)

- The app parses the input processes and builds a timeline of execution segments according to the selected scheduling algorithm.
- For preemptive algorithms (SRTF, Round Robin, RM, EDF) the scheduler simulates time in small steps and produces contiguous execution segments for each process; these are merged for display.
- RM and EDF implementations support periodic jobs by expanding releases up to a simulation horizon.

Running the project locally

Requirements

- Node.js (recommended: 20.19+ or 22.12+)
- npm

Install and run:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`). If Vite warns about Node.js version, upgrade Node to the recommended version.

Customization & performance

- The animated background is powered by WebGL/GLSL in `src/components/FaultyTerminal.jsx`. If you notice high GPU usage, you can disable or remove that component in `src/components/Layout.jsx`.
- Visualization options such as colors, segment collapsing, and zoom are good candidates for future enhancement.

Limitations and intended use

- The scheduling implementations are designed for teaching and demonstration. They are not intended as production-grade real-time schedulers.
- RM and EDF assume reasonable `period` and `deadline` inputs and simulate up to a fixed horizon; adjust the horizon if you need longer simulations.

Contributing

Contributions are welcome. Suggested improvements:

- Add example presets for each algorithm on the Run page.
- Add unit tests for algorithm correctness and edge cases.
- Improve the visualization (PID colors, merged segments, zoom, interactive cursor).

License

This project is provided as-is for learning and demonstration. Add a license file if you plan to share or distribute it commercially.

Questions or next steps

If you'd like, I can add example presets to the Run page, improve the chart visuals, or add unit tests for the algorithms.


