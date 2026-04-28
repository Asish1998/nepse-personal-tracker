/**
 * Utility to synchronize Portfolio gains/losses with the Wealth Manager.
 * This ensures that a successful trade realization is reflected in the overall wealth record.
 */
export function syncTradeToWealth(userId, tradeData) {
  if (!userId) return;
  
  const storageKey = `wealth_data_${userId}`;
  const saved = localStorage.getItem(storageKey);
  const transactions = saved ? JSON.parse(saved) : [];
  
  // profit = net received - (qty * buyPrice + buyFees)
  // We use the netAmount from preview.fees passed in the action
  const profit = tradeData.profit || 0;
  
  if (profit === 0) return;

  const newTransaction = {
    id: Date.now(),
    type: profit > 0 ? 'INCOME' : 'EXPENSE',
    category: 'Share Dividend', // Closest default category or we can add 'Trading Profit'
    amount: Math.abs(profit),
    date: tradeData.date || new Date().toISOString().split('T')[0],
    note: `Realized ${profit > 0 ? 'Profit' : 'Loss'} from ${tradeData.sym} sale (${tradeData.qty} units). Auto-synced from Portfolio.`,
    isAutoSynced: true
  };

  // Add 'Trading Profit' as a special note if not in categories
  if (profit > 0) newTransaction.category = 'Other Income';
  else newTransaction.category = 'Other Expense';

  const updatedTransactions = [newTransaction, ...transactions];
  localStorage.setItem(storageKey, JSON.stringify(updatedTransactions));
  
  console.log(`[WealthSync] Synced ${profit} for ${tradeData.sym} to Wealth Manager.`);
}
