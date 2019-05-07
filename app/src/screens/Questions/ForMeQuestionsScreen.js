import React from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Row, Grid, Header, Icon, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import { AppLoading, ImagePicker, Permissions, Font, Contacts } from 'expo';
// At the top of your file
import { Ionicons } from '@expo/vector-icons';
import Standart from '@styles/standart';
import StorageConst from '@constants/Storage';
import questions from '@data/questions';

export default class ForMeQuestionsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      fontLoaded: false,
      items: questions.forMe
    };
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'For me Questions',
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
          <Grid>
            <Row style={Standart.container}>
              <List
                dataArray={this.state.items}
                renderRow={(item) =>
                  <ListItem thumbnail onPress={this._showQuestionForMe.bind(this, item)}>
                    <Left>
                      <Thumbnail square source={{uri: item.questionImage}} />
                    </Left>
                    <Body>
                      <Text style={Standart.listItemText}>{item.questionText}</Text>
                      <Text style={Standart.listItemSubText}>From: {item.fromPhone}</Text>
                    </Body>
                  </ListItem>
                } />
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }

  _showQuestionForMe = async (answer) => {
    const { navigate } = this.props.navigation;
    await AsyncStorage.setItem(StorageConst.QUESTION, answer.id);
    navigate('ForMeQuestion', {
      haveNotAnswer: true,
    })
  };
}