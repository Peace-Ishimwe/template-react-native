import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { cn } from "../utils/cn";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ title, className, ...rest }) => {
  return (
    <TouchableOpacity
      className={cn(
        "bg-blue-500 rounded-lg py-3 px-4 items-center",
        className
      )}
      {...rest}
    >
      <Text className="text-white text-base font-medium">{title}</Text>
    </TouchableOpacity>
  );
};
