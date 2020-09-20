var express = require("express");
const { ObjectID } = require("mongodb");
var pollRouter = express.Router();
const objectId = require("mongodb").ObjectID;

module.exports = pollRouter



pollRouter.post("/create", async (req, res) => {
    try {

        const mainApp = require('./index');
        const database = mainApp.database;

        var question = req.body.question;
        var options = {};
        var allowMultiChoice = req.body.allowMultiChoice;
        var IPCheck = req.body.IPCheck;

        req.body.options.forEach((item) => {
            options[item] = 0
        });
        console.log(question);
        var Poll = {
            'question': question,
            'options': options,
            'totalVotes': 0,
            'allowMultiChoice': allowMultiChoice,
            'IPCheck': IPCheck,
            'votedIPs': []
        };
        await database.collection("Polls").insertOne(Poll);

    } catch (error) {
        console.log(error);
    }
    res.json({ "yey": "yey" });
});

pollRouter.get('/getAll', async (req, res) => {
    try {
        // var ip = req.headers['x-real-ip'] || req.connection.remoteAddress
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('Polls');

        var polls = await collection.find({}).toArray();;
        res.json({ 'polls': polls });
    } catch (error) {
        console.log(error);
    }
});


pollRouter.post('/vote', async (req, res) => {
    try {
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('Polls');

        var pollId = req.body.pollId;
        var selectedOptionIndex = req.body.selectedOptionIndex;
        var userIP = req.ip.split(':')[3];

        await collection.findOne({ '_id': ObjectID(pollId) },  (err, poll) => {
            if (poll.IPCheck && poll.votedIPs.some((alreadyUserIP) => userIP === alreadyUserIP )) {
                res.json({'message':'ALready voted from this IP'});
                return
            } 
            selectedOptionIndex.forEach((index) => {
                poll.options[Object.keys(poll.options)[index]]++
                poll.totalVotes++;
            });
            poll.votedIPs.push(userIP);

             collection.updateOne({ '_id': ObjectID(pollId) },{'$set' : {
                totalVotes : poll.totalVotes,
                options: poll.options,
                votedIPs: poll.votedIPs

            }})
            res.send(200);

        });

    } catch (error) {
        console.log(error);
    }


});