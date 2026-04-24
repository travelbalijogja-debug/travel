import type { Metadata } from "next";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neotraveljepara.my.id';
const BRAND = 'Noe Travel Jepara';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // ── Core ──────────────────────────────────────────
  title: {
    default: `${BRAND} — Paket Wisata Bali, Karimunjawa & Cruise Singapore`,
    template: `%s | ${BRAND}`,
  },
  description:
    'Noe Travel Jepara melayani paket wisata terbaik ke Bali, Karimunjawa, Jogja, hingga Cruise Singapore. Transport private, hotel bintang 4, tour guide profesional. Hubungi kami sekarang!',
  keywords: [
    'paket wisata Jepara', 'travel Jepara', 'paket Karimunjawa',
    'paket Bali murah', 'wisata Karimunjawa', 'tour Bali Jepara',
    'Noe Travel Jepara', 'cruise Singapore Jepara', 'island hopping Karimunjawa',
    'paket liburan keluarga', 'agen travel Jepara', 'paket honeymoon Bali',
  ],
  authors: [{ name: BRAND, url: SITE_URL }],
  creator: BRAND,
  publisher: BRAND,
  category: 'travel',

  // ── Canonical & Robots ────────────────────────────
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph (Facebook, WhatsApp, Telegram) ─────
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: BRAND,
    title: `${BRAND} — Paket Wisata Bali, Karimunjawa & Cruise Singapore`,
    description:
      'Paket wisata terbaik dari Jepara. Bali, Karimunjawa, Jogja, hingga Cruise Singapore dengan harga kompetitif dan pelayanan profesional.',
  },

  // ── Twitter / X Card ──────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND} — Paket Wisata Bali & Karimunjawa`,
    description: 'Paket wisata terbaik dari Jepara. Bali, Karimunjawa, Jogja, hingga Cruise Singapore.',
  },

  // ── Favicon & Icons ───────────────────────────
  // Next.js otomatis pakai icon.png dari src/app/
  // Pastikan favicon.ico lama sudah dihapus dari src/app/

  // ── Verification (isi setelah submit ke Google Search Console) ──
  // verification: { google: 'YOUR_GOOGLE_VERIFICATION_CODE' },
};

// ── JSON-LD Structured Data (Local Business) ──────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: BRAND,
  description: 'Agen perjalanan wisata terpercaya di Jepara melayani paket Bali, Karimunjawa, Jogja dan Cruise Singapore.',
  url: SITE_URL,
  telephone: '+6289678657991',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Sukarno Hatta No. 27, Bok Biru, Tahunan',
    addressLocality: 'Jepara',
    addressRegion: 'Jawa Tengah',
    postalCode: '59427',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -6.5882,
    longitude: 110.6684,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '21:00',
  },
  sameAs: [],
  priceRange: 'Rp 1.000.000 - Rp 5.000.000',
  currenciesAccepted: 'IDR',
  paymentAccepted: 'Cash, Bank Transfer, QRIS',
  areaServed: {
    '@type': 'Country',
    name: 'Indonesia',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#000000" />
        <meta name="geo.region" content="ID-JT" />
        <meta name="geo.placename" content="Jepara, Jawa Tengah" />
        <meta name="geo.position" content="-6.5882;110.6684" />
        <meta name="ICBM" content="-6.5882, 110.6684" />
      </head>
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
