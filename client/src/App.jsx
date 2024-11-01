import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BuyCredits from './pages/BuyCredits';
import Results from './pages/Results';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';

function App() {


  return (
    <div className='min-h-screen bg-slate-50'>
      <ToastContainer position='bottom-right' />
      <Navbar />
      <Routes>
        <Route path={"/"} element={<Home />}></Route>
        <Route path={"/result"} element={<Results />}></Route>
        <Route path={"/buy"} element={<BuyCredits />}></Route>
        <Route path={"/verify"} element={<Verify />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
