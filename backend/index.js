const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const expressPino = require("pino-http");
const logger = require("./logger.js");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const userRoute = require("./routes/user.route.js");
const postRoute = require("./routes/post.route.js");
const commentRoute = require("./routes/comment.route.js");

const app = express();
const Port = process.env.PORT || 3000;
const expressLogger = expressPino({ logger });

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(expressLogger);
app.use(express.urlencoded({ extended: false }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comment", commentRoute);

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
    const server = app.listen(Port, () => {
      logger.info(`Server is running on port ${Port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
      server.close(() => {
        mongoose.connection.close(false, () => {
          logger.info("Closed out remaining connections.");
          process.exit(0);
        });
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })
  .catch((error) => {
    logger.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1); // Terminate the application if unable to connect to the database
  });
