export const mapFirebaseUserToUser = (firebaseUser) => {
  const user = { uid: firebaseUser.uid, email: firebaseUser.email ?? '' }

  return user
}
