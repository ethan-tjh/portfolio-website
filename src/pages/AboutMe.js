import { useEffect, useState } from "react";
import { getSkills } from "../services/api";

export default function AboutMe() {
    const name = "Ethan Tan";
    const studyYear = 2;
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        </main>
    );
}