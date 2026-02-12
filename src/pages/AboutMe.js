import { useEffect, useState } from "react";
import { getSkills, getCertificates } from "../services/api";

export default function AboutMe() {
    const name = "Ethan Tan";
    const studyYear = 2;
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCertificates, setShowCertificates] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        async function loadSkills() {
            try {
                const data = await getSkills();
                // Group skills by category
                const grouped = data.reduce((acc, skill) => {
                    const category = skill.skill_category || 'Other';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(skill.name);
                    return acc;
                }, {});
                // Define the preferred order
                const categoryOrder = ['Frontend', 'Backend', 'Design'];
                // Convert to array format for table with custom ordering
                const skillsArray = [];
                // First, add categories in the preferred order
                categoryOrder.forEach(category => {
                    if (grouped[category]) {
                        skillsArray.push({
                            category: category,
                            items: grouped[category]
                        });
                    }
                });
                // Then add any remaining categories (Others)
                Object.keys(grouped).forEach(category => {
                    if (!categoryOrder.includes(category)) {
                        skillsArray.push({
                            category: category,
                            items: grouped[category]
                        });
                    }
                });
                setSkills(skillsArray);
            } catch (err) {
                console.error("Failed to load skills", err);
                setError("Failed to load skills");
            } finally {
                setLoading(false);
            }
        }
        loadSkills();
    }, []);
    useEffect(() => {
        async function loadCertificates() {
            try {
                const data = await getCertificates();
                setCertificates(data);
            } catch (err) {
                console.error("Failed to load certificates", err);
            }
        }
        loadCertificates();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const openCertificate = (cert) => {
        setSelectedCertificate(cert);
    };

    const closeCertificate = () => {
        setSelectedCertificate(null);
    };

    return (
        <main className="about-page">
            <div className="about-left-panel">
                <div className="avatar-container">
                    <img 
                        src={`/images/about-pic.jpg`} 
                        alt="Profile" 
                        className="avatar-image"
                    />
                </div>
            </div>
            <div className="about-right-panel">
                <div className="about-content">
                    <div className="about-section">
                        <h1>About Me</h1>
                        <p>
                            Hello, I'm {name}, a Year {studyYear} student at Republic Polytechnic 
                            pursuing a Diploma in Digital Design and Development.
                        </p>
                        <p>
                            I enjoy exploring different areas of design and development, bringing 
                            ideas to life through code while focusing on creating functional, 
                            user-friendly digital experiences. I’m continuously learning and 
                            refining my skills across disciplines, using hands-on projects as 
                            a way to experiment, improve, and grow.
                        </p>
                        <p>
                            I’m always open to picking up new tools and skills, and I value 
                            versatility, curiosity, and steady improvement in both my personal 
                            and professional journey.
                        </p>
                    </div>
                    <div className="certificates-button-container">
                        <button 
                            className="certificates-toggle-btn"
                            onClick={() => setShowCertificates(!showCertificates)}
                        >
                            {showCertificates ? '▼' : '▶'} Certificates ({certificates.length})
                        </button>
                    </div>
                    {showCertificates && (
                        <div className="certificates-section">
                            {certificates.length > 0 ? (
                                <div className="certificates-table-container">
                                    <table className="certificates-table">
                                        <thead>
                                            <tr>
                                                <th>Certificate Name</th>
                                                <th>Issuer</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {certificates.map((cert) => (
                                                <tr key={cert.id}>
                                                    <td className="cert-name">{cert.name}</td>
                                                    <td className="cert-issuer">{cert.issuer || 'N/A'}</td>
                                                    <td className="cert-date">{formatDate(cert.issue_date)}</td>
                                                    <td className="cert-action">
                                                        <button 
                                                            className="view-cert-btn"
                                                            onClick={() => openCertificate(cert)}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="no-certificates">No certificates available.</p>
                            )}
                        </div>
                    )}
                    <div className="skills-section">
                        <h2>Skills</h2>
                        {loading ? (
                            <p>Loading skills...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : (
                            <div className="skills-table-container">
                                <table className="skills-table">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Technologies</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skills.map((skill, index) => (
                                            <tr key={index}>
                                                <td className="category-cell">{skill.category}</td>
                                                <td className="tech-cell">{skill.items.join(', ')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedCertificate && (
                <div className="certificate-modal-overlay" onClick={closeCertificate}>
                    <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeCertificate}>
                            ✕
                        </button>
                        <div className="modal-header">
                            <h2>{selectedCertificate.name}</h2>
                            {selectedCertificate.issuer && (
                                <p className="modal-issuer">Issued by {selectedCertificate.issuer}</p>
                            )}
                            {selectedCertificate.issue_date && (
                                <p className="modal-date">{formatDate(selectedCertificate.issue_date)}</p>
                            )}
                        </div>
                        <div className="modal-body">
                            {selectedCertificate.description && (
                                <p className="modal-description">{selectedCertificate.description}</p>
                            )}
                            <iframe
                                src={selectedCertificate.certificate_url}
                                className="certificate-iframe"
                                title={selectedCertificate.name}
                            />
                            <div className="modal-actions">
                                <a 
                                    href={selectedCertificate.certificate_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="open-new-tab-btn"
                                >
                                    Open in New Tab
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}