import React from "react";
import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { cn } from "../utils/cn";

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  focused: boolean;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  color,
  focused,
  size = 24,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(focused ? 1.1 : 1, { duration: 200 }) }],
    opacity: withTiming(focused ? 1 : 0.7, { duration: 200 }),
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={cn("items-center justify-center")}
    >
      <FontAwesome
        size={size}
        name={name}
        color={color}
        className={cn("mb-1")}
      />
    </Animated.View>
  );
};