const Candidate = require('../models/Candidate');

// @route POST /api/candidates
const createCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create({
      ...req.body,
      recruiter: req.user.id,
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Error creating candidate', error: err.message });
  }
};

// @route GET /api/candidates?department=&source=&stage=&from=&to=
const getCandidates = async (req, res) => {
  try {
    const { department, source, stage, from, to } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (source) filter.source = source;
    if (stage) filter.stage = stage;
    if (from || to) {
      filter.appliedDate = {};
      if (from) filter.appliedDate.$gte = new Date(from);
      if (to) filter.appliedDate.$lte = new Date(to);
    }

    const candidates = await Candidate.find(filter)
      .populate('recruiter', 'name email')
      .sort({ appliedDate: -1 });

    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
};

// @route GET /api/candidates/:id
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('recruiter', 'name email');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching candidate', error: err.message });
  }
};

// @route PUT /api/candidates/:id
const updateCandidate = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Automatically stamp hiredDate when stage moves to Hired
    if (updates.stage === 'Hired') {
      updates.hiredDate = updates.hiredDate || new Date();
    }

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Error updating candidate', error: err.message });
  }
};

// @route DELETE /api/candidates/:id
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting candidate', error: err.message });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
