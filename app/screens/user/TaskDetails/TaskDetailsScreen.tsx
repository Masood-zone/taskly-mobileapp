"use client";

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditTaskModal from "../../../components/EditTaskModal";
import { useTasks, type Task } from "../../../contexts/tasks/TasksContext";

const TaskDetailsScreen = ({ route, navigation }: any) => {
  const { taskId } = route.params;
  const { tasks, markCompleted, deleteTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    setTask(foundTask || null);
  }, [tasks, taskId]);

  const handleMarkCompleted = async () => {
    if (!task) return;

    try {
      await markCompleted(task.id);
      Alert.alert("Success", "Task marked as completed!");
    } catch (error) {
      Alert.alert("Error", "Failed to update task");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(taskId);
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOverdue = task.status === "overdue";
  const isCompleted = task.status === "completed";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.labelContainer}>
            <View
              style={[styles.labelIcon, { backgroundColor: task.label.color }]}
            >
              <Ionicons name={task.label.icon as any} size={16} color="#fff" />
            </View>
            <Text style={styles.labelText}>{task.label.name}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              isCompleted && styles.completedBadge,
              isOverdue && styles.overdueBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isCompleted && styles.completedText,
                isOverdue && styles.overdueText,
              ]}
            >
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>
            Due: {task.dueDate.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {task.description || "No description provided"}
          </Text>
        </View>

        <View style={styles.actions}>
          {!isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleMarkCompleted}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={20} color="#007AFF" />
            <Text style={styles.editButtonText}>Edit Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditTaskModal
        visible={showEditModal}
        task={task}
        onClose={() => setShowEditModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e3f2fd",
  },
  completedBadge: {
    backgroundColor: "#e8f5e8",
  },
  overdueBadge: {
    backgroundColor: "#ffebee",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1976d2",
  },
  completedText: {
    color: "#388e3c",
  },
  overdueText: {
    color: "#d32f2f",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  dateText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  actions: {
    gap: 12,
    paddingBottom: 32,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34c759",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 8,
  },
  editButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
    gap: 8,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
});

export default TaskDetailsScreen;
