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
    const { totalAmount, description, participants, telegramId, walletAddress } = req.body;

    const expense = await Expense.create({
      totalAmount,
      description,
      createdBy: telegramId,
      creatorWallet: walletAddress,
      participants: participants.map((p: string) => ({
        telegramUsername: p,
        amount: totalAmount / participants.length,
        paid: false
      }))
    });

    return res.status(200).json({ success: true, expense });

  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ success: false, error: 'Failed to create expense' });
  }
}