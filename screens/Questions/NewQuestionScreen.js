import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  SectionList,
  TextInput,
  AsyncStorage,
  View,
  Image,
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
    title: 'New Question',
  };

  render() {
    let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
      // fontFamily: 'Courier'
    } : {};
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: 'red' }}>
          <TextInput
            ref={'textInput'}
            name={this.state.enterCode ? 'code' : 'phoneNumber'}
            type={'TextInput'}
            multiline={true}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            autoCorrect={false}
            // onChangeText={this._onChangeText}
            // placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            // style={[styles.textInput, textStyle]}
            returnKeyType='go'
            autoFocus
            placeholderTextColor={brandColor}
            selectionColor={brandColor}
          // maxLength={this.state.enterCode ? 6 : 20}
          // onSubmitEditing={this._getSubmitAction}
          />
          <Image
            source={require('../../assets/images/icon.png')}
            style={[styles.icon]}
          />
        </View>
        <View style={{ backgroundColor: 'blue' }}>
          <Button
            onPress={this.onPressLearnMore}
            title="Add Question"
            accessibilityLabel="Add Question"
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

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#744BAC';

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 22,
    margin: 20,
    color: '#4A4A4A',
  },
  form: {
    margin: 20
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    fontSize: 20,
    color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    // fontFamily: 'Helvetica',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    fontSize: 20,
    color: brandColor,
    // fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingRight: 10
  },
  icon: {
    width: 24,
    height: 24,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
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