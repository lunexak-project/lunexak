const express = require("express");
const {
  autocomplete,
  searchResults
} = require("../controllers/searchController");

const router = express.Router();

router.get("/autocomplete", autocomplete);
router.get("/results", searchResults);

module.exports = router;
