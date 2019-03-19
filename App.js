import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View, Button, Image } from 'react-native';
// import { AppLoading, Asset, Font, Icon } from 'expo';
// import AppNavigator from './navigation/AppNavigator';

// import { DrawerNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

// class MyHomeScreen extends React.Component {
//   static navigationOptions = {
//     drawerLabel: 'Home',
//     drawerIcon: ({ tintColor }) => (
//       <Image
//         source={require('./assets/images/icon.png')}
//         // source={require('./assets/chats-icon.png')}
//         style={[styles.icon, {tintColor: tintColor}]}
//       />
//     ),
//   };

//   render() {
//     return (
//       <Button
//         onPress={() => this.props.navigation.navigate('Notifications')}
//         title="Go to notifications"
//       />
//     );
//   }
// }

// class MyNotificationsScreen extends React.Component {
//   static navigationOptions = {
//     drawerLabel: 'Notifications',
//     drawerIcon: ({ tintColor }) => (
//         <Image
//           source={require('./assets/images/icon.png')}
//           style={[styles.icon, {tintColor: tintColor}]}
//         />
//     ),
//   };

//   render() {
//     return (
//       <View style={[styles.container.flex]}>
//       <Button
//         onPress={() => this.props.navigation.goBack()}
//         title="Go back home"
//       />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   icon: {
//     width: 24,
//     height: 24,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });

// const MyDrawerNavigator = createDrawerNavigator({
//   Home: {
//     screen: MyHomeScreen,
//   },
//   Notifications: {
//     screen: MyNotificationsScreen,
//   },
// });

// const MyAppContainer = createAppContainer(MyDrawerNavigator);
// class App extends React.Component {
//   someEvent() {
//     // call navigate for AppNavigator here:
//     this.navigator &&
//       this.navigator.dispatch(
//         NavigationActions.navigate({ routeName: someRouteName })
//       );
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//       <Text></Text>
//       <MyAppContainer
//         ref={nav => {
//           this.navigator = nav;
//         }}
//       />
//       </View>
//     );
//   }
// }
// // const App = DrawerNavigator({
// //   Home: {
// //     screen: MyHomeScreen,
// //   },
// //   Notifications: {
// //     screen: MyNotificationsScreen,
// //   },
// // });

// export default App;
// // export default class App extends React.Component {
// //   state = {
// //     isLoadingComplete: false,
// //   };

// //   render() {
// //     if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
// //       return (
// //         <AppLoading
// //           startAsync={this._loadResourcesAsync}
// //           onError={this._handleLoadingError}
// //           onFinish={this._handleFinishLoading}
// //         />
// //       );
// //     } else {
// //       return (
// //         <View style={styles.container}>
// //           {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
// //           <AppNavigator />
// //         </View>
// //       );
// //     }
// //   }

// //   _loadResourcesAsync = async () => {
// //     return Promise.all([
// //       Asset.loadAsync([
// //         require('./assets/images/robot-dev.png'),
// //         require('./assets/images/robot-prod.png'),
// //       ]),
// //       Font.loadAsync({
// //         // This is the font that we are using for our tab bar
// //         ...Icon.Ionicons.font,
// //         // We include SpaceMono because we use it in HomeScreen.js. Feel free
// //         // to remove this if you are not using it in your app
// //         'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
// //       }),
// //     ]);
// //   };

// //   _handleLoadingError = error => {
// //     // In this case, you might want to report the error to your error
// //     // reporting service, for example Sentry
// //     console.warn(error);
// //   };

// //   _handleFinishLoading = () => {
// //     this.setState({ isLoadingComplete: true });
// //   };
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// // });

import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";

// class LogoTitle extends React.Component {
//   render() {
//     return (
//       <Image
//         source={require('./assets/images/icon.png')}
//         style={{ width: 30, height: 30 }}
//       />
//       // <Text>aaaa</Text>
//     );
//   }
// }

class HomeScreen extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: <LogoTitle />,
  //     headerRight: (
  //       <Button
  //         onPress={navigation.getParam('increaseCount')}
  //         title="+1"
  //         color="#fff"
  //       />
  //     ),
  //   };
  // };

  // componentDidMount() {
  //   this.props.navigation.setParams({ increaseCount: this._increaseCount });
  // }

  // state = {
  //   count: 0,
  // };

  // _increaseCount = () => {
  //   this.setState({ count: this.state.count + 1 });
  // };


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('Details', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    };
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Update the title"
          onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const Home = createStackNavigator(
  {
    Feed: HomeScreen,
    Profile: HomeScreen,
  }, {
    defaultNavigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#000',
      },
    },
    navigationOptions: {
      tabBarLabel: 'Home!',
    },
  }
);

const Tabs = createBottomTabNavigator({ Home });

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(RootStack);
// export default createAppContainer(Tabs);
// export default createAppContainer(AppNavigator);