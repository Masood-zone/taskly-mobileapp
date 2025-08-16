"use client";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "app/contexts/auth/AuthContext";
import { updateEmail } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditProfileModal from "../../../components/EditProfileModal";
import { useTasks } from "../../../contexts/tasks/TasksContext";
import { db } from "../../../services/firebase";

export default function ProfileScreen() {
  const { userProfile, user, logout } = useAuth();
  const { tasks } = useTasks();
  const [editVisible, setEditVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleEditProfile = async (name: string, email: string) => {
    if (!userProfile || !user) return;
    setEditLoading(true);
    try {
      // Update Firestore user profile
      await updateDoc(doc(db, "users", user.uid), {
        name,
        email,
      });
      // Optionally, update email in Firebase Auth (not just Firestore)
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      // Update local state (will be refreshed on next auth state change)
      // But for instant UI update, you may want to update userProfile here if needed
    } finally {
      setEditLoading(false);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userProfile?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.name}>{userProfile?.name || "User"}</Text>
        <Text style={styles.email}>{userProfile?.email}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsTitle}>Task Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#34c759" }]}>
              {completedTasks}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#007AFF" }]}>
              {pendingTasks}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#FF3B30" }]}>
              {overdueTasks}
            </Text>
            <Text style={styles.statLabel}>Overdue</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setEditVisible(true)}
        >
          <Ionicons name="person-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        initialName={userProfile?.name || ""}
        initialEmail={userProfile?.email || ""}
        onSave={handleEditProfile}
        loading={editLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  stats: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    paddingHorizontal: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 16,
  },
  logoutText: {
    color: "#FF3B30",
  },
});
