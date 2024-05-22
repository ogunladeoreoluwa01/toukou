const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const expressPino = require("pino-http");
const logger = require("./logger.js");

const userRoute = require("./routes/user.route.js");
const postRoute = require("./routes/post.route.js");

const app = express();
const Port = process.env.PORT || 3000;
const expressLogger = expressPino({ logger });

// Middleware
app.use(express.json());
app.use(expressLogger);
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Database connected");
    app.listen(Port, () => {
      logger.info(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1); // Terminate the application if unable to connect to the database
  });
