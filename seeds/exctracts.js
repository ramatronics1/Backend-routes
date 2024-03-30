const xlsx = require('xlsx');
const mongoose = require('mongoose');
const {Auth} = require('../models/clientSchema');
const path = require('path');

const filePath = path.join(__dirname, '..', 'seeds', 'Registrations.xlsx');


mongoose.connect('mongodb://localhost:27017/majorproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const reverseDateFormat = dateString => {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const reversedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    return reversedDate;
  }
};

const seedDB = async () => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = 'ug 3rd sem';

  if (!workbook.Sheets.hasOwnProperty(sheetName)) {
    console.error(`Sheet ${sheetName} not found in the Excel file.`);
    process.exit(1);
  }

  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  const totalRecords = 811; // Change this to the actual total number of records
  const extractedData = data.slice(0, totalRecords).map(row => ({
    column1: row[0], // Assuming the first column
    column2: row[3], // Assuming the second column
    column3: reverseDateFormat(row[6]),
    column4:row[8]
  }));



  await Auth.deleteMany({});

  for (const item of extractedData) {
    const seeds = new Auth({
      usn: item.column1,
      name: item.column2,
      dob: item.column3,
      email:item.column4
    });
    await seeds.save()
  }

  mongoose.connection.close();
};

seedDB();