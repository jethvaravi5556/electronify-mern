import React, { useContext } from "react";
import VerticalCard from "../components/VerticalCard";
import ImageSearchContext from "../context/ImageSearchContext";

const ImageSearchResult = () => {
  const { imageSearchResults, loading } = useContext(ImageSearchContext);

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <p className="mt-20 text-center text-blue-600 font-semibold">
          🔍 Searching by image...
        </p>
      )}

      {!loading && imageSearchResults.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Similar Products:</h2>
          <VerticalCard data={imageSearchResults} />
        </>
      )}

      {!loading && imageSearchResults.length === 0 && (
        <p className="text-center text-gray-500">No matching products found.</p>
      )}
    </div>
  );
};

export default ImageSearchResult;
