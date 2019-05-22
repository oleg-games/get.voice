import React from 'react';
import { View, YellowBox, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { AppLoading, Font } from 'expo';
import { Container, Content, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '@/services';
import Standart from '@styles/standart';
import StorageConst from '@constants/Storage';
import { Axios } from '@http';

export default class GVComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progress: 40,
            fontLoaded: false,
            loading: false,
            imgSource: undefined,
            uploading: false,
        };

        YellowBox.ignoreWarnings(['Setting a timer']);
    }

    async componentDidMount() {
        try {
            await Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
                ...Ionicons.font,
            });
            this.setState({ fontLoaded: true });
        } catch (error) {
            console.log('error loading icon fonts', error);
            alert('error loading icon fonts', error);
        }
        this._setDefaultState();

        // Set the AUTH token for any request
        // await AsyncStorage.removeItem(StorageConst.TOKEN);
        const token = await AsyncStorage.getItem(StorageConst.TOKEN);

        if (token) {
            console.log('token', token)
            Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        await this._loadParams();
    }

    _errorHandler(err, title = "Oops. Something when't wrong!") {
        if (err && err.response && err.response.data.error && err.response.data.error.message) {
            this._errorReqHandler(err);
        } else {
            Alert.alert(title, err.message);
        }
    }

    _errorReqHandler(err) {
        if (err.response.status === 401) {
            Alert.alert('Login problems!', err && err.response && err.response.data.error && err.response.data.error.message, [{
                text: 'OK',
                onPress: async () => {
                    await AsyncStorage.removeItem(StorageConst.TOKEN);
                    const { navigate } = this.props.navigation;
                    navigate('AuthLoading')
                }
            }]);
        } else {
            Alert.alert('Oops. Someting wrong!', err && err.response && err.response.data.error && err.response.data.error.message);
        }
    }

    _setDefaultState() {
        this.setState({ loading: true });
        this.setState({ uploading: false });
        this.setState({ progress: 0 });
    }

    render() {
        const { uploading, fontLoaded, loading, imgSource, progress } = this.state;
        if (!fontLoaded) {
            return <AppLoading />;
        }
        return (
            <Container>
                {imgSource !== '' && !!uploading && !!progress && (
                    <View>
                        <View
                            style={[styles.progressBar, { width: `${progress || 0}%` }]}
                        />
                    </View>
                )}
                {!!loading && (
                    this._renderLoader()
                )}
                {!loading && (
                    this._renderContent()
                )}
            </Container>);
    }

    _renderLoader() {
        return (
            <Content padder contentContainerStyle={Standart.container}>
                <Spinner style={{ flex: 1 }} color='blue' />
            </Content>
        );
    }

    _renderContent() {
        return null;
    }

    _isLoading(isLoading) {
        this.setState({ loading: isLoading });
    }

    _isUploading(isUploading) {
        this.setState({ uploading: isUploading });
    }

    _loadParams = async () => {
        this.setState({ loading: false });
    }

    _uploadImageAsync = async (phone, uri) => {
        this.setState({ uploading: true });
        this.setState({ imgSource: uri.uri });
        this.setState({ progress: 30 });

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        var uploadTask = Storage
            .getImagePhoneRef(phone)
            .put(blob);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            this.setState({ progress: progress || 0 });
            switch (snapshot.state) {
                case Storage.instanse.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case Storage.instanse.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, (error) => {
            this.setState({ uploading: false });
            console.log('Error when upload file', error)
            alert('Error when upload file', error)
            blob.close();
        }, () => {
            blob.close();
            this.setState({ uploading: false });
        });

        await uploadTask;
        return await uploadTask.snapshot.ref.getDownloadURL();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    btn: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: 'rgb(3, 154, 229)',
        marginTop: 20,
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: 'rgba(3,155,229,0.5)'
    },
    btnTxt: {
        color: '#fff'
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200,
        resizeMode: 'contain',
        backgroundColor: '#ccc',
    },
    img: {
        flex: 1,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#ccc'
    },
    progressBar: {
        backgroundColor: 'rgb(3, 154, 229)',
        height: 3,
        shadowColor: '#000',
    }
});