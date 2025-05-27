import React, { useState, useEffect } from "react";
import { View, Text, Alert, StatusBar } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { updateUser } from "../../services/api";
import { SignupCredentials } from "../../types/user";
import { cn } from "../../utils/cn";

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setCredentials({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateUser(user!.id, credentials);
      if (updatedUser) {
        await login({ email: credentials.email, password: credentials.password || user!.password });
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to logout");
    }
  };

  if (!user) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <StatusBar barStyle="dark-content" />
        <Text className="text-gray-600 text-base text-center">Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <View className="h-1/5 bg-blue-500 rounded-b-3xl justify-center items-center">
        <Text className="text-white text-2xl font-bold">Your Profile</Text>
      </View>
      <View className="flex-1 px-6 -mt-8">
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Input
            label="Name"
            value={credentials.name}
            onChangeText={(text) => setCredentials({ ...credentials, name: text })}
            placeholder="Enter your name"
            secureTextEntry={false}
            className={cn(isEditing ? "focus:border-blue-400" : "opacity-70", "text-base")}
          />
          <Input
            label="Email"
            value={credentials.email}
            onChangeText={(text) => setCredentials({ ...credentials, email: text })}
            placeholder="Enter your email"
            secureTextEntry={false}
            className={cn(isEditing ? "focus:border-blue-400" : "opacity-70", "text-base")}
          />
         
          <Button
            title={isEditing ? "Save Changes" : "Edit Profile"}
            onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
            className="transition-all duration-200 active:scale-95"
          />
          <Button
            title="Logout"
            onPress={handleLogout}
            className="bg-gray-500 mt-2"
          />
        </View>
      </View>
    </View>
  );
}