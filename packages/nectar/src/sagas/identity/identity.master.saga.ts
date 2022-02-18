import { Socket } from 'socket.io-client'
import { all, takeEvery } from 'typed-redux-saga'
import { createUserCsrSaga } from './createUserCsr/createUserCsr.saga'
import { identityActions } from './identity.slice'
import { registerCertificateSaga } from './registerCertificate/registerCertificate.saga'
import { saveOwnerCertToDbSaga } from './saveOwnerCertToDb/saveOwnerCertToDb.saga'
import { registerUsernameSaga } from './registerUsername/registerUsername.saga'
import { savedOwnerCertificateSaga } from './savedOwnerCertificate/savedOwnerCertificate.saga'

export function* identityMasterSaga(socket: Socket): Generator {
  yield all([
    takeEvery(identityActions.registerUsername.type, registerUsernameSaga),
    takeEvery(identityActions.createUserCsr.type, createUserCsrSaga),
    takeEvery(identityActions.savedOwnerCertificate.type, savedOwnerCertificateSaga, socket),
    takeEvery(identityActions.saveOwnerCertToDb.type, saveOwnerCertToDbSaga, socket),
    takeEvery(identityActions.registerCertificate.type, registerCertificateSaga, socket)
  ])
}
