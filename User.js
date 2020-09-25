var express = require('express')

var userRouter = express.Router()
const { ObjectID } = require("mongodb");


// email -> req.body.email
// password -> req.body.password
userRouter.post('/create', async (req, res) => {
    try {
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('User');

        var email = req.body.email
        var password = req.body.password

        await collection.findOne({ 'email': email })
            // .then((response) => response.toArray())
            .then((response) => {
                if (response != null) {
                    res.json({ message: 'Email has already taken.' })
                    return
                }

                var User = {
                    email: email,
                    password: password,
                    lastLogInDate : null,
                    lastLogInIP : null,
                }

                collection.insertOne(User)
                res.json({ message: 'Success' })
                return
            })

    } catch (error) {
        console.log(error);
    }
});

userRouter.post('/logIn', async (req, res) => {
    try {
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('User');

        var email = req.body.email
        var password = req.body.password
        console.log(req.body);

        await collection.findOne({ 'email': email })
            // .then((response) => response.toArray())
            .then((response) => {
                if (response == null){
                // if (resArray.length == 0){
                    res.json({message: 'Couldn\'t find the email.'})
                    return
                }
                // console.log(response);
                // var resArray = response.toArray()
                var user  = response
                if (password != user.password){
                    res.json({message: 'Wrong password!'})
                    return
                }
                collection.updateOne(
                    {'_id':ObjectID(user._id)},
                    {'$set':{
                        lastLogInDate:  Date(),
                        lastLogInIP: req.ip.split(':')[3]
                    }})
                res.json({message: 'Success'})
                return

            });

    } catch (error) {
        console.log(error);
    }
});


module.exports = userRouter