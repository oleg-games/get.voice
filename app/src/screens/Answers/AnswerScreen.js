import React from 'react';
import {  StyleSheet,  AsyncStorage,  Image } from 'react-native';
import { Container, Textarea, Form, Grid, Icon, Row, Content, Button, Text, Label } from 'native-base';
import { AppLoading, ImagePicker, Permissions, Font, Contacts } from 'expo';
import { PRIMARY_STANDART_MARGIN } from '@styles/common.js';
import Standart from '@styles/standart.js';
import StorageConst from '@constants/Storage';
// At the top of your file
import { Ionicons } from '@expo/vector-icons';
import questions from '@data/questions';

export default class AnswerScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      answerText: '',
      answer: undefined,
      text: '',
      value: 'aaaa',
      imageUri: undefined,
      fontLoaded: false,
      containsError: false,
    };
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && params.haveNotAnswer ? 'Get Answer' : 'Answer'
    };
  };

  // Later on in your component
  async componentDidMount() {
    await this._loadFonts();
    await this._loadParams();
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }
    console.log('this.state.answer.image', this.state)
    return (
      <Container>
        <Content padder contentContainerStyle={Standart.container}>
          <Grid>
            <Row style={Standart.container}>
              <Form ref={'form'} style={{ flex: 1 }}>
                <Label
                  style={Standart.answerText}>
                  {this.state.answer && this.state.answer.questionText}
                </Label>
                <Label
                  style={Standart.itemSubText}>
                  From: {this.state.answer && this.state.answer.fromPhone}
                </Label>
                <Textarea
                  rowSpan={5}
                  // style={!this.state.answer ? Standart.answerText : Standart.NONE}
                  style={Standart.questionText}
                  value={this.state.answerText}
                  bordered
                  placeholder="Answer"
                  onChangeText={(answerText) => this.setState({ answerText })} />
                <Button
                  iconLeft
                  block
                  light
                  style={Standart.button}
                  // style={!this.state.answer ? Standart.button : Standart.NONE}
                  onPress={this._onAddImage}>
                  <Icon name='add' />
                  <Text> Add Image </Text>
                </Button>
                <Image
                  source={{ uri: this.state.imageUri }}
                  style={this.state.answer && this.state.answer.answerImage ? Standart.answerImage : Standart.NONE}
                />
                <Image
                  source={{ uri: this.state.imageUri }}
                  style={this.state.imageUri ? Standart.answerImage : Standart.NONE}
                />
                {/* <Image
                  source={!(this.state.answer && this.state.answer.id) ? { uri: this.state.imageUri } : { uri: this.state.answer.image}}
                  style={Standart.answerImage}
                /> */}
                <Image
                  source={{ uri: this.state.answer && this.state.answer.questionImage}}
                  style={Standart.questionImage}
                />
              </Form>
            </Row>
            <Row style={!(this.state.answer && this.state.answer.text) ? Standart.buttonRow : Standart.NONE}>
              <Button
                iconLeft
                block
                primary
                style={Standart.button}
                onPress={this._onAddQuestion}>
                <Icon ios="ios-person-add" android="md-person-add" />
                <Text> Get answer </Text>
              </Button>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }

  componentWillUnmount = async () => {
    await AsyncStorage.removeItem(StorageConst.QUESTION);
  }

  _loadFonts = async () => {
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

  _loadParams = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
      const questionId = await AsyncStorage.getItem(StorageConst.QUESTION);
      //async to get answer info
      if (questionId) {
        const answer = questions && questions.forMe && questions.forMe.find((el) => el.id === questionId)
        console.log('finded answer', answer)
        if (answer) {
          this.setState({ phoneNumber, answer });
        } else {
          throw new Error(`cannot find answer with id ${questionId}`);
        }
      } else {
        this.setState({ phoneNumber });
      }
    } catch (error) {
      console.log(error)
      alert('error loading params from router', error);
    }
  }

  _onAddQuestion = () => {
    if (!this.state.answerText) {
      alert('Please fill answer text')
      return;
    }

    this._showFirstContactAsync();
  };

  async _showFirstContactAsync() {
    // Ask for permission to query contacts.
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    if (permission.status !== 'granted') {
      // Permission was denied...
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      fields: [
        Contacts.PHONE_NUMBERS,
      ],
      pageOffset: 0,
    });
    if (contacts.total > 0) {
      const allContacts = contacts.data
        .reduce((all, el) => el.phoneNumbers ? all.concat(el.phoneNumbers) : all, [])
        .map((el) => el.number);
      console.log('allContacts', allContacts)
      const { navigate } = this.props.navigation.goBack();
    }
  }

  _cleanAll = () => {
    this.setState({ answerText: '' })
  }

  _onAddImage = async () => {

    // const photos = this.state.selected;

    // if (photos.length > 0) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== 'granted') {
      throw new Error('Denied CAMERA_ROLL permissions!');
    }

    // const promises = photos.map(photoUri => {
    // MediaLibrary.createAssetAsync(photoUri);
    // return MediaLibrary.createAssetAsync(photoUri);
    // });

    // await Promise.all(promises);
    // alert('Successfully saved photos to user\'s gallery!');
    // } else {
    //   alert('No photos to save!');
    // }


    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action
    let result = await ImagePicker.launchImageLibraryAsync();

    if (result.cancelled) {
      return;
    }
    this.setState({ imageUri: result.uri });
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    // let localUri = result.uri;
    // let filename = localUri.split('/').pop();

    // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    // // Upload the image using the fetch and FormData APIs
    // let formData = new FormData();
    // // Assume "photo" is the name of the form field the server expects
    // formData.append('photo', { uri: localUri, name: filename, type });

    // return await fetch(YOUR_SERVER_URL, {
    //   method: 'POST',
    //   body: formData,
    //   header: {
    //     'content-type': 'multipart/form-data',
    //   },
    // });
  }
}
