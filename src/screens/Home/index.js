import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Produtos from '../Produtos';
import Carrinho from '../Carrinho';

const { Navigator, Screen } = createBottomTabNavigator();

export default function Home() {
  return (
    <Navigator tabBarOptions={{activeTintColor: '#e91e63'}}>    
      <Screen
        name="Produtos" component={Produtos}
        options={{ tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={"black"} size={30} />
        )}}
      />

      <Screen
        name="Carrinho" component={Carrinho}
        options={{ tabBarIcon: () => (
            <MaterialCommunityIcons name="home" color={"black"} size={30} />
        )}}
      />
    </Navigator>
  );
}
