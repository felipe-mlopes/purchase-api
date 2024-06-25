import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin'


@Injectable()
export class FirestoreService {
    private readonly db: FirebaseFirestore.Firestore

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require('../firestone/purchase-app1-firebase-adminsdk-vbcbm-c6ebaf8c46.json')

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })

        this.db = admin.firestore()
    }

    getFirestoneInstance(): FirebaseFirestore.Firestore {
        return this.db
    }
}