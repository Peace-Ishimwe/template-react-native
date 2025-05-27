import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery } from "@tanstack/react-query";
import { PieChart } from "react-native-chart-kit";
import { cn } from "@/src/utils/cn";
import { getExpenses } from "@/src/services/api";
import { useAuth } from "@/src/contexts/AuthContext";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: () => getExpenses(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Calculate metrics
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  const monthlyBudget = 10000;
  const budgetStatus =
    totalExpenses <= monthlyBudget ? "On Track" : "Over Budget";
  const budgetColor = totalExpenses <= monthlyBudget ? "#22C55E" : "#EF4444";

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryBreakdown).map(
    ([name, value], index) => ({
      name,
      amount: value,
      color: ["#3B82F6", "#22C55E", "#EF4444", "#F59E0B", "#8B5CF6", "#EC4899"][
        index % 6
      ],
      legendFontColor: "#374151",
      legendFontSize: 12,
    })
  );

  // Recent expenses (last 5, sorted by date or createdAt)
  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt).getTime() -
        new Date(a.date || a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#3B82F6", "#1E3A8A"]}
        className="h-1/4 rounded-b-3xl justify-center items-center"
      >
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="flex flex-col items-center"
        >
          <Text className="text-white text-3xl font-bold">
            Welcome back 👋,
          </Text>
          <Text className="text-white text-3xl font-bold">
            {user?.username || "User"}!
          </Text>
        </Animated.View>
        <Text className="text-white text-lg mt-2 opacity-80">
          Manage Your Finances with Ease
        </Text>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 -mt-8">
        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-12">
            <Text className="text-white text-lg">Loading dashboard...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center mt-4">
            <Text className="text-white text-lg">Error loading data.</Text>
          </View>
        ) : (
          <>
            {/* Total Expenses Card */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(200)}
              className="mb-6"
            >
              <View className="bg-white rounded-xl p-4 shadow-md flex-row justify-between">
                <View>
                  <Text className="text-gray-600 text-sm">Total Expenses</Text>
                  <Text className="text-blue-500 text-2xl font-bold">
                    ${totalExpenses.toFixed(2)}
                  </Text>
                </View>
                <FontAwesome name="dollar" size={24} color="#3B82F6" />
              </View>
            </Animated.View>

            {/* Budget Status Card */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(400)}
              className="mb-6"
            >
              <View className="bg-white rounded-xl p-4 shadow-md flex-row justify-between">
                <View>
                  <Text className="text-gray-600 text-sm">Budget Status</Text>
                  <Text
                    className={cn(
                      "text-2xl font-bold",
                      totalExpenses <= monthlyBudget
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {budgetStatus}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    ${totalExpenses.toFixed(2)} / ${monthlyBudget.toFixed(2)}
                  </Text>
                </View>
                <FontAwesome
                  name={
                    totalExpenses <= monthlyBudget
                      ? "check-circle"
                      : "exclamation-circle"
                  }
                  size={24}
                  color={budgetColor}
                />
              </View>
            </Animated.View>

            {/* Category Breakdown Card */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(600)}
              className="mb-6"
            >
              <View className="bg-white rounded-xl p-4 shadow-md">
                <Text className="text-gray-600 text-sm mb-2">
                  Expenses by Category
                </Text>
                {pieChartData.length > 0 ? (
                  <PieChart
                    data={pieChartData}
                    width={screenWidth - 48} // Adjust for padding
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(55, 65, 81, ${opacity})`,
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                ) : (
                  <Text className="text-gray-500 text-sm">
                    No category data available.
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Recent Expenses Card */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(800)}
              className="mb-6"
            >
              <View className="bg-white rounded-xl p-4 shadow-md">
                <Text className="text-gray-600 text-sm mb-2">
                  Recent Expenses
                </Text>
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <TouchableOpacity
                      key={expense.id}
                      className="flex-row justify-between py-2 border-b border-gray-200"
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/expense-detail",
                          params: { id: expense.id },
                        })
                      }
                    >
                      <View>
                        <Text className="text-gray-800 text-base">
                          {expense.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {expense.date
                            ? new Date(expense.date).toLocaleDateString()
                            : new Date(expense.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text className="text-blue-500 text-base">
                        ${parseFloat(expense.amount).toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text className="text-gray-500 text-sm">
                    No recent expenses.
                  </Text>
                )}
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(1200)}
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
