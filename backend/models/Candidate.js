const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    jobRole: { type: String, required: true, trim: true }, // e.g. "Software Engineer"
    department: {
      type: String,
      required: true,
      trim: true, // e.g. "Engineering", "Marketing", "Sales"
    },

    source: {
      type: String,
      enum: ['Referral', 'Job Portal', 'Campus', 'Social Media', 'Walk-in', 'Other'],
      required: true,
    },

    stage: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected'],
      default: 'Applied',
    },

    appliedDate: { type: Date, required: true, default: Date.now },
    hiredDate: { type: Date }, // set when stage becomes 'Hired'

    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    resumeLink: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
