import { useEffect, useState } from 'react';
import { createTask, fetchTasks } from '../services/taskService';
import { Task } from '../types';

export function useCreateTask() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Carga inicial desde la API. Se fusiona por id en vez de reemplazar
  // para no borrar tareas creadas localmente si esta petición resuelve tarde.
  useEffect(() => {
    let active = true;
    fetchTasks()
      .then((fetched) => {
        if (!active) return;
        setTasks((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          return [...prev, ...fetched.filter((t) => !existingIds.has(t.id))];
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const submit = async (title: string) => {
    setStatus('loading');
    try {
      const task = await createTask(title);
      setTasks((prev) => [task, ...prev]);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { status, tasks, submit, removeTask };
}
