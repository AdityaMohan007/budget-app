import React, { useContext, useState } from "react"
import { v4 as uuidV4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext();

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized";

export function useBudgets() {
    return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }) => {

    const [budgets, setBudgets] = useLocalStorage("budgets", []);
    const [expenses, setExpenses] = useLocalStorage("expenses", []);

    // If we want to get all expenses for entertainment, we just pass in entertainment budget ID and we get entertainment expenses
    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.budgetId === budgetId);
    }
    function addExpense({ description, amount, budgetId }) {
        setExpenses(prevExpenses => {
            return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
        })
    }
    // when adding budgets, return all previous budgets and we creating a new budget with new name, max value
    // make sure to pass array inside addBudget function with braces
    function addBudget({ name, max }) {
        setBudgets(prevBudgets => {
            // if budget with same name is created, new budget is not created and prev budgets are returned
            if (prevBudgets.find(budget => budget.name === name)) {
                return prevBudgets;
            }
            return [...prevBudgets, { id: uuidV4(), name, max }];
        })
    }
    function deleteBudget({ id }) {
        // If a budget is deleted and it contains some expenses, they should be moved to UNCATEGORIZED budget
        setExpenses(prevExpenses => {
            return prevExpenses.map(expense => {
                if (expense.budgetId !== id) 
                    return expense;
                return { ... expense, budgetId: UNCATEGORIZED_BUDGET_ID};
            });
        });
        // Delete budget
        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id);
        })
    }
    function deleteExpense({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.filter(expense => expense.id !== id);
        })
    }

    return (
        <BudgetsContext.Provider value={{
                budgets,
                expenses,
                getBudgetExpenses,
                addExpense,
                addBudget,
                deleteBudget,
                deleteExpense,
            }}
        >
            {children}
        </BudgetsContext.Provider>
    )
}