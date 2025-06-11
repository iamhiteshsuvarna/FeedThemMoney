'use client';
import React, { useState, useEffect } from "react";

export default function OpeningBalance() {
  const [balances, setBalances] = useState([]);
  const [form, setForm] = useState({
    accounting_concept: "",
    opening_balance: "",
    last_update: ""
  });

  // Extracted fetch logic
  const loadOpeningBalance = () => {
    fetch("/api/settings/load_opening_balance")
      .then((response) => response.json())
      .then((data) => setBalances(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  const concepts = ["Assets", "Liabilities", "Reserves", "Expenses", "Income"];
  useEffect(() => {
    loadOpeningBalance();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log("handleChange", name, value);
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleAddOrUpdate = e => {
    e.preventDefault();
    fetch("/api/settings/add_opening_balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accounting_concept: form.accounting_concept,
          opening_balance: form.opening_balance,
          last_update: form.last_update
        })
      })
      .then(res => res.json())
      .then(data => {
        // Reload categories after update
        loadOpeningBalance();
      })
      .catch(err => console.error("Error updating Openiing Balances:", err));
    
    setForm({
        accounting_concept: "",
        opening_balance: "",
        last_update: ""
    });
  };
  
  
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-6">Manage Opening Balances</h1>
      <form onSubmit={handleAddOrUpdate} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Accounting Concept</label>
          <select
            name="accounting_concept"
            value={form.accounting_concept}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required>
                <option value="">Select Concept</option>
                {concepts.map((concept, index) => (
                <option key={index} value={concept}>
                    {concept}
                </option>
                ))}
            </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Opening Balance</label>
          <input
            name="opening_balance"
            type="number"
            value={form.opening_balance ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Applicable From Date</label>
          <input
            name="last_update"
            type="date"
            value={form.last_update ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            {"Update Opening Balance"}
          </button>
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Opening Balances</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Accounting Concept</th>
              <th className="p-2 border">Opening Balance</th>
              <th className="p-2 border">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {balances.map(cat => (
              <tr key={cat.accounting_concept + `ROW`}>
                <td className="p-2 border">{cat.accounting_concept}</td>
                <td className="p-2 border">{cat.opening_balance}</td>
                <td className="p-2 border">{cat.last_update}</td>
              </tr>
            ))}
            {balances.length === 0 && (
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