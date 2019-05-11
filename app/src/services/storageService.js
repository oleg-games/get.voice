/**
 * @class Storage
 */

import Firebase from '@config/firebase';

export default class Storage {

    static get instanse() {
        return Firebase.getFirebase().storage;
    }

    static get imageRef() {
        return Firebase.getImageRef();
    }

};