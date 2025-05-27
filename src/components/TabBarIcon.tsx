import React from 'react';
import { View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { cn } from '../utils/cn';

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color, focused }) => {
  return (
    <View className={cn('items-center justify-center transition-all duration-300', focused && 'scale-110')}>
      <FontAwesome
        size={28}
        className={cn('-mb-[3px]', focused ? 'opacity-100' : 'opacity-70')}
        name={name}
        color={color}
      />
      {focused && <View className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full" />}
    </View>
  );
};