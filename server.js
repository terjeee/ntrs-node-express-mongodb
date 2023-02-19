const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

const app = require("./app");

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE;

// ERROR: uncaughtException //
// ERROR: uncaughtException //

process.on("uncaughtException", (error) => {
  console.log("❌ UNCAUGHT EXCEPTION");
  console.log(error.name, error.message);

  process.exit(1);
});

// CONNECT DATABASE //
// CONNECT DATABASE //

mongoose.set({ strictQuery: true });
mongoose.connect(DATABASE, {}).then((connection) => {
  console.log("✅ DATABASE CONNECTED");
});

// INIT SERVER //
// INIT SERVER //

const server = app.listen(PORT, () => {
  console.log(`✅ APP RUNNING @ https://localhost:${PORT}`);
});

// ERROR: unhandledRejection //
// ERROR: unhandledRejection //

process.on("unhandledRejection", (error) => {
  console.log("❌ UNHANDLED REJECTION");
  console.log(error.name, error.message);

  server.close(() => {
    process.exit(1);
  });
});
