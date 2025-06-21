import { getImageEmbedding } from "../../utils/clipEmbedder.js";
import productModel from "../../models/productModel.js";
import fs from "fs";

// Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

export const searchByImageController = async (req, res) => {
  const imagePath = req.file?.path;
  if (!imagePath) return res.status(400).json({ success: false, message: "No image uploaded" });

  try {
    const result = await getImageEmbedding(imagePath);
    const uploadedEmbedding = result?.embedding;

    const products = await productModel.find({ embedding: { $exists: true } });

    const scored = products.map((p) => ({
      ...p.toObject(),
      similarity: cosineSimilarity(uploadedEmbedding, p.embedding),
    }));

    const top10 = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 10);

    return res.json({ success: true, products: top10 });
  } catch (err) {
    res.status(500).json({ success: false, message: "Image search failed", error: err.message });
  } finally {
    fs.unlink(imagePath, () => {});
  }
};
