import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Medications from './pages/Medications';
import History from './pages/History';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="medications" element={<Medications />} />
          <Route path="history" element={<History />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
