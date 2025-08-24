'use client';
import React, { Suspense, use, useEffect, useState } from "react";

export default function Home() {
    const [data, setData] = useState([]);
    const [openingBalances, setOpeningBalances] = useState({});
    const [sumSelected, setSumSelected] = useState(Number(0));
    const [selectedCells, setSelectedCells] = useState([]);
    const [detailMode, setDetailMode] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState([]);
    const [moneyAccounts, setMoneyAccounts] = useState([]);
    const [selectedMoneyAccount, setSelectedMoneyAccount] = useState(0);

    const fetchDashboard = () => {
      fetch("/api/dashboard", {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({money_account: selectedMoneyAccount})}).then((response) => response.json())
        .then((data) => {
          console.log("Dashboard Data:", data);
          setData(data)
        })
        .catch((error) => console.error("Error fetching transactions:", error));
    }

    const fetchOpeningBalances = () => {
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
    };

    const fetchMoneyAccounts = () => {
      fetch("/api/transactions/load_money_accounts")
          .then((response) => response.json()) 
          .then((accounts) => {
            setMoneyAccounts(accounts);
          })
          .catch((error) => console.error("Error fetching money accounts:", error));
    }

    useEffect(() => {fetchDashboard();}, [selectedMoneyAccount]); 

    useEffect(() => {  
      fetchDashboard();
      fetchOpeningBalances();
      fetchMoneyAccounts();
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

    const handleFetchCellDetails = (cellKey, month, category) => {
      if (selectedCells.includes(cellKey)) {
        setSelectedCells(selectedCells.filter(key => key !== cellKey));
      } else {
        setSelectedCells([]);
      }
      setSumSelected(0);
      fetch(`/api/fetch_category_details`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ month, category, money_account: selectedMoneyAccount}),
      })  
      .then(response => response.json())
      .then(data => {
        setTransactionDetails(data);
      })
      .catch(error => console.error("Error fetching category details:", error));

      console.log("Fetching details for month:", month, "category:", category);
    };

    useEffect(() => {
      console.log("Sum Selected Updated:", sumSelected);
      // You can add any side effects here if needed when sumSelected changes
    }, [sumSelected]);

    const calculateBalance = (budget, spent) => {
      if(budget==0) {
        return 0;
      }
      return (Number(budget) - Number(spent)).toFixed(2);
    }
    return (
        <div className="">
            <div className="flex flex-row items-center justify-start p-2">
                {/* Toggle Switch for Sum/Detail Mode */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs font-semibold">Sum Mode</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={detailMode}
                      onChange={e => setDetailMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-6"></div>
                  </div>
                  <span className="text-xs font-semibold">Detail Mode</span>
                </label>
                <div className="ml-6">
                  <label className="text-xs font-semibold mr-2">Money Account:</label>
                  <select
                    value={selectedMoneyAccount}
                    onChange={(e) => setSelectedMoneyAccount(Number(e.target.value))}
                    className="border p-1 rounded"
                  >
                    <option value={0}>All Accounts</option>
                    {moneyAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
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
                            <th className="dashboard-header month" colSpan={2}>JAN</th>
                            <th className="dashboard-header month" colSpan={2}>FEB</th>
                            <th className="dashboard-header month" colSpan={2}>MAR</th>
                            <th className="dashboard-header month" colSpan={2}>APR</th>
                            <th className="dashboard-header month" colSpan={2}>MAY</th>
                            <th className="dashboard-header month" colSpan={2}>JUN</th>
                            <th className="dashboard-header month" colSpan={2}>JUL</th>
                            <th className="dashboard-header month" colSpan={2}>AUG</th>
                            <th className="dashboard-header month" colSpan={2}>SEP</th>
                            <th className="dashboard-header month" colSpan={2}>OCT</th>
                            <th className="dashboard-header month" colSpan={2}>NOV</th>
                            <th className="dashboard-header month" colSpan={2}>DEC</th>
                        </tr>
                        <tr>
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            <th className="dashboard-header content spent">Spent</th>
                            <th className="dashboard-header content budget">Budget</th>
                            {/* <th className="dashboard-header content balance">Balance</th> */}
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="dashboard-data sticky-col left-0 bg-white"><span>{item.Concept}</span></td>
                                <td className="dashboard-data sticky-col left-1 bg-white"><span>{item.Category}</span></td>
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JAN`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-JAN`, 1, item.Category) : handleSpentCellClick(`${index}-JAN`, item.JAN_Spent)}>{item.JAN_Budget==0 ? null: (Number(item.JAN_Budget) - Number(item.JAN_Spent) > 0) ? <sub className="positive">{(Number(item.JAN_Budget) - Number(item.JAN_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.JAN_Budget) - Number(item.JAN_Spent)).toFixed(2)}</sub>} {Number(item.JAN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JAN_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.JAN_Budget) - Number(item.JAN_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-FEB`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-FEB`, 2, item.Category) : handleSpentCellClick(`${index}-FEB`, item.FEB_Spent)}>{item.FEB_Budget==0 ? null: (Number(item.FEB_Budget) - Number(item.FEB_Spent) > 0) ? <sub className="positive">{(Number(item.FEB_Budget) - Number(item.FEB_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.FEB_Budget) - Number(item.FEB_Spent)).toFixed(2)}</sub>} {Number(item.FEB_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.FEB_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.FEB_Budget) - Number(item.FEB_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent  ${selectedCells.includes(`${index}-MAR`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-MAR`, 3, item.Category) : handleSpentCellClick(`${index}-MAR`, item.MAR_Spent)}>{item.MAR_Budget==0 ? null: (Number(item.MAR_Budget) - Number(item.MAR_Spent) > 0) ? <sub className="positive">{(Number(item.MAR_Budget) - Number(item.MAR_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.MAR_Budget) - Number(item.MAR_Spent)).toFixed(2)}</sub>} {Number(item.MAR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.MAR_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.MAR_Budget) - Number(item.MAR_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-APR`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-APR`, 4, item.Category) : handleSpentCellClick(`${index}-APR`, item.APR_Spent)}>{item.APR_Budget==0 ? null: (Number(item.APR_Budget) - Number(item.APR_Spent) > 0) ? <sub className="positive">{(Number(item.APR_Budget) - Number(item.APR_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.APR_Budget) - Number(item.APR_Spent)).toFixed(2)}</sub>} {Number(item.APR_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.APR_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.APR_Budget) - Number(item.APR_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-MAY`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-MAY`, 5, item.Category) : handleSpentCellClick(`${index}-MAY`, item.MAY_Spent)}>{item.MAY_Budget==0 ? null: (Number(item.MAY_Budget) - Number(item.MAY_Spent) > 0) ? <sub className="positive">{(Number(item.MAY_Budget) - Number(item.MAY_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.MAY_Budget) - Number(item.MAY_Spent)).toFixed(2)}</sub>} {Number(item.MAY_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.MAY_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.MAY_Budget) - Number(item.MAY_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JUN`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-JUN`, 6, item.Category) : handleSpentCellClick(`${index}-JUN`, item.JUN_Spent)}>{item.JUN_Budget==0 ? null: (Number(item.JUN_Budget) - Number(item.JUN_Spent) > 0) ? <sub className="positive">{(Number(item.JUN_Budget) - Number(item.JUN_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.JUN_Budget) - Number(item.JUN_Spent)).toFixed(2)}</sub>} {Number(item.JUN_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JUN_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.JUN_Budget) - Number(item.JUN_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-JUL`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-JUL`, 7, item.Category) : handleSpentCellClick(`${index}-JUL`, item.JUL_Spent)}>{item.JUL_Budget==0 ? null: (Number(item.JUL_Budget) - Number(item.JUL_Spent) > 0) ? <sub className="positive">{(Number(item.JUL_Budget) - Number(item.JUL_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.JUL_Budget) - Number(item.JUL_Spent)).toFixed(2)}</sub>} {Number(item.JUL_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.JUL_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.JUL_Budget) - Number(item.JUL_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-AUG`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-AUG`, 8, item.Category) : handleSpentCellClick(`${index}-AUG`, item.AUG_Spent)}>{item.AUG_Budget==0 ? null: (Number(item.AUG_Budget) - Number(item.AUG_Spent) > 0) ? <sub className="positive">{(Number(item.AUG_Budget) - Number(item.AUG_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.AUG_Budget) - Number(item.AUG_Spent)).toFixed(2)}</sub>} {Number(item.AUG_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.AUG_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.AUG_Budget) - Number(item.AUG_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-SEP`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-SEP`, 9, item.Category) : handleSpentCellClick(`${index}-SEP`, item.SEP_Spent)}>{item.SEP_Budget==0 ? null: (Number(item.SEP_Budget) - Number(item.SEP_Spent) > 0) ? <sub className="positive">{(Number(item.SEP_Budget) - Number(item.SEP_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.SEP_Budget) - Number(item.SEP_Spent)).toFixed(2)}</sub>} {Number(item.SEP_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.SEP_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.SEP_Budget) - Number(item.SEP_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-OCT`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-OCT`, 10, item.Category) : handleSpentCellClick(`${index}-OCT`, item.OCT_Spent)}>{item.OCT_Budget==0 ? null: (Number(item.OCT_Budget) - Number(item.OCT_Spent) > 0) ? <sub className="positive">{(Number(item.OCT_Budget) - Number(item.OCT_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.OCT_Budget) - Number(item.OCT_Spent)).toFixed(2)}</sub>} {Number(item.OCT_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.OCT_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.OCT_Budget) - Number(item.OCT_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-NOV`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-NOV`, 11, item.Category) : handleSpentCellClick(`${index}-NOV`, item.NOV_Spent)}>{item.NOV_Budget==0 ? null: (Number(item.NOV_Budget) - Number(item.NOV_Spent) > 0) ? <sub className="positive">{(Number(item.NOV_Budget) - Number(item.NOV_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.NOV_Budget) - Number(item.NOV_Spent)).toFixed(2)}</sub>} {Number(item.NOV_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.NOV_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.NOV_Budget) - Number(item.NOV_Spent)).toFixed(2)}</td> */}
                                
                                <td className={`dashboard-data amount spent ${selectedCells.includes(`${index}-DEC`) ? "selected_for_sum" : ""}`} onClick={() => detailMode ? handleFetchCellDetails(`${index}-DEC`, 12, item.Category) : handleSpentCellClick(`${index}-DEC`, item.DEC_Spent)}>{item.DEC_Budget==0 ? null: (Number(item.DEC_Budget) - Number(item.DEC_Spent) > 0) ? <sub className="positive">{(Number(item.DEC_Budget) - Number(item.DEC_Spent)).toFixed(2)}</sub> :  <sub className="negetive">{(Number(item.DEC_Budget) - Number(item.DEC_Spent)).toFixed(2)}</sub>} {Number(item.DEC_Spent).toFixed(2)}</td>
                                <td className="dashboard-data amount budget">{Number(item.DEC_Budget).toFixed(2)}</td>
                                {/* <td className="dashboard-data amount balance">{(Number(item.DEC_Budget) - Number(item.DEC_Spent)).toFixed(2)}</td> */}
                                
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
                            <td className="dashboard-foot sticky-col left-1 font-bold bg-gray-100"><span>{concept}</span></td>
                            <td className="dashboard-foot sticky-col left-0 font-bold bg-gray-100 text-right border-r border-dashed border-black">
                              <span>{(totalSpentAllMonths + opening).toFixed(2)}</span>
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
                                  <td className="dashboard-foot amount spent font-bold bg-gray-100 text-right">{budget==0 ? null: (balance > 0) ? <sub className="positive">{balance}</sub> :  <sub className="negetive">{balance}</sub>} {spent}</td>
                                  <td className="dashboard-foot amount budget font-bold bg-gray-100 text-right">{budget}</td>
                                  {/* <td className="dashboard-foot amount balance font-bold bg-gray-100 text-right">{balance}</td> */}
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        );
                      })}

                      {/* Reserve Available row */}
                      <tr>
                        <td className="dashboard-foot sticky-col left-1 font-bold bg-green-100"><span>Reserve Available</span></td>
                        <td className="dashboard-foot sticky-col left-0 font-bold bg-green-100 text-right border-r border-dashed border-black"><span>
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
                          }</span>
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
                              <td colSpan={2} className="dashboard-foot amount budget reserve font-bold bg-green-100 text-right">{reserve.toFixed(2)}</td>
                              {/* <td className="dashboard-foot bg-green-100"></td>
                              <td className="dashboard-foot amount balance bg-green-100"></td> */}
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    </tfoot>
                </table>
            }
            </div>
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
            <div className={detailMode && transactionDetails.length > 0 ? "fixed bottom-2 right-2 bg-white p-4 shadow-lg rounded-lg w-full md:w-64 h-48 border overflow-y-auto z-50" : "hidden"}>
              <div className="flex justify-between items-center mb-2 border-b border-dashed">
                <h3 className="text-lg font-semibold">Transaction Details</h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setDetailMode(false);
                    setTransactionDetails([]);
                    setSelectedCells([]);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {transactionDetails.length > 0 && 
                <ul className="space-y-2">
                  {transactionDetails.map((transaction, index) => {
                    // Format txn_date to yyyy-mm-dd
                    let formattedDate = transaction.txn_date;
                    if (formattedDate) {
                      const d = new Date(formattedDate);
                      if (!isNaN(d)) {
                        formattedDate = d.toISOString().slice(0, 10);
                      }
                    }
                    return (
                      <li key={index} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between">
                          <span>{formattedDate}</span>
                          <span className="font-semibold">{transaction.amount.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600">{transaction.particulars}</div>
                      </li>
                    );
                  })}
                </ul>}
            </div>
        </div>
    );
}