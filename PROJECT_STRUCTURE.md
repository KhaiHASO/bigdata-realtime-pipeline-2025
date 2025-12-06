# Project Structure Overview

## 📁 Directory Layout

```
bigdata-realtime-pipeline-2025/
│
├── README.md                    # Main project README
├── PROJECT_STRUCTURE.md         # This file
│
├── legacy_pipeline/             # Original infrastructure implementation
│   ├── SUMMARY.md              # Why legacy approach vs new approach
│   ├── README.md               # Original documentation
│   ├── DEMO.md                  # Demo scenarios
│   ├── docker-compose.yml      # All Docker services
│   ├── producer/                # Python Kafka producer
│   ├── flink/                   # Flink streaming job
│   ├── cassandra/               # Database schema
│   ├── airflow/                 # Airflow DAGs
│   ├── scripts/                 # Helper scripts
│   └── demo-*.sh               # Demo automation scripts
│
└── pipeline-simulator-fe/      # NEW: Frontend simulation (MAIN)
    ├── README.md               # Frontend documentation
    ├── package.json            # Dependencies
    ├── vite.config.ts          # Vite configuration
    ├── tailwind.config.js      # TailwindCSS config
    ├── tsconfig.json           # TypeScript config
    │
    └── src/
        ├── main.tsx            # Entry point
        ├── App.tsx             # Root component with routing
        ├── index.css           # Global styles
        │
        ├── components/         # Reusable components
        │   ├── ui/             # Base UI components
        │   │   ├── button.tsx
        │   │   └── card.tsx
        │   └── layout/         # Layout components
        │       ├── Sidebar.tsx
        │       ├── Header.tsx
        │       └── MainLayout.tsx
        │
        ├── pages/               # Page components
        │   ├── Overview.tsx    # Pipeline overview
        │   ├── KafkaUI.tsx     # Kafka simulation
        │   ├── SparkUI.tsx     # Spark streaming simulation
        │   ├── MongoDBUI.tsx   # MongoDB simulation
        │   ├── Analytics.tsx   # Analytics dashboard
        │   └── About.tsx       # About page
        │
        ├── services/           # Business logic
        │   └── fakeDataService.ts  # Fake data generation
        │
        ├── hooks/               # Custom React hooks
        │   ├── useFakeData.ts  # Hooks for fake data
        │   └── useClock.ts     # Clock hook
        │
        ├── store/               # State management
        │   └── simulationStore.ts  # Zustand store
        │
        ├── types/               # TypeScript types
        │   └── index.ts
        │
        └── lib/                 # Utilities
            └── utils.ts         # Helper functions
```

## 🎯 Main Deliverable

**`pipeline-simulator-fe/`** is the main project - a beautiful frontend that simulates the entire pipeline.

## 📦 What Each Folder Does

### `legacy_pipeline/`
- Original implementation with real infrastructure
- Docker Compose setup
- Python scripts
- Demo automation
- **Purpose:** Reference for understanding actual infrastructure

### `pipeline-simulator-fe/`
- React + TypeScript frontend
- Fake data generation
- Real-time UI updates
- Beautiful dashboards
- **Purpose:** Easy-to-demo simulation

## 🚀 Getting Started

1. **For Demos:** Use `pipeline-simulator-fe/`
   ```bash
   cd pipeline-simulator-fe
   npm install
   npm run dev
   ```

2. **For Learning Infrastructure:** Refer to `legacy_pipeline/`
   ```bash
   cd legacy_pipeline
   docker compose up -d
   ```

## 📝 Key Files

### Frontend
- `src/App.tsx` - Main routing
- `src/services/fakeDataService.ts` - Data generation logic
- `src/pages/*.tsx` - All page components
- `src/components/layout/*.tsx` - Layout components

### Legacy
- `docker-compose.yml` - Service definitions
- `producer/producer.py` - Kafka producer
- `flink/job.py` - Flink streaming job
- `demo-*.sh` - Demo scripts

## 🎨 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Recharts
- Zustand

### Legacy
- Docker Compose
- Python
- Apache Flink
- Kafka
- Cassandra
- Airflow

