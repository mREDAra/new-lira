// Utility to convert Western Arabic digits (0-9) to Eastern Arabic digits (٠-٩)
export const toIndicDigits = (str: string): string => {
  return str.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};

// Simplified Tafqeet (Number to Arabic Text) logic
const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
const teens = ["عشر", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
const hundreds = ["", "مئة", "مئتان", "ثلاثمئة", "أربعمئة", "خمسمئة", "ستمئة", "سبعمئة", "ثمانمئة", "تسعمئة"];

const convertGroup = (n: number): string => {
  if (n === 0) return "";
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100) {
    const rem = n % 10;
    return (rem > 0 ? ones[rem] + " و" : "") + tens[Math.floor(n / 10)];
  }
  // Hundreds
  const hund = Math.floor(n / 100);
  const rem = n % 100;
  return hundreds[hund] + (rem > 0 ? " و" + convertGroup(rem) : "");
};

export const numberToArabicText = (num: number): string => {
  if (num === 0) return "صفر";
  
  // Handling large numbers by splitting (simplified for common currency ranges)
  // Max safe integer in JS is 9 quadrillion, enough for Lira
  
  const parts: { value: number; label: string; labelDual: string; labelPlural: string }[] = [
    { value: 1000000000000, label: "تريليون", labelDual: "تريليونان", labelPlural: "تريليونات" },
    { value: 1000000000, label: "مليار", labelDual: "ملياران", labelPlural: "مليارات" },
    { value: 1000000, label: "مليون", labelDual: "مليونان", labelPlural: "ملايين" },
    { value: 1000, label: "ألف", labelDual: "ألفان", labelPlural: "آلاف" },
    { value: 1, label: "", labelDual: "", labelPlural: "" }
  ];

  let result = "";
  let remaining = num;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (remaining >= part.value) {
      const count = Math.floor(remaining / part.value);
      remaining %= part.value;

      if (result !== "") result += " و";

      if (part.value === 1) {
        result += convertGroup(count);
      } else {
        if (count === 1) {
          result += part.label; // One thousand -> "ألف"
        } else if (count === 2) {
          result += part.labelDual; // Two thousand -> "ألفان"
        } else if (count >= 3 && count <= 10) {
          result += convertGroup(count) + " " + part.labelPlural; // 3-10 -> Plural "خمسة آلاف"
        } else {
          result += convertGroup(count) + " " + part.label; // >11 -> Singular Accusative (simplified to base label here) "خمسون ألف"
        }
      }
    }
  }

  return result;
};