import { create } from 'zustand';

export const useScoreStore = create((set) => ({
  topScore: 5,
  bottomScore: 5,

  topTokenOn: false,
  bottomTokenOn: false,

  topCoinUsed: false,
  bottomCoinUsed: false,

  incTop: (n) => set((s) => ({ topScore: s.topScore + n })),
  decTop: (n) => set((s) => ({ topScore: Math.max(0, s.topScore - n) })),

  incBottom: (n) => set((s) => ({ bottomScore: s.bottomScore + n })),
  decBottom: (n) =>
    set((s) => ({ bottomScore: Math.max(0, s.bottomScore - n) })),

  toggleTop: () => set((s) => ({ topTokenOn: !s.topTokenOn })),
  toggleBottom: () => set((s) => ({ bottomTokenOn: !s.bottomTokenOn })),

  useTopCoin: () => set({ topCoinUsed: true }),
  useBottomCoin: () => set({ bottomCoinUsed: true }),
  setTopCoinUsed: (v) => set({ topCoinUsed: v }),
  setBottomCoinUsed: (v) => set({ bottomCoinUsed: v }),

  reset: () =>
    set({
      topScore: 5,
      bottomScore: 5,
      topTokenOn: false,
      bottomTokenOn: false,
      topCoinUsed: false,
      bottomCoinUsed: false
    })
}));
