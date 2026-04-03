import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApi } from "../services/mockApi";

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,

      // fetch all transactions from mock API
      fetchTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await mockApi.getTransactions();
          set({ transactions: data, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      // add a transaction
      addTransaction: async (transaction) => {
        try {
          const newTxn = await mockApi.addTransaction(transaction);
          set((state) => ({
            transactions: [newTxn, ...state.transactions],
          }));
          return newTxn;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      // edit a transaction
      updateTransaction: async (id, updates) => {
        try {
          const updated = await mockApi.updateTransaction(id, updates);
          set((state) => ({
            transactions: state.transactions.map((txn) =>
              txn.id === id ? updated : txn
            ),
          }));
          return updated;
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      // delete a transaction
      deleteTransaction: async (id) => {
        try {
          await mockApi.deleteTransaction(id);
          set((state) => ({
            transactions: state.transactions.filter((txn) => txn.id !== id),
          }));
        } catch (err) {
          set({ error: err.message });
          throw err;
        }
      },

      // clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "ledgr-transactions",
    }
  )
);