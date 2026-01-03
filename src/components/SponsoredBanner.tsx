import React from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';

const SponsoredBanner: React.FC = () => {
  return (
    <div className="w-full mt-1 mb-1">
      <div className="bg-white rounded-xl border border-[#1B4D3E]/10 p-3 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-1 h-full bg-[#D4AF37] opacity-90" />

        <div className="flex items-center justify-between gap-3 pl-1 pr-2 relative z-0">
          {/* Text Content */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
             <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <h3 className="text-xs font-bold text-[#1B4D3E] truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#D4AF37]" fill="#D4AF37" fillOpacity={0.2} />
                  <span>برعاية كيان جروب</span>
                </h3>
                <span className="text-[10px] text-stone-400 font-normal hidden xs:inline">– مكتب حوالات معتمد</span>
             </div>
             <p className="text-[10px] text-stone-600 font-medium leading-tight">
               بيع وشراء الليرة السورية • تسليم فوري • ثقة وأمان
             </p>
          </div>

          {/* CTA Button - Whatsapp Green */}
          <a 
            href="https://wa.me/905386468201" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-sm transition-transform active:scale-95 whitespace-nowrap flex-shrink-0"
            aria-label="تواصل مع كيان جروب عبر واتساب"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>تواصل الآن</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SponsoredBanner;