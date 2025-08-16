"use client";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Auth Screens
import LoginScreen from "../screens/auth/Login/LoginScreen";
import RegisterScreen from "../screens/auth/Register/RegisterScreen";

// User Screens
import useAuth from "app/contexts/auth/AuthContext";
import DashboardScreen from "../screens/user/Dashboard/DashboardScreen";
import ProfileScreen from "../screens/user/Profile/ProfileScreen";
import TaskDetailsScreen from "../screens/user/TaskDetails/TaskDetailsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "Dashboard") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Profile") {
          iconName = focused ? "person" : "person-outline";
        } else {
          iconName = "help-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="UserTabs"
      component={UserTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TaskDetails"
      component={TaskDetailsScreen}
      options={{ title: "Task Details" }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return user ? <UserStack /> : <AuthStack />;
};

export default AppNavigator;
