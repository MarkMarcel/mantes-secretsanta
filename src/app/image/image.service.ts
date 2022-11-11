import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FirebaseStoragePath, FirestoreCollectionPath } from '../firebase-paths';

export enum ImageType {
  CHILD, EXCHANGE, ITEM, USER
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private _firestore: Firestore,
    private _storage: Storage,
  ) { }

  async deleteImage(id:string,type:ImageType){
    const typePath = this.getTypePath(type);
    const name = `${id}.jpg`;
    const path = `${FirebaseStoragePath.images}/${typePath}/${name}`;
    await deleteObject(ref(this._storage, path));
  }

  async saveImage(id: string, imageBase64String: string, type: ImageType): Promise<string> {
    const typePath = this.getTypePath(type);
    const name = `${id}.jpg`;
    const path = `${FirebaseStoragePath.images}/${typePath}/${name}`;
    const mime = "img/jpeg";
    const file = new File([(await (await fetch(imageBase64String)).arrayBuffer())], name, { type: mime })
    const handle = ref(this._storage, path);
    await uploadBytes(handle, file);
    const url = await getDownloadURL(handle);
    await this.updateData(id, typePath, url);
    return url;
  }

  async updateData(id: string, typePath: string, url: string) {
    await setDoc(doc(collection(this._firestore, typePath), id), { pictureUrl: url }, { merge: true });
  }

  private getTypePath(type:ImageType):string{
    let typePath = '';
    switch (type) {
      case ImageType.CHILD:
        typePath = FirestoreCollectionPath.children;
        break;
      case ImageType.EXCHANGE:
        typePath = FirestoreCollectionPath.exchanges;
        break;
      case ImageType.ITEM:
        typePath = FirestoreCollectionPath.itemsWanted;
        break;
      case ImageType.USER:
        typePath = FirestoreCollectionPath.users;
        break;
      default:
        break;
    }
    return typePath;
  }
}
