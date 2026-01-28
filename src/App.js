import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import AboutMe from "./pages/AboutMe";
import Contact from "./pages/Contact";
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/about" element={<AboutMe/>}/>
        <Route path="/contact" element={<Contact/>}/>
        {/* Error Route */}
        <Route path="*" element={<h1 className="not-found">Page Not Found</h1>}/>
      </Routes>
    </BrowserRouter>
  );
}