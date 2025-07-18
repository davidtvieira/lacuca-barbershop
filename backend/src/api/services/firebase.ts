import * as admin from 'firebase-admin';
import userModel from '../schemas/user.schema';

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function createAccount(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: number
) {
  if (phoneNumber) {
    const phoneNumberAlreadyUsed = await userModel.findOne({ phoneNumber });
    if (phoneNumberAlreadyUsed)
      return { user: null, error: 'O número de telemóvel fornecido já se encontra associado a outra conta.' };
  }

  const { user: userRecord, error } = await admin
    .auth()
    .createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    })
    .then((user) => {
      return { user, error: null };
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-exists') {
        return { user: null, error: 'O email fornecido já se encontra associado a outra conta.' };
      }

      return { user: null, error: 'Ocorreu um erro ao criar a sua conta. Por favor tente novamente mais tarde.' };
    });
  if (error) return { uid: null, error };

  const user = new userModel({
    uid: userRecord.uid,
    firstName,
    lastName,
    phoneNumber,
  });
  await user.save();

  await admin.auth().setCustomUserClaims(userRecord.uid, {
    isValid: true,
  });

  return { uid: userRecord.uid, error: null };
}

export async function getUserFromIdToken(idToken: string): Promise<{ user: admin.auth.DecodedIdToken; error: string }> {
  const { decodedToken, error } = await admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      if (!decodedToken || !decodedToken.isValid) {
        return { decodedToken: null, error: 'A token fornecida é inválida. #ITK-100' };
      }

      return { decodedToken, error: null };
    })
    .catch(() => {
      return { decodedToken: null, error: 'A token fornecida é inválida. #ITK-101' };
    });

  return { user: decodedToken, error };
}
