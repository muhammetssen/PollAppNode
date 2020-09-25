const fs = require('fs')

let rawdata = fs.readFileSync('credentials.json')
let credentials = JSON.parse(rawdata)

var database
console.log("Connecting to DB")
const MongoClient = require("mongodb").MongoClient
try {

} catch (error) {
  console.log(error);
  console.log("Please check internet connection");
  //TODO
}
const MongoURL = "mongodb://" + credentials.MongoUsername + ":" + credentials.MongoPassword + "@35.209.140.129:27018/Poll?authMechanism=DEFAULT&authSource=admin"
const client = new MongoClient(MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
client.connect().then((database = client.db("Poll")))

const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// app.set('trust proxy', true)

app.listen(8080, () => {
  console.log("Listening on 8080")
})

var pollRouter = require('./Poll')
var userRouter = require('./User')
app.use('/poll', pollRouter)
app.use('/user', userRouter)
module.exports = {
  database: database,
}