/**
 * @class Database
 */

import Firebase from '@config/firebase';
import questions from '@data/questions';
import answers from '@data/answers';

export default class Database {

    static INIT_DATABASE = true;

    constructor(props) {
        console.log('Create database instanse', props)
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

    static getAuth() {
        if (!Firebase.firebaseAppsLength) {
            console.log('Firebase NOT Inizialized');
            Firebase.initialize();
        } else {
        }

        return Firebase.getAuth();
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
        return this.getQuestionsCol().where("fromPhone", "==", fromPhone).get();
    }

    /**
     * Get all answers by toPhone number which contains empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersEmptyTextByToPhone(toPhone) {
        const res = await this.getAnswersCol()
            .where("toPhone", "==", toPhone)
            .where("text", '==', '')
            .get()
        let mainListItems = [];

        for (const doc of res.docs) {
            let newItem = { ...doc.data(), id: doc.id };
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get all answers by toPhone number which contains not empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersNotEmptyTextByToPhone(toPhone) {
        const res = await this.getAnswersCol()
            .where("toPhone", "==", toPhone)
            .where("text", '>', '')
            .get()
        let mainListItems = [];

        for (const doc of res.docs) {
            let newItem = { ...doc.data(), id: doc.id };
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get all answers by fromPhone number which contains not empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersNotEmptyTextByFromPhone(fromPhone) {
        const questions = await this.getQuestionsCol()
            .where("fromPhone", "==", fromPhone)
            .get()
        let mainListItems = [];
        for (const question of questions.docs) {
            const ref = await this.getQuestionsCol().doc(question.id)
            const answers = await this.getAnswersCol()
                .where("text", '>', '')
                .where("questionRef", '==', ref)
                .get()

            for (const answer of answers.docs) {
                let newItem = { ...answer.data(), id: answer.id };
                newItem.questionRef = { ...question.data(), id: question.id };
                mainListItems.push(newItem)
            }
        }

        return mainListItems;
    }

    /**
     * Get all answers by toPhone number
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersByToPhone(toPhone) {
        const res = await this.getAnswersCol().where("toPhone", "==", toPhone).get()
        let mainListItems = [];

        for (const doc of res.docs) {
            let newItem = { ...doc.data(), id: doc.id };
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get all answers by fromPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersByFromPhone(fromPhone) {
        const res = this.getAnswersCol().where("toPhone", "==", fromPhone).get()
        let mainListItems = [];

        for (const doc of res.docs) {
            let newItem = doc.data();
            newItem.id = doc.id;
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = question.data()
                mainListItems.push(newItem);
            } else {
                mainListItems.push(newItem);
            }

        }

        return mainListItems;
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
     * Get answer by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnswer(id) {
        const doc = await this.getAnswersCol().doc(id).get();
        if (!doc || !doc.exists) {
            throw new Error(`Cannot find answer with id ${id}`)
        }

        let newItem = { ...doc.data(), id: doc.id };

        if (newItem.questionRef) {
            const question = await newItem.questionRef.get()
            newItem.questionRef = { ...question.data(), id: question.id };
        }
        return newItem;
    }

    /**
     * Update answer by id
     *
     * @param {string} id
     * @param {object} data
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async updateAnswer(id, data) {
        try {
            await this.getAnswersCol().doc(id).update(data);
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Add new answer
     *
     * @param toPhone
     * @param text answer text
     * @param image answer image
     * @param questionRef question reference for object -> .doc('questions/' + questionRefs.id)
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addAnswer({ toPhone, text, image, questionRef }) {
        let answer = {
            toPhone,
            text: text || '',
            questionRef,
            image: image || '',
        }

        return this.getAnswersCol().add(answer);
    }

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
        console.log('Init Database --->>>>')
        console.log(questions.my);
        for (const question of questions.my) {
            await Database.addQuestion('89507355808', question.text, question.image);
        }

        console.log(questions.forMe);
        for (const answer of questions.forMe) {
            const questionRefs = await Database.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Database.getDatabase().doc('questions/' + questionRefs.id),
                text: '',
                image: '',
            };
            await Database.addAnswer(data);
        }

        console.log(answers.my);
        for (const answer of answers.my) {
            const questionRefs = await Database.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Database.getDatabase().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Database.addAnswer(data);
        }
        console.log(answers.forMe);
        for (const answer of answers.forMe) {
            const questionRefs = await Database.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Database.getDatabase().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Database.addAnswer(data);
        }

    }
};