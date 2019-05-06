import React from 'react';
import { AsyncStorage, Image } from 'react-native';
import { DeckSwiper, Container, Row, Grid, Header, Icon, Content, List, ListItem, Card, CardItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { AppLoading, ImagePicker, Permissions, Font, Contacts } from 'expo';
// At the top of your file
import { Ionicons } from '@expo/vector-icons';
import Standart from '@styles/standart';
import StorageConst from '@constants/Storage';
import answers from '@data/answers';

export default class MyAnswersScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      fontLoaded: false,
      items: answers.my
    };
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'My Answers',
  };

  // Later on in your component
  async componentDidMount() {
    try {
      await Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
      this.setState({ fontLoaded: true });
    } catch (error) {
      alert('error loading icon fonts', error);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    return (
      <Container>
        <Content padder contentContainerStyle={Standart.container}>
          <DeckSwiper
            dataSource={this.state.items}
            renderItem={(item) =>
              <Card style={{ elevation: 3 }}>
                <CardItem>
                  <Left style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                    <Thumbnail style={{flex: 0.4}} source={{uri: item.questionImage}} />
                    <Body>
                      <Text>{item.questionText}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem>
                  <Left style={{flexDirection: 'column', justifyContent: 'space-around'}}>
                    <Thumbnail style={{flex: 0.4}} source={{uri: item.image}} />
                    <Body>
                      <Text>{item.text}</Text>
                      <Text note>To: {item.toPhone}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            } />
        </Content>
      </Container>
    );
  }
}