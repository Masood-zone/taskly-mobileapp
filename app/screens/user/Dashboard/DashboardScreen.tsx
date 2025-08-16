"use client"

import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTasks, type Task } from "../../../contexts/tasks/TasksContext"
import TaskCard from "../../../components/TaskCard"
import AddTaskModal from "../../../components/AddTaskModal"
import FilterButtons from "../../../components/FilterButtons"

const DashboardScreen = ({ navigation }: any) => {
  const { tasks, loading } = useTasks()
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "overdue">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const { filterTasks } = useTasks()

  const filteredTasks = filterTasks(filter)

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard task={item} onPress={() => navigation.navigate("TaskDetails", { taskId: item.id })} />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>
          {filteredTasks.length} {filter === "all" ? "total" : filter} tasks
        </Text>
      </View>

      <FilterButtons
        activeFilter={filter}
        onFilterChange={setFilter}
        taskCounts={{
          all: tasks.length,
          pending: filterTasks("pending").length,
          completed: filterTasks("completed").length,
          overdue: filterTasks("overdue").length,
        }}
      />

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>{filter === "all" ? "No tasks yet" : `No ${filter} tasks`}</Text>
            <Text style={styles.emptySubtext}>
              {filter === "all" ? "Tap the + button to add your first task" : "Try a different filter"}
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  taskList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})

export default DashboardScreen
