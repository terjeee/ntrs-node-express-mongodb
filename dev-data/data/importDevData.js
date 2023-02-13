const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const fileSystem = require("fs");
const mongoose = require("mongoose");
const ModelTour = require("../../models/ModelTour");

const DATABASE = process.env.DATABASE;

mongoose.set("strictQuery", false);
mongoose.connect(DATABASE).then((message) => console.log(`✅ MongoDB`));

// READ
// READ

const tours = JSON.parse(fileSystem.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

// IMPORT DATA TO DATABASE
// IMPORT DATA TO DATABASE

async function importDataToDatabase() {
  try {
    await ModelTour.create(tours);
    console.log("✅ DATA LOADED!");
  } catch (error) {
    console.log(error);
  }

  process.exit(); // AGRO COMMAND
}

// DELETE DATA FROM DATABASE
// DELETE DATA FROM DATABASE

async function deleteDataFromDatabase() {
  try {
    await ModelTour.deleteMany();
    console.log("✅ DATA DELETED");
  } catch (error) {
    console.log(error);
  }

  process.exit(); // AGRO COMMAND
}

if (process.argv[2] === "--delete") deleteDataFromDatabase();
if (process.argv[2] === "--import") importDataToDatabase();

console.log(process.argv);
