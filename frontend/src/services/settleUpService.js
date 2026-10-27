/**
 * Service to calculate net balances and minimal debt settlements
 * among trip group members ("Who Owes Whom").
 */

export const calculateSettleUp = (expenses = [], members = []) => {
  // Extract unique member names
  let memberNames = (members || []).map((m) => (typeof m === 'string' ? m : m.name || 'Member'));
  if (memberNames.length === 0) {
    memberNames = ['Shihab', 'Aiden Vance'];
  }

  const balances = {};
  memberNames.forEach((name) => {
    balances[name] = 0;
  });

  expenses.forEach((exp) => {
    const amount = Number(exp.amount) || 0;
    if (amount <= 0) return;

    const payer = exp.paidBy || memberNames[0];
    if (balances[payer] === undefined) {
      balances[payer] = 0;
    }

    // Determine participants
    const splitWith =
      exp.splitBetween && exp.splitBetween.length > 0 ? exp.splitBetween : memberNames;

    const share = amount / splitWith.length;

    // Credit payer
    balances[payer] += amount;

    // Debit participants
    splitWith.forEach((person) => {
      if (balances[person] === undefined) balances[person] = 0;
      balances[person] -= share;
    });
  });

  // Round balances to 2 decimal places
  Object.keys(balances).forEach((person) => {
    balances[person] = Math.round(balances[person] * 100) / 100;
  });

  // Separate debtors and creditors
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([person, net]) => {
    if (net < -0.01) {
      debtors.push({ person, amount: Math.abs(net) });
    } else if (net > 0.01) {
      creditors.push({ person, amount: net });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const settleAmount = Math.min(debtor.amount, creditor.amount);

    if (settleAmount > 0.01) {
      transactions.push({
        id: `tx_${d}_${c}_${Date.now()}`,
        from: debtor.person,
        to: creditor.person,
        amount: Math.round(settleAmount * 100) / 100
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount <= 0.01) d++;
    if (creditor.amount <= 0.01) c++;
  }

  return { balances, transactions };
};
