// Månedsnavn på norsk
export const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

// Sjekk om et år er skuddår
export function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0));
}

// Få antall dager i et år
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

// Få antall dager i en måned
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Få dag-nummer i året (1-365/366)
export function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Sett dato basert på dag-nummer i året
export function setDayOfYear(date, dayOfYear) {
  const newDate = new Date(date.getFullYear(), 0, 1);
  newDate.setDate(dayOfYear);
  newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds());
  return newDate;
}

// Konverter tid til norsk talespråk
export function timeToNorwegian(hours, minutes) {
  const period = hours < 12 ? 'på formiddagen' : hours < 18 ? 'på ettermiddagen' : 'på kvelden';
  const h12 = hours % 12 || 12;
  const nextH12 = (hours + 1) % 12 || 12;
  
  const numberWords = [
    'tolv', 'ett', 'to', 'tre', 'fire', 'fem', 
    'seks', 'sju', 'åtte', 'ni', 'ti', 'elleve', 'tolv'
  ];
  
  if (minutes === 0) return `${numberWords[h12]} ${period}`;
  if (minutes === 15) return `kvart over ${numberWords[h12]} ${period}`;
  if (minutes === 30) return `halv ${numberWords[nextH12]} ${period}`;
  if (minutes === 45) return `kvart på ${numberWords[nextH12]} ${period}`;
  
  if (minutes < 30) {
    if (minutes === 5) return `fem over ${numberWords[h12]} ${period}`;
    if (minutes === 10) return `ti over ${numberWords[h12]} ${period}`;
    if (minutes === 20) return `tjue over ${numberWords[h12]} ${period}`;
    if (minutes === 25) return `fem på halv ${numberWords[nextH12]} ${period}`;
    return `${minutes} over ${numberWords[h12]} ${period}`;
  } else {
    if (minutes === 35) return `fem over halv ${numberWords[nextH12]} ${period}`;
    if (minutes === 40) return `tjue på ${numberWords[nextH12]} ${period}`;
    if (minutes === 50) return `ti på ${numberWords[nextH12]} ${period}`;
    if (minutes === 55) return `fem på ${numberWords[nextH12]} ${period}`;
    return `${60 - minutes} på ${numberWords[nextH12]} ${period}`;
  }
}

// Formater dato til norsk
export function formatDateNorwegian(date) {
  const day = date.getDate();
  const month = MONTHS_NO[date.getMonth()].toLowerCase();
  const year = date.getFullYear();
  return `${day}. ${month} ${year}`;
}