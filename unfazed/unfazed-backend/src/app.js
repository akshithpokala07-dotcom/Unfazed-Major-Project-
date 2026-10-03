const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const therapistRoutes = require("./routes/therapistRoutes");
const schedulingRoutes = require("./routes/schedulingRoutes");
const clientRoutes = require("./routes/clientRoutes");
const noteRoutes = require("./routes/noteRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Unfazed API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

module.exports = app;