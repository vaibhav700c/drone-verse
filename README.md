# Drone Verse

Drone Verse is a multi-part repository that combines a modern drone operations dashboard with an AI-powered corrosion detection demo. The project is designed to showcase how fleet monitoring, inspection workflows, environmental analytics, and computer vision can work together in one ecosystem.

## Overview

This workspace contains two complementary systems:

- [drone-portal](drone-portal): A polished Next.js web application for monitoring drones, inspections, maintenance, alerts, and environmental data.
- [computer_vision_and_corrosion](computer_vision_and_corrosion): A Python-based computer vision utility that uses a YOLO model to detect corrosion from a live webcam feed.

Together, they represent a practical concept for smart infrastructure inspection and drone fleet operations.

---

## What the project does

### 1. Drone operations portal
The portal provides a high-level monitoring experience for a drone fleet. It includes a dashboard with:

- live-style fleet metrics
- drone location maps
- VOC trend charts
- maintenance tracking
- inspection reports
- alert management
- user administration

The UI is built as a demo-style management console and uses mock data to simulate a real operations environment.

### 2. Corrosion detection demo
The computer vision component uses YOLOv8 to process webcam frames and highlight potential corrosion regions in real time. This is a useful prototype for visual inspection workflows in industrial or infrastructure contexts.

---

## Repository structure

```text
drone-verse/
├── README.md
├── computer_vision_and_corrosion/
│   ├── best.pt
│   └── run.py
└── drone-portal/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── loading.tsx
    │   └── page.tsx
    ├── components/
    │   ├── alerts-panel.tsx
    │   ├── drone-map.tsx
    │   ├── drone-table.tsx
    │   ├── inspection-reports.tsx
    │   ├── maintenance-tracker.tsx
    │   ├── navigation-header.tsx
    │   ├── performance-metrics.tsx
    │   ├── task-scheduler.tsx
    │   ├── theme-provider.tsx
    │   ├── user-management.tsx
    │   ├── voc-chart.tsx
    │   └── ui/
    ├── hooks/
    ├── lib/
    ├── public/
    ├── styles/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── next.config.mjs
    ├── postcss.config.mjs
    └── tsconfig.json
```

---

## The web portal in detail

### Main application entry
The main UI is rendered from [drone-portal/app/page.tsx](drone-portal/app/page.tsx). It acts as the control center for the dashboard experience.

It includes:

- a top navigation header
- a tab-based layout for the major modules
- stat cards for fleet performance
- a VOC chart panel
- a drone map panel
- AI insight cards

### Key portal modules

#### Dashboard
The dashboard provides an overview of the entire system using summary cards and charts. It is designed to feel like an operations control room and includes metrics such as:

- active drones
- total flight hours
- alerts today
- average battery level

#### Drone map
The map experience is built with Leaflet and rendered inside [drone-portal/components/drone-map.tsx](drone-portal/components/drone-map.tsx). It can display:

- drone positions as map markers
- drone status colors
- popup details for each drone
- a heatmap-style VOC overlay

#### Drone fleet table
The fleet management view in [drone-portal/components/drone-table.tsx](drone-portal/components/drone-table.tsx) lets users:

- search drones
- filter by status
- add new drones
- edit fleet information
- remove drones
- export fleet data as CSV
- issue actions such as return to base or emergency landing

#### Inspection reports
The inspection workflow in [drone-portal/components/inspection-reports.tsx](drone-portal/components/inspection-reports.tsx) allows users to:

- review inspection findings
- filter by severity
- create new reports
- view detailed report information
- export reports
- update status and plan follow-up work

#### Maintenance tracker
The maintenance interface in [drone-portal/components/maintenance-tracker.tsx](drone-portal/components/maintenance-tracker.tsx) shows scheduled tasks and helps manage work orders for:

- routine inspections
- battery replacements
- propeller service
- software updates
- other maintenance types

#### Performance analytics
The performance section in [drone-portal/components/performance-metrics.tsx](drone-portal/components/performance-metrics.tsx) provides interactive charts and summaries such as:

- efficiency trends
- fuel usage analysis
- mission success metrics
- real-time weather and fleet context

#### Alerts panel
The alerts center in [drone-portal/components/alerts-panel.tsx](drone-portal/components/alerts-panel.tsx) supports:

- alert filtering
- status updates
- acknowledgement and resolution actions
- clearing resolved alerts
- CSV export

#### User management
The user management view in [drone-portal/components/user-management.tsx](drone-portal/components/user-management.tsx) demonstrates how access control and account administration could be handled in the portal.

#### Visual design system
The UI uses a modern component library approach with reusable building blocks in [drone-portal/components/ui](drone-portal/components/ui). These are shadcn-style UI primitives such as cards, tabs, dialogs, buttons, tables, inputs, selects, and charts.

---

## The computer vision component in detail

The Python script in [computer_vision_and_corrosion/run.py](computer_vision_and_corrosion/run.py) performs the following steps:

1. Imports OpenCV and Ultralytics YOLO.
2. Loads a trained YOLO model from the provided model file.
3. Opens the default webcam.
4. Captures frames continuously.
5. Runs object detection on each frame.
6. Displays the annotated output with bounding boxes.
7. Stops when the user presses the Q key.

### Important note
The current script includes a hard-coded Windows path to the model file:

```python
model = YOLO(r"C:\Users\tejte\Downloads\best.pt")
```

That path will not work on most other machines. You should update it to point to the correct location of your trained model or the provided [computer_vision_and_corrosion/best.pt](computer_vision_and_corrosion/best.pt) file if it is available in your environment.

---

## Tech stack

### Web portal
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Radix UI primitives
- Recharts for charts
- Leaflet for maps
- Lucide icons

### Computer vision
- Python 3
- OpenCV
- Ultralytics YOLO

---

## Getting started

### Run the web portal
From the repository root:

```bash
cd drone-portal
pnpm install
pnpm dev
```

Then open the local URL shown by Next.js, usually:

```text
http://localhost:3000
```

### Run the corrosion detector
From the repository root:

```bash
cd computer_vision_and_corrosion
pip install opencv-python ultralytics
python run.py
```

If you are using a different machine or operating system, make sure to update the model path in [computer_vision_and_corrosion/run.py](computer_vision_and_corrosion/run.py) before running it.

---

## Notes on current implementation

This repository is best understood as a prototype and showcase project rather than a fully productionized platform. Several parts of the portal rely on sample data and client-side state, including:

- mock drone telemetry
- mock inspection reports
- mock maintenance tasks
- mock alert events
- mock user accounts

That makes it ideal for UI demonstrations, design exploration, and proof-of-concept workflows.

---

## Suggested next steps

If you want to evolve this project further, good next steps would include:

- connecting the portal to a real backend or API
- storing drone, report, and maintenance data in a database
- integrating live telemetry from real drones or sensors
- replacing the mock AI insights with real analytics
- improving the YOLO model with a larger labeled dataset
- adding authentication and role-based access control
- containerizing the app for easier deployment

---

## Summary

Drone Verse combines two practical ideas:

- a modern operations dashboard for drone fleet oversight
- a computer vision prototype for industrial corrosion inspection

It is a strong starting point for building a more complete platform around infrastructure monitoring, environmental sensing, and AI-assisted inspection.
