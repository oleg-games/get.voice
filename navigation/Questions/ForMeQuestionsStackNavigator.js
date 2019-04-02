import { createStackNavigator } from 'react-navigation';
// import QuestionsBottomTabNavigator from '../navigation/QuestionsBottomTabNavigator'
import MyQuestionsScreen from '../../screens/Questions/MyQuestionsScreen'

export default createStackNavigator({
    Item: MyQuestionsScreen
});