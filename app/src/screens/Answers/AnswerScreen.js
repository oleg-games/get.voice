import React from 'react';
import GVComponent from '@components/GVComponent';
import { AsyncStorage, Image } from 'react-native';
import { ImagePicker, Permissions, Contacts } from 'expo';
import { Textarea, Form, Grid, Icon, Row, Content, Button, Text, Label } from 'native-base';
import { PRIMARY_STANDART_MARGIN } from '@styles/common.js';
import Standart from '@styles/standart.js';
import StorageConst from '@constants/Storage';
// At the top of your file
import { Axios } from '@http';

export default class AnswerScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      answerText: '',
      answer: undefined,
      text: '',
      value: 'aaaa',
      imgSource: undefined,
      fontLoaded: false,
      containsError: false,
      isLoadingImg: false,
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

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Form style={{ flex: 1 }}>
              <Label
                style={Standart.answerText}>
                {this.state.answer && this.state.answer.questionRef.text}
              </Label>
              <Label
                style={Standart.itemSubText}>
                From: {this.state.answer && this.state.answer.questionRef.fromPhone}
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
                source={{ uri: this.state.imgSource }}
                style={this.state.answer && this.state.answer.answerImage ? Standart.answerImage : Standart.NONE}
              />
              <Image
                source={{ uri: this.state.imgSource }}
                style={this.state.imgSource ? Standart.answerImage : Standart.NONE}
              />
              {/* <Image
                  source={!(this.state.answer && this.state.answer.id) ? { uri: this.state.imgSource } : { uri: this.state.answer.image}}
                  style={Standart.answerImage}
                /> */}
              <Image
                source={{ uri: this.state.answer && this.state.answer.questionRef.images && this.state.answer.questionRef.images[0] }}
                style={Standart.questionImage}
              />
            </Form>
          </Row>
          <Row style={Standart.buttonRow}>
            {/* <Row style={!(this.state.answer && this.state.answer.text) ? Standart.buttonRow : Standart.NONE}> */}
            <Button
              iconLeft
              block
              primary
              disabled={this.state.isLoadingImg}
              style={Standart.button}
              onPress={this._onGetAnswer}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Get answer </Text>
            </Button>
          </Row>
        </Grid>
      </Content>
    );
  }

  componentWillUnmount = async () => {
    await AsyncStorage.removeItem(StorageConst.ANSWER);
  }

  _loadParams = async () => {
    try {
      console.log('test1')
      this._isLoading(true);
      const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
      const answerId = await AsyncStorage.getItem(StorageConst.ANSWER);
      // //async to get answer info
      if (answerId) {
        console.log('answerId', answerId)
        const { data: answer } = await Axios.get(`/answers/${answerId}`);
        console.log('answer', answer)
        this.setState({ answer });
      }
      this.setState({ phoneNumber });
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  }

  _onGetAnswer = async () => {
    if (!this.state.answerText) {
      alert('Please fill answer text')
      return;
    }

    try {
      this._isLoading(true);
      await this._showFirstContactAsync(this.state.url ? [this.state.url] : []);
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  };

  async _showFirstContactAsync(url) {
    // Ask for permission to query contacts.
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
      let data = { text: this.state.answerText, images: [url], contacts: allContacts }

      // await Answers.updateAnswer(this.state.answer.id, data);
      await Axios.put(`/answers/${this.state.answer.id}`, data);
      console.log('Done')
      this.props.navigation.goBack();
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
    this.setState({ imgSource: result.uri });
    this.setState({ isLoadingImg: true });

    try {
      // const url = this.state.imgSource;
      const url = this.state.imgSource && await this._uploadImageAsync(this.state.imgSource);
      console.log('url', url)
      this.setState({ url });
    } catch (err) {
      console.log(err);
      this._errorHandler(err);
    } finally {
      this.setState({ isLoadingImg: false });
    }

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
