require('dotenv').config(); // Load environment variables

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jofxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const menuCollection = client.db('bistroBoss').collection('menu');

    app.get('/menu', async (req, res) => {
        const menu = await menuCollection.find().toArray();
        try {
            res.status(200).send(menu);
        } catch (error) {
            res.status(500).send({ error: "Failed to fetch menu" });
        }
    })
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});