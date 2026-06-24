const SeoPage = require("../models/SeoPage");
const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require('fs');
const path = require('path');

const getSeoPage = async (req, res) => {
  try {
    const { type, slug } = req.params;
    let seo = await SeoPage.findOne({ pageType: type.toUpperCase(), slug });
    
    // If no specific override exists, we could return a default or 404
    if (!seo) {
      return res.status(404).json({ success: false, message: "SEO overrides not found for this page" });
    }
    
    res.status(200).json({ success: true, seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllSeoPages = async (req, res) => {
  try {
    const seoPages = await SeoPage.find();
    res.status(200).json({ success: true, seoPages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSeoPage = async (req, res) => {
  try {
    const { type, slug } = req.params;
    
    let seo = await SeoPage.findOne({ pageType: type.toUpperCase(), slug });
    
    if (seo) {
      seo = await SeoPage.findByIdAndUpdate(seo._id, req.body, { new: true });
    } else {
      seo = await SeoPage.create({ ...req.body, pageType: type.toUpperCase(), slug });
    }
    
    res.status(200).json({ success: true, seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSeoPage = async (req, res) => {
  try {
    const seo = await SeoPage.findByIdAndDelete(req.params.id);
    if (!seo) return res.status(404).json({ success: false, message: "SEO page not found" });
    res.status(200).json({ success: true, message: "SEO config removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSitemap = async (req, res) => {
  try {
    const products = await Product.find({ status: "LIVE" }).select("slug updatedAt");
    const categories = await Category.find({ isActive: true }).select("slug updatedAt");
    
    const baseUrl = process.env.CLIENT_URL || "https://lunexak.com";
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Add categories
    categories.forEach(cat => {
      xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <lastmod>${cat.updatedAt.toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    
    // Add products
    products.forEach(prod => {
      xml += `  <url>\n    <loc>${baseUrl}/product/${prod.slug}</loc>\n    <lastmod>${prod.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRobotsTxt = async (req, res) => {
  try {
    const robotsPath = path.join(__dirname, '../../robots.txt');
    if (fs.existsSync(robotsPath)) {
      const content = fs.readFileSync(robotsPath, 'utf8');
      res.status(200).json({ success: true, content });
    } else {
      const defaultRobots = `User-agent: *\nAllow: /\n\nSitemap: ${process.env.CLIENT_URL || "https://lunexak.com"}/api/seo/sitemap.xml`;
      res.status(200).json({ success: true, content: defaultRobots });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateRobotsTxt = async (req, res) => {
  try {
    const { content } = req.body;
    const robotsPath = path.join(__dirname, '../../robots.txt');
    fs.writeFileSync(robotsPath, content);
    res.status(200).json({ success: true, message: "robots.txt updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSeoPage,
  getAllSeoPages,
  updateSeoPage,
  deleteSeoPage,
  getSitemap,
  getRobotsTxt,
  updateRobotsTxt
};
