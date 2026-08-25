const express = require('express');
const router = express.Router();
const {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // all candidate routes require login

router.post('/', createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);

module.exports = router;
