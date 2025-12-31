export enum ConversionDirection {
  RemoveZeros = 'REMOVE_ZEROS', // Old -> New (Divide by 100)
  AddZeros = 'ADD_ZEROS'       // New -> Old (Multiply by 100)
}

export interface ConversionState {
  amount: string;
  direction: ConversionDirection;
  result: number | null;
}