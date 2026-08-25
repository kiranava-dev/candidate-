// Run with: node seed.js
// Populates the database with a demo HR user + sample candidates for the dashboard.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Candidate = require('./models/Candidate');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recruitment_bi';

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
const sources = ['Referral', 'Job Portal', 'Campus', 'Social Media', 'Walk-in'];
const stages = ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected'];
const roles = ['Software Engineer', 'Marketing Executive', 'Sales Associate', 'HR Executive', 'Financial Analyst'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgoMax) {
  const daysAgo = Math.floor(Math.random() * daysAgoMax);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');

  await Candidate.deleteMany({});
  console.log('Cleared old candidates');

  let hrUser = await User.findOne({ email: 'hr@demo.com' });
  if (!hrUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    hrUser = await User.create({
      name: 'Demo HR Manager',
      email: 'hr@demo.com',
      password: hashedPassword,
      role: 'hr_manager',
    });
    console.log('Created demo HR user: hr@demo.com / password123');
  }

  const candidates = [];
  for (let i = 1; i <= 80; i++) {
    const appliedDate = randomDate(120);
    const stage = randomFrom(stages);
    const department = randomFrom(departments);
    const roleIndex = departments.indexOf(department);

    const candidate = {
      name: `Candidate ${i}`,
      email: `candidate${i}@example.com`,
      phone: `98765${(10000 + i).toString().slice(-5)}`,
      jobRole: roles[roleIndex],
      department,
      source: randomFrom(sources),
      stage,
      appliedDate,
      recruiter: hrUser._id,
    };

    if (stage === 'Hired') {
      const hiredDate = new Date(appliedDate);
      hiredDate.setDate(hiredDate.getDate() + Math.floor(Math.random() * 30) + 5);
      candidate.hiredDate = hiredDate;
    }

    candidates.push(candidate);
  }

  await Candidate.insertMany(candidates);
  console.log(`Seeded ${candidates.length} sample candidates`);

  await mongoose.disconnect();
  console.log('Seeding complete. Done.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
