import { useEffect, useState } from "react";
import * as api from "../api/projects";

export function useProjects(token) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await api.getProjects(token);
      setProjects(response);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!token) return;
    fetchProjects();
  }, [token]);

  // Poll only when there are processing projects
  useEffect(() => {
    if (!token) return;

    const hasProcessingProjects = projects.some(
      (p) => p.status === "processing",
    );

    if (!hasProcessingProjects) return;

    const interval = setInterval(() => {
      fetchProjects();
    }, 3000); // Check every 3 seconds when processing

    return () => clearInterval(interval);
  }, [token, projects]);

  async function createProject(name) {
    const createdProject = await api.createProject(token, name);
    // console.log("Creating a new Project.....");
    setProjects((prev) => [...prev, createdProject]);
    return createdProject;
  }

  async function updateProject(id, updateName) {
    // console.log(`Updating Project: ${id}.....`);
    const updatedProject = await api.updateProject(token, id, updateName);
    setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
    return updatedProject;
  }

  async function deleteProject(id) {
    // console.log(`Deleting Project: ${id}.....`);
    await api.deleteProject(token, id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return {
    projects,
    setProjects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
