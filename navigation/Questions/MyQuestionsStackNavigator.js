import { createStackNavigator } from 'react-navigation';
// import QuestionsBottomTabNavigator from '../navigation/QuestionsBottomTabNavigator'
import MyQuestionsScreen from '../../screens/Questions/MyQuestionsScreen'
import NewQuestionScreen from '../../screens/Questions/NewQuestionScreen'

export default createStackNavigator({
    MyQuestions: MyQuestionsScreen,
    NewQuestion: NewQuestionScreen,
},{
    initialRouteName: 'MyQuestions',
});