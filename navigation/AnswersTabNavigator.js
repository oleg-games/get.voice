import { createBottomTabNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'

export default createBottomTabNavigator({
    Home: HomeScreen,
    Settings: SettingsScreen,
});