import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import AddProject from "./pages/AddProject";
import UpdateProject from "./pages/UpdateProject";
import AboutMe from "./pages/AboutMe";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import './App.css';
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/projects/:id" element={<ProjectDetail/>}/>
          <Route path="/projects/add" element={<AddProject/>}/>
          <Route path="/projects/:id/update" element={<UpdateProject/>}/>
          <Route path="/about" element={<AboutMe/>}/>
          <Route path="/contact" element={<Contact/>}/>
          {/* Error Route */}
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>}/>
        </Routes>
        <Footer/>
      </div>      
    </BrowserRouter>
  );
}