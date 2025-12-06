# Big Data Realtime Pipeline - Project Restructure

This project has been reorganized into two parts:

## 📁 Project Structure

```
bigdata-realtime-pipeline-2025/
├── legacy_pipeline/          # Original infrastructure-based implementation
│   ├── docker-compose.yml    # Docker services (Kafka, Flink, Cassandra, etc.)
│   ├── producer/             # Python Kafka producer
│   ├── flink/                # Flink streaming job
│   ├── cassandra/            # Database schema
│   ├── airflow/              # Airflow orchestration
│   ├── demo-*.sh             # Demo scripts
│   └── SUMMARY.md            # Explanation of legacy approach
│
└── pipeline-simulator-fe/   # NEW: Frontend simulation (MAIN PROJECT)
    ├── src/
    │   ├── components/       # UI components
    │   ├── pages/            # Page components
    │   ├── services/         # Fake data generation
    │   ├── hooks/            # Custom React hooks
    │   └── store/            # State management
    ├── package.json
    └── README.md             # Frontend documentation
```

## 🚀 Quick Start (Frontend Simulator)

The **main deliverable** is the frontend simulator. To run it:

```bash
cd pipeline-simulator-fe
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

**That's it!** No Docker, no Python, no databases needed.

## 🎯 What's New

### Frontend Simulator (`pipeline-simulator-fe/`)

A beautiful, fully functional React application that simulates the entire Big Data pipeline using **fake data**:

- ✅ **Zero Setup** - Just `npm install` and run
- ✅ **Real-time Simulation** - Live data generation
- ✅ **Beautiful UI** - Modern design with TailwindCSS
- ✅ **Interactive Dashboards** - Click buttons, see updates
- ✅ **No Backend** - Everything runs in browser
- ✅ **Portable** - Deploy anywhere (Vercel, Netlify, etc.)

**Pages:**
- Overview - Pipeline diagram and controls
- Kafka UI - Simulated message broker
- Spark Streaming - Fake metrics and charts
- MongoDB Dashboard - Simulated database
- Analytics - Real-time visualizations
- About - Technology explanations

### Legacy Pipeline (`legacy_pipeline/`)

The original implementation using actual infrastructure:
- Docker Compose with Kafka, Flink, Cassandra, Airflow
- Python producer scripts
- Flink streaming jobs
- Demo scripts and documentation

**Note:** This is kept for reference only. See `legacy_pipeline/SUMMARY.md` for details.

## 📊 Comparison

| Feature | Legacy Pipeline | Frontend Simulator |
|---------|----------------|-------------------|
| Setup Time | 5-10 minutes | 30 seconds |
| Dependencies | Docker, Python, Java | Node.js only |
| Resource Usage | High (multiple containers) | Low (browser) |
| Portability | Requires Docker | Works anywhere |
| Demo Value | Shows real tech | Shows concepts clearly |
| Maintenance | Complex | Simple |

## 🎮 Usage

### For Demos and Presentations:
Use the **Frontend Simulator** (`pipeline-simulator-fe/`)

### For Learning Infrastructure:
Refer to **Legacy Pipeline** (`legacy_pipeline/`)

## 📚 Documentation

- **Frontend:** See `pipeline-simulator-fe/README.md`
- **Legacy:** See `legacy_pipeline/SUMMARY.md` and `legacy_pipeline/README.md`

## 🛠️ Development

### Frontend Development
```bash
cd pipeline-simulator-fe
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Legacy Pipeline (Reference Only)
```bash
cd legacy_pipeline
docker compose up -d  # Start all services
# See legacy_pipeline/README.md for full instructions
```

## 🎨 Features

The frontend simulator includes:
- Real-time fake data generation
- Interactive UI components
- Beautiful charts and visualizations
- Responsive design
- No backend dependencies
- Easy to customize and extend

## 📝 Notes

- The frontend uses **100% fake data** - no actual Kafka, Spark, or MongoDB
- Perfect for demos, presentations, and learning concepts
- The legacy pipeline shows how to implement with real infrastructure
- Both approaches are valid - choose based on your needs

---

**Start with the Frontend Simulator for the best demo experience! 🚀**

