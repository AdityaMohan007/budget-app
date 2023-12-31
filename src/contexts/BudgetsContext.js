import React, { useContext, useState } from "react"
import { v4 as uuidV4 } from 'uuid';

const BudgetsContext = React.createContext();

export function useBudgets() {
    return useContext(BudgetsContext);
}

export const BudgetsProvider = ({ children }) => {

    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // If we want to get all expenses for entertainment, we just pass in entertainment budget ID and we get entertainment expenses
    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.budgetId === budgetId);
    }
    function addExpense(description, amount, budgetId) {
        setExpenses(prevExpenses => {
            return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }];
        })
    }
    // when adding budgets, return all previous budgets and we creating a new budget with new name, max value
    function addBudget(name, max) {
        setBudgets(prevBudgets => {
            // if budget with same name is created, new budget is not created and prev budgets are returned
            if (prevBudgets.find(budget => budget.name === name)) {
                return prevBudgets;
            }
            return [...prevBudgets, { id: uuidV4(), name, max }];
        })
    }
    function deleteBudget({ id }) {
        // TODO: Deal with expenses
        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id);
        })
    }
    function deleteExpense({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.filter(budget => budget.id !== id);
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
            deleteExpense
        }}>{children}</BudgetsContext.Provider>
    )
}