import mongoose from "mongoose";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down");
  console.log("Error: ", err);
  process.exitCode = -1;
  process.exit();
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down");
  console.log("Error: ", err);
  process.exitCode = -1;
  process.exit();
});

const PORT = process.env.PORT || 8080;

const mongoURI = process.env.DB_CONN_STRING.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(mongoURI, {})
  .then(() => {
    console.log("Database connection successful!");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
  })
  .catch((err) => console.log("Error: ", err));
