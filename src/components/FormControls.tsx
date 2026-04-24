import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const CustomSelect = ({ label, value, onChange, options, icon: Icon, disabled = false, placeholder = 'Select...', noMargin = false }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className={noMargin ? "" : "mb-4"} ref={containerRef}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
            <Icon size={16} className={disabled ? 'opacity-50' : ''} />
          </div>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left ${Icon ? 'pl-9' : 'px-3'} pr-10 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all text-sm 
            ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'}
            ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 bg-white' : ''}`}
        >
          {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={16} />

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {opt.label}
                {value === opt.value && <Check size={14} className="text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomMonthPicker = ({ label, value, onChange, icon: Icon, disabled = false, placeholder = 'YYYY-MM', suffix }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const initialYear = value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear();
  const [viewYear, setViewYear] = useState(initialYear);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleMonthSelect = (monthIndex: number) => {
    const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}`);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value || value.toLowerCase() === 'present') return value;
    const parts = value.split('-');
    if (parts.length !== 2) return value;
    const monthName = MONTHS[parseInt(parts[1], 10) - 1];
    return `${monthName} ${parts[0]}`;
  };

  return (
    <div className="mb-4" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
            <Icon size={16} className={disabled ? 'opacity-50' : ''} />
          </div>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full text-left ${Icon ? 'pl-9' : 'px-3'} ${suffix ? 'pr-20' : 'pr-3'} py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 transition-all text-sm 
            ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'}
            ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500 bg-white' : ''}`}
        >
          {value ? getDisplayValue() : <span className="text-slate-400">{placeholder}</span>}
        </button>
        {suffix && <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">{suffix}</div>}

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-1.5 w-[240px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex justify-between items-center mb-3 px-1">
              <button onClick={() => setViewYear(v => v - 1)} className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"><ChevronLeft size={18} /></button>
              <span className="font-semibold text-slate-800 tracking-wide">{viewYear}</span>
              <button onClick={() => setViewYear(v => v + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((month, idx) => {
                const isSelected = value === `${viewYear}-${(idx + 1).toString().padStart(2, '0')}`;
                return (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(idx)}
                    className={`py-1.5 text-sm rounded-md transition-colors ${isSelected ? 'bg-blue-600 text-white font-medium' : 'text-slate-700 hover:bg-blue-50'}`}
                  >
                    {month}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
