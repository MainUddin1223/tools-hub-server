const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hmelectronics.qnmf1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('hm-electronics').collection('users');
        const toolsCollection = client.db('hm-electronics').collection('tools');
        const orderCollection = client.db('hm-electronics').collection('orders');
        //tools provide api
        app.get('/tools', async (req, res) => {
            const query = {};
            const result = await toolsCollection.find(query).toArray();
            res.send(result)
        })

        //find tools by id
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await toolsCollection.findOne(query);
            res.send(result)
        })

        //Order
        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result)
        })
        //
        //manageOrder
        app.get('/order', async (req, res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result)

        })
        // get Order
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })
        //users collector api
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const name = req.body.name;
            const user = req.body;
            const filter = { email: email, name: name }
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //update profile
        app.put('/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            const name = req.body.name;
            const address = req.body.address;
            const phone = req.body.phone;
            const education = req.body.education;
            const filter = { email: email };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: name, address: address, phone: phone, education: education
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //make admin
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updatedDoc = {
                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })

        // get all admin
        app.get('/users/:admin', async (req, res) => {
            const admin = req.params.admin;
            const query = { role: admin };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        //all user sender api
        app.get('/users/makeadmin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        //users profile api
        app.get('/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const result = userCollection.findOne(query);
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running');
})