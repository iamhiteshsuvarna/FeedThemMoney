'use client';
import React, { Suspense, use, useEffect, useState } from "react";

export default function Home() {
    const [data, setData] = useState([]);
    const [openingBalances, setOpeningBalances] = useState({});
    const [sumSelected, setSumSelected] = useState(Number(0));
    const [selectedCells, setSelectedCells] = useState([]);

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

    const handleSpentCellClick = (cellKey, amount) => {
      if (selectedCells.includes(cellKey)) {
        setSelectedCells(selectedCells.filter(key => key !== cellKey));
        setSumSelected(sumSelected - amount);
      } else {
        setSelectedCells([...selectedCells, cellKey]);
        setSumSelected(sumSelected + amount);
      }

      // if (sumSelected === Number(amount)) {
      //   setSumSelected(0);
      //   console.log("Deselected amount:", amount);
      //   return;
      // }
      
      // const newAmount = Number(sumSelected) + Number(amount);  
      // setSumSelected(newAmount);
      // console.log("Selected amount:", sumSelected);
    };

    useEffect(() => {
      console.log("Sum Selected Updated:", sumSelected);
      // You can add any side effects here if needed when sumSelected changes
    }, [sumSelected]);

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
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            <th className="dashboard-header content balance">Balance</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="dashboard-data sticky-col left-0 bg-white"><span>{item.Concept}</span></td>
                                <td className="dashboard-data sticky-col left-1 bg-white"><span>{item.Category}</span></td>
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-JAN`, item.JAN_Spent)}>{Number(item.JAN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JAN_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.JAN_Budget) - Number(item.JAN_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-FEB`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-FEB`, item.FEB_Spent)}>{Number(item.FEB_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.FEB_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.FEB_Budget) - Number(item.FEB_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent  ${selectedCells.includes(`${index}-MAR`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-MAR`, item.MAR_Spent)}>{Number(item.MAR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.MAR_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.MAR_Budget) - Number(item.MAR_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-APR`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-APR`, item.APR_Spent)}>{Number(item.APR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.APR_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.APR_Budget) - Number(item.APR_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-MAY`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-MAY`, item.MAY_Spent)}>{Number(item.MAY_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.MAY_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.MAY_Budget) - Number(item.MAY_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JUN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-JUN`, item.JUN_Spent)}>{Number(item.JUN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JUN_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.JUN_Budget) - Number(item.JUN_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JUL`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-JUL`, item.JUL_Spent)}>{Number(item.JUL_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JUL_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.JUL_Budget) - Number(item.JUL_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-AUG`, item.AUG_Spent)}>{Number(item.AUG_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.AUG_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.AUG_Budget) - Number(item.AUG_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-SEP`, item.SEP_Spent)}>{Number(item.SEP_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.SEP_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.SEP_Budget) - Number(item.SEP_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-OCT`, item.OCT_Spent)}>{Number(item.OCT_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.OCT_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.OCT_Budget) - Number(item.OCT_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-NOV`, item.NOV_Spent)}>{Number(item.NOV_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.NOV_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.NOV_Budget) - Number(item.NOV_Spent)).toFixed(2)}</td>
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => handleSpentCellClick(`${index}-DEC`, item.DEC_Spent)}>{Number(item.DEC_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.DEC_Budget).toFixed(2)}</td>
                                <td className="dashboard-data amount balance">{(Number(item.DEC_Budget) - Number(item.DEC_Spent)).toFixed(2)}</td>
                                
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
                            <td className="dashboard-data sticky-col left-1 font-bold bg-gray-100">{concept}</td>
                            <td className="dashboard-data sticky-col left-0 font-bold bg-gray-100 text-right border-r border-dashed border-black">
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
                                  <td className="dashboard-data spent font-bold bg-gray-100 text-right">{spent}</td>
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
                        <td className="dashboard-data sticky-col left-1 font-bold bg-green-100">Reserve Available</td>
                        <td className="dashboard-data sticky-col left-0 font-bold bg-green-100 text-right border-r border-dashed border-black">
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
                              <td className="dashboard-data spent font-bold bg-green-100 text-right">{reserve.toFixed(2)}</td>
                              <td className="dashboard-data bg-green-100"></td>
                              <td className="dashboard-data bg-green-100"></td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    </tfoot>
                </table>
            }
            <div className={sumSelected > 0 ? "fixed bottom-2 right-2 bg-black px-4 py-2 shadow-lg rounded-full text-white flex flex-row items-center gap-4" : "hidden"}>
                <h3 className="text-sm font-semibold">Sum: {sumSelected.toFixed(2)}</h3>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                    onClick={() => {
                        setSumSelected(0);
                        setSelectedCells([]);
                    }}
                >
                    Clear
                </button>
              </div>
        </div>
    );
}