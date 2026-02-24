export const SITE_CONFIG = {
  name: 'קנייה ברורה',
  tagline: 'קונים חכם. משלמים פחות.',
  subtitle: 'דילים שנבחרו על ידי AI + המחירים הטובים ביותר מאליאקספרס ישירות אליכם.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kenya-brura.co.il',
  description: 'השוו מחירים מאליאקספרס עם מחיר ברור בשקלים, זמן אספקה ודירוג אמון.',
  affiliateDisclosure: 'אם תקנו דרך הקישורים באתר, ייתכן שנקבל עמלה קטנה ללא עלות נוספת עבורכם. זה מה שמאפשר לנו להמשיך לפעול.',
  priceDisclaimer: 'ייתכן מע"מ או מכס בהתאם לחוק ולסכום הקנייה.',
  fxDisclaimer: 'שער המרה משוער',
  contactEmail: 'info@kenya-brura.co.il',
  social: {
    facebook: '',
    instagram: '',
  },
} as const
