const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
const bodyParser = require("body-parser");
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({origin: ['http://localhost:5000', 'http://localhost:5001/egetapi/us-central1/users'] }));
const { request, response } = require("express");
app.use(bodyParser.json());


// GET all users
app.get("/", async (request, response) => {
  
    const userCollectionRef = db.collection("users");
    const result = await userCollectionRef.get();
    
    let users = [];
    result.forEach((userDoc) => {
      const id = userDoc.id;
      const data = userDoc.data();
      users.push({ id, ...data });
    });
  
    response.status(200).send(users);
 
  
});



// PUT
/*app.put("/:id", async (request, response) => {
  
  }); */



// POST
app.post("/", async function (request, response) {
    const newUser = request.body;
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.add(newUser);

    response.status(200).send(result);
  
});


// Delete user
app.delete("/:id", async function (request, response) {
    const userId = request.params.id;
    const userCollectionRef = db.collection('users');
    const result = await userCollectionRef.doc(userId).delete();
    
    response.status(200).send(result);
    
}); 




exports.users = functions.https.onRequest(app);
