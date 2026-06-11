"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Star, Truck, Shield, RefreshCw, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getById(id);
      const prod = data.product || data;
      setProduct(prod);
      if (prod.images?.length > 0) setSelectedImage(prod.images[0].url);
      if (prod.sizes?.length > 0) setSelectedSize("");
      if (prod.colors?.length > 0) setSelectedColor("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const hasSizes = product.sizes?.length > 0;
    if (hasSizes && !selectedSize) {
      alert("Please select a size first");
      return;
    }
    addToCart({
      id: product._id,
      name: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      image: product.images?.[0]?.url,
      quantity,
      size: selectedSize || undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.title,
        price: product.price,
        image: product.images?.[0]?.url,
        category: product.category,
      });
    }
  };

  const discountPercent = product?.compareAtPrice > product?.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-gray-200 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  const inWishlist = isInWishlist(product._id);
  const availableSizes = product.sizes?.length > 0 ? product.sizes : ["S", "M", "L", "XL", "XXL"];
  const availableColors = product.colors?.length > 0 ? product.colors : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-black">Products</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">

        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div
            className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 cursor-zoom-in"
            onClick={() => window.open(selectedImage, "_blank")}
          >
            {selectedImage ? (
              <img src={selectedImage} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === img.url ? "border-black" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h1>

          {/* Stars */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill={i < Math.round(product.ratingAvg || 4) ? "currentColor" : "none"} size={16} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.ratingCount || 128} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
            {discountPercent > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.compareAtPrice?.toLocaleString()}</span>
                <span className="text-green-600 font-bold text-lg">{discountPercent}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Color: <span className="font-normal text-gray-600">{selectedColor || "Select"}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color ? "border-black scale-110" : "border-gray-200 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">
                Size: <span className="font-normal text-gray-600">{selectedSize || "Select"}</span>
              </h3>
              <button className="text-sm text-gray-500 underline hover:text-black">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[56px] h-12 px-3 rounded-xl font-medium border-2 transition text-sm ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Actions */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100 text-lg font-bold">−</button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100 text-lg font-bold">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 rounded-xl font-bold text-sm uppercase tracking-wide transition ${
                addedToCart
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className={`p-4 border-2 rounded-xl transition ${
                inWishlist
                  ? "border-red-500 text-red-500 bg-red-50"
                  : "border-gray-200 text-gray-600 hover:border-black hover:text-black"
              }`}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={22} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Stock notice */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-red-500 text-sm font-medium mb-4">⚠ Only {product.stock} left in stock!</p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck size={18} className="text-gray-400 flex-shrink-0" />
              <span>Free Delivery over ₹1999</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RefreshCw size={18} className="text-gray-400 flex-shrink-0" />
              <span>14 Days Easy Return</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield size={18} className="text-gray-400 flex-shrink-0" />
              <span>1 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
