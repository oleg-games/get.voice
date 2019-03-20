import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MyQuestionsScreen from '../screens/Questions/MyQuestionsScreen'
import ForMeQuestionsScreen from '../screens/Questions/ForMeQuestionsScreen'

export default createBottomTabNavigator({
    MyQuestionsScreen: {
        screen: MyQuestionsScreen,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'My',
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name={
                        Platform.OS === 'ios'
                            ? `ios-information-circle${focused ? '' : '-outline'}`
                            :
                            'md-information-circle'
                    }
                />
            ),
        }),
    },
    ForMeQuestionsScreen: {
        screen: ForMeQuestionsScreen,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'For Me',
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
                />
            ),
        }),
    },
},
    // {
    //     tabBarOptions: {
    //         activeTintColor: '#e91e63',
    //         labelStyle: {
    //             fontSize: 16,
    //         },
    //         style: {
    //             // backgroundColor: 'white',
    //         },
    //     }
    // }
);