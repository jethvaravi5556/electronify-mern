import mongoose from "mongoose";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import productModel from "../models/productModel.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/electronify";
const PYTHON_API_URL = "http://localhost:9000/embed";
const TMP_DIR = path.join("tmp");

const ensureTmpDirExists = () => {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR);
    console.log("📁 Created tmp directory");
  }
};

const downloadImage = async (url, destPath) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  return new Promise((resolve, reject) => {
    fs.writeFile(destPath, response.data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getEmbeddingFromPython = async (imagePath) => {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(imagePath)); // ✅ not "file"

    const response = await axios.post(PYTHON_API_URL, form, {
      headers:{...form.getHeaders()} , // ✅ Important: sets proper content-type
    });

    return response.data.embedding;
  } catch (err) {
    console.error("❌ Error from Python API:", err.message);
    throw err;
  }
};

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    ensureTmpDirExists();

    const products = await productModel.find({ embedding: { $exists: false } });

    if (products.length === 0) {
      console.log("ℹ️ No new products to embed. All are already processed.");
      return process.exit(0);
    }

    for (const product of products) {
      const url = product.productImage?.[0];
      if (!url) {
        console.warn(`⚠️ Skipping ${product.productName} - No image URL found`);
        continue;
      }

      const tempFileName = `${uuidv4()}.jpg`;
      const tempFilePath = path.join(TMP_DIR, tempFileName);

      try {
        console.log(`📥 Downloading image for ${product.productName}`);
        await downloadImage(url, tempFilePath);
        console.log("✅ Image downloaded:", tempFilePath);

        const embedding = await getEmbeddingFromPython(tempFilePath);

        if (embedding && Array.isArray(embedding)) {
          product.embedding = embedding;
          await product.save();
          console.log(`✅ Saved embedding for: ${product.productName}`);
        } else {
          throw new Error("Invalid embedding received");
        }
      } catch (err) {
        console.error(`❌ Failed embedding for ${product.productName}:`, err.message);
      } finally {
        // Clean up the temp file
        fs.unlink(tempFilePath, (err) => {
          if (err) console.warn("⚠️ Failed to delete temp file:", err.message);
        });
      }
    }

    console.log("🎉 All embeddings processed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  }
};

run();
