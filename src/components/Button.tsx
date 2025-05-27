import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "../utils/cn";

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, className }) => {
  return (
    <TouchableOpacity
      className={cn(
        "bg-blue-500 rounded-lg py-3 px-4 items-center",
        className
      )}
      onPress={onPress}
    >
      <Text className="text-white text-base font-medium">{title}</Text>
    </TouchableOpacity>
  );
};