import { useEffect, useState, useRef } from "react";
import * as api from "../api/task";

export function useTask(token, project_id) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Fetch task status
  async function fetchTask() {
    try {
      const response = await api.getTask(token, project_id);
      setTask(response);
      return response;
    } catch (err) {
      // If task doesn't exist (404), that's ok - just no active task
      if (err.response?.status === 404) {
        setTask(null);
        setError(null);
      } else {
        setError(err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Start polling
  function startPolling(intervalMs = 2000) {
    // Clear any existing polling
    stopPolling();

    // Poll immediately
    fetchTask();

    // Then poll at interval
    pollingIntervalRef.current = setInterval(async () => {
      const taskData = await fetchTask();

      // Stop polling if task is complete or failed
      if (
        taskData &&
        (taskData.status === "SUCCESS" || taskData.status === "FAILED")
      ) {
        stopPolling();
      }
    }, intervalMs);
  }

  function stopPolling() {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }

  useEffect(() => {
    if (!token || !project_id) {
      setTask(null);
      setLoading(false);
      return;
    }

    fetchTask();

    return () => {
      stopPolling();
    };
  }, [token, project_id]);

  useEffect(() => {
    if (task && (task.status === "PROCESSING" || task.status === "PENDING")) {
      startPolling();
    }

    return () => stopPolling();
  }, [task?.status]);

  async function createTask(files) {
    const createdTask = await api.createTask(token, project_id);
    setTask(createdTask);

    startPolling();

    return createdTask;
  }

  return {
    task,
    setTask,
    loading,
    error,
    createTask,
    startPolling,
    stopPolling,
    isPolling: pollingIntervalRef.current !== null,
  };
}
