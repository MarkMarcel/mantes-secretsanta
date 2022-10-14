import {writeFile} from 'fs';
import {argv} from 'yargs';
import * as dotenv from 'dotenv'
dotenv.config()

const environment = (argv as any).environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

const envFileContent = `
export const environment = {
    production: ${isProduction},
    firebaseConfig :{
      apiKey: "${(process.env as any).FIREBASE_API_KEY}",
      authDomain: "mantessecretsanta.firebaseapp.com",
      projectId: "mantessecretsanta",
      storageBucket: "mantessecretsanta.appspot.com",
      messagingSenderId: "108612670563",
      appId: "1:108612670563:web:059bc06d1b5fd3d4655456",
      measurementId: "G-B2L4LMKELR"
    }
  };
`;
   
writeFile(targetPath, envFileContent, function (err) {
    if (err) {
       console.log(err);
    }
    console.log(`Wrote variables to ${targetPath}`);
 });