import Firestore from './firestoreService';
import Questions from './questionsService';

/**
 * @class Answers
 */
export default class Answers {

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
     * Get all answers by fromPhone number which contains not empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersNotEmptyTextByFromPhone(fromPhone) {
        const questions = await Questions.getQuestionsCol()
            .where("fromPhone", "==", fromPhone)
            .get()
        let mainListItems = [];
        for (const question of questions.docs) {
            const ref = await Questions.getQuestionsCol().doc(question.id)
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
     * Get answers collection
     */
    static getAnswersCol() {
        return Firestore.getFirestore().collection("answers");
    }
}

