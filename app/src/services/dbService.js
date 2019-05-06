/**
 * @class Database
 */

// import * as firebase from "firebase";
// import 'firebase/firestore'
import Firebase from '@config/firebase';

export default class Database {

    constructor(props) {
        console.log('test', props)
    }

    /**
     * Get current Database
     */
    static getDatabase() {
        if (!Firebase.firebaseAppsLength) {
            console.log('Firebase NOT Inizialized');
            Firebase.initialize();
        } else {
        }

        return Firebase.getFirestore();
    }

    /**
     * Get questions collection
     */
    static getQuestionsCol() {
        return this.getDatabase().collection("questions");
    }

    /**
     * Get answers collection
     */
    static getAnswersCol() {
        return this.getDatabase().collection("answers");
    }

    /**
     * Sets a users mobile number
     * @param userId
     * @param mobile
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserMobile(userId, mobile) {

        let userMobilePath = "/user/" + userId + "/details";

        return this.getDatabase().ref(userMobilePath).set({
            mobile: mobile
        })

    }

    /**
     * Listen for changes to a users mobile number
     * @param userId
     * @param callback Users mobile number
     */
    static listenUserMobile(userId, callback) {

        let userMobilePath = "/user/" + userId + "/details";

        this.getDatabase().ref(userMobilePath).on('value', (snapshot) => {

            var mobile = "";

            if (snapshot.val()) {
                mobile = snapshot.val().mobile
            }

            callback(mobile)
        });
    }

    /**
     * Add new question
     *
     * @param fromPhone
     * @param text question text
     * @param image question image
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addQuestion(fromPhone, text, image) {
        let question = {
            fromPhone,
            text,
        }

        if (image) {
            question.image = image
        }
        return this.getQuestionsCol().add(question);
    }

    /**
     * Get all question by fromPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getQuestionsByPhone(fromPhone) {
        return this.getQuestionsCol().where("fromPhone", "==", fromPhone).get();
    }

    /**
     * Get question by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getQuestion(id) {
        return this.getQuestionsCol().doc(id).get();
    }

    /**
     * Add new answer
     *
     * @param toPhone
     * @param text answer text
     * @param image answer image
     * @param questionId question id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addAnswer(toPhone, text, image, questionId) {
        let answer = {
            toPhone,
            text,
            questionId,
        }
        if (image) {
            answer.image = image
        }

        return this.getAnswersCol().add(answer);
    }

    // /**
    //  * Get all question by fromPhone number
    //  * @param fromPhone
    //  * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
    //  */
    // static getQuestionsByPhone({fromPhone}) {
    //     return this.getQuestionsCol().where("fromPhone", "==", fromPhone).get();
    // }

    /**
     * Add item to database
     * @param item
     */
    static addItem(item) {
        this.getDatabase().ref('/items').push({
            name: item
        });
    }

    static get firebase() {
        return Firebase.getFirebase();
    }

    static get imageRef() {
        return Firebase.getImageRef();
    }

    // //Progress bar add
    // static uploadImageAsync = async (uri) => {
    //     const blob = await new Promise((resolve, reject) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.onload = function () {
    //             resolve(xhr.response);
    //         };
    //         xhr.onerror = function (e) {
    //             console.log(e);
    //             reject(new TypeError('Network request failed'));
    //         };
    //         xhr.responseType = 'blob';
    //         xhr.open('GET', uri, true);
    //         xhr.send(null);
    //     });

    //     const ref = this.getImageRef()
    //         .child(uuid.v4());
    //     const uploadTask  = await ref.put(blob);

    //     blob.close();

    //     return await uploadTask.ref.getDownloadURL();
    // }
};