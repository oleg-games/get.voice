/**
 * @class Database
 */

import Firebase from '@config/firebase';

export default class Auth {

    static getAuth() {
        return Firebase.getAuth();
    }

};