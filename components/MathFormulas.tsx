
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

interface Formula {
  name: string;
  latex: string;
  description: string;
}

interface Category {
  title: string;
  formulas: Formula[];
}

const FORMULA_DATA: Category[] = [
  {
    title: 'Algebra (Beajganit)',
    formulas: [
      { name: 'Square of sum', latex: '(a + b)² = a² + 2ab + b²', description: 'Basic identity for square of a sum.' },
      { name: 'Square of difference', latex: '(a - b)² = a² - 2ab + b²', description: 'Basic identity for square of a difference.' },
      { name: 'Difference of squares', latex: 'a² - b² = (a + b)(a - b)', description: 'Crucial for factorization.' },
      { name: 'Cube of sum', latex: '(a + b)³ = a³ + 3a²b + 3ab² + b³', description: 'Basic cube expansion.' },
      { name: 'Quadratic Formula', latex: 'x = [-b ± √(b² - 4ac)] / 2a', description: 'To find roots of ax² + bx + c = 0.' },
    ]
  },
  {
    title: 'Geometry (Rekhaganit)',
    formulas: [
      { name: 'Area of Circle', latex: 'A = πr²', description: 'r is the radius.' },
      { name: 'Circumference of Circle', latex: 'C = 2πr', description: 'Perimeter of a circle.' },
      { name: 'Area of Triangle', latex: 'A = ½ × base × height', description: 'Standard area formula.' },
      { name: 'Pythagoras Theorem', latex: 'a² + b² = c²', description: 'In a right-angled triangle, c is hypotenuse.' },
      { name: 'Volume of Sphere', latex: 'V = (4/3)πr³', description: 'Total volume of a 3D ball.' },
      { name: 'Surface Area of Sphere', latex: 'A = 4πr²', description: 'Outer area of a 3D ball.' },
    ]
  },
  {
    title: 'Trigonometry',
    formulas: [
      { name: 'Pythagorean Identity', latex: 'sin²θ + cos²θ = 1', description: 'Fundamental identity.' },
      { name: 'Tan identity', latex: 'tanθ = sinθ / cosθ', description: 'Relation between primary ratios.' },
      { name: 'Double Angle Sine', latex: 'sin(2θ) = 2sinθcosθ', description: 'Useful for simplification.' },
      { name: 'Double Angle Cosine', latex: 'cos(2θ) = cos²θ - sin²θ', description: 'Also: 2cos²θ - 1 or 1 - 2sin²θ.' },
    ]
  },
  {
    title: 'Arithmetic (Ankganit)',
    formulas: [
      { name: 'Average (Ausat)', latex: 'Avg = (Sum of Obs.) / (No. of Obs.)', description: 'Basic mean calculation.' },
      { name: 'Simple Interest', latex: 'SI = (P × R × T) / 100', description: 'Interest on principal.' },
      { name: 'Compound Interest Amount', latex: 'A = P(1 + r/n)^(nt)', description: 'Total amount after CI.' },
      { name: 'Percentage change', latex: '%Δ = [(New - Old) / Old] × 100', description: 'Change relative to original.' },
    ]
  }
];

const MathFormulas: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(FORMULA_DATA.map(c => c.title));

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredData = FORMULA_DATA.map(cat => ({
    ...cat,
    formulas: cat.formulas.filter(f => 
      f.name.toLowerCase().includes(search.toLowerCase()) || 
      f.latex.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.formulas.length > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[#1E3A8A] dark:text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-violet-600" />
          Math Formulas (Sutra)
        </h2>
        <p className="text-slate-400 text-sm">Aapke sabhi important maths formulas ek hi jagah par.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Formula dhoondein (e.g. circle, algebra, square)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium text-slate-700 dark:text-slate-200"
        />
      </div>

      <div className="space-y-6">
        {filteredData.length > 0 ? filteredData.map((category) => {
          const isExpanded = expandedCategories.includes(category.title);
          return (
            <div key={category.title} className="bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden transition-all">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-left"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{category.title}</h3>
                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                  {category.formulas.map((formula, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-500">{formula.name}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-3 overflow-x-auto custom-scrollbar group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-colors">
                        <code className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap block text-center py-2">
                          {formula.latex}
                        </code>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed italic">
                        {formula.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-10">
            <p className="text-slate-400 font-medium">Search results nahi mile. Kuch aur try karein.</p>
          </div>
        )}
      </div>

      <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-[2rem] border border-violet-100 dark:border-violet-800 text-center">
        <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
          Tip: Formulas ko yaad karne ke liye daily practice karein!
        </p>
      </div>
    </div>
  );
};

export default MathFormulas;
