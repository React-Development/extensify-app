import { createStore, combineReducers } from "redux";
import uuid from "uuid";

// ADD_EXPENSE
const addExpense = ({
  description = "",
  note = "",
  amount = 0,
  createdAt = 0
} = {}) => ({
  type: "ADD_EXPENSE",
  expense: {
    id: uuid(),
    description,
    note,
    amount,
    createdAt
  }
});

// REMOVE_EXPENSE
const removeExpense = ({ id } = {}) => ({
  type: "REMOVE_EXPENSE",
  id
});

// EDIT_EXPENSE
const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates
});

// SET_TEXT_FILTER
const setTextFilter = (text = "") => ({
  type: "SET_TEXT_FILTER",
  text
});

// SORT_BY_DATE
const sortByDate = () => ({
  type: "SORT_BY_DATE"
});

// SORT_BY_AMOUNT
const sortByAmount = () => ({
  type: "SORT_BY_AMOUNT"
});

// SET_START_DATE
const setStartDate = (startDate = undefined) => ({
  type: "SET_START_DATE",
  startDate
});
// SET_END_DATE
const setEndDate = (endDate = undefined) => ({
  type: "SET_END_DATE",
  endDate
});

// Expenses Reducer

const expensesReducerDefaultState = [];

const expensesReducer = (state = expensesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_EXPENSE":
      return [...state, action.expense];
    case "REMOVE_EXPENSE":
      // Filter is similar to map, it returns individual objects (or items) from an array, that's wny accessed to the object's id with -> (object) expense.id (object's property)
      // We can also go further and destructure 'expense' object by using the following syntax -> return state.filter(({id}) => id !== action.id);
      return state.filter(({ id }) => id !== action.id);
    case "EDIT_EXPENSE":
      return state.map(expense => {
        if (expense.id === action.id) {
          return {
            ...expense,
            // Here we will override all the properties we are passing down (in this case will be only the amount)
            ...action.updates
          };
        } else {
          return expense;
        }
      });
    default:
      return state;
  }
};

// Filters Reducer

const filtersReducerDefaultState = {
  text: "",
  sortBy: "date",
  startDate: undefined,
  endDate: undefined
};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_TEXT_FILTER":
      return {
        ...state,
        text: action.text
      };
    case "SORT_BY_AMOUNT":
      return {
        ...state,
        sortBy: "amount"
      };
    case "SORT_BY_DATE":
      return {
        ...state,
        sortBy: "date"
      };
    case "SET_START_DATE":
      return {
        ...state,
        startDate: action.startDate
      };
    case "SET_END_DATE":
      return {
        ...state,
        endDate: action.endDate
      };
    default:
      return state;
  }
};

// Timestamps -> counting in milliseconds
// January 1st 1970 (unix epoch) -> this is the value set when timestamp is set to 0
// When a positive number is set the date is forward the one when the value is set to 0 and if negative, it goes backwards
// 33400 (33.4s after the previous date), 10, -203

// Get visible expenses
const getVisibleExpenses = (expenses, { text, sortBy, startDate, endDate }) => {
  return expenses
    .filter(expense => {
      const startDateMatch =
        typeof startDate !== "number" || expense.createdAt >= startDate;
      const endDateMatch =
        typeof endDate !== "number" || expense.createdAt <= endDate;

      const textMatch = expense.description
        .toLowerCase()
        .includes(text.toLowerCase());

      return startDateMatch && endDateMatch && textMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return a.createdAt < b.createdAt ? 1 : -1;
      } else if (sortBy === "amount") {
        return a.amount < b.amount ? 1 : -1;
      }

      // sortBy -> amount
      // put the ones with a greater amount first
    });
};

// Store Creation

const store = createStore(
  combineReducers({
    expenses: expensesReducer,
    filters: filtersReducer
  })
);

store.subscribe(() => {
  const state = store.getState();
  const visibleExpenses = getVisibleExpenses(state.expenses, state.filters);
  console.log(visibleExpenses);
});

// Adding expenses
const expenseOne = store.dispatch(
  addExpense({
    description: "Rent",
    amount: 100,
    createdAt: -21000
  })
);

const expenseTwo = store.dispatch(
  addExpense({
    description: "Coffee",
    amount: 300,
    createdAt: -1000
  })
);

// Removing Expenses
// store.dispatch(removeExpense({ id: expenseOne.expense.id }));

// Editing Expenses
// store.dispatch(editExpense(expenseTwo.expense.id, { amount: 500 }));

// Setting text filter
// store.dispatch(setTextFilter("rent"));

// Sorting by amount
store.dispatch(sortByAmount()); // sortBy: amount

// Sorting by date
// store.dispatch(sortByDate()); // sortBy: date

// Setting startDate
// store.dispatch(setStartDate(0));
// store.dispatch(setStartDate());

// Setting endDate
// store.dispatch(setEndDate(999));

const demoState = {
  expenses: [
    {
      id: "fasdfasfas",
      description: "January Rent",
      note: "This was the final paymant for that address",
      amount: 54500, // pennies $ currency (value actually $545.00)
      createdAt: 0
    }
  ],
  filters: {
    text: "rent",
    sortBy: "amount", // date or amount
    startDate: undefined,
    endDate: undefined
  }
};

// const user = {
//   name: "Jen",
//   age: 24
// };

// console.log({
//   ...user,
//   location: "Santa Ana",
//   age: 27
// });
