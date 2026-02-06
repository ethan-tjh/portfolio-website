import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjects();
                // Get first 4 projects for the grid
                setProjects(data.slice(0, 4));
            } catch (err) {
                console.error("Failed to load projects", err);
            } finally {
                setLoading(false);
            }
        }
        
        loadProjects();
    }, []);

    // Helper function to get image source
    const getImageSrc = (imgPath) => {
        if (!imgPath) return '/images/placeholder.png';
        const isUrl = imgPath.startsWith('http://') || imgPath.startsWith('https://');
        return isUrl ? imgPath : `/images/${imgPath}`;
    };

    // Grid size pattern: large, medium, large, medium
    const getGridClass = (index) => {
        return index % 2 === 0 ? 'grid-large' : 'grid-medium';
    };

    return (
        <main className="home-page">
            <div className="home-container">
                {/* Left Sidebar */}
                <aside className="home-sidebar">
                    <div className="sidebar-content">
                        <h1 className="home-title">Ethan's Portfolio</h1>
                        <p className="home-subtitle">"A little design, a little code, a lot of curiosity"</p>
                        
                        <div className="sidebar-section">
                            <h2 className="section-title">About Me</h2>
                            <p className="section-text">
                                I'm a developer who enjoys learning across different disciplines, applying a broad skill set to build simple, effective digital solutions.
                            </p>
                        </div>

                        <Link to="/projects" className="home-cta-button">
                            View My Projects
                        </Link>
                    </div>
                </aside>
                {/* Right Grid */}
                <div className="home-grid">
                    {loading ? (
                        // Show placeholders while loading
                        <>
                            <div className="grid-item grid-large">
                                <div className="grid-placeholder">
                                    <div className="placeholder-icon">
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-item grid-medium">
                                <div className="grid-placeholder">
                                    <div className="placeholder-icon">
                                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-item grid-large">
                                <div className="grid-placeholder">
                                    <div className="placeholder-icon">
                                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="grid-item grid-medium">
                                <div className="grid-placeholder">
                                    <div className="placeholder-icon">
                                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Show actual project images
                        projects.map((project, index) => (
                            <Link 
                                key={project.id} 
                                to={`/projects/${project.id}`} 
                                className={`grid-item ${getGridClass(index)}`}
                            >
                                <img 
                                    src={getImageSrc(project.img)} 
                                    alt={project.name}
                                    className="grid-image"
                                />
                                <div className="grid-overlay">
                                    <h3>{project.name}</h3>
                                    {project.category && <span className="grid-category">{project.category}</span>}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}