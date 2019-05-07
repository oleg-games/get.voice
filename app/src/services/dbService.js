/**
 * @class Database
 */

import Firebase from '@config/firebase';
import questions from '@data/questions';

export default class Database {

    static INIT_DATABASE = true;

    constructor(props) {
        console.log('test', props)
    }

    /**
     * Get current Database
     */
    static getDatabase() {
        console.log('this.initDate', this.INIT_DATABASE)
        // if (this.INIT_DATABASE) {
        //     this.initDatabase();
        // }

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
    static async getQuestionsByPhone(fromPhone) {
        console.log('test')
        this.getDatabase().collection("answers").get()
        // const questions = await this.getDatabase().collection("answers").get();
        // questions.forEach((el) => el.id)
        // this.getDatabase().collection("questions").where("answers.toPhone", "==", "79193424223").get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log("Sub Document ID: ", doc.id);
                })
            }).catch(err => {
                console.log("Error getting sub-collection documents", err);
            })
        // const answers = await this.getDatabase().collection("questions").where("answers.toPhone", "==", "+79193424223").get();
        // console.log('answers', answers.data())
        // answers.forEach((doc) => {
        //     console.log('test it')
        //     console.log('answers', doc.data())
        //     // const docData = await doc.ref.collection('answers').get();
        //     // console.log('datass', docData.data());
        //     // items.push({ ...doc.data(), id: doc.id });
        // });
        // console.log('aaa')

        // const questionsSnapshot = await Database.getQuestionsByPhone('89507355808')
        // const questionsSnapshot = 
        // Database.getQuestionAnsersByPhone('89507355808')
        // const questionsSnapshot = await Database.getAnsersByPhone('89507355808')
        // const items = [];

        // questionsSnapshot.forEach((doc) => {
        //     // console.log('doc', doc.data())
        //     items.push({ ...doc.data(), id: doc.id });
        // });


        return this.getQuestionsCol().where("fromPhone", "==", fromPhone).get();
    }

    /**
     * Get all answers by toPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getAnsersByPhone(toPhone) {
        // var messageRef = db.collection('rooms').doc('roomA')
        //         .collection('messages').doc('message1');
        return this.getAnswersCol().where("toPhone", "==", toPhone).get();
    }

    static async getQuestionAnsersByPhone(toPhone) {
        // const answers = await this.getAnsersByPhone(toPhone);
        // // for (const answer of answers) {
        // // }
        // console.log('answers', answers);
        // answers.forEach(answer => {
        //     let questionAnswer = { ...answer.data(), id: answer.id };
        //     console.log('element', questionAnswer)
        //     // const question = this.getQuestion(questionAnswer.questionId).then(question => {
        //     //     console.log('question', question)
        //     //     questionAnswer = { ...questionAnswer, ...question.data() }
        //     //     console.log('questionAnswer', questionAnswer)
        //     // });
        // });
        // var messageRef = db.collection('rooms').doc('roomA')
        //         .collection('messages').doc('message1');
        // return this.getAnswersCol().where("toPhone", "==", toPhone).then(() => {
        //     const items = [];
        //     questionsSnapshot.forEach((doc) => {
        //         console.log('doc', doc.data())
        //         items.push({ ...doc.data(), id: doc.id });
        //     })
        // });
        return this.getAnswersCol().where("toPhone", "==", toPhone).get();
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

    static async initDatabase() {
        // console.log(questions.my);
        // for(const question of questions.my) {
        //     await Database.addQuestion('89507355808', question.text, question.image);
        // }

        // console.log(questions.forMe);
        // for(const question of questions.forMe) {
        //     await Database.addQuestion('89507355808', question.text, question.image);
        // }
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