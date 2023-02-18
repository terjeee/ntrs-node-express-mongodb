const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const fileSystem = require("fs");
const mongoose = require("mongoose");
const ModelTour = require("../../models/ModelTour");

const DATABASE = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.connect(DATABASE).then((message) => console.log(`✅ MongoDB: Connected`));

// READ //
// READ //

const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// DELETE DATA FROM DATABASE //
// DELETE DATA FROM DATABASE //

async function deleteDataFromDatabase() {
  try {
    await ModelTour.deleteMany();
    console.log("✅ Data deleted");
  } catch (error) {
    console.log(error);
  }

  process.exit(); // AGRO COMMAND
}

// IMPORT DATA TO DATABASE //
// IMPORT DATA TO DATABASE //

async function importDataToDatabase() {
  try {
    await ModelTour.create(tours);
    console.log("✅ Data loaded!");
  } catch (error) {
    console.log(error);
  }

  process.exit(); // ! AGRO COMMAND
}

// COMMANDS //
// COMMANDS //

if (process.argv.includes("--delete")) deleteDataFromDatabase();
if (process.argv.includes("--import")) importDataToDatabase();
