// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// basic Inits
const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trxtr.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    if (!err) {
        console.log(err);
    }
    const volunteersCollection = client.db(process.env.DB_USER).collection('VolunteersList');
    const eventCollection = client.db(process.env.DB_USER).collection('EventList');
    // Adding New Event to Mongo
    app.post('/addEvent', (req, res) => {
        const eventData = req.body;
        eventCollection.insertOne(eventData, (error, doc) => {
            if (!error) {
                res.send(doc);
            } else {
                res.send(error);
            }
        });
    });

    // Getting Event List from  Mongo
    app.get('/getEvents', (req, res) => {
        eventCollection.find({}).toArray((exception, doc) => {
            if (!exception) {
                res.send(doc);
            } else {
                res.send(exception);
            }
        });
    });

    // Getting the List of Volunteers
    app.get('/volunteers', (req, res) => {
        volunteersCollection.find({}).toArray((exception, doc) => {
            if (!exception) {
                res.send(doc);
            } else {
                res.send(exception);
            }
        });
    });

    // Adding Volunteers Profile
    app.post('/addVolunteer', (req, res) => {
        const data = req.body;
        volunteersCollection.insertOne(data).then((doc) => {
            console.log(doc);
            res.send(doc);
        });
    });
});
app.listen(process.env.PORT || 4000, () => {
    console.log('Listening to Port ', process.env.PORT || 4000);
});
