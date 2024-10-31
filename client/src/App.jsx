import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuyCredits from './pages/BuyCredits';
import Results from './pages/Results';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


function App() {


  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Home />}></Route>
        <Route path={"/results"} element={<Results />}></Route>
        <Route path={"/buy"} element={<BuyCredits />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
