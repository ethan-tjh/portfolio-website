import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects, deleteProject, getProjectImages, getProjectTags } from "../services/api";
export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const token = localStorage.getItem("token");
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const projects = await getProjects();
                const found = projects.find((p) => p.id === Number(id));
                setProject(found);
                const projectImages = await getProjectImages(id);
                if (projectImages.length > 0) {
                    setImages(projectImages.map(img => img.image_url));
                } else if (found?.img) {
                    setImages([`/images/${found.img}`]);
                }
                const projectTags = await getProjectTags(id);
                setTags(projectTags);
            } catch (err) {
                console.error("Failed to load Project", err);
                setError("Failed to load Project");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);
    async function handleDelete() {
        if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
            setBusy(true);
            setError("");
            try {
                await deleteProject(project.id);
                navigate("/projects");
            } catch (err) {
                console.error("Failed to delete Project", err);
                setError("Failed to delete Project");
            } finally {
                setBusy(false);
            }
        }
    }
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    if (loading) return <main className="page-centered"><p>Loading...</p></main>;
    if (error) return <main className="page-centered"><p className="error-message">{error}</p></main>;
    if (!project) return <main className="page-centered"><p>Project not found</p></main>;
    return (
        <main className="project-detail-page">
            <div className="project-detail-container">
                <div className="project-detail-left">
                    <div className="project-carousel">
                        <div className="carousel-main">
                            <img
                                src={images[currentImageIndex]}
                                alt={`${project.name} screenshot ${currentImageIndex + 1}`}
                                className="carousel-image"
                            />
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={prevImage} 
                                        className="carousel-btn carousel-btn-prev"
                                        aria-label="Previous image"
                                    >
                                        ‹
                                    </button>
                                    <button 
                                        onClick={nextImage} 
                                        className="carousel-btn carousel-btn-next"
                                        aria-label="Next image"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="carousel-thumbnails">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="project-detail-right">
                    <div className="project-header">
                        <h1>{project.name}</h1>
                        {(project.module_code || project.module_code) && (
                            <span className="project-badge">{project.module_code} - {project.module_name}</span>
                        )}
                    </div>
                    <div className="project-divider"></div>
                    <div className="project-section">
                        <h2>Description</h2>
                        <p>{project.description || "No description available."}</p>
                    </div>
                    <div className="project-divider"></div>
                    <div className="project-section">
                        <h2>Technologies Used</h2>
                        {tags.length > 0 ? (
                            <ul className="project-features">
                                {tags.map((tag) => (
                                    <li key={tag.id}>
                                        <span className="feature-dot"></span>
                                        {tag.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-tags">No technologies listed for this project.</p>
                        )}
                    </div>
                    {(project.github_link || project.demo_link) && (
                        <>
                            <div className="project-divider"></div>
                            <div className="project-section">
                                <h2>Project Links</h2>
                                <div className="project-links">
                                    {project.github_link && (
                                        <a 
                                            href={project.github_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="project-link github-link"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                            View on GitHub
                                        </a>
                                    )}
                                    {project.demo_link && (
                                        <a 
                                            href={project.demo_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="project-link demo-link"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                            View Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    <div className="project-actions">
                        <button 
                            className="btn-secondary"
                            onClick={() => navigate("/projects")}
                        >
                            Back to Projects
                        </button>
                    </div>
                    {token && (
                        <div className="project-admin-actions">
                            <button 
                                className="btn-edit"
                                onClick={() => navigate(`/projects/${project.id}/update`)}
                                disabled={busy}
                            >
                                Edit Project
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={handleDelete}
                                disabled={busy}
                            >
                                {busy ? "Deleting..." : "Delete Project"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}