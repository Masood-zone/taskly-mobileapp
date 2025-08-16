import type React from "react"
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"

interface FilterButtonsProps {
  activeFilter: "all" | "pending" | "completed" | "overdue"
  onFilterChange: (filter: "all" | "pending" | "completed" | "overdue") => void
  taskCounts: {
    all: number
    pending: number
    completed: number
    overdue: number
  }
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: "all", label: "All", count: taskCounts.all, color: "#007AFF" },
    { key: "pending", label: "Pending", count: taskCounts.pending, color: "#007AFF" },
    { key: "completed", label: "Completed", count: taskCounts.completed, color: "#34c759" },
    { key: "overdue", label: "Overdue", count: taskCounts.overdue, color: "#FF3B30" },
  ] as const

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.filterButton,
            activeFilter === filter.key && [styles.activeFilterButton, { backgroundColor: filter.color }],
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Text style={[styles.filterText, activeFilter === filter.key && styles.activeFilterText]}>
            {filter.label}
          </Text>
          <Text style={[styles.countText, activeFilter === filter.key && styles.activeCountText]}>{filter.count}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    gap: 8,
  },
  activeFilterButton: {
    borderColor: "transparent",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: "center",
  },
  activeCountText: {
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
})

export default FilterButtons
