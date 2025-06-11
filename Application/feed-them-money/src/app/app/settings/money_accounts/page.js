'use client';
import React, { useState, useEffect } from "react";

export default function ManageMoneyAccounts() {
  const [moneyAccounts, setMoneyAccounts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    account_name: "",
    account_number: "",
    ifsc_code: "",
    bank_branch: ""
  });
  const [editId, setEditId] = useState(null);

  // Extracted fetch logic
  const loadMoneyAccounts = () => {
    fetch("/api/transactions/load_money_accounts")
      .then((response) => response.json())
      .then((data) => setMoneyAccounts(data))
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  useEffect(() => {
    loadMoneyAccounts();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log("handleChange", name, value);
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleAddOrUpdate = e => {
    e.preventDefault();
    fetch("/api/settings/add_money_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          money_account_id: form.id,
          account_name: form.account_name,
          account_number: form.account_number,
          ifsc_code: form.ifsc_code,
          bank_branch: form.bank_branch
        })
      })
      .then(res => res.json())
      .then(data => {
        // Reload categories after update
        loadMoneyAccounts();
      })
      .catch(err => console.error("Error updating category:", err));
    if (editId) {
      setEditId(null);
    } 
    setForm({
      id: null,
      account_name: "",
      account_number: "",
      ifsc_code: "",
      bank_branch: ""
    });
  };

  const handleEdit = cat => {
    setEditId(cat.id);
    setForm({
      id: cat.id,
      account_name: cat.account_name,
      account_number: cat.account_number,
      ifsc_code: cat.ifsc_code,
      bank_branch: cat.bank_branch
    });
  };

  const handleDelete = id => {
    fetch("/api/settings/delete_money_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          money_account_id: id
        })
      })
      .then(res => res.json())
      .then(data => {
        loadMoneyAccounts();
      })
      .catch(err => console.error("Error updating money accounts:", err));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-6">Manage Money Accounts</h1>
      <form onSubmit={handleAddOrUpdate} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Account Name</label>
          <input
            name="account_name"
            value={form.account_name ??''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Account Number</label>
          <input
            name="account_number"
            value={form.account_number ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IFSC Code</label>
          <input
            name="ifsc_code"
            value={form.ifsc_code ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bank Branch</label>
          <input
            name="bank_branch"
            value={form.bank_branch ?? ''}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            {editId ? "Update Money Account" : "Add Money Account"}
          </button>
          {editId && (
            <button
              type="button"
              className="ml-2 px-4 py-2 rounded bg-gray-300"
              onClick={() => {
                setEditId(null);
                setForm({
                    id: null,
                    account_name: "",
                    account_number: "",
                    ifsc_code: "",
                    bank_branch: ""
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-lg font-semibold mb-2">All Money Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Account Name</th>
              <th className="p-2 border">Account Number</th>
              <th className="p-2 border">IFSC Code</th>
              <th className="p-2 border">Bank Branch</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {moneyAccounts.map(cat => (
              <tr key={cat.id + `ROW`}>
                <td className="p-2 border">{cat.account_name}</td>
                <td className="p-2 border">{cat.account_number}</td>
                <td className="p-2 border">{cat.ifsc_code}</td>
                <td className="p-2 border">{cat.bank_branch}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>
                  {/* <button
                    className={`text-red-600 ${cat.usedInTransactions ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !cat.usedInTransactions && handleDelete(cat.id)}
                    disabled={cat.usedInTransactions}
                    title={cat.usedInTransactions ? "Category is used in transactions and cannot be deleted" : "Delete"}
                  >
                    Delete
                  </button> */}
                </td>
              </tr>
            ))}
            {moneyAccounts.length === 0 && (
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