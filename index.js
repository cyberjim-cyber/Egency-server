const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.emqen.mongodb.net:27017,cluster0-shard-00-01.emqen.mongodb.net:27017,cluster0-shard-00-02.emqen.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-y2z8ln-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const eventsCollection = client.db("egency").collection("social");
	const baseCollection = client.db("egency").collection("social");
	console.log("DB connected 🚀");

	/* API: Adding base data */
	app.post("/addBaseData", (req, res) => {
		const baseData = req.body;
		baseCollection.insertMany(baseData).then((result) => {
			console.log(result);
			console.log(result.insertedCount, "All Data Inserted ✅");
			res.send(result.insertedCount);
		});
	});

	/* API: Getting Base data on home page */
	app.get("/home", (req, res) => {
		baseCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	/* API: Register Volunteer */
	app.post("/registerVolunteer", (req, res) => {
		const newVolunteer = req.body;
		eventsCollection.insertOne(newVolunteer).then((result) => {
			console.log(result, "Task Inserted ✅");
			res.send(result.insertedCount > 0);
		});
	});

	/* API: Getting events by email */
	app.get("/events", (req, res) => {
		console.log(req.query.email);
		eventsCollection.find({ email: req.query.email }).toArray((error, documents) => {
			res.send(documents);
			console.log(error);
		});
	});

	/* API: Deleting an event task */
	app.delete("/deleteTask/:id", (req, res) => {
		console.log(req.params.id);
		eventsCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
			console.log(result, "Deleted ⚠️");
			res.send(result.deletedCount > 0);
		});
	});

	/* ADMIN API: Create new event task */
	app.post("/admin/addEvent", (req, res) => {
		const newTask = req.body;
		baseCollection.insertOne(newTask).then((result) => {
			console.log(result, "Task Inserted ✅");
			res.send(result.insertedCount > 0);
		});
	});

	/* ADMIN API: Getting volunteer list */
	app.get("/loadVolunteerList", (req, res) => {
		eventsCollection.find({}).toArray((err, docs) => {
			res.send(docs);
			console.log(docs);
		});
	});

	/* ADMIN API: Deleting an event task */
	app.delete("/admin/deleteTask/:id", (req, res) => {
		console.log(req.params.id);
		eventsCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
			console.log(result, "Task deleted ⚠️");
			res.send(result.deletedCount > 0);
		});
	});

	/* API : Default */
	app.get("/", (req, res) => {
		res.send("Hello from Express, API is working 👨🏻‍💻");
	});
});

app.listen(process.env.PORT || port);











// var MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb://<username>:<password>@cluster0-shard-00-00.emqen.mongodb.net:27017,cluster0-shard-00-01.emqen.mongodb.net:27017,cluster0-shard-00-02.emqen.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-y2z8ln-shard-0&authSource=admin&retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, client) {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });






