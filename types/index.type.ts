type RedeemItem = {
  status: string;
  redeem_points: string;
  branch: string;
  date: string;
  invoice_no: string;
  authorization_status: string;
  id: string;
};

interface Transaction {
  points: string;
  type: string; // "Received" or "Redeemed"
  referred_date: string;
  branch: string;
  logo?: string;
}

export type { Transaction, RedeemItem };