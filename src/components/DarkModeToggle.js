import { useState, useEffect, useRef } from "react";
export default function DarkModeToggle({darkMode, setDarkMode}) {
    const [isOpen, setIsOpen] = useState(false);
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'device';
    });
    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        if (themeMode === 'light') {
            setDarkMode(false);
        } else if (themeMode === 'dark') {
            setDarkMode(true);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode, setDarkMode]);
    useEffect(() => {
        if (themeMode !== 'device') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeMode, setDarkMode]);
    const handleSelect = (mode) => {
        setThemeMode(mode);
        setIsOpen(false);
    };
    const getIcon = () => {
        if (themeMode === 'light') return '☀️';
        if (themeMode === 'dark') return '🌙';
        return '🖥️';
    };
    return (
        <div className="theme-toggle-container" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="dark-mode-toggle"
                aria-label="Toggle theme menu"
                aria-expanded={isOpen}
            >
                {getIcon()}
            </button>
            
            {isOpen && (
                <div className="theme-dropdown">
                    <button 
                        className={`theme-option ${themeMode === 'light' ? 'active' : ''}`}
                        onClick={() => handleSelect('light')}
                    >
                        <span className="theme-option-icon">☀️</span>
                        <span>Light theme</span>
                    </button>
                    <button 
                        className={`theme-option ${themeMode === 'dark' ? 'active' : ''}`}
                        onClick={() => handleSelect('dark')}
                    >
                        <span className="theme-option-icon">🌙</span>
                        <span>Dark theme</span>
                    </button>
                    <button 
                        className={`theme-option ${themeMode === 'device' ? 'active' : ''}`}
                        onClick={() => handleSelect('device')}
                    >
                        <span className="theme-option-icon">🖥️</span>
                        <span>Device default</span>
                    </button>
                </div>
            )}
        </div>
    );
}