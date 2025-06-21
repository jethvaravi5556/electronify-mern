import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Context from "../context";
import SaveButton from "./SaveButton";

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingList = new Array(13).fill(null);
  const [scroll, setScroll] = useState(0);
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    // console.log("category ",categoryProduct?.data)
    setData(categoryProduct?.data || []); // ✅ fallback to an empty array
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };
  return (
    <div className="container mx-auto px-4 my-4 relative">
      <h2 className="text-2xl font-semibold py-2">{heading}</h2>
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow-md "
                >
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[150px] flex justify-center items-center">
                    {/* <img src={product?.productImage[0]} className='h-full object-scale-down hover:scale-110 transition-all mix-blend-multiply'/> */}
                  </div>
                  <div className="p-4 grid w-full gap-2">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full"></h2>
                    <p className="capitalize text-slate-500 bg-slate-200 animate-pulse p-1 rounded-full"></p>
                    <div className="flex gap-2">
                      <p className="text-red-500 font-medium bg-slate-200 animate-pulse p-1 rounded-full"></p>
                      <p className="text-slate-500 line-through bg-slate-200 animate-pulse p-1 rounded-full"></p>
                    </div>
                    <button className="text-sm text-white px-3 py-0.5 rounded-full bg-slate-200 animate-pulse p-1"></button>
                  </div>
                </div>
              );
            })
          : Array.isArray(data) &&
            data.map((product, index) => {
              return (
                <Link
                  to={"product/" + product?._id}
                  key={product._id || index}
                  className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow-md "
                >
                  <div className="relative bg-slate-200 h-48 flex justify-center items-center">
                    <SaveButton
                      className="absolute top-2 right-2 z-10"
                      productId={product?._id}
                    />
                    <img
                      src={product?.productImage[0]}
                      className="h-full object-contain hover:scale-110 transition-all mix-blend-multiply"
                      alt={product?.productName}
                    />
                  </div>

                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.category}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-red-500 font-medium">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      <p className="text-slate-500 line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    </div>
                    <button
                      className="text-sm bg-red-500 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
