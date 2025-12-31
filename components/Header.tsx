import React from 'react';
import { Banknote } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-8 pb-6 px-4 z-10 relative">
      <div className="bg-[#1B4D3E] p-2.5 rounded-full mb-3 shadow-lg ring-4 ring-[#D4AF37]/20">
        <Banknote className="w-6 h-6 text-[#FDFBF7]" />
      </div>
      <h1 className="text-2xl font-bold text-[#1B4D3E] mb-1 text-center tracking-wide">
        محوّل الليرة السورية
      </h1>
      <p className="text-[#555] text-sm font-medium opacity-80">
        قبل وبعد حذف الأصفار
      </p>
    </header>
  );
};

export default Header;