import Firestore from './firestoreService';

export default class Questions {

    /**
     * Get questions collection
     */
    static getQuestionsCol() {
        return Firestore.getFirestore().collection("questions");
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
     * Get question by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getQuestion(id) {
        return this.getQuestionsCol().doc(id).get();
    }

}

