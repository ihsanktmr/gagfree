import { useCallback, useMemo, useState } from "react";

import { selectPosts } from "app/redux/post/selectors";
import { useSelector } from "react-redux";

export const usePostsData = () => {
  const postsData = useSelector(selectPosts) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories and ensure they're all strings
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();

    postsData.forEach((post) => {
      if (post?.category && typeof post.category === "string") {
        uniqueCategories.add(post.category);
      }
    });

    return Array.from(uniqueCategories).sort();
  }, [postsData]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    console.log("Filtering posts with:", {
      totalPosts: postsData.length,
      selectedCategory,
      searchQuery,
    });

    let filtered = [...postsData];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((post) => {
        const matches = post.category === selectedCategory;
        console.log(
          `Post "${post.title}" category "${post.category}" matches selected "${selectedCategory}": ${matches}`,
        );
        return matches;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().trim().split(" ");
      filtered = filtered.filter((post) => {
        const searchableText = [post.title, post.description, post.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTerms.every((term) => searchableText.includes(term));
      });
    }

    console.log("Filtered results:", {
      category: selectedCategory,
      totalResults: filtered.length,
      posts: filtered.map((p) => ({
        id: p._id,
        title: p.title,
        category: p.category,
      })),
    });

    return filtered;
  }, [postsData, selectedCategory, searchQuery]);

  const handleSetCategory = useCallback((category: string | null) => {
    console.log("Setting category:", {
      previous: selectedCategory,
      new: category,
    });
    setSelectedCategory(category);
  }, []);

  return {
    posts: filteredPosts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory: handleSetCategory,
  };
};
