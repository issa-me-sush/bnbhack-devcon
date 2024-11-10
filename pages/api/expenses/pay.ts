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
    const { expenseId, telegramId, txHash } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { 
        _id: expenseId, 
        'splits.telegramId': telegramId 
      },
      {
        $set: {
          'splits.$.paid': true,
          'splits.$.txHash': txHash
        }
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    return res.status(200).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to process payment' });
  }
}