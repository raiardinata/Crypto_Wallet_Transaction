import { Request, Response } from 'express';
import { GetWallet } from '../function/function'

export const getWallets = (req: Request, res: Response) => {
  const { username } = req.body;

  const walletBalance = GetWallet(username);

  res.send('Your Balance is : ' + walletBalance);
};
