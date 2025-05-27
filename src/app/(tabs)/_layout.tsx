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
            backgroundColor: "#121212",
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            height: 70,
            paddingBottom: 10
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={["rgba(18, 18, 18, 0.95)", "rgba(30, 30, 30, 0.95)"]}
              style={{
                flex: 1,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            />
          ),
          tabBarActiveTintColor: "#1DB954",
          tabBarInactiveTintColor: "#B3B3B3",
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "CircularStd-Medium",
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="home" color={color} focused={focused} size={24} />
            ),
            headerRight: () => (
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={24}
                      color="#1DB954"
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
              <TabBarIcon name="list" color={color} focused={focused} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-expense"
          options={{
            title: "Add Expense",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="plus" color={color} focused={focused} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="user" color={color} focused={focused} size={24} />
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