function saveToServer(user) {
  firebase.database()
          .ref('users')
          .push()
          .set(user)
          .then(function(snapshot) {
              success(); // some success method
          }, function(error) {
              console.log('error' + error);
              error(); // some error method
  });

}
