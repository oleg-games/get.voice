import Firebase from '@config/firebase';

/**
 * @class Storage
 */
export default class Storage {

    static get instanse() {
        return Firebase.getFirebase().storage;
    }

    static get imageRef() {
        return Firebase.getImageRef();
    }

};