import { createBottomTabNavigator } from 'react-navigation';
import Answers from './AnswersStackNavigator'

export default createBottomTabNavigator({
    Answers: {
        screen: Answers,
    },
    // ForMeQuestionsScreen: {
    //     screen: ForMeQuestionsScreen,
    //     // Optional: Override the `navigationOptions` for the screen
    //     // navigationOptions: ({ navigation }) => ({
    //     //     tabBarLabel: 'For Me',
    //     //     tabBarIcon: ({ focused }) => (
    //     //         <TabBarIcon
    //     //             focused={focused}
    //     //             name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    //     //         />
    //     //     ),
    //     // }),
    // },
});