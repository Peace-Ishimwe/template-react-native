import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TabBarIcon } from "@/src/components/TabBarIcon";
import { cn } from "@/src/utils/cn";
import { ProtectedRoute } from "@/src/components/ProtectedRoute";

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            height: 70,
            paddingBottom: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.9)", "rgba(240, 240, 245, 0.95)"]}
              style={{
                flex: 1,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
          ),
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="home" color={color} focused={focused} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color="#3B82F6"
                      className={cn(
                        "mr-4",
                        pressed && "opacity-50",
                        "transition-opacity duration-200"
                      )}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="list" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-expense"
          options={{
            title: "Add Expense",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="plus" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="expense-detail"
          options={{
            title: "Expense Detail",
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
