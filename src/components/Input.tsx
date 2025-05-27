import React from "react";
import { TextInput, View, Text } from "react-native";
import { cn } from "../utils/cn";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  className,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 text-base mb-2">{label}</Text>
      <TextInput
        className={cn(
          "bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800",
          className
        )}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};