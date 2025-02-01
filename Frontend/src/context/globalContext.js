import React, { useContext, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5001/api/transactions/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);

  //calculate incomes
  const addIncome = async (income) => {
    try {
      const response = await axios.post(`${BASE_URL}add-income`, income, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true, // ✅ Important for cookies to work
      });

      console.log("Income Added Successfully:", response.data);
      getIncomes(); // ✅ Fetch updated income list
    } catch (error) {
      console.error(
        "Error adding income:",
        error.response?.data || error.message
      );
    }
  };

  const getIncomes = async () => {
    try {
      console.log("Calling API: GET get-incomes"); // Debug log
      const response = await axios.get(`${BASE_URL}get-incomes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      console.log("Fetched Incomes from API:", response.data); // Debug log
      setIncomes(response.data.incomes || response.data); // Adjust based on your API response shape
    } catch (error) {
      console.error(
        "Error fetching incomes:",
        error.response?.data || error.message
      );
    }
  };

  const deleteIncome = async (id) => {
    const res = await axios.delete(`${BASE_URL}delete-income/${id}`);
    getIncomes();
  };

  const totalIncome = () => {
    let totalIncome = 0;
    incomes.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  //calculate incomes
  const addExpense = async (income) => {
    const response = await axios
      .post(`${BASE_URL}add-expense`, income)
      .catch((err) => {
        setError(err.response.data.message);
      });
    getExpenses();
  };

  const getExpenses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}get-expenses`);
      console.log("Fetched Expenses:", response.data); // ✅ Debugging Line
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const deleteExpense = async (id) => {
    const res = await axios.delete(`${BASE_URL}delete-expense/${id}`);
    getExpenses();
  };

  const totalExpenses = () => {
    let totalIncome = 0;
    expenses.forEach((income) => {
      totalIncome = totalIncome + income.amount;
    });

    return totalIncome;
  };

  const totalBalance = () => {
    return totalIncome() - totalExpenses();
  };

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return history.slice(0, 3);
  };

  return (
    <GlobalContext.Provider
      value={{
        addIncome,
        getIncomes,
        incomes,
        deleteIncome,
        expenses,
        totalIncome,
        addExpense,
        getExpenses,
        deleteExpense,
        totalExpenses,
        totalBalance,
        transactionHistory,
        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
