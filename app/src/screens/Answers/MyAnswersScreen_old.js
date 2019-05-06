import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  // AlertIOS
} from 'react-native';
// import { PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '../styles/common.js';
// import { addItem } from '@services/ItemService';
import { YellowBox } from 'react-native';

export default class MyQuestionsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    YellowBox.ignoreWarnings(['Setting a timer']);
  }
  handleChange(e) {
    this.setState({
      name: e.nativeEvent.text
    });
  }
  handleSubmit() {
    // addItem(this.state.name);
    console.log('Item saved successfully');
    // AlertIOS.alert(
    //   'Item saved successfully'
    //  );
  }
  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Add Item</Text>
        <TextInput
              style={styles.itemInput}
              onChange={this.handleChange}
            />
        <TouchableHighlight
                style = {styles.button}
                underlayColor= "white"
                onPress = {this.handleSubmit}
              >
              <Text
                  style={styles.buttonText}>
                  Add
              </Text>
            </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
main: {
  flex: 1,
  padding: 30,
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: '#2a8ab7'
},
title: {
  marginBottom: 20,
  fontSize: 25,
  textAlign: 'center'
},
itemInput: {
  height: 50,
  padding: 4,
  marginRight: 5,
  fontSize: 23,
  borderWidth: 1,
  borderColor: 'white',
  borderRadius: 8,
  color: 'white'
},
buttonText: {
  fontSize: 18,
  color: '#111',
  alignSelf: 'center'
},
button: {
  height: 45,
  flexDirection: 'row',
  backgroundColor:'white',
  borderColor: 'white',
  borderWidth: 1,
  borderRadius: 8,
  marginBottom: 10,
  marginTop: 10,
  alignSelf: 'stretch',
  justifyContent: 'center'
}
});