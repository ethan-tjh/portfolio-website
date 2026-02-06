import {useNavigate, NavLink} from "react-router-dom";
import {useState, useEffect} from "react";
import DarkModeToggle from "./DarkModeToggle";
import {logoLight, logoDark } from "../icons";
export default function NavBar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);
    function handleLogout() {
        const username = localStorage.getItem("username");
        if (window.confirm(`Are you sure you want to logout${username ? `, ${username}` : ""}?`)) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/");
        }
    }
    return (
        <header className="NavBar">
            <NavLink to="/" end>
                <img src={darkMode ? logoDark : logoLight} alt="Logo" className="nav-logo"/>
            </NavLink>
            <nav className="nav-links">
                <NavLink to="/" end className={({isActive}) => isActive ? "NavButton active-home" : "NavButton"}>
                    Home
                </NavLink>
                <NavLink to="/projects" end className={({isActive}) => isActive ? "NavButton active-projects" : "NavButton"}>
                    Projects
                </NavLink>
                <NavLink to="/about" end className={({isActive}) => isActive ? "NavButton active-about" : "NavButton"}>
                    About
                </NavLink>
                <NavLink to="/contact" end className={({isActive}) => isActive ? "NavButton active-contact" : "NavButton"}>
                    Contact
                </NavLink>
            </nav>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode}/>
            <nav>
                {token ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <NavLink to="/login" end className="login-button">
                        Login
                    </NavLink>
                )}
            </nav>
        </header>
    );
}