import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Expense from '@/models/expense';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    await dbConnect();
    const expense = await Expense.findById(id);
    
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    return res.status(200).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch expense' });
  }
}