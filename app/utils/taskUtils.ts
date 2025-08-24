import type { Task } from "../contexts/tasks/TasksContext";

export const getTaskStatusColor = (status: Task["status"]): string => {
  switch (status) {
    case "completed":
      return "#34c759";
    case "overdue":
      return "#FF3B30";
    case "pending":
    default:
      return "#007AFF";
  }
};

export const sortTasksByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

export const sortTasksByStatus = (tasks: Task[]): Task[] => {
  const statusOrder = { overdue: 0, pending: 1, completed: 2 };
  return [...tasks].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );
};

export default {
  getTaskStatusColor,
  sortTasksByDueDate,
  sortTasksByStatus,
};
