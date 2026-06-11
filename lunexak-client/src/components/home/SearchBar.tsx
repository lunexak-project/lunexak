"use client";

import { useSearch } from "@/context/SearchContext";

export default function SearchBar() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useSearch();

  return (
    <section className="py-8 flex flex-col md:flex-row justify-center items-center gap-4">

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        className="
          border
          p-3
          rounded-lg
          w-[350px]
        "
      />

      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) =>
          setSelectedCategory(
            e.target.value
          )
        }
        className="
          border
          p-3
          rounded-lg
        "
      >
        <option value="All">
          All Categories
        </option>

        <option value="men">
          Men
        </option>

        <option value="women">
          Women
        </option>

        <option value="kids">
          Kids
        </option>

        <option value="home-kitchen">
          Home & Kitchen
        </option>
      </select>

      {/* Sorting */}
      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
        className="
          border
          p-3
          rounded-lg
        "
      >
        <option value="">
          Sort By
        </option>

        <option value="lowToHigh">
          Price Low → High
        </option>

        <option value="highToLow">
          Price High → Low
        </option>
      </select>

    </section>
  );
}