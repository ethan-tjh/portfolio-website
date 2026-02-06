import {Link} from "react-router-dom";

export default function ProjectCard({project}) {
    const isUrl = project.img && (project.img.startsWith('http://') || project.img.startsWith('https://'));
    const imgSrc = project.img ? (isUrl ? project.img : `/images/${project.img}`) : '/images/placeholder.png';
    
    return (
        <div className="project-card">
            <Link to={`/projects/${project.id}`} className="card">
                <img src={imgSrc} alt={project.name}/>
                <h3>{project.name}</h3>
            </Link>
        </div>
    );
}