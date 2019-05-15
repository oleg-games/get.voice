import Firebase from '@config/firebase';
import uuid from 'uuid';

/**
 * @class Storage
 */
export default class Storage {

    static get instanse() {
        return Firebase.getFirebase().storage;
    }

    static getImagePhoneRef(phone) {
        return this.getImageFilePoints(phone);
    }

    static getImageRef() {
        // Create a child reference
        // Get a reference to the storage service, which is used to create references in your storage bucket
        const storage = Firebase.getStorage();

        // Create a storage reference from our storage service
        const storageRef = storage.ref();
        return storageRef.child('images');
        // imagesRef now points to 'images'
    }

    static getImageFilePoints(phone) {
        // Points to 'images/space.jpg'
        // Note that you can use variables to create child values
        return this.getImagePhonePoints(phone).child(uuid.v4());
    }

    static getImagePhonePoints(phone) {
        // Points to 'images/space.jpg'
        // Note that you can use variables to create child values
        return this.getImageRef().child(phone);
    }

};