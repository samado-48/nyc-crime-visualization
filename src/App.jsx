import 'leaflet/dist/leaflet.css';

import Header from './components/Header';
import CrimeMap from './components/CrimeMap';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <CrimeMap />
      </main>
      <Footer />
    </div>
  );
}

export default App;
