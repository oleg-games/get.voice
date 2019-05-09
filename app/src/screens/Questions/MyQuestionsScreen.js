import React from 'react';
import GVComponent from '@components/GVComponent';
import { AsyncStorage } from 'react-native';
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
// At the top of your file
import Standart from '@styles/standart';
import StorageConst from '@constants/Storage';

import Database from '@services/dbService';
export default class MyQuestionsScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      items: [],
    };
    this._bootstrapAsync();
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'My Questions',
  };

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const questionsSnapshot = await Database.getQuestionsByPhone('89507355808');
      const items = questionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      this.setState({ items });
    } catch (error) {
      console.log('error loading items', error);
      alert('error loading items', error);
    } finally {
      this._isLoading(false);
    }
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <List
              dataArray={this.state.items}
              renderRow={(item) =>
                <ListItem thumbnail onPress={this._showSelectedQuestion.bind(this, item)}>
                  <Left>
                    <Thumbnail square source={{ uri: item.image }} />
                  </Left>
                  <Body>
                    <Text style={Standart.listItemText}>{item.text}</Text>
                  </Body>
                  <Right>
                  </Right>
                </ListItem>
              } />
          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._showNewQuestion}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Add Question </Text>
            </Button>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._fillData}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Fill DB </Text>
            </Button>
          </Row>
        </Grid>
      </Content>);
  };

  _showSelectedQuestion = async (question) => {
    const { navigate } = this.props.navigation;
    await AsyncStorage.setItem(StorageConst.QUESTION, question.id);
    navigate('MyQuestion', {
      id: question.id,
    })
  };

  _showNewQuestion = async () => {
    const { navigate } = this.props.navigation;
    navigate('MyQuestion')
  };

  _fillData = async () => {
    await Database.initDatabase();
  };
}