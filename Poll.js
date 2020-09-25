
var express = require("express");
const { ObjectID } = require("mongodb");
var pollRouter = express.Router();
const objectId = require("mongodb").ObjectID;


let bodyParser = require('body-parser');
pollRouter.use(bodyParser.json());


pollRouter.post("/create", async (req, res) => {
    try {

        const mainApp = require('./index');
        const database = mainApp.database;

        var question = req.body.question;
        if (question == null)
            return
        var options = {};
        var allowMultiChoice = req.body.allowMultiChoice;
        var IPCheck = req.body.IPCheck;

        console.log(question);
        req.body.options.forEach((item) => {
            if(!(item == ' ' || item == ''|| item == null)){
                options[item] = 0
            }
        });
        var Poll = {
            'question': question,
            'options': options,
            'totalVotes': 0,
            'allowMultiChoice': allowMultiChoice,
            'IPCheck': IPCheck,
            'votedIPs': []
        };
        console.log(Poll);
        await database.collection("Polls").insertOne(Poll);
        res.json({ "message": "Success" });

    } catch (error) {
        console.log(error);
        res.json({ 'message': 'Failed' })
    }
});

pollRouter.get('/getAll', async (req, res) => {
    try {
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('Polls');

        var polls = await (await collection.find({}).toArray()).reverse();
        res.json({ 'polls': polls });
    } catch (error) {
        console.log(error);
        res.json({ 'message': 'Failed' })
    }
});

pollRouter.get('/getSingle/:id', async (req, res) => {
    try {
        const mainApp = require('./index');
        var collection = mainApp.database.collection('Polls');

        var wantedPoll = await collection.find({ '_id': ObjectID(req.params.id) }).toArray();
        res.json({ 'poll': wantedPoll });

    } catch (error) {
        console.log(error);
        res.json({ 'message': 'Failed' })
    }
});




pollRouter.post('/vote', async (req, res) => {
    try {
        const mainApp = require('./index');
        const database = mainApp.database;
        var collection = database.collection('Polls');
        console.log(req.body);
        var pollId = req.body.pollId;
        var selectedOptionIndex = req.body.selectedOptionIndex;
        var userIP = req.ip.split(':')[3];
        collection.findOne({ '_id': ObjectID(pollId) }, (err, poll) => {
            if (poll.IPCheck && poll.votedIPs.some((alreadyUserIP) => userIP === alreadyUserIP)) {
                res.json({ 'message': 'ALready voted from this IP' });
                return
            }
            selectedOptionIndex.forEach((index) => {
                poll.options[Object.keys(poll.options)[index]]++
                poll.totalVotes++;
            });
            poll.votedIPs.push(userIP);

            collection.updateOne({ '_id': ObjectID(pollId) }, {
                '$set': {
                    totalVotes: poll.totalVotes,
                    options: poll.options,
                    votedIPs: poll.votedIPs

                }
            })
            res.send(200);

        });

    } catch (error) {
        console.log(error);
    }


});
module.exports = pollRouter