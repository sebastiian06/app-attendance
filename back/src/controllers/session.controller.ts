import { Request, Response } from 'express';
import { Session } from '../models/session.model';

export const createSession = async (req: Request, res: Response) => {
  const { unitId } = req.body;

  const expiresAt = new Date(Date.now() + 60 * 1000); // 1 min

  const session = await Session.create({
    unitId,
    qrToken: Math.random().toString(36).substring(2, 10),
    expiresAt
  });

  res.json(session);
};