import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Copy, Share2, RotateCcw, Check, Banknote, Download, X, Smartphone, MoreVertical, Share as ShareIcon, MoreHorizontal, PlusSquare, MonitorDown } from 'lucide-react';
import PatternBackground from './components/PatternBackground';
import Header from './components/Header';
import { ConversionDirection } from './types';
import { numberToArabicText, toIndicDigits } from './utils';

const App: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [direction, setDirection] = useState<ConversionDirection>(ConversionDirection.RemoveZeros);
  const [calculatedResult, setCalculatedResult] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState<number>(50);
  
  // Install Modal State
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>('other');

  // Constants for styling
  const primaryColor = "text-[#1B4D3E]";
  const quickAmounts = [5000, 10000, 50000, 100000, 500000, 1000000];
  const denominations = [500, 200, 100, 50, 25, 10];

  // Format options to ensure Western Arabic numerals (0-9)
  const formatOptions: any = {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    numberingSystem: 'latn',
  };

  // Device detection
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    }
  }, []);

  // Handle Input Change with Comma Formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove existing commas to get raw number
    const rawValue = e.target.value.replace(/,/g, '');
    
    // Check if valid positive integer (allow empty)
    if (rawValue === '' || /^\d+$/.test(rawValue)) {
      if (rawValue === '') {
        setAmount('');
      } else {
        // Format with commas using Intl
        const formatted = new Intl.NumberFormat('en-US').format(BigInt(rawValue));
        setAmount(formatted);
      }
    }
  };

  const calculate = (val: string, dir: ConversionDirection) => {
    if (!val) return null;
    const numericAmount = parseFloat(val.replace(/,/g, ''));
    if (isNaN(numericAmount)) {
      return null;
    }
    if (dir === ConversionDirection.RemoveZeros) {
      return numericAmount / 100;
    } else {
      return numericAmount * 100;
    }
  };

  // Auto-calculate for reactive feel
  useEffect(() => {
    const res = calculate(amount, direction);
    setCalculatedResult(res);
  }, [amount, direction]);

  const handleSwap = () => {
    setIsAnimating(true);
    setDirection(prev => 
      prev === ConversionDirection.RemoveZeros 
        ? ConversionDirection.AddZeros 
        : ConversionDirection.RemoveZeros
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const formatCurrency = (val: number) => {
    // Use en-US to ensure comma separators (1,000) are used consistently
    return new Intl.NumberFormat('en-US', formatOptions).format(val);
  };

  const handleCopy = () => {
    if (calculatedResult !== null) {
      const formatted = formatCurrency(calculatedResult);
      navigator.clipboard.writeText(formatted);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
    }
  };

  const handleShare = async () => {
    if (calculatedResult === null || !amount) return;

    // Dismiss keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const rawAmount = parseFloat(amount.replace(/,/g, ''));
    
    // Determine Old vs New values based on direction
    let oldAmountVal = 0;
    let newAmountVal = 0;

    if (direction === ConversionDirection.RemoveZeros) {
      // Input is Old, Result is New
      oldAmountVal = rawAmount;
      newAmountVal = calculatedResult;
    } else {
      // Input is New, Result is Old
      oldAmountVal = calculatedResult;
      newAmountVal = rawAmount;
    }

    const formattedOld = formatCurrency(oldAmountVal);
    const formattedNew = formatCurrency(newAmountVal);
    
    const shareText = `محول الليرة السورية 
المبلغ بالعملة القديمة: ${formattedOld} ليرة سورية
المبلغ بالعملة الجديدة: ${formattedNew} ليرة سورية

رابط التطبيق: www.new-lira.pro`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        // Share cancelled or failed
        console.debug('Share cancelled');
      }
    } else {
      // Desktop / Fallback
      navigator.clipboard.writeText(shareText);
      setShowShareSuccess(true);
      setTimeout(() => setShowShareSuccess(false), 2000);
    }
  };

  const handleReset = () => {
    setAmount('');
    setCalculatedResult(null);
  };

  // Breakdown Logic
  const getBreakdown = () => {
    if (calculatedResult === null) return { count: 0, remainder: 0 };
    // Handle floating point precision safely
    const count = Math.floor(calculatedResult / selectedDenom);
    // Use multiplication/subtraction for more accurate remainder than modulo with floats
    const remainder = calculatedResult - (count * selectedDenom);
    // Round remainder to avoid 0.0000000001 issues
    const roundedRemainder = Math.round(remainder * 100) / 100;
    return { count, remainder: roundedRemainder };
  };

  const breakdown = getBreakdown();

  // Prepare textual representation for input
  const getAmountTextDetails = () => {
    if (!amount) return null;
    const rawVal = parseInt(amount.replace(/,/g, ''));
    if (isNaN(rawVal)) return null;
    
    return {
      text: numberToArabicText(rawVal),
      indic: toIndicDigits(amount)
    };
  };

  const amountDetails = getAmountTextDetails();

  return (
    <div className="min-h-screen relative flex flex-col items-center font-sans text-gray-800 overflow-x-hidden selection:bg-[#1B4D3E] selection:text-white">
      <PatternBackground />
      
      <Header />

      <main className="w-full max-w-[420px] px-4 pb-4 z-10 relative flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-stone-200 overflow-hidden">
          
          {/* Top colored bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1B4D3E] via-[#D4AF37] to-[#1B4D3E]"></div>

          <div className="p-5 flex flex-col gap-6">
            
            {/* Toggle Direction Section */}
            <div className="bg-stone-100 rounded-xl p-1.5 relative flex items-center justify-between">
              <button 
                onClick={() => setDirection(ConversionDirection.RemoveZeros)}
                className={`flex-1 py-3 px-1 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  direction === ConversionDirection.RemoveZeros 
                    ? 'bg-white text-[#1B4D3E] shadow-sm ring-1 ring-stone-200' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>من القديمة - للجديدة</span>
                <span className="text-[10px] font-normal opacity-80 scale-90">حذف صفرين</span>
              </button>

              <button 
                onClick={handleSwap}
                className="mx-1 p-2 bg-[#D4AF37] text-white rounded-full shadow-sm hover:bg-[#b5952f] transition-transform active:scale-90 z-10 flex-shrink-0"
                aria-label="تبديل الاتجاه"
              >
                <ArrowLeftRight className={`w-4 h-4 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`} />
              </button>

              <button 
                onClick={() => setDirection(ConversionDirection.AddZeros)}
                className={`flex-1 py-3 px-1 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                  direction === ConversionDirection.AddZeros 
                    ? 'bg-white text-[#1B4D3E] shadow-sm ring-1 ring-stone-200' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span>من الجديدة - للقديم</span>
                <span className="text-[10px] font-normal opacity-80 scale-90">إضافة صفرين</span>
              </button>
            </div>

            {/* Input Section */}
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className="text-stone-600 font-semibold text-sm text-right px-1 flex justify-between items-center">
                <span>المبلغ</span>
                <span className="text-stone-400 font-normal text-xs">(ل.س {direction === ConversionDirection.RemoveZeros ? 'قديمة' : 'جديدة'})</span>
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className={`w-full text-4xl font-bold text-center py-4 border-b-2 bg-transparent focus:outline-none focus:ring-0 transition-colors placeholder:text-stone-200 ${primaryColor} ${
                    amount ? 'border-[#1B4D3E]' : 'border-stone-200'
                  }`}
                  dir="ltr"
                />
                {amount && (
                  <button 
                    onClick={handleReset}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-stone-500 transition-colors active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Added: Textual representation and Indic numerals */}
              {amountDetails ? (
                <div className="text-center mt-1 animate-fade-in">
                  <p className="text-sm font-medium text-[#1B4D3E] leading-relaxed">
                    {amountDetails.text}
                  </p>
                  <p className="text-lg text-stone-400 font-ibm-plex font-normal mt-0.5" dir="ltr">
                    ({amountDetails.indic})
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-stone-400 text-center mt-1">
                  يتم الحساب تلقائيًا عند إدخال المبلغ
                </p>
              )}

              {/* Quick Amounts */}
              <div className="mt-3">
                <p className="text-[11px] text-stone-400 font-medium mb-2 text-right px-1 opacity-80">مبالغ شائعة</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(new Intl.NumberFormat('en-US').format(amt))}
                      className="text-xs font-medium text-stone-500 bg-stone-50 border border-stone-200 hover:border-[#1B4D3E]/40 hover:text-[#1B4D3E] hover:bg-white active:bg-[#1B4D3E]/10 rounded-full py-2 transition-all duration-200"
                    >
                      {new Intl.NumberFormat('en-US').format(amt)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div className="bg-[#1B4D3E]/5 rounded-xl p-5 border border-[#1B4D3E]/10 text-center relative group min-h-[140px] flex flex-col justify-center items-center">
              <div className="text-stone-500 text-xs font-bold mb-3 uppercase tracking-wider">
                النتيجة 
                <span className="font-normal opacity-70 mr-1">
                  ({direction === ConversionDirection.RemoveZeros ? 'العملة الجديدة' : 'العملة القديمة'})
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-3 w-full overflow-hidden">
                <span className={`text-4xl sm:text-5xl font-bold tracking-tight truncate px-2 ${primaryColor}`} dir="ltr">
                   {calculatedResult !== null ? formatCurrency(calculatedResult) : '0'}
                </span>
              </div>
              <div className="text-[#D4AF37] font-bold text-lg">ليرة سورية</div>

              {/* Copy Button (Result only) */}
              <button 
                onClick={handleCopy}
                disabled={!calculatedResult}
                className={`absolute top-2 left-2 p-2.5 rounded-full transition-all duration-200 ${
                  !calculatedResult 
                    ? 'text-stone-300 cursor-not-allowed' 
                    : 'text-[#1B4D3E] hover:bg-[#1B4D3E]/10 active:scale-95 bg-white/50 shadow-sm'
                }`}
                title="نسخ المبلغ"
              >
                <Copy className="w-5 h-5" />
                {showCopyTooltip && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] px-2 py-1 rounded shadow-sm whitespace-nowrap z-20">
                    تم النسخ
                  </span>
                )}
              </button>
            </div>
            
            {/* Share Button - Replaces Calculate */}
            <button 
              onClick={handleShare}
              disabled={!amount}
              className={`w-full font-bold h-14 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg mt-2 ${
                amount 
                  ? 'bg-[#1B4D3E] active:bg-[#163e32] text-white shadow-[#1B4D3E]/20' 
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              {showShareSuccess ? (
                 <>
                   <Check className="w-5 h-5" />
                   <span>تم نسخ النتيجة</span>
                 </>
              ) : (
                 <>
                   <Share2 className="w-5 h-5" />
                   <span>مشاركة الحسبة</span>
                 </>
              )}
            </button>

            {/* Cash Denomination Breakdown */}
            {calculatedResult !== null && calculatedResult > 0 && (
              <div className="animate-fade-in border-t border-stone-100 pt-5 mt-1">
                <div className="flex items-center justify-end gap-2 mb-3 px-1">
                  <h3 className="text-sm font-bold text-stone-600">توزيع الفئات النقدية</h3>
                  <Banknote className="w-4 h-4 text-[#D4AF37]" />
                </div>
                
                <div className="flex flex-row-reverse flex-wrap gap-2 mb-4">
                  {denominations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDenom(d)}
                      className={`flex-1 min-w-[3rem] py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
                        selectedDenom === d
                          ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-md'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-[#1B4D3E]/30'
                      }`}
                    >
                      {formatCurrency(d)}
                    </button>
                  ))}
                </div>

                <div className="bg-[#FDFBF7] rounded-xl p-4 border border-stone-200/60 relative overflow-hidden">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 rounded-bl-full -mr-2 -mt-2"></div>
                   
                   <p className="text-sm text-stone-700 leading-relaxed text-center relative z-10">
                     أنت بحاجة إلى <span className="font-bold text-[#1B4D3E] text-lg mx-1">{formatCurrency(breakdown.count)}</span> ورقة نقدية <br/>
                     من فئة <span className="font-bold">{formatCurrency(selectedDenom)}</span> ليرة
                   </p>
                   
                   {breakdown.remainder > 0 && (
                     <div className="mt-3 pt-3 border-t border-stone-200/50 text-center relative z-10">
                       <p className="text-xs font-medium text-amber-600">
                         {`المتبقي (فراطة): ${formatCurrency(breakdown.remainder)} ليرة`}
                       </p>
                       <p className="text-[10px] text-stone-400 mt-1 font-medium">
                         {`(تعادل ${formatCurrency(breakdown.remainder * 100)} ليرة من العملة القديمة)`}
                       </p>
                     </div>
                   )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Note Below Card */}
        <div className="text-center px-6">
          <p className="text-stone-400 text-xs leading-relaxed opacity-80">
            الليرة الجديدة تساوي 100 ليرة قديمة.
          </p>
        </div>

        {/* Footer Area */}
        <div className="mt-6 mb-8 flex flex-col items-center gap-4">
          
          {/* Install Button */}
          <button 
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white border border-[#1B4D3E]/20 rounded-full text-[#1B4D3E] text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت الأداة</span>
          </button>

          {/* Copyright & Social */}
          <div className="text-[10px] text-stone-400 text-center">
             <span>جميع الحقوق محفوظة © 2026 لـ </span>
             <a 
               href="https://www.instagram.com/m_reda_ra/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="font-bold text-stone-500 hover:text-[#1B4D3E] transition-colors"
             >
               M.REDA RACHID
             </a>
          </div>
        </div>

      </main>

      {/* Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowInstallModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <h3 className="font-bold text-[#1B4D3E]">تثبيت الأداة</h3>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="p-1 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              
              {/* iPhone / Safari */}
              {(deviceType === 'ios' || deviceType === 'other') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                    <Smartphone className="w-4 h-4 text-stone-400" />
                    <span>iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-3 mr-6 list-decimal">
                    <li className="leading-relaxed">
                      اضغط على زر الثلاث نقاط <MoreHorizontal className="w-3 h-3 inline mx-1 text-stone-500 bg-stone-100 rounded px-0.5" />
                    </li>
                    <li className="leading-relaxed">
                      اضغط على زر المشاركة <ShareIcon className="w-3 h-3 inline mx-1 text-blue-500" />
                    </li>
                    <li className="leading-relaxed">
                      اختر: <strong>إضافة إلى الشاشة الرئيسية</strong>
                      <div className="flex items-center gap-1 mt-1 text-stone-500 bg-stone-50 p-1 rounded w-fit border border-stone-100">
                         <PlusSquare className="w-3 h-3" />
                         <span className="text-[10px] font-medium">Add to Home Screen</span>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {(deviceType === 'other') && <div className="h-px bg-stone-100 w-full"></div>}

              {/* Android / Chrome */}
              {(deviceType === 'android' || deviceType === 'other') && (
                <div className="space-y-3">
                   <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                    <Smartphone className="w-4 h-4 text-stone-400" />
                    <span>Android (Chrome)</span>
                  </div>
                  <ol className="text-xs text-stone-600 space-y-3 mr-6 list-decimal">
                    <li className="leading-relaxed">
                      اضغط على قائمة المتصفح <MoreVertical className="w-3 h-3 inline mx-0.5 align-text-bottom text-stone-500" />
                    </li>
                    <li className="leading-relaxed">
                      اختر: <strong>إضافة إلى الشاشة الرئيسية</strong>
                      <div className="flex items-center gap-1 mt-1 text-stone-500 bg-stone-50 p-1 rounded w-fit border border-stone-100">
                         <MonitorDown className="w-3 h-3" />
                         <span className="text-[10px] font-medium">Add to Home Screen</span>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

            </div>
            
            <div className="p-4 bg-stone-50 text-center">
              <button 
                onClick={() => setShowInstallModal(false)}
                className="text-sm font-medium text-[#1B4D3E] hover:text-[#163e32]"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;