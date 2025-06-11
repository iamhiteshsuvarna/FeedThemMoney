'use client';
import React, { Suspense, use, useEffect, useState } from "react";

export default function Home() {
    const [data, setData] = useState([]);
    const [openingBalances, setOpeningBalances] = useState({});

    useEffect(() => {
        fetch("/api/dashboard")
          .then((response) => response.json())
          .then((data) => setData(data))
          .catch((error) => console.error("Error fetching transactions:", error));
    
        fetch("/api/settings/load_opening_balance")
          .then((response) => response.json())
          .then((balances) => {
            // Convert array to object: { assets: 65654, income: 155844, ... }
            const ob = {};
            balances.forEach(b => {
              ob[b.accounting_concept.toLowerCase()] = b.opening_balance || 0;
            });
            setOpeningBalances(ob);
          })
          .catch((error) => console.error("Error fetching opening balances:", error));
      }, []);

    return (
        <div className="overflow-x-auto">
            {data.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">Loading ... </span>
                </div>
            ) : 
                <table className="w-full h-full min-w-max">
                    <thead>
                        <tr>
                            <th className="dashboard-header sticky-col left-0 z-10" rowSpan={2}><span>Concept</span></th>
                            <th className="dashboard-header sticky-col left-1 z-10" rowSpan={2}><span>Category</span></th>
                            <th className="dashboard-header month" colSpan={3}>JAN</th>
                            <th className="dashboard-header month" colSpan={3}>FEB</th>
                            <th className="dashboard-header month" colSpan={3}>MAR</th>
                            <th className="dashboard-header month" colSpan={3}>APR</th>
                            <th className="dashboard-header month" colSpan={3}>MAY</th>
                            <th className="dashboard-header month" colSpan={3}>JUN</th>
                            <th className="dashboard-header month" colSpan={3}>JUL</th>
                            <th className="dashboard-header month" colSpan={3}>AUG</th>
                            <th className="dashboard-header month" colSpan={3}>SEP</th>
                            <th className="dashboard-header month" colSpan={3}>OCT</th>
                            <th className="dashboard-header month" colSpan={3}>NOV</th>
                            <th className="dashboard-header month" colSpan={3}>DEC</th>
                        </tr>
                        <tr>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            <th className="dashboard-header content">Spent</th>
                            <th className="dashboard-header content">Budget</th>
                            <th className="dashboard-header content">Balance</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="dashboard-data sticky-col left-0 bg-white"><span>{item.Concept}</span></td>
                                <td className="dashboard-data sticky-col left-1 bg-white"><span>{item.Category}</span></td>
                                <td className="dashboard-data amount">{Number(item.JAN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.JAN_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.JAN_Budget) - Number(item.JAN_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.FEB_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.FEB_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.FEB_Budget) - Number(item.FEB_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.MAR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.MAR_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.MAR_Budget) - Number(item.MAR_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.APR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.APR_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.APR_Budget) - Number(item.APR_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.MAY_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.MAY_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.MAY_Budget) - Number(item.MAY_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.JUN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.JUN_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.JUN_Budget) - Number(item.JUN_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.JUL_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.JUL_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.JUL_Budget) - Number(item.JUL_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.AUG_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.AUG_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.AUG_Budget) - Number(item.AUG_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.SEP_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.SEP_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.SEP_Budget) - Number(item.SEP_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.OCT_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.OCT_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.OCT_Budget) - Number(item.OCT_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.NOV_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.NOV_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.NOV_Budget) - Number(item.NOV_Spent)).toFixed(2)}</td>
                                
                                <td className="dashboard-data amount">{Number(item.DEC_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount">{Number(item.DEC_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount">{(Number(item.DEC_Budget) - Number(item.DEC_Spent)).toFixed(2)}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
  {/* Existing concept rows */}
  {["Assets", "Liabilities", "Expenses", "Income"].map((concept) => {
    const groupItems = data.filter(item =>
      (item.Concept || "").trim().toLowerCase() === concept.toLowerCase()
    );
    const opening = openingBalances[concept.toLowerCase()] || 0;
    const totalSpentAllMonths = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ].reduce((total, month) => {
      return total + groupItems.reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
    }, 0);

    return (
      <tr key={concept}>
        <td className="dashboard-data sticky-col left-0 font-bold bg-gray-100">{concept}</td>
        <td className="dashboard-data sticky-col left-1 font-bold bg-gray-100 text-right border-r border-dashed border-black">
          {(totalSpentAllMonths + opening).toFixed(2)}
        </td>
        {[
          "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ].map((month) => {
          const spent = groupItems.reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0).toFixed(2);
          const budget = groupItems.reduce((sum, item) => sum + Number(item[`${month}_Budget`] || 0), 0).toFixed(2);
          const balance = groupItems.reduce((sum, item) =>
            sum + (Number(item[`${month}_Budget`] || 0) - Number(item[`${month}_Spent`] || 0)), 0
          ).toFixed(2);
          return (
            <React.Fragment key={month}>
              <td className="dashboard-data font-bold bg-gray-100 text-right">{spent}</td>
              <td className="dashboard-data font-bold bg-gray-100 text-right">{budget}</td>
              <td className="dashboard-data font-bold bg-gray-100 text-right">{balance}</td>
            </React.Fragment>
          );
        })}
      </tr>
    );
  })}

  {/* Reserve Available row */}
  <tr>
    <td className="dashboard-data sticky-col left-0 font-bold bg-green-100">Reserve Available</td>
    <td className="dashboard-data sticky-col left-1 font-bold bg-green-100 text-right border-r border-dashed border-black">
      {
        // Calculate total reserve for all months
        (() => {
          const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
          ];
          let totalReserve = openingBalances.reserves || 0;
          months.forEach((month) => {
            const income = /*(openingBalances.income || 0) +*/
              data.filter(item => (item.Concept || "").trim().toLowerCase() === "income")
                .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
            const liability = /*(openingBalances.liabilities || 0) +*/
              data.filter(item => (item.Concept || "").trim().toLowerCase() === "liabilities")
                .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
            const expense = /*(openingBalances.expenses || 0) +*/
              data.filter(item => (item.Concept || "").trim().toLowerCase() === "expenses")
                .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
            const asset = /*(openingBalances.assets || 0) +*/
              data.filter(item => (item.Concept || "").trim().toLowerCase() === "assets")
                .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
            totalReserve += (income - liability - expense - asset);
          });
          return totalReserve.toFixed(2);
        })()
      }
    </td>
    {[
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ].map((month) => {
      const income = data.filter(item => (item.Concept || "").trim().toLowerCase() === "income")
        .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
      const liability = data.filter(item => (item.Concept || "").trim().toLowerCase() === "liabilities")
        .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
      const expense = data.filter(item => (item.Concept || "").trim().toLowerCase() === "expenses")
        .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
      const asset = data.filter(item => (item.Concept || "").trim().toLowerCase() === "assets")
        .reduce((sum, item) => sum + Number(item[`${month}_Spent`] || 0), 0);
      
      const reserve = income - liability - expense - asset;
      return (
        <React.Fragment key={month}>
          <td className="dashboard-data font-bold bg-green-100 text-right">{reserve.toFixed(2)}</td>
          <td className="dashboard-data bg-green-100"></td>
          <td className="dashboard-data bg-green-100"></td>
        </React.Fragment>
      );
    })}
  </tr>
</tfoot>
                </table>
            }
        </div>
    );
}