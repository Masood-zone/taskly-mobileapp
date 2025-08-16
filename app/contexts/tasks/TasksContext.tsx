"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { db } from "../../services/firebase";
import useAuth from "../auth/AuthContext";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "completed" | "overdue";
  label: {
    name: string;
    color: string;
    icon: string;
  };
  createdAt: Date;
}

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "userId" | "createdAt">) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markCompleted: (taskId: string) => Promise<void>;
  filterTasks: (filter: "all" | "pending" | "completed" | "overdue") => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}

interface TasksProviderProps {
  children: ReactNode;
}

export default function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Task[];

      // Update overdue status
      const updatedTasks = tasksData.map((task) => ({
        ...task,
        status:
          task.status === "pending" && task.dueDate < new Date()
            ? "overdue"
            : task.status,
      }));

      setTasks(updatedTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addTask = async (
    taskData: Omit<Task, "id" | "userId" | "createdAt">
  ) => {
    if (!user) return;

    await addDoc(collection(db, "tasks"), {
      ...taskData,
      userId: user.uid,
      createdAt: new Date(),
    });
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    await updateDoc(doc(db, "tasks", taskId), updates);
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const markCompleted = async (taskId: string) => {
    await updateDoc(doc(db, "tasks", taskId), {
      status: "completed",
    });
  };

  const filterTasks = (filter: "all" | "pending" | "completed" | "overdue") => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  };

  const value: TasksContextType = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    markCompleted,
    filterTasks,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
