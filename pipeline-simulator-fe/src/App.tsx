import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Overview } from './pages/Overview';
import { KafkaUI } from './pages/KafkaUI';
import { SparkUI } from './pages/SparkUI';
import { MongoDBUI } from './pages/MongoDBUI';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';

function App() {
  try {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Overview />} />
            <Route path="kafka" element={<KafkaUI />} />
            <Route path="spark" element={<SparkUI />} />
            <Route path="mongodb" element={<MongoDBUI />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } catch (error) {
    console.error('App Error:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error Loading App</h1>
        <pre>{String(error)}</pre>
      </div>
    );
  }
}

export default App;
