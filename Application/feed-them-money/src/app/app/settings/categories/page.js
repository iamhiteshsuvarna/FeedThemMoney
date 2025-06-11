'use client';
import React, { useState, useEffect } from "react";

const concepts = ["Assets", "Liabilities", "Income", "Expenses"];

export default function ManageCategories() {
  const defaultDate = new Date();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    id: null,
    category: "",
    accounting_concept: concepts[0],
    budget: "",
    budget_from_month: new Date().toISOString().slice(0, 7),
    budget_from: new Date().toISOString()
  });
  const [editId, setEditId] = useState(null);

  // Extracted fetch logic
  const loadCategories = () => {
    fetch("/api/transactions/load_categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(
          data.map(cat => ({
            ...cat,
            budget_from: cat.budget_from,
            budget_from_month: cat.budget_from ? cat.budget_from.slice(0, 7) : null
          }))
        );
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log("handleChange", name, value);
    if (name === "budget_from") {
      setForm(f => ({ ...f, ['budget_from']: value + "-01" })); // Ensure budget_from is in YYYY-MM-DD format
      setForm(f => ({ ...f, ['budget_from_month']: value })); // Ensure budget_from is in YYYY-MM-DD format
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };


  const handleAddOrUpdate = e => {
    e.preventDefault();
    fetch("/api/settings/add_categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category_id: form.id,
          category_name: form.category,
          accounting_concept: form.accounting_concept,
          category_budget: Number(form.budget),
          budget_start_from: form.budget_from
        })
      })
      .then(res => res.json())
      .then(data => {
        // Reload categories after update
        loadCategories();
      })
      .catch(err => console.error("Error updating category:", err));
    if (editId) {
      setEditId(null);
    } 
    setForm({
      id: null,
      category: "",
      accounting_concept: concepts[0],
      budget: "",
      budget_from: new Date().toISOString(),
      budget_from_month: new Date().toISOString().slice(0, 7) // "YYYY-MM"
    });
  };

  const handleEdit = cat => {
    setEditId(cat.id);
    setForm({
      id: cat.id,
      category: cat.category,
      accounting_concept: cat.accounting_concept,
      budget: cat.budget,
      budget_from: cat.budget_from,
      budget_from_month: cat.budget_from ? cat.budget_from.slice(0, 7): defaultDate.toString().slice(0, 7) // Extract "YYYY-MM" for month input
    });
  };

  const handleDelete = id => {
    fetch("/api/settings/delete_category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category_id: id
        })
      })
      .then(res => res.json())
      .then(data => {
        // Reload categories after update
        loadCategories();
      })
      .catch(err => console.error("Error updating category:", err));
    // setCategories(cats => cats.filter(cat => cat.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-6">Manage Categories</h1>
      <form onSubmit={handleAddOrUpdate} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Accounting Concept</label>
          <select
            name="accounting_concept"
            value={form.accounting_concept}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            {concepts.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Budget</label>
          <input
            name="budget"
            type="number"
            value={form.budget}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start from Month</label>
          <input
            name="budget_from"
            type="month"
            value={form.budget_from_month? form.budget_from_month : Date.now().slice(0, 7)}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            {editId ? "Update Category" : "Add Category"}
          </button>
          {editId && (
            <button
              type="button"
              className="ml-2 px-4 py-2 rounded bg-gray-300"
              onClick={() => {
                setEditId(null);
                setForm({ category: "", accounting_concept: concepts[0], budget: "", budget_from: months[0] });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Categories</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Accounting Concept</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Start Month</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.category + `ROW`}>
                <td className="p-2 border">{cat.category}</td>
                <td className="p-2 border">{cat.accounting_concept}</td>
                <td className="p-2 border">{cat.budget}</td>
                <td className="p-2 border">{cat.budget_from}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className={`text-red-600 ${cat.usedInTransactions ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !cat.usedInTransactions && handleDelete(cat.id)}
                    disabled={cat.usedInTransactions}
                    title={cat.usedInTransactions ? "Category is used in transactions and cannot be deleted" : "Delete"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">Loading ....</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}