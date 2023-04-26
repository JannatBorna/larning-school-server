const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 2000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoj9s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database')
        const database = client.db('learningSchool');
        const servicesCollection = database.collection('services')


        //user collection
        const usersCollection = database.collection('users');

        //order place
        const ordersCollection = database.collection('orders');

        // reviews
        const feedbacksCollection = database.collection('feedbacks');

        



// services load
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

       
//POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });


// single service load
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })



        //Delete api product
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // admin verified

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })


   // admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })




        // reviews
        app.get('/feedbacks', async (req, res) => {
            const cursor = feedbacksCollection.find({});
            const feedbacks = await cursor.toArray();
            res.send(feedbacks);
        })


        app.post('/feedbacks', async (req, res) => {
            const feedback = req.body;
            const result = await feedbacksCollection.insertOne(feedback);
            res.json(result);

        });
        


        // order 
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);

        });

        

        //Delete api order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedOrder.name,

                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            res.json(result)

        })


    }

    finally {
        // await client.close()
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Learning School')
})

app.listen(port, () => {
    console.log(`learning school at ${port}`)
})
