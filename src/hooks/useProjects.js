import { useEffect, useState } from "react";
import * as api from "../api/projects";

export function useProjects(token) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    async function fetchProjects() {
      try {
        // console.log("Fetching Projects.....");
        const response = await api.getProjects(token);
        setProjects(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [token]);

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
