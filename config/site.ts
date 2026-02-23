export const SITE_CONFIG = {
  name: 'קנייה-ברורה',
  tagline: 'מחיר ברור, משלוח ברור, קליק אחד לקנייה',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kenya-brura.co.il',
  description: 'השוו מחירים מאליאקספרס עם מחיר ברור בשקלים, זמן אספקה ודירוג אמון.',
  affiliateDisclosure: 'אם תקנו דרך הקישור, ייתכן שנקבל עמלה קטנה ללא עלות נוספת עבורכם.',
  priceDisclaimer: 'ייתכן מע"מ או מכס בהתאם לחוק ולסכום הקנייה.',
  fxDisclaimer: 'שער המרה משוער',
  contactEmail: 'info@kenya-brura.co.il',
  social: {
    facebook: '',
    instagram: '',
  },
} as const
