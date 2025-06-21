import path from "path";
import fs from "fs";

export const getSoundSample = (req, res) => {
  const { category, product } = req.query;
  if (!category || !product) return res.status(400).json({ message: "Missing category or product" });

  const filePath = path.resolve(`public/audio_samples/${category}/${product}.mp3`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Audio file not found" });
  }

  res.sendFile(filePath);
};
