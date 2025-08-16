import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "app/contexts/auth/AuthContext";
import TasksProvider from "app/contexts/tasks/TasksContext";
import AppNavigator from "app/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </TasksProvider>
    </AuthProvider>
  );
}
