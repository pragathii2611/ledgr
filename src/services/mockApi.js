import { mockTransactions } from "../data/mockData";

// simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// in-memory store so add/edit/delete actually work
let transactionsDB = [...mockTransactions];

export const mockApi = {

  // fetch all transactions
  async getTransactions() {
    await delay(700);
    return [...transactionsDB];
  },

  // add a new transaction
  async addTransaction(transaction) {
    await delay(400);
    const newTransaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
    };
    transactionsDB = [newTransaction, ...transactionsDB];
    return newTransaction;
  },

  // edit an existing transaction
  async updateTransaction(id, updates) {
    await delay(400);
    transactionsDB = transactionsDB.map((txn) =>
      txn.id === id ? { ...txn, ...updates } : txn
    );
    return transactionsDB.find((txn) => txn.id === id);
  },

  // delete a transaction
  async deleteTransaction(id) {
    await delay(300);
    transactionsDB = transactionsDB.filter((txn) => txn.id !== id);
    return id;
  },

};