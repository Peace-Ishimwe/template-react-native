import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/contexts/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" />
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#3B82F6", "#1E3A8A"]}
        className="h-1/3 rounded-b-3xl justify-center items-center"
      >
        <Animated.View entering={FadeInUp.duration(500)} className="flex flex-col items-center">
          <Animated.Text
            className={"text-white text-3xl font-bold"}
          >
            Welcome back 👋,
          </Animated.Text>
          <Animated.Text
            className={"text-white text-3xl font-bold"}
          >
            {user?.username || "User"}!
          </Animated.Text>
        </Animated.View>
        <Text className="text-white text-lg mt-2 opacity-80">
          Manage Your Finances with Ease
        </Text>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 -mt-8">
        {/* Summary Cards */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          className="mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-md flex-row justify-between">
            <View>
              <Text className="text-gray-600 text-sm">Total Expenses</Text>
              <Text className="text-blue-500 text-2xl font-bold">
                $1,245.50
              </Text>
            </View>
            <FontAwesome name="dollar" size={24} color="#3B82F6" />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          className="mb-6"
        >
          <View className="bg-white rounded-xl p-4 shadow-md flex-row justify-between">
            <View>
              <Text className="text-gray-600 text-sm">Budget Status</Text>
              <Text className="text-green-500 text-2xl font-bold">
                On Track
              </Text>
            </View>
            <FontAwesome name="check-circle" size={24} color="#22C55E" />
          </View>
        </Animated.View>

        {/* Navigation Buttons */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(600)}
          className="mb-6"
        >
          <Link href="/(tabs)/expenses" asChild>
            <TouchableOpacity className="bg-blue-500 rounded-xl p-4 flex-row justify-between items-center">
              <Text className="text-white text-lg font-semibold">
                View Expenses
              </Text>
              <FontAwesome name="list" size={20} color="#fff" />
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(800)}
        className="absolute bottom-6 right-6"
      >
        <Link href="/(tabs)/create-expense" asChild>
          <TouchableOpacity
            className={cn(
              "bg-blue-500 w-16 h-16 rounded-full justify-center items-center shadow-lg",
              "active:scale-90 transition-all duration-200"
            )}
          >
            <FontAwesome name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  );
}
