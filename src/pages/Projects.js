import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import {getProjects} from "../services/api";
export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);
    async function load() {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            console.error("Failed to load Projects", err);
            setError("Failed to load Projects");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, []);
    const groupedProjects = projects.reduce((acc, project) => {
        const category = project.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(project);
        return acc;
    }, {});
    // Get all categories
    const categories = Object.keys(groupedProjects);
    // Filter projects based on selected category
    const displayProjects = selectedCategory === "all" 
        ? projects 
        : groupedProjects[selectedCategory] || [];
    const handleAddProject = () => {
        navigate("/projects/add");
    };
    if (loading) return <main className="page-centered">Loading...</main>;
    if (!projects) return <main className="page-centered">Card not found</main>
    return (
        <div className="projects-page">
            <div className="projects-container-layout">
                {/* Left Sidebar */}
                <aside className="projects-sidebar">
                    <div className="projects-sidebar-content">
                        <h1>My Projects</h1>
                        <p className="projects-subtitle">
                            A collection of work spanning design, development, and creative exploration
                        </p>
                        <div className="category-nav">
                            <h2 className="category-nav-title">Categories</h2>
                            <button
                                className={`category-nav-item ${selectedCategory === "all" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("all")}
                            >
                                All Projects
                                <span className="category-count">{projects.length}</span>
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`category-nav-item ${selectedCategory === category ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                    <span className="category-count">{groupedProjects[category].length}</span>
                                </button>
                            ))}
                        </div>
                        {isLoggedIn && (
                            <button 
                                className="add-project-btn"
                                onClick={handleAddProject}
                            >
                                + Add Project
                            </button>
                        )}
                    </div>
                </aside>
                {/* Right Content Area */}
                <main className="projects-main-content">
                    <div className="projects-grid">
                        {displayProjects.map((p) => (
                            <ProjectCard
                                key={p.id}
                                project={p}
                                error={error}
                            />
                        ))}
                    </div>
                    {displayProjects.length === 0 && (
                        <div className="no-projects">
                            <p>No projects found in this category.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}