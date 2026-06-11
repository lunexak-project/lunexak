"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const SearchContext = createContext<any>(null);

export function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [sortBy, setSortBy] =
    useState("");

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,

        selectedCategory,
        setSelectedCategory,

        sortBy,
        setSortBy,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () =>
  useContext(SearchContext);