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
import { PieChart, LineChart } from "react-native-chart-kit";
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
    staleTime: 5 * 60 * 1000,
  });

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );
  const monthlyBudget = 10000;
  const budgetStatus =
    totalExpenses <= monthlyBudget ? "On Track" : "Over Budget";
  const budgetColor = totalExpenses <= monthlyBudget ? "#1DB954" : "#FF453A";

  // Pie Chart: Expenses by Category
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(categoryBreakdown).map(
    ([name, value], index) => ({
      name,
      amount: value,
      color: ["#1DB954", "#3B82F6", "#FF453A", "#F59E0B", "#8B5CF6", "#EC4899"][
        index % 6
      ],
      legendFontColor: "#B3B3B3",
      legendFontSize: 12,
    })
  );

  // Line Chart: Expenses Over Time
  const expensesByDate = expenses.reduce((acc, expense) => {
    const date = expense.date
      ? new Date(expense.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : new Date(expense.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
    acc[date] = (acc[date] || 0) + parseFloat(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(expensesByDate).sort((a, b) => {
    const dateA = new Date(a.split(" ")[1] + " " + a.split(" ")[0] + ", 2025");
    const dateB = new Date(b.split(" ")[1] + " " + b.split(" ")[0] + ", 2025");
    return dateA.getTime() - dateB.getTime();
  });

  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        data: sortedDates.map((date) => expensesByDate[date] || 0),
        color: (opacity = 1) => `rgba(29, 185, 84, ${opacity})`, // #1DB954
        strokeWidth: 2,
      },
    ],
  };

  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.date || b.createdAt).getTime() -
        new Date(a.date || a.createdAt).getTime()
    )
    .slice(0, 5);

  // Dummy data for Savings Goal
  const savingsGoal = 5000;
  const currentSavings = 3200;
  const savingsProgress = (currentSavings / savingsGoal) * 100;

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <LinearGradient
        colors={["#1DB954", "#121212"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="h-1/4 justify-center items-center"
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
      <ScrollView
        className="px-4 -mt-8"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-12">
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "CircularStd-Book" }}
            >
              Loading dashboard...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center mt-4">
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "CircularStd-Book" }}
            >
              Error loading data.
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            {/* Grid Layout for Cards */}
            <View className="flex-row flex-wrap justify-between">
              {/* Total Expenses Card */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(200)}
                className="w-[48%] mb-4"
              >
                <View className="bg-[#1E1E1E] rounded-2xl p-4 shadow-md">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text
                        className="text-[#B3B3B3] text-sm mb-1"
                        style={{ fontFamily: "CircularStd-Book" }}
                      >
                        Total Expenses
                      </Text>
                      <Text
                        className="text-white text-2xl font-bold"
                        style={{ fontFamily: "CircularStd-Medium" }}
                      >
                        ${totalExpenses.toFixed(2)}
                      </Text>
                    </View>
                    <FontAwesome name="dollar" size={24} color="#1DB954" />
                  </View>
                </View>
              </Animated.View>

              {/* Budget Status Card */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(400)}
                className="w-[48%] mb-4"
              >
                <View className="bg-[#1E1E1E] rounded-2xl p-4 shadow-md">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text
                        className="text-[#B3B3B3] text-sm mb-1"
                        style={{ fontFamily: "CircularStd-Book" }}
                      >
                        Budget Status
                      </Text>
                      <Text
                        className={cn(
                          "text-2xl font-bold",
                          totalExpenses <= monthlyBudget
                            ? "text-[#1DB954]"
                            : "text-[#FF453A]"
                        )}
                        style={{ fontFamily: "CircularStd-Medium" }}
                      >
                        {budgetStatus}
                      </Text>
                      <Text
                        className="text-[#B3B3B3] text-xs mt-1"
                        style={{ fontFamily: "CircularStd-Book" }}
                      >
                        ${totalExpenses.toFixed(2)} / $
                        {monthlyBudget.toFixed(2)}
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
                </View>
              </Animated.View>

              {/* Savings Goal Card */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(600)}
                className="w-[48%] mb-4"
              >
                <View className="bg-[#1E1E1E] rounded-2xl p-4 shadow-md">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text
                        className="text-[#B3B3B3] text-sm mb-1"
                        style={{ fontFamily: "CircularStd-Book" }}
                      >
                        Savings Goal
                      </Text>
                      <Text
                        className="text-white text-2xl font-bold"
                        style={{ fontFamily: "CircularStd-Medium" }}
                      >
                        ${currentSavings.toFixed(2)}
                      </Text>
                      <Text
                        className="text-[#B3B3B3] text-xs mt-1"
                        style={{ fontFamily: "CircularStd-Book" }}
                      >
                        {savingsProgress.toFixed(0)}% of $
                        {savingsGoal.toFixed(2)}
                      </Text>
                    </View>
                    <FontAwesome name="bank" size={24} color="#1DB954" />
                  </View>
                  <View className="bg-[#2A2A2A] h-2 rounded-full mt-2">
                    <View
                      className="bg-[#1DB954] h-2 rounded-full"
                      style={{ width: `${savingsProgress}%` }}
                    />
                  </View>
                </View>
              </Animated.View>

              {/* Finance Tip Card */}
              <Animated.View
                entering={FadeInDown.duration(400).delay(800)}
                className="w-[48%] mb-4"
              >
                <View className="bg-[#1E1E1E] rounded-2xl p-4 shadow-md">
                  <Text
                    className="text-[#B3B3B3] text-sm mb-1"
                    style={{ fontFamily: "CircularStd-Book" }}
                  >
                    Finance Tip
                  </Text>
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: "CircularStd-Medium" }}
                  >
                    Save 20% of your income each month to build a strong
                    financial cushion.
                  </Text>
                </View>
              </Animated.View>
            </View>

            {/* Expenses Over Time Line Chart */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(1200)}
              className="mb-6"
            >
              <View className="bg-[#1E1E1E] rounded-2xl p-5 shadow-md">
                <Text
                  className="text-[#B3B3B3] text-sm mb-3"
                  style={{ fontFamily: "CircularStd-Book" }}
                >
                  Expenses Over Time
                </Text>
                {sortedDates.length > 0 ? (
                  <LineChart
                    data={lineChartData}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: "#1E1E1E",
                      backgroundGradientTo: "#1E1E1E",
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(29, 185, 84, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(179, 179, 179, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#121212",
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <Text
                    className="text-[#B3B3B3] text-sm"
                    style={{ fontFamily: "CircularStd-Book" }}
                  >
                    No expense data available.
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Expenses by Category Pie Chart */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(1000)}
              className="mb-6"
            >
              <View className="bg-[#1E1E1E] rounded-2xl p-5 shadow-md">
                <Text
                  className="text-[#B3B3B3] text-sm mb-3"
                  style={{ fontFamily: "CircularStd-Book" }}
                >
                  Expenses by Category
                </Text>
                {pieChartData.length > 0 ? (
                  <PieChart
                    data={pieChartData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(29, 185, 84, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(179, 179, 179, ${opacity})`,
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={{ borderRadius: 16 }}
                  />
                ) : (
                  <Text
                    className="text-[#B3B3B3] text-sm"
                    style={{ fontFamily: "CircularStd-Book" }}
                  >
                    No category data available.
                  </Text>
                )}
              </View>
            </Animated.View>

            {/* Recent Expenses */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(1400)}
              className="mb-6"
            >
              <View className="bg-[#1E1E1E] rounded-2xl p-5 shadow-md">
                <Text
                  className="text-[#B3B3B3] text-sm mb-3"
                  style={{ fontFamily: "CircularStd-Book" }}
                >
                  Recent Expenses
                </Text>
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <TouchableOpacity
                      key={expense.id}
                      className="flex-row justify-between py-3 border-b border-[#2A2A2A]"
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/expense-detail",
                          params: { id: expense.id },
                        })
                      }
                    >
                      <View>
                        <Text
                          className="text-white font-medium"
                          style={{ fontFamily: "CircularStd-Medium" }}
                        >
                          {expense.name}
                        </Text>
                        <Text
                          className="text-[#B3B3B3] text-xs"
                          style={{ fontFamily: "CircularStd-Book" }}
                        >
                          {expense.date
                            ? new Date(expense.date).toLocaleDateString()
                            : new Date(expense.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text
                        className="text-[#1DB954] font-medium"
                        style={{ fontFamily: "CircularStd-Medium" }}
                      >
                        ${parseFloat(expense.amount).toFixed(2)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    className="text-[#B3B3B3] text-sm"
                    style={{ fontFamily: "CircularStd-Book" }}
                  >
                    No recent expenses.
                  </Text>
                )}
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(1600)}
        className="absolute bottom-6 right-6"
      >
        <Link href="/(tabs)/create-expense" asChild>
          <TouchableOpacity
            className={cn(
              "bg-[#1DB954] w-16 h-16 rounded-full justify-center items-center shadow-2xl",
              "active:scale-95 transition-transform"
            )}
          >
            <FontAwesome name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  );
}