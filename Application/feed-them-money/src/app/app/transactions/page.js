"use client";
import { useEffect, useState, useRef } from "react";

export default function TransactionsPage() {
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formHidden, setFormHidden] = useState(true);
  const [form, setForm] = useState({
    txn_id: "",
    txn_date: "",
    category: "",
    particulars: "",
    amount: "",
    money_account: "",
    tags: [],
  });
  const txnDateInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const categoryInputRef = useRef(null);

  const [moneyAccounts, setMoneyAccounts] = useState([]);
  const [showAccountSuggestions, setShowAccountSuggestions] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [activeAccountSuggestion, setActiveAccountSuggestion] = useState(-1);
  const accountInputRef = useRef(null);

  const [allTags, setAllTags] = useState([]); // All possible tags from backend
  const [tagInput, setTagInput] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [activeTagSuggestion, setActiveTagSuggestion] = useState(-1);
  const tagInputRef = useRef(null);

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortAmount, setSortAmount] = useState(""); // "asc" or "desc"

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

  // Fetch money accounts
  const loadMoneyAccounts = () => {
  fetch("/api/transactions/load_money_accounts")
      .then((response) => response.json())
      .then((data) => setMoneyAccounts(data))
      .catch((error) => console.error("Error fetching accounts:", error));
  };
  useEffect(() => {
    loadMoneyAccounts();
  }, []);

  // Fetch transactions
  const loadTransactions = () => {
    fetch("/api/transactions/fetch_transactions")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Fetch money accounts
  const loadTags = () => {
  fetch("/api/transactions/load_tags")
      .then((response) => response.json())
      .then((data) => setAllTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  };
  useEffect(() => {
    loadTags();
  }, []);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/transactions/add_transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags: JSON.stringify(form.tags) }),
    });
    if (res.ok) {
      loadTransactions();
      loadTags();
      setIsSubmitting(false);
      setForm((prevForm) => ({
        txn_id: "",
        txn_date: prevForm.txn_date, // Keep the selected date intact
        category: "",
        particulars: "",
        amount: "",
        money_account: "",
        tags: [],
      }));
      setIsEditing(false);
      // Focus the txn_date input after submit
      setTimeout(() => {
        if (txnDateInputRef.current) {
          txnDateInputRef.current.focus();
        }
      }, 0);
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

  const handleAccountChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, money_account: value });

    if (value.length > 0) {
      const filtered = moneyAccounts
        .map(acc => typeof acc === "string" ? acc : acc.account_name)
        .filter(acc =>
          acc.toLowerCase().includes(value.toLowerCase())
        );
      setFilteredAccounts(filtered);
      setShowAccountSuggestions(filtered.length > 0);
    } else {
      setShowAccountSuggestions(false);
    }
  };

  const handleAccountSelect = (acc) => {
    setForm({ ...form, money_account: acc });
    setShowAccountSuggestions(false);
  };

  

  // Tag input handling
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.length > 0) {
      const filtered = allTags.filter(tag =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
      // If no matches, show the user's input as a suggestion
      if (filtered.length === 0) {
        setFilteredTags([value]);
      } else {
        setFilteredTags(filtered);
      }
      setShowTagSuggestions(true);
    } else {
      setShowTagSuggestions(false);
    }
  };

  const handleTagSelect = (tag) => {
    console.log("Selected tag:", tag);
    if (!form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    console.log("Updated tags:", form.tags);
    setTagInput("");
    setShowTagSuggestions(false);
  };

  const handleTagDelete = (tagToDelete) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToDelete) });
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
      if (
        accountInputRef.current &&
        !accountInputRef.current.contains(event.target)
      ) {
        setShowAccountSuggestions(false);
      }
      if (
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target)
      ) {
        setShowTagSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveSuggestion(-1);
  }, [filteredCategories, showSuggestions]);

  useEffect(() => {
    setActiveAccountSuggestion(-1);
  }, [filteredAccounts, showAccountSuggestions]);

  useEffect(() => {
    setActiveTagSuggestion(-1);
  }, [filteredTags, showTagSuggestions]);

  // Filtered data based on criteria
  let filteredData = data;

  // Filter by date range
  if (filterStartDate)
    filteredData = filteredData.filter(txn => txn.txn_date >= filterStartDate);
  if (filterEndDate)
    filteredData = filteredData.filter(txn => txn.txn_date <= filterEndDate);

  // Filter by category
  if (filterCategory)
    filteredData = filteredData.filter(txn => txn.category === filterCategory);

  // Filter by account
  if (filterAccount)
    filteredData = filteredData.filter(txn => txn.money_account === filterAccount);

  // Filter by tag
  if (filterTag)
    filteredData = filteredData.filter(txn =>
      Array.isArray(JSON.parse(txn.tags))
        ? JSON.parse(txn.tags).includes(filterTag)
        : false
    );

  // Sort by amount
  if (sortAmount === "asc")
    filteredData = [...filteredData].sort((a, b) => a.amount - b.amount);
  if (sortAmount === "desc")
    filteredData = [...filteredData].sort((a, b) => b.amount - a.amount);

  const handleEditTransaction = (txn) => {
    // Ensure date is in YYYY-MM-DD format
    let dateValue = "";
    if (txn.txn_date) {
      // If already in YYYY-MM-DD, this will work; otherwise, convert
      const d = new Date(txn.txn_date);
      if (!isNaN(d)) {
        dateValue = d.toISOString().slice(0, 10);
      } else {
        // fallback: try to use as is
        dateValue = txn.txn_date;
      }
    }
    setForm({
      txn_id: txn.txn_id || "",
      txn_date: dateValue,
      category: txn.category || "",
      particulars: txn.particulars || "",
      amount: txn.amount !== undefined && txn.amount !== null ? txn.amount : "",
      money_account: txn.money_account || "",
      tags: Array.isArray(JSON.parse(txn.tags)) ? JSON.parse(txn.tags) : [],
    });
    setIsEditing(true);
    setFormHidden(false);
    // Optionally scroll to form or focus
  };

  const handleDeleteTransaction = async (txn_id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    const res = await fetch("/api/transactions/delete_transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txn_id }),
    });
    if (res.ok) {
      loadTransactions();
    } else {
      alert("Failed to delete transaction.");
    }
  };

  return (
    <div className="dark:text-black grid grid-cols-1 md:grid-cols-3 grid-rows-12 md:grid-rows-1 gap-2 items-start h-[calc(100vh-5em)]">
      <div className={`col-span-2 row-span-10 flex items-start bg-white h-full p-2`}>
      {data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>): 
        <div className="w-full h-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 rounded-lg bg-blue-900 text-white p-2 w-full">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Filter Transactions</span>
              <div className="flex flex-row gap-2">
                <span className="text-sm bg-blue-700 p-2 rounded-full text-white">Count {filteredData.length}</span>
                <span className="text-sm bg-blue-700 p-2 rounded-full text-white">
                  Sum {filteredData.reduce((sum, txn) => sum + Number(txn.amount), 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="date"
                value={filterStartDate}
                key="sd1"
                onChange={e => setFilterStartDate(e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Start date"
              />
              <span>-</span>
              <input
                type="date"
                value={filterEndDate}
                key="ed2"
                onChange={e => setFilterEndDate(e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="End date"
              />
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
                value={filterAccount}
                onChange={e => setFilterAccount(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Accounts</option>
                {moneyAccounts.map(acc => {
                  const value = typeof acc === "string" ? acc : acc.account_name;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <select
                value={filterTag}
                onChange={e => setFilterTag(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <select
                value={sortAmount}
                onChange={e => setSortAmount(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Sort by Amount</option>
                <option value="asc">Amount ↑</option>
                <option value="desc">Amount ↓</option>
              </select>
              <button
                className="ml-2 px-2 py-1 bg-blue-800 text-white rounded"
                onClick={() => {
                  setFilterStartDate("");
                  setFilterEndDate("");
                  setFilterCategory("");
                  setFilterTag("");
                  setSortAmount("");
                }}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Particulars</th>
                  <th>Amount</th>
                  <th>Account</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((txn) => {
                  const dateObj = new Date(txn.txn_date);
                  const day = String(dateObj.getDate()).padStart(2, '0');
                  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const year = dateObj.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;
                  return (
                    <tr key={txn.txn_id}>
                      <td>{formattedDate}</td>
                      <td>{txn.category}</td>
                      <td>{txn.particulars}</td>
                      <td className="text-right">{txn.amount.toFixed(2)}</td>
                      <td>{txn.money_account}</td>
                      <td>
                        {Array.isArray(JSON.parse(txn.tags))
                          ? JSON.parse(txn.tags).map((tag, idx) => (
                              <span key={tag + idx} className="inline-block bg-gray-200 rounded px-2 py-1 mr-1 text-xs">
                                {tag}
                              </span>
                            ))
                          : null}
                      </td>
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
          
        </div>}
      </div>
      <div className={`${!formHidden ? `row-span-12`: `row-span-2`} flex flex-col bg-white h-full p-2 w-full`}>
        <button className={`${!formHidden ? `hidden`: `flex`}  md:hidden py-2 px-4 bg-blue-600 text-white rounded-lg items-center justify-center`} onClick={() => setFormHidden(false)}>Add Transaction</button>
        <div className={`transition duration-75 ease-in-out  ${formHidden ? `translate-y-96 md:translate-y-0`: `flex  -translate-y-96`} md:flex flex-col p-4 border-collapse rounded-lg bg-amber-100 mb-4 border-4 border-blue-600`}>
          <div className="flex flex-row justify-between items-center py-4">
            <h2 className="flex items-center text-lg font-semibold h-full">Add Transaction</h2>
            <button className="flex md:hidden flex-row gap-2 py-2 px-4 rounded-full bg-gray-200" onClick={() => setFormHidden(true)}><span className="text-center align-middle">X</span>Close</button></div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="date"
              name="txn_date"
              value={form.txn_date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
              ref={txnDateInputRef}
            />
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
            <input
              type="text"
              name="particulars"
              placeholder="Particulars"
              value={form.particulars}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount === undefined || form.amount === null ? "" : form.amount}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <div className="relative" ref={accountInputRef}>
              <input
                type="text"
                name="money_account"
                placeholder="Account"
                value={form.money_account}
                onChange={handleAccountChange}
                className="border p-2 rounded w-full"
                autoComplete="off"
                onFocus={() => {
                  if (form.money_account.length > 0 && filteredAccounts.length > 0) setShowAccountSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (!showAccountSuggestions) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveAccountSuggestion((prev) =>
                      prev < filteredAccounts.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveAccountSuggestion((prev) =>
                      prev > 0 ? prev - 1 : filteredAccounts.length - 1
                    );
                  } else if (e.key === "Enter") {
                    if (activeAccountSuggestion >= 0 && filteredAccounts.length > 0) {
                      e.preventDefault();
                      handleAccountSelect(filteredAccounts[activeAccountSuggestion]);
                    }
                  } else if (e.key === "Escape") {
                    setShowAccountSuggestions(false);
                  }
                }}
              />
              {showAccountSuggestions && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded shadow">
                  {filteredAccounts.map((acc, idx) => (
                    <li
                      key={acc}
                      className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                        idx === activeAccountSuggestion ? "bg-blue-100" : ""
                      }`}
                      onMouseDown={() => handleAccountSelect(acc)}
                      onMouseEnter={() => setActiveAccountSuggestion(idx)}
                    >
                      {acc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative" ref={tagInputRef}>
              <input
                type="text"
                name="tags"
                placeholder="Tags"
                value={tagInput}
                onChange={handleTagInputChange}
                className="border p-2 rounded w-full"
                autoComplete="off"
                onFocus={() => {
                  if (tagInput.length > 0 && filteredTags.length > 0) setShowTagSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (!showTagSuggestions) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveTagSuggestion((prev) =>
                      prev < filteredTags.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveTagSuggestion((prev) =>
                      prev > 0 ? prev - 1 : filteredTags.length - 1
                    );
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (activeTagSuggestion >= 0 && filteredTags.length > 0) {
                      handleTagSelect(filteredTags[activeTagSuggestion]);
                    } else if (tagInput.trim() !== "") {
                      handleTagSelect(tagInput.trim());
                    }
                  } else if (e.key === "Escape") {
                    setShowTagSuggestions(false);
                  }
                }}
              />
              {showTagSuggestions && (
                <ul className="absolute z-20 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded shadow">
                  {filteredTags.map((tag, idx) => (
                    <li
                      key={tag}
                      className={`px-3 py-2 hover:bg-blue-100 cursor-pointer ${
                        idx === activeTagSuggestion ? "bg-blue-100" : ""
                      }`}
                      onMouseDown={() => handleTagSelect(tag)}
                      onMouseEnter={() => setActiveTagSuggestion(idx)}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-1">
              {form.tags.map((tag, idx) => (
                <span key={tag} className="inline-flex items-center bg-blue-200 rounded px-2 py-1 text-xs">
                  {tag}
                  <button
                    type="button"
                    className="ml-1 text-blue-700 hover:text-red-600"
                    onClick={() => handleTagDelete(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button
              type="submit"
              className={` ${isSubmitting ? `bg-amber-700`: `bg-blue-600` } text-white px-4 py-2 rounded w-full`}
            >
              { isSubmitting ? `Updating..Please Wait` : isEditing ? `Update Transaction` : `Save Transaction` }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}