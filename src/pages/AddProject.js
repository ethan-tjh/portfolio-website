import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { addProject, getCategories } from "../services/api";

export default function AddProject() {
  const navigate = useNavigate();

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
    fetchCategories();
  }, [navigate]);
  
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
      await addProject(values);
      navigate("/projects");
    } catch (error) {
      console.error("Failed to add project", error);
      setError("Failed to add project");
    } finally {
      setBusy(false);
    }
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
        submitText="Add Project"
      />
    </main>
  );
}