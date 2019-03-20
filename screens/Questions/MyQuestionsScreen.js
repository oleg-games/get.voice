import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  SectionList,
  AsyncStorage,
  View,
  Text,
} from 'react-native';
// import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '../styles/common.js';

export default class MyQuestionsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
    };
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'red' }}>
          {/* <Text>{this.state.phoneNumber}</Text> */}
          <SectionList
            renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            )}
            sections={[
              { title: 'Title1', data: ['item1', 'item2'] },
              { title: 'Title2', data: ['item3', 'item4'] },
              { title: 'Title3', data: ['item5', 'item6'] },
            ]}
            keyExtractor={(item, index) => item + index}
          />
        </View>
        <View style={{ backgroundColor: 'blue' }}>
          <Button
            onPress={this.onPressLearnMore}
            title="Learn More"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  onPressLearnMore = () => {
    console.log('test');
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      justifyContent: 'space-between',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
// const styles = StyleSheet.create({
//   container: {
//    flex: 1,
//    paddingTop: 22
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
// })
// export default StyleSheet.create({
//   backgroundColor: PRIMARY_COLOR,
//   color: PRIMARY_COLOR_DARK
// });