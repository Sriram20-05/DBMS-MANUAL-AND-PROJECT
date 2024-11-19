const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://mageshedu77:12345@payrollmanagement.p4ovq.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Import routes
const salaryRoutes = require("./routes/salaryRoutes");
app.use("/api/salaries", salaryRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
