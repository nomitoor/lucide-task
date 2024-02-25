import create from "zustand";

const useStore = create((set) => ({
  value: 0,
  setValue: (newValue) => set({ value: newValue }),
}));

export default useStore;
