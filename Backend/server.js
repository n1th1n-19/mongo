require("dotenv").config();  // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Debug: Print MongoDB URI
console.log("✅ Debug: MongoDB URI ->", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
});

// Define Schema & Model
const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);

// Routes
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error("❌ Failed to fetch items:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/items", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ error: "Item name is required" });
        }
        const newItem = new Item({ name: req.body.name });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        console.error("❌ Failed to add item:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/items/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        console.error("❌ Failed to delete item:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
