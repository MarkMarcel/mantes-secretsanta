import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Exchange, mapDataToExchangeModel } from "./models/exchange";
import { saveExchangeDetails } from "./save-exchange";

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const saveExchangeProtocols = functions.https.onCall((data, context) => {
    /* admin.auth().setCustomUserClaims
    if (!context?.auth?.token?.admin)
        throw new functions.https.HttpsError("permission-denied", "You need to be an admin"); */
    try {
        const details = mapDataToExchangeModel(data);
        if (details instanceof Exchange)
            return saveExchangeDetails((details as Exchange));
        else
            throw new functions.https.HttpsError("invalid-argument", (details as string));
    } catch (error) {
        throw new functions.https.HttpsError("internal", (error as any).message, error);
    }
});
