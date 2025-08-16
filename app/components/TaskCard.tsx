import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Task } from "../contexts/tasks/TasksContext"

interface TaskCardProps {
  task: Task
  onPress: () => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const isOverdue = task.status === "overdue"
  const isCompleted = task.status === "completed"

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <View style={[styles.labelIcon, { backgroundColor: task.label.color }]}>
            <Ionicons name={task.label.icon as any} size={12} color="#fff" />
          </View>
          <Text style={styles.labelText}>{task.label.name}</Text>
        </View>

        <View style={[styles.statusBadge, isCompleted && styles.completedBadge, isOverdue && styles.overdueBadge]}>
          <Text style={[styles.statusText, isCompleted && styles.completedText, isOverdue && styles.overdueText]}>
            {task.status}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, isCompleted && styles.completedTitle]}>{task.title}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.dateText}>{task.dueDate.toLocaleDateString()}</Text>
        </View>

        {isCompleted && <Ionicons name="checkmark-circle" size={20} color="#34c759" />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#e3f2fd",
  },
  completedBadge: {
    backgroundColor: "#e8f5e8",
  },
  overdueBadge: {
    backgroundColor: "#ffebee",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1976d2",
    textTransform: "capitalize",
  },
  completedText: {
    color: "#388e3c",
  },
  overdueText: {
    color: "#d32f2f",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
})

export default TaskCard
