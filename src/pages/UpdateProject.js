import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { updateProject, getCategories } from "../services/api";

export default function UpdateProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [values, setValues] = useState({
    name: "",
    module_code: "",
    module_name: "",
    description: "",
    img: "",
    category: "",
    github_link: "",
    demo_link: "",
    additional_images: [],
  });
  const [categories, setCategories] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    async function fetchCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    }

    async function fetchProject() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || ""}/projects/${id}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const project = await response.json();
        
        setValues({
          name: project.name || "",
          module_code: project.module_code || "",
          module_name: project.module_name || "",
          description: project.description || "",
          img: project.img || "",
          category: project.category || "",
          github_link: project.github_link || "",
          demo_link: project.demo_link || "",
          additional_images: project.images ? project.images.map(img => img.image_url) : [],
        });
      } catch (error) {
        console.error("Failed to fetch project", error);
        setError("Failed to load project data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
    fetchProject();
  }, [navigate, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    setBusy(true);
    setError("");
    try {
      await updateProject(id, values);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to update project", error);
      setError("Failed to update project");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="page-centered">
        <p>Loading project...</p>
      </main>
    );
  }

  return (
    <main>
      <ProjectForm
        values={values}
        categories={categories}
        onChange={handleChange}
        onSubmit={handleSubmit}
        busy={busy}
        error={error}
        submitText="Update Project"
      />
    </main>
  );
}