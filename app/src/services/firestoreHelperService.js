/**
 * @class FirestoreHelper
 */

import Firestore from './firestoreService';
import Questions from './questionsService';
import Answers from './answersService';
import questions from '@data/questions';
import answers from '@data/answers';

export default class FirestoreHelper {

    static async fillData() {
        console.log('Fill Data --->>>>')
        console.log(questions.my);
        for (const question of questions.my) {
            await Questions.addQuestion('89507355808', question.text, question.image);
        }

        console.log(questions.forMe);
        for (const answer of questions.forMe) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: '',
                image: '',
            };
            await Answers.addAnswer(data);
        }

        console.log(answers.my);
        for (const answer of answers.my) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Answers.addAnswer(data);
        }
        console.log(answers.forMe);
        for (const answer of answers.forMe) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Answers.addAnswer(data);
        }

    }
};