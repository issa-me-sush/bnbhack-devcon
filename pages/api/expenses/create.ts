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

    // Validate required fields
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid amount' 
      });
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Description is required' 
      });
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'At least one participant is required' 
      });
    }

    if (!createdById || !createdByUsername || !creatorWallet) {
      return res.status(400).json({ 
        success: false, 
        error: 'Creator information is missing' 
      });
    }

    // Validate participant usernames
    const validParticipants = participants.every(p => 
      typeof p === 'string' && 
      p.startsWith('@') && 
      p.length > 1
    );

    if (!validParticipants) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid participant username format' 
      });
    }

    const expense = await Expense.create({
      totalAmount,
      description,
      createdById,
      createdByUsername,
      creatorWallet,
      participants: participants.map((username: string) => ({
        telegramUsername: username,
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
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to create expense' 
    });
  }
}