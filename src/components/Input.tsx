import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { cn } from "../utils/cn";

interface InputProps extends TextInputProps {
  label: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  className,
  ...rest
}) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 text-base mb-2">{label}</Text>
      <TextInput
        className={cn(
          "bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800",
          className
        )}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
};
