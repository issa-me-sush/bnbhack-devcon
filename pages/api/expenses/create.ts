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
    const { 
      totalAmount, 
      description, 
      participants, 
      createdById,
      createdByUsername,
      creatorWallet 
    } = req.body;

    const expense = await Expense.create({
      totalAmount,
      description,
      createdById, // Store Telegram user ID
      createdByUsername, // Store username for display
      creatorWallet,
      participants: participants.map((username: string) => ({
        telegramUsername: username, // Store username for now
        // We'll get the ID when they actually open the payment link
        amount: totalAmount / participants.length,
        paid: false
      }))
    });

    return res.status(200).json({ 
      success: true, 
      expense,
      paymentLink: `https://t.me/splitbnb_bot/splitbnb?startapp=expense_${expense._id}`
    });

  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ success: false, error: 'Failed to create expense' });
  }
}