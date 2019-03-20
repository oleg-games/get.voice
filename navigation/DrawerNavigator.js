import { createDrawerNavigator } from 'react-navigation';
import QuestionsBottomTabNavigator from '../navigation/QuestionsBottomTabNavigator'
import AnswersTabNavigator from '../navigation/AnswersTabNavigator'

export default createDrawerNavigator({
    Questions: {
        screen: QuestionsBottomTabNavigator,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: `Questions`,
        }),
    },
    Answers: {
        screen: AnswersTabNavigator,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: `Answers`,
        }),
    },
});