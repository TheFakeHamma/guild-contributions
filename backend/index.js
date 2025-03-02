require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes");
const recruitmentRoutes = require("./src/routes/recruitmentRoutes");
const contributionRoutes = require("./src/routes/contributionRoutes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/recruitments", recruitmentRoutes);
app.use("/api/contributions", contributionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
