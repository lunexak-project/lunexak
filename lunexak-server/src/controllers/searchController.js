const Product = require("../models/Product");

const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, results: [] });

    // Simple regex search for autocomplete on title
    const results = await Product.find({
      title: { $regex: q, $options: "i" },
      status: "LIVE"
    }).select("title slug price").limit(5);

    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchResults = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    const query = { status: "LIVE" };
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  autocomplete,
  searchResults
};
