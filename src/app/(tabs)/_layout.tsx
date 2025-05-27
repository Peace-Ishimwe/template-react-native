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
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            height: 80,
            paddingBottom: 15,
            paddingTop: 10,
            position: "absolute",
            bottom: 10,
            left: 16,
            right: 16,
            borderRadius: 20,
            marginHorizontal: 16,
          },
         tabBarBackground: () => (
            <LinearGradient
              colors={["#1E1E1E", "#2A2A2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 20,
                overflow: "hidden",
              }}
            />
          ),
          tabBarActiveTintColor: "#1DB954",
          tabBarInactiveTintColor: "#B3B3B3",
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: "CircularStd-Book",
            marginTop: 2,
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