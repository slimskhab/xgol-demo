import './App.css';
import { Route, Routes } from 'react-router-dom';
import RecordPage from './view/pages/RecordPage/RecordPage';
import TestDevice from './view/pages/TestDevice/TestDevice';
import Recording from './view/pages/recording/Recording';
import NavBar from './view/components/navBar/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<RecordPage />} />
        <Route path="/record" element={<RecordPage />} />
        <Route path="/verify" element={<TestDevice />} />
        <Route path="/recording" element={<Recording />} />

      </Routes>
    </div>
  );
}

export default App;
