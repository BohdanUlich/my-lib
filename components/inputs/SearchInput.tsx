"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TextField } from "@mui/material";

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState<string>(searchParams.get("q") || "");

  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const updateSearch = () => {
    keyword ? params.set("q", keyword) : params.delete("q");

    router.replace(`?${params.toString()}`);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      updateSearch();
    }, 300);

    return () => clearTimeout(delay);
    // eslint-disable-next-line
  }, [keyword]);

  return (
    <TextField
      label="Search"
      value={keyword}
      sx={{ width: { xs: "100%", md: "300px" } }}
      fullWidth
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};
