var database;
console.log("Connecting to DB");
const MongoClient = require("mongodb").MongoClient;
const MongoURL = "mongodb://35.209.140.129:27018/Poll";
const client = new MongoClient(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
client.connect().then((database = client.db("Poll")));

// console.log(database);
const express = require("express");
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.json());
app.set('trust proxy', true)

app.listen(8080, () => {
    console.log("Listening on 8080");
  });

app.get("/", (req,res) => {
    res.json({"deneme":"123"});

});

var pollRouter = require("./Poll");
app.use('/poll',pollRouter);
module.exports = {
  database: database,
};