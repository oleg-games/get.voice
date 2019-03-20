import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthLoadingScreen from './screens/Auth/AuthLoadingScreen'
import AuthStack from './stacks/AuthStack'
import AppStack from './stacks/AppStack'

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'App',
    // initialRouteName: 'AuthLoading',
  }
));
