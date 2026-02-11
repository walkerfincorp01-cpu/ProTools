
import React from 'react';

export type Category = 'Sabhi' | 'Financial' | 'PDF' | 'Image' | 'Utility';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: Category;
}

export interface CalculationResult {
  totalAmount: number;
  totalInterest: number;
  principal: number;
  breakdown?: any[];
}