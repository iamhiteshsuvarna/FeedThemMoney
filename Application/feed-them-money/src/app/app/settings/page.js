'use client';
import React from "react";

export default function Settings() {
  const settingsOptions = [
    {
      title: "Manage Categories",
      description: "Add, edit, or remove your transaction categories.",
      link: "/app/settings/categories"
    },
    {
      title: "Opening Balance",
      description: "Set or update your opening balance for accounts.",
      link: "/app/settings/opening_balance"
    },
    {
      title: "Money Accounts",
      description: "Manage your bank, cash, and other money accounts.",
      link: "/app/settings/money_accounts"
    },
    {
      title: "User Account",
      description: "Manage your name, email, phone and password.",
      link: "/app/settings/user_account"
    }
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <ul className="space-y-4">
        {settingsOptions.map(option => (
          <li key={option.title} className="border rounded p-4 hover:bg-gray-50 transition">
            <a href={option.link} className="block">
              <div className="text-lg font-semibold">{option.title}</div>
              <div className="text-gray-600">{option.description}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}