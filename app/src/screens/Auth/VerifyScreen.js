import React from 'react';
import GVComponent from '@components/GVComponent';

import {
  AppRegistry,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  AsyncStorage,
  ScrollView,
} from 'react-native';

import {
  Row,
  Grid,
  Icon,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from 'native-base';
import { PRIMARY_STANDART_MARGIN } from '@styles/common.js';

import Form from 'react-native-form';
import CountryPicker from 'react-native-country-picker-modal';
// import { parsePhoneNumberFromString, parsePhoneNumber, ParseError } from 'libphonenumber-js'
// import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/mobile'
// import { formatIncompletePhoneNumber, AsYouType } from 'libphonenumber-js'
// import googleLib from 'google-libphonenumber';
// import phoneFormatter from 'phone';
// import PhoneNumberA from 'awesome-phonenumber';
import Standart from '@styles/standart.js';

// import Form from 'react-native-form';
// import CountryPicker from 'react-native-country-picker-modal';
import { Auth } from '@services';
import { Linking, WebBrowser } from 'expo'

const captchaUrl = `https://get-voice-4d167.firebaseapp.com/?appurl=${Linking.makeUrl('')}`
// // const captchaUrl = `https://workers-ef768.firebaseapp.com/captcha.html?appurl=${Linking.makeUrl('')}`

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
    flex: 1
  },
  header: {
    flex: 0.1,
    margin: PRIMARY_STANDART_MARGIN,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: PRIMARY_STANDART_MARGIN,
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    // fontSize: 20,
    // color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    // backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    // color: '#fff',
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
    // fontSize: 20,
    // color: brandColor,
    // fontWeight: 'bold',
    paddingRight: 20
  }
});

export default class Verify extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      //       user: undefined,
      phone: '',
      confirmationResult: undefined,
      //       code: ''
      enterCode: false,
      country: {
        cca2: 'RU',
        callingCode: '7'
      }
    };
    Auth.getAuth().onAuthStateChanged(user => {
      this.setState({ user })
    })
  }

  reset = () => {
    this.setState({
      phone: '',
      phoneCompleted: false,
      confirmationResult: undefined,
      code: ''
    })
  }

  _getCode = async () => {
    console.log('test')
    const { phoneNumber } = this.refs.form.getValues();
    console.log('phoneNumber', phoneNumber)

    this.setState({ loading: true });

    let token = null
    const listener = ({ url }) => {
      WebBrowser.dismissBrowser()
      const tokenEncoded = Linking.parse(url).queryParams['token']
      if (tokenEncoded)
        token = decodeURIComponent(tokenEncoded)
    }
    Linking.addEventListener('url', listener)
    await WebBrowser.openBrowserAsync(captchaUrl)
    Linking.removeEventListener('url', listener)

    if (token) {
      const { country } = this.state;
      //fake firebase.auth.ApplicationVerifier
      //fake Database.getAuth().ApplicationVerifier
      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token)
      }

      try {
        const confirmationResult = await Auth.getAuth().signInWithPhoneNumber(`+${country.callingCode}${phoneNumber}`, captchaVerifier)
        this.setState({ confirmationResult })
        setTimeout(() => {
          Alert.alert('Sent!', "We've sent you a verification code", [{
            text: 'OK',
            onPress: () => this.refs.form.refs.textInput.focus()
          }]);
        }, 100);
        this.setState({
          loading: false,
          enterCode: true,
        });


      } catch (e) {
        console.warn(e)
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  _verifyCode = async () => {
    this.setState({ loading: true });
    try {
      const { confirmationResult } = this.state
      const { code } = this.refs.form.getValues();
      await confirmationResult.confirm(code + '')
      this.reset()
      this.setState({ loading: false });
      Alert.alert('Success!', 'You have successfully verified your phone number');
      this.props.navigation.navigate('App');
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert('Oops!', err.message);
    }
  }

  _onChangeText = (val) => {
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE)
      this._verifyCode();
  }

  _tryAgain = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: '' })
    this.refs.form.refs.textInput.focus();
    this.setState({ enterCode: false });
  }

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode();
  }

  _getValidPhoneNumber() {

  }


  _changeCountry = (country) => {
    this.setState({ country });
    this.refs.form.refs.textInput.focus();
  }

  _renderFooter = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
      </View>
    );

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng' />
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  _renderContent() {
    let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
    } : {};

    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Text style={styles.header}>{headerText}</Text>

            <Form ref={'form'} style={styles.form}>

              <View style={{ flexDirection: 'row' }}>

                {this._renderCountryPicker()}
                {this._renderCallingCode()}

                <TextInput
                  ref={'textInput'}
                  name={this.state.enterCode ? 'code' : 'phoneNumber'}
                  type={'TextInput'}
                  underlineColorAndroid={'transparent'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={this._onChangeText}
                  placeholder={this.state.enterCode ? '_ _ _ _ _ _' : 'Phone Number'}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  style={[styles.textInput, textStyle]}
                  returnKeyType='go'
                  autoFocus
                  // placeholderTextColor={brandColor}
                  // selectionColor={brandColor}
                  maxLength={this.state.enterCode ? 6 : 20}
                  onSubmitEditing={this._getSubmitAction} />

              </View>

              {this._renderFooter()}

            </Form>

          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._getSubmitAction}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text>{buttonText}</Text>
            </Button>
          </Row>
        </Grid>
      </Content>);
  };
}
