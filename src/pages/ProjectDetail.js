import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects, deleteProject, getProjectImages } from "../services/api";
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