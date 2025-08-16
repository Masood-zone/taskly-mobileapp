import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Label {
  name: string
  color: string
  icon: string
}

interface LabelSelectorProps {
  selectedLabel: Label
  onLabelChange: (label: Label) => void
}

const predefinedLabels: Label[] = [
  { name: "Work", color: "#007AFF", icon: "briefcase" },
  { name: "Personal", color: "#34c759", icon: "person" },
  { name: "Shopping", color: "#FF9500", icon: "bag" },
  { name: "Health", color: "#FF3B30", icon: "heart" },
  { name: "Education", color: "#5856D6", icon: "school" },
  { name: "Travel", color: "#00C7BE", icon: "airplane" },
  { name: "Finance", color: "#FFD60A", icon: "card" },
  { name: "Home", color: "#8E8E93", icon: "home" },
]

const LabelSelector: React.FC<LabelSelectorProps> = ({ selectedLabel, onLabelChange }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {predefinedLabels.map((label) => (
        <TouchableOpacity
          key={label.name}
          style={[styles.labelButton, selectedLabel.name === label.name && styles.selectedLabel]}
          onPress={() => onLabelChange(label)}
        >
          <View style={[styles.iconContainer, { backgroundColor: label.color }]}>
            <Ionicons name={label.icon as any} size={16} color="#fff" />
          </View>
          <Text style={styles.labelText}>{label.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
  },
  labelButton: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    minWidth: 80,
  },
  selectedLabel: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },
})

export default LabelSelector
