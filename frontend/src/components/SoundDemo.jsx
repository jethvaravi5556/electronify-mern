import React, { useState } from "react";
import SummaryApi from "../common";

const SoundDemo = () => {
  const [category, setCategory] = useState("airpods");
  const [product, setProduct] = useState("airpodes_111");
  const [audioUrl, setAudioUrl] = useState("");

  const handlePlay = async() => {
    const apiUrl = SummaryApi.sampleSound.url.trim().replace(/\u200B/g, "");
    setAudioUrl(
      `${apiUrl}?category=${category}&product=${product}`
    );
  };

  const productList = {
    airpods: [
      "airpodes_111", "airpodes_201", "airpodes_131", "airpodes_501_anc", "airpodes_121",
      "airpodes_381_mkl", "airpodes_411", "airpodes_115", "airpodes_451v2_4", "airpodes_172",
      "airpodes_192", "airpodes_511_v2", "airpodes_381", "airpodes_181", "airpodes_431",
      "airpodes_701_anc", "tygot_tripod_stand"
    ],
    earphones: [
      "boat_trebel_rockerz_450", "boat_rockerz_330_pro_4", "boat_rockerz_258_pro_plus_1",
      "boat_rockerz_450_batman", "boat_rockerz_375_1", "boat_rockerz_558", "rockerz_265_v2",
      "boat_rockerz_103_pro_2", "boat_trebel_rockerz_255_pro", "boat_rockerz_330_4",
      "boat_rockerz_400", "boat_rockerz_510", "boat_trebel_rockerz_235_v2", "boat_rockerz_518"
    ],
    speakers: [
      "blitz_2000_1", "boat_rugby_plus_1", "stone_500_1", "stone_260_1", "boat_stone_170",
      "boat_stone_190_1", "boat_stone_620_1", "boat_stone_1200_1", "boat_stone_1450_1",
      "stone_1350_1", "boat_stone_1508_1", "stone_200_1", "stone_350_1"
    ]
  };

  return (
    <div className="p-4 sm:p-6 mt-10 max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-red-300">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-red-600 mb-6 text-center">
        🎧 Sound Demo
      </h2>

      <div className="flex flex-col gap-5">
        {/* Category Selector */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-red-500">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProduct(productList[e.target.value][0]);
            }}
            className="w-full p-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="airpods">Airpods</option>
            <option value="earphones">Earphones</option>
            <option value="speakers">Speakers</option>
          </select>
        </div>

        {/* Product Selector */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-red-500">
            Product
          </label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {productList[category].map((p) => (
              <option key={p} value={p}>
                {p.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full py-2 px-4 transition-all"
        >
          🔊 Load & Play
        </button>

        {/* Audio Player */}
        {audioUrl && (
          <audio
            controls
            className="w-full mt-4 border border-red-300 rounded-md"
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default SoundDemo;
