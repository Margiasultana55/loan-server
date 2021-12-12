const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9nw5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databse = client.db("loandb");
        const loanCollecton = databse.collection("loans");
        const usersCollection = databse.collection('users');




        //loans post api
        app.post('/loans', async (req, res) => {
            const order = req.body;
            const result = await loanCollecton.insertOne(order)
            res.json(result)
        })


        //loan get api
        app.get('/loans', async (req, res) => {
            const params = req.params;
            const cursor = loanCollecton.find({});
            const loan = await cursor.toArray();
            console.log(loan);
            res.json(loan);
        })

        //Delete loan API

        app.delete('/loans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await loanCollecton.deleteOne(query);
            // console.log("delet with id:", result);
            res.json(result);
        })
        //get loan  API



    }
    finally {

    }


}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
});
app.listen(port, () => {
    console.log('server running at port', port);
})