import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Expense from '@/models/expense';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { amount, description, creatorId, creatorWallet, participantIds } = req.body;

    // Calculate split amount
    const splitAmount = amount / (participantIds.length || 1);

    const expense = await Expense.create({
      amount,
      description,
      creatorId,
      creatorWallet,
      splits: participantIds.map((id: number) => ({
        telegramId: id,
        amount: splitAmount,
        paid: false
      }))
    });

    return res.status(200).json({ 
      success: true, 
      expense,
      paymentLink: `https://t.me/splitbnb_bot/splitbnb?startapp=expense_${expense._id}`
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create expense' });
  }
}