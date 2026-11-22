/**
 * Shared FAQ content — used by the home page teaser and the help centre.
 * Kept in one place so the two never drift apart.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        q: "Do I need an account to order?",
        a: "No. You can browse, add to cart, checkout, and submit a custom art request entirely as a guest. Accounts are optional and only let you save your details and see order history.",
      },
      {
        q: "How do I track my order?",
        a: "Go to the Track Order page and enter your Order ID (sent on confirmation) and the phone number you used. You'll see a live status timeline.",
      },
    ],
  },
  {
    id: "custom-art",
    title: "Custom art",
    items: [
      {
        q: "How does String Face Art work?",
        a: "You upload a clear face photo, we design a thread pattern from it, and craft it onto a 45cm round wooden plank, and deliver it to your door. The whole process takes about 4–5 days.",
      },
      {
        q: "What photo works best?",
        a: "A clear, well-lit, front-facing photo of the face with good contrast gives the best result. You can upload JPG, PNG or WEBP up to 10MB.",
      },
      {
        q: "How much does custom art cost?",
        a: "The signature 45cm String Face Art has a fixed price shown on the Custom Art page. Couple/two-face versions are priced higher. You'll always see the price before you submit.",
      },
      {
        q: "Are my uploaded photos private?",
        a: "Yes. Photos are stored privately and only accessible to our team through secure links. We use them solely to create your artwork.",
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery",
    items: [
      {
        q: "Do you deliver outside the Kathmandu Valley?",
        a: "Yes — we deliver to every district in Nepal through courier partners. Delivery time and fee depend on your location.",
      },
    ],
  },
  {
    id: "payment-returns",
    title: "Payment & returns",
    items: [
      {
        q: "How do I pay?",
        a: "We offer Cash on Delivery, and (where enabled) eSewa, Khalti and bank transfer / QR. You choose at checkout.",
      },
      {
        q: "Can I return a custom piece?",
        a: "Custom pieces are personalised and can't be returned unless they arrive damaged or incorrect. If anything's wrong, message us within 48 hours and we'll fix it.",
      },
    ],
  },
];

export const faqItems: FaqItem[] = faqGroups.flatMap((g) => g.items);
