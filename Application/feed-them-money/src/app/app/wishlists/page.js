"use client";
import { useEffect, useState, useRef } from "react";

export default function WishlistPage() {
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formHidden, setFormHidden] = useState(true);
  const [form, setForm] = useState({
    id: 0,
    category: "",
    particulars: "",
    wishlist_description: "",
    wishlist_group: "",
    budget: "",
    wishlist_stage: "",
    priority: 0,
  });
  const txnDateInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const categoryInputRef = useRef(null);

  const [wishlistGroups, setWishlistGroups] = useState([]);
  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [activeGroupSuggestion, setActiveGroupSuggestion] = useState(-1);
  const groupInputRef = useRef(null);

  
  const stage = ["EXPLORING","CONSIDERING","SEE YOU LATER","DONE"];

  const [filterCategory, setFilterCategory] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [sortBudget, setSortBudget] = useState(""); // "asc" or "desc"
  const [sortPriority, setSortPriority] = useState(""); // "asc" or "desc"
  

  // Fetch categories
  const loadCategories = () => {
    fetch("/api/transactions/load_categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }
  useEffect(() => {
    loadCategories();
  }
  , []);

  // Fetch categories
  const loadWishlistGroups = () => {
    fetch("/api/wishlist/fetch_wishlist_groups")
      .then((response) => response.json())
      .then((data) => {
        const output = data.map(group => group.wishlistgroup);
        console.log("Wishlist Groups:", output);
        setWishlistGroups(output)})
      .catch((error) => console.error("Error fetching Wishlist Groups:", error));
  }
  useEffect(() => {
    loadWishlistGroups();
  }
  , []);

  // Fetch transactions
  const loadWishlists = () => {
    fetch("/api/wishlist/fetch_wishlist")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching wishlist:", error));
  };

  useEffect(() => {
    loadWishlists();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/wishlist/add_wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: JSON.stringify(form.tags) }),
    });
    if (res.ok) {
      loadWishlists();
      setIsSubmitting(false);
      setForm((prevForm) => ({
        id: "",
        category: "",
        particulars: "",
        wishlist_description: "",
        wishlist_group: "",
        budget: "",
        wishlist_stage: "",
        priority: 0
      }));
      setIsEditing(false);
    }
    // Optionally show a message
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, category: value });

    if (value.length > 0) {
      const filtered = categories
        .map(cat => typeof cat === "string" ? cat : cat.category)
        .filter(cat =>
          cat.toLowerCase().includes(value.toLowerCase())
        );
      setFilteredCategories(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCategorySelect = (cat) => {
    setForm({ ...form, category: cat });
    setShowSuggestions(false);
  };

  const handleWishlistGroupChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, wishlist_group: value });

    if (value.length > 0) {
      const filtered = wishlistGroups
        .map(group => typeof group === "string" ? group : group.wishlist_group)
        .filter(group =>
          group.toLowerCase().includes(value.toLowerCase())
        );
      setFilteredGroups(filtered);
      setShowGroupSuggestions(filtered.length > 0);
    } else {
      setShowGroupSuggestions(false);
    }
  };

  const handleWishlistGroupSelect = (group) => {
    setForm({ ...form, wishlist_group: group });
    setShowGroupSuggestions(false);
  };

  const handleStageSelect = (stage) => {
    setForm({ ...form, wishlist_stage: stage.target.value });
  };

  // Hide suggestions if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveSuggestion(-1);
    setActiveGroupSuggestion(-1);
  }, [filteredCategories, showSuggestions, filteredGroups, showGroupSuggestions]);

  // Filtered data based on criteria
  let filteredData = data;

  // Filter by category
  if (filterCategory)
    filteredData = filteredData.filter(txn => txn.category === filterCategory);

  // Filter by groups
  if (filterGroup)
    filteredData = filteredData.filter(txn => txn.wishlist_group === filterGroup);

  // Filter by Stage
  if (filterStage)
    filteredData = filteredData.filter(txn => txn.stage === filterStage);

  // Sort by budget
  if (sortBudget === "asc")
    filteredData = [...filteredData].sort((a, b) => a.budget - b.budget);
  if (sortBudget === "desc")
    filteredData = [...filteredData].sort((a, b) => b.budget - a.budget);

  // Sort by priority
  if (sortPriority === "asc")
    filteredData = [...filteredData].sort((a, b) => a.priority - b.priority);
  if (sortPriority === "desc")
    filteredData = [...filteredData].sort((a, b) => b.priority - a.priority);

  
  const handleEditTransaction = (txn) => {
    
    setForm({
      id: txn.id || 0,
      category: txn.category || "",
      particulars: txn.particulars || "",
      wishlist_group: txn.wishlist_group || "",
      wishlist_description: txn.wishlist_description || "",
      budget: txn.budget !== undefined && txn.budget !== null ? txn.budget : "",
      wishlist_stage: txn.wishlist_stage || "",
      priority: txn.priority !== undefined && txn.priority !== null ? txn.priority : 0
    });
    setIsEditing(true);
    setFormHidden(false);
    // Optionally scroll to form or focus
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wishlist item?")) return;
    const res = await fetch("/api/wishlist/delete_wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      loadWishlists();
    } else {
      alert("Failed to delete wishlist.");
    }
  };

  return (
    <div className="dark:text-black grid grid-cols-1 md:grid-cols-3 grid-rows-1 gap-2 items-start h-[calc(100vh-5em)]">
      
      {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center row-span-12">
            <p className="text-gray-500">Loading...</p>
          </div>): <div className={`col-span-1 md:col-span-2 row-span-1 items-start bg-white h-full p-2 flex flex-col gap-2`}>
          {/* FILTER */}
          <div className="flex flex-col gap-2 rounded-lg bg-blue-900 text-white p-2 w-full">
            {/* TITLE, COUNT & SUM */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Filter Wishlist</span>
              <div className="flex flex-row gap-2">
                <span className="text-sm bg-blue-700 p-2 rounded-full text-white">Count: {filteredData.length}</span>
                <span className="text-sm bg-blue-700 p-2 rounded-full text-white">
                  Budget: {filteredData.reduce((sum, txn) => sum + Number(txn.budget), 0).toFixed(2)}
                </span>
              </div>
            </div>
            {/* FILTER FIELDS */}
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Categories</option>
                {categories.map(cat => {
                  const value = typeof cat === "string" ? cat : cat.category;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <select
                value={filterGroup}
                onChange={e => setFilterGroup(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Groups</option>
                {wishlistGroups.map(group => {
                  const value = typeof group === "string" ? group : group.wishlist_group;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {stage.map(val => {
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <select
                value={sortBudget}
                onChange={e => setSortBudget(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Sort by Budget</option>
                <option value="asc">Budget ↑</option>
                <option value="desc">Budget ↓</option>
              </select>
              <button
                className="ml-2 px-2 py-1 bg-blue-800 text-white rounded"
                onClick={() => {
                  setFilterStage("");
                  setFilterCategory("");
                  setSortBudget("");
                  setSortPriority("");
                }}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          {/* TABLE */}
          <div className="overflow-y-auto h-full w-full">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Group</th>
                  <th>Particulars</th>
                  <th>Description</th>
                  <th>Budget</th>
                  <th>Stage</th>
                  {/* <th>Priority</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((txn) => {
                  return (
                    <tr key={txn.id}>
                      <td>{txn.category}</td>
                      <td>{txn.wishlist_group}</td>
                      <td>{txn.particulars}</td>
                      <td>{txn.wishlist_description}</td>
                      <td className="text-right">{txn.budget.toFixed(2)}</td>
                      <td>{txn.wishlist_stage}</td>
                      {/* <td className="text-center">{txn.priority}</td> */}
                      
                      <td>
                        <div className="flex flex-row gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => handleEditTransaction(txn)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleDeleteTransaction(txn.txn_id)}
                          type="button"
                        >
                          Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button className={`${formHidden ? `flex`: `hidden`} row-span-1 md:hidden py-2 px-4 bg-blue-600 text-white rounded-lg items-center justify-center w-full`} onClick={() => setFormHidden(false)}>Add Transaction</button>
          </div>
        }
      
      <div className={`z-40 transition duration-75 ease-in-out  ${formHidden && `hidden justify-end md:flex md:justify-center`} flex absolute md:relative col-span-1 row-span-1 flex-col h-[calc(100vh-5em)] p-2 w-full justify-end`}>
        <div className={`flex flex-col p-4 border-collapse rounded-lg bg-amber-100 mb-4 border-4 border-blue-600 md:h-full`}>
          {/* HEADER */}
          <div className="flex flex-row justify-between items-center py-4">
            <h2 className="flex items-center text-lg font-semibold h-full">Add Wishlist</h2>
            <button className="flex md:hidden flex-row gap-2 py-2 px-4 rounded-full bg-gray-200" onClick={() => setFormHidden(true)}><span className="text-center align-middle">X</span>Close</button>
          </div>
          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative" ref={categoryInputRef}>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleCategoryChange}
                className="border p-2 rounded w-full"
                autoComplete="off"
                required
                onFocus={() => {
                  if (form.category.length > 0 && filteredCategories.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveSuggestion((prev) =>
                      prev < filteredCategories.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveSuggestion((prev) =>
                      prev > 0 ? prev - 1 : filteredCategories.length - 1
                    );
                  } else if (e.key === "Enter") {
                    if (activeSuggestion >= 0 && filteredCategories.length > 0) {
                      e.preventDefault();
                      handleCategorySelect(filteredCategories[activeSuggestion]);
                    }
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
              />
              {showSuggestions && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded shadow">
                  {filteredCategories.map((cat, idx) => (
                    <li
                      key={cat}
                      className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                        idx === activeSuggestion ? "bg-blue-100" : ""
                      }`}
                      onMouseDown={() => handleCategorySelect(cat)}
                      onMouseEnter={() => setActiveSuggestion(idx)}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative" ref={groupInputRef}>
              <input
                type="text"
                name="wishlist_group"
                placeholder="Group (Optional)"
                value={form.wishlist_group}
                onChange={handleWishlistGroupChange}
                className="border p-2 rounded w-full"
                autoComplete="off"
                required
                onFocus={() => {
                  if (form.wishlist_group.length > 0 && filteredGroups.length > 0) setShowGroupSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (!showGroupSuggestions) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveGroupSuggestion((prev) =>
                      prev < filteredGroups.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveGroupSuggestion((prev) =>
                      prev > 0 ? prev - 1 : filteredGroups.length - 1
                    );
                  } else if (e.key === "Enter") {
                    if (activeGroupSuggestion >= 0 && filteredGroups.length > 0) {
                      e.preventDefault();
                      handleWishlistGroupSelect(filteredGroups[activeGroupSuggestion]);
                    }
                  } else if (e.key === "Escape") {
                    setShowGroupSuggestions(false);
                  }
                }}
              />
              {showGroupSuggestions && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded shadow">
                  {filteredGroups.map((group, idx) => (
                    <li
                      key={group}
                      className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                        idx === activeGroupSuggestion ? "bg-blue-100" : ""
                      }`}
                      onMouseDown={() => handleWishlistGroupSelect(group)}
                      onMouseEnter={() => setActiveGroupSuggestion(idx)}
                    >
                      {group}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
              name="particulars"
              placeholder="Particulars"
              value={form.particulars}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <textarea
              type="text"
              name="wishlist_description"
              placeholder="Description"
              value={form.wishlist_description}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            
            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={form.budget === undefined || form.budget === null ? "" : form.budget}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <select
              value={form.wishlist_stage}
              name="stage"
              placeholder="Stage"
              onChange={(val) => handleStageSelect(val)}
              className="border rounded px-2 py-1"
            >
              {stage.map(val => {
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
            
            <button
              type="submit"
              className={` ${isSubmitting ? `bg-amber-700`: `bg-blue-600` } text-white px-4 py-2 rounded w-full`}
            >
              { isSubmitting ? `Updating..Please Wait` : isEditing ? `Update Wishlist Item` : `Add to Wishlist` }
            </button>
          </form>
        </div>
        <div className="bg-black md:bg-white opacity-35 md:opacity-100 w-full h-full absolute top-0 left-0 -z-10" />
      </div>
    </div>
  );
}