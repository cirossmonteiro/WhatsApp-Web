export type RGB = [number, number, number];

export interface IUser {
  cellphone: string;
  savedName?: string;
  originalName?: string;
  picture?: string;
  color: string;
  id: string;
}

interface IReaction {
  value: string;
  amount: number;
}

export interface IMessage {
  id: string;
  contents: string;
  reactions: IReaction[];
  timestamp: string;
  userIndex: number;
  mentionIndex?: number;
}

export interface TColor {
  red: number;
  green: number;
  blue: number;
}