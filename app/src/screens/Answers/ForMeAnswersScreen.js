import React from 'react';
import GVComponent from '@components/GVComponent';
import { AsyncStorage, Image } from 'react-native';
import { DeckSwiper, Container, Row, Grid, Header, Icon, Content, List, ListItem, Card, CardItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import Standart from '@styles/standart';
import Database from '@services/dbService';

export default class MyAnswersScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      fontLoaded: false,
      items: []
    };
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'For me Answers',
  };

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const items = await Database.getAnsersNotEmptyTextByFromPhone('89507355808');
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
        <DeckSwiper
          dataSource={this.state.items}
          renderItem={(item) =>
            <Card style={{ elevation: 3 }}>
              <CardItem>
                <Left style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Thumbnail style={{ flex: 0.4 }} source={{ uri: item.questionRef && item.questionRef.image }} />
                  <Body>
                    <Text>{item.questionRef && item.questionRef.text}</Text>
                    <Text note>To: {item.toPhone}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Left style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Thumbnail style={{ flex: 0.4 }} source={{ uri: item.image }} />
                  <Body>
                    <Text>{item.text}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                {/* TODO IOS */}
                <Icon name="md-checkmark" style={{ color: '#ED4A6A' }} onPress={this._checkAnswer.bind(this, item)} />
                <Text>{item.name}</Text>
              </CardItem>
            </Card>
          } />
      </Content>
    );
  }

  _checkAnswer = async (answer) => {
    alert('skip this answer')
  };
}