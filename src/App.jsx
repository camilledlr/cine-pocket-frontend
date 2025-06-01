import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {useLoading } from './context/LoadingContext';
import Loader from './components/Common/Loader';
import MobileOnly from './components/MobileOnly';
import Home from './pages/Home';
import Watchlist from './pages/Watchlist';
import Seenlist from './pages/Seenlist';
import FilmPage from './pages/FilmPage';
import RecoPage from './pages/RecoPage';
import InfosPage from './pages/InfosPage';
import PlatformsPage from './pages/PlatformsPage';
import ReviewPage from './pages/ReviewPage';



function App() {
  const { loading } = useLoading();
  return (
    // <MobileOnly>
    <Router>
    <AnimatePresence mode="wait">
    {loading && <Loader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/seenlist" element={<Seenlist />} />
        <Route path="/films/:slug" element={<FilmPage />} />
        <Route path="/films/add-reco/:filmId" element={<RecoPage />} />
        <Route path="/films/infos/:filmId" element={<InfosPage />} />
        <Route path="/films/platforms/:filmId" element={<PlatformsPage />} />
        <Route path="/films/review/:filmId" element={<ReviewPage />} />
      </Routes>
      </AnimatePresence>
    </Router>
    // </MobileOnly>
  );
}

export default App;