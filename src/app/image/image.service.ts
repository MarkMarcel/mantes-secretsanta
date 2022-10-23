import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseStoragePath, FirestoreCollectionPath } from '../firebase-paths';

export enum ImageType {
  CHILD, EXCHANGE, USER
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private _firestore: Firestore,
    private _storage: Storage,
  ) { }

  async saveImage(id: string, imageBase64String: string, type: ImageType): Promise<string> {
    const typePath = (type == ImageType.CHILD) ? FirestoreCollectionPath.children : (type == ImageType.EXCHANGE) ? FirestoreCollectionPath.exchanges : FirestoreCollectionPath.users;
    const name = `${id}.jpg`;
    const path = `${FirebaseStoragePath.images}/${typePath}/${name}`;
    const mime = "img/jpeg";
    const file = new File([(await (await fetch(imageBase64String)).arrayBuffer())], name, { type: mime })
    const handle = ref(this._storage, path);
    await uploadBytes(handle, file);
    const url = await getDownloadURL(handle);
    await this.updateData(id,typePath,url);
    return url;
  }

  async updateData(id: string, typePath: string, url: string) {
    await setDoc(doc(collection(this._firestore, typePath), id), { pictureUrl: url }, { merge: true });
  }
}
