const functions = require('firebase-functions')
var admin = require('firebase-admin')

var sakey = require('../maltracker-290a9-firebase-adminsdk-tuu0t-ff910a2683.json')

admin.initializeApp({
  credential: admin.credential.cert(sakey),
  databaseURL: "https://maltracker-290a9.firebaseio.com"
})

exports.updateData = functions.https.onRequest((req, res) => {
  //const users = ref.child('users')
  //console.log(users)
})
