
document.addEventListener('DOMContentLoaded', () => {
'use strict';

  var config = {
    apiKey: "AIzaSyCbwkLe6ZFPLMxAoT7iNjSKEFf6hsCuXZA",
    authDomain: "test-store-b68ee.firebaseapp.com",
    databaseURL: "https://test-store-b68ee.firebaseio.com",
    projectId: "test-store-b68ee",
    storageBucket: "test-store-b68ee.appspot.com",
    messagingSenderId: "184450022187"
  };
  firebase.initializeApp(config);

  const db = firebase.firestore()
  const auth = firebase.auth()
  // const settings = { timestampsInSnapshots: true }
  // db.settings(settings)
  const form = document.querySelector('#form')
  const input = document.querySelector('#input')
  const btn = document.querySelector('#btn') 
  const ul = document.querySelector('#ul');
  const login = document.querySelector('#login');
  const logout = document.querySelector('#logout');

  const collection = db.collection('atom')

  login.addEventListener('click', () => {
    auth.signInAnonymously()
  })
  logout.addEventListener('click', () => {
    auth.signOut();
  })

  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = input.value.trim()
    if (value === "") return
    
    // ダイレクト記載分
    // let li = document.createElement('li')
    // li.textContent = value
    // ul.appendChild(li)

    collection.add({
      message: input.value,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(doc=> {
      console.log(`${doc.id}`);
      input.value = ''
      input.focus()
    })
    .catch(error => {
      console.error(error)
    })
    input.focus()
  })

  auth.onAuthStateChanged(user => {
    if (user) {
      collection.orderBy('created_at', 'desc')
        .onSnapshot( snapshot => {
          snapshot.docChanges().forEach( change => {
            if (change.type === 'added') {
              let li = document.createElement('li')
              li.textContent = `data: ${change.doc.data().message} `
              ul.appendChild(li)
            }
          })
        })
      console.log(`uid: ${user.uid}`)
      return
    }
    console.log('Nobody is login')
  })

})
  