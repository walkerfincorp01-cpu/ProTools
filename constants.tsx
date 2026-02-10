
import React from 'react';
import { 
  Calculator, 
  FileText, 
  Image as ImageIcon, 
  Wrench, 
  ArrowRightLeft, 
  Maximize, 
  Files, 
  Type, 
  Hash, 
  Link, 
  TrendingUp, 
  PieChart, 
  Percent, 
  CreditCard,
  FileSearch,
  Settings,
  Ruler,
  ReceiptText,
  Sigma
} from 'lucide-react';
import { Tool } from './types';

export const TOOLS: Tool[] = [
  {
    id: 'math-formulas',
    title: 'Math Formulas (Sutra)',
    description: 'A complete collection of important math formulas for school and competitive exams.',
    category: 'Utility',
    icon: <Sigma className="w-6 h-6 text-violet-600" />
  },
  {
    id: 'invoice-generator',
    title: 'Invoice Generator (GST)',
    description: 'Professional Tax Invoice with GST slabs, HSN codes, and auto-calculations.',
    category: 'Financial',
    icon: <ReceiptText className="w-6 h-6 text-indigo-600" />
  },
  {
    id: 'interest-calculator',
    title: 'Interest Calculator (SI/CI)',
    description: 'Calculate simple and compound interest for your savings or loans.',
    category: 'Financial',
    icon: <Calculator className="w-6 h-6 text-emerald-500" />
  },
  {
    id: 'sip-calculator',
    title: 'SIP Calculator',
    description: 'Calculate your SIP returns with detailed breakdown and charts.',
    category: 'Financial',
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />
  },
  {
    id: 'emi-calculator',
    title: 'EMI Calculator',
    description: 'Calculate loan EMI with principal and interest breakdown.',
    category: 'Financial',
    icon: <CreditCard className="w-6 h-6 text-indigo-500" />
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter (Jamin)',
    description: 'Convert length and area units like feet, meter, acre, bigha etc.',
    category: 'Utility',
    icon: <Ruler className="w-6 h-6 text-amber-500" />
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, discounts, and tips easily.',
    category: 'Financial',
    icon: <Percent className="w-6 h-6 text-rose-500" />
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to specific dimensions and quality.',
    category: 'Image',
    icon: <Maximize className="w-6 h-6 text-orange-500" />
  },
  {
    id: 'pdf-merge',
    title: 'PDF Merge',
    description: 'Combine multiple PDF files into one single document.',
    category: 'PDF',
    icon: <Files className="w-6 h-6 text-red-500" />
  },
  {
    id: 'text-counter',
    title: 'Text Counter',
    description: 'Count words, characters, and sentences in your text.',
    category: 'Utility',
    icon: <Type className="w-6 h-6 text-purple-500" />
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data for readability.',
    category: 'Utility',
    icon: <Settings className="w-6 h-6 text-slate-500" />
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Create short URLs for easy sharing and tracking.',
    category: 'Utility',
    icon: <Link className="w-6 h-6 text-cyan-500" />
  }
];

export const CATEGORIES: { name: string; label: string }[] = [
  { name: 'Sabhi', label: 'Sabhi' },
  { name: 'Financial', label: 'Financial' },
  { name: 'PDF', label: 'PDF' },
  { name: 'Image', label: 'Image' },
  { name: 'Utility', label: 'Utility' }
];
