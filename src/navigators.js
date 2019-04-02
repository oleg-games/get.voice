
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

// Navigators
import { createDrawerNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'

// StackNavigator screens
import ItemList from './ItemList'
import Item from './Item'

// TabNavigator screens
import TabA from './TabA'
import TabB from './TabB'
import TabC from './TabC'

// Plain old component
import Plain from './Plain'

export const Stack = createStackNavigator({
  ItemList: { screen: ItemList },
  Item: { screen: Item },
}, {
  initialRouteName: 'ItemList',
})

export const Tabs = createBottomTabNavigator({
  TabA: { screen: TabA },
  TabB: { screen: TabB },
  TabC: { screen: Stack },
},
{
  order: ['TabA', 'TabB', 'TabC']
}
)

export const Drawer = createDrawerNavigator({
  Stack: { screen: Stack },
  Tabs: { screen: Tabs },
  Plain: { screen: Plain },
})
