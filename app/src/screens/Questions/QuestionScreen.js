import React from 'react';
import GVComponent from '@components/GVComponent';
import { AsyncStorage, Image } from 'react-native';
import { Textarea, Form, Grid, Icon, Row, Content, Button, Text, Label } from 'native-base';
import { ImagePicker, Permissions, Contacts } from 'expo';
import Standart from '@styles/standart.js';
import StorageConst from '@constants/Storage';
import { Questions } from '@services';
import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: `https://us-central1-get-voice-4d167.cloudfunctions.net`,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

export default class QuestionScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      questionText: '',
      question: undefined,
      text: '',
      value: '',
      containsError: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && params.id ? 'Question' : 'New Question',
    };
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Form style={{ flex: 1 }}>
              <Label
                style={this.state.question ? Standart.questionText : Standart.NONE}>
                {this.state.question && this.state.question.text}
              </Label>
              <Textarea
                rowSpan={5}
                style={!this.state.question ? Standart.questionText : Standart.NONE}
                value={this.state.questionText}
                bordered
                placeholder="Question"
                onChangeText={(questionText) => this.setState({ questionText })} />
              <Button
                iconLeft
                block
                light
                style={!this.state.question ? Standart.button : Standart.NONE}
                onPress={this._onAddImage}>
                <Icon name='add' />
                <Text> Add Image </Text>
              </Button>
              <Image
                source={!this.state.question ? { uri: this.state.imgSource } : { uri: this.state.question.image }}
                style={Standart.questionImage}
              />
            </Form>
          </Row>
          <Row style={!this.state.question ? Standart.buttonRow : Standart.NONE}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._onAddQuestion}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Submit </Text>
            </Button>
          </Row>
        </Grid>
      </Content>);
  }

  componentWillUnmount = async () => {
    await AsyncStorage.removeItem(StorageConst.QUESTION);
  }

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
      const questionId = await AsyncStorage.getItem(StorageConst.QUESTION);

      if (questionId) {
        const question = await Questions.getQuestion(questionId);

        if (question && question.exists) {
          this.setState({ question: { ...question.data(), id: question.id } });
        } else {
          throw new Error(`cannot find question with id ${questionId}`);
        }
      }

      this.setState({ phoneNumber });
    } catch (error) {
      console.log(error)
      alert('error loading item', error);
    } finally {
      this._isLoading(false);
    }
  }

  _onAddQuestion = async () => {
    if (!this.state.questionText) {
      alert('Please fill question text')
      return;
    }

    try {
      this._isLoading(true);
      const url = this.state.imgSource && await this._handleImagePicked(this.state.imgSource);
      await this._showFirstContactAsync(url);
    } catch (err) {
      console.log('Error when add question', err);
      alert('Error when add question', err);
    } finally {
      this._isLoading(false);
    }
  };

  _handleImagePicked = async pickerResult => {
    try {
      return await this._uploadImageAsync(pickerResult);
    } catch (e) {
      console.log(e);
      alert('Upload failed:', error);
    }
  };

  async _showFirstContactAsync(url) {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    if (permission.status !== 'granted') {
      throw new Error('Denied CONTACTS permissions!');
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
      const { id } = await Questions.addQuestion(this.state.phoneNumber, this.state.questionText, url);
      await axiosPublic.post('/addAnswers', {
        questionId: id,
        contacts: allContacts,
      });

      this.props.navigation.goBack();
    }
  }

  _cleanAll = () => {
    this.setState({ questionText: '' })
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

    this.setState({ imgSource: result.uri });
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