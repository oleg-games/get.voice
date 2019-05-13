import Firebase from '@config/firebase';

/**
 * @class Firestore
 */
export default class Firestore {

    /**
     * Get current Database
     */
    static getFirestore() {
        return Firebase.getFirestore();
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

    static get firebase() {
        return Firebase.getFirebase();
    }

    static get imageRef() {
        return Firebase.getImageRef();
    }

};