import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://projects.aaenterprisetech.com/kaggle/project"),
  title: {
    default: "VITALIS-360 | Autonomous AI Medical Orchestrator & Clinical Guardian",
    template: "%s | VITALIS-360"
  },
  description: "Next-generation clinical intelligence platform powered by Gemini AI, real-time IoT vital telemetry, SHA-256 encrypted diagnostic vault, and 24/7 emergency SOS triage matrix.",
  keywords: [
    "AI Medical Assistant",
    "Clinical Telemetry",
    "HIPAA Compliant Healthcare AI",
    "Electronic Health Records",
    "Telemedicine Portal",
    "VITALIS-360",
    "Medical AI Advisor",
    "Emergency SOS Dispatch",
    "Remote Patient Monitoring",
    "AI Health Sentinel"
  ],
  authors: [{ name: "VITALIS-360 Clinical Engine" }],
  creator: "VITALIS-360 Sentinel Ecosystem",
  publisher: "VITALIS-360 Healthcare Solutions",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://projects.aaenterprisetech.com/kaggle/project",
    siteName: "VITALIS-360 Clinical Ecosystem",
    title: "VITALIS-360 | Autonomous AI Medical Orchestrator",
    description: "Real-time IoT vital telemetry, AI clinical advisory, SHA-256 encrypted diagnostic report vault, and emergency ER matrix.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "VITALIS-360 Clinical Guardian Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VITALIS-360 | Autonomous AI Medical Orchestrator",
    description: "Next-gen clinical telemetry, Gemini AI medical advisor, and SHA-256 encrypted report vault.",
    images: ["/logo.png"],
    creator: "@vitalis360",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://projects.aaenterprisetech.com/kaggle/project",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "MedicalOrganization",
                  "@id": "https://projects.aaenterprisetech.com/kaggle/project/#organization",
                  "name": "VITALIS-360 Clinical Guardian",
                  "url": "https://projects.aaenterprisetech.com/kaggle/project",
                  "logo": "https://projects.aaenterprisetech.com/kaggle/project/logo.png",
                  "description": "Autonomous AI Medical Orchestrator and Clinical Telemetry Guardian providing 24/7 patient vital monitoring, AI triage, and SHA-256 encrypted diagnostic vault.",
                  "medicalSpecialty": [
                    "Cardiology",
                    "EmergencyMedicine",
                    "GeneralMedicine",
                    "Telemedicine"
                  ],
                  "sameAs": [
                    "https://projects.aaenterprisetech.com/kaggle/project"
                  ]
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://projects.aaenterprisetech.com/kaggle/project/#app",
                  "name": "VITALIS-360 Platform",
                  "url": "https://projects.aaenterprisetech.com/kaggle/project",
                  "applicationCategory": "HealthApplication",
                  "operatingSystem": "Web, Windows, macOS, iOS, Android",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "AI-powered clinical ecosystem featuring real-time patient telemetry, WhatsApp emergency gateway, Google Maps ER proximity matrix, and multilingual clinical advisor."
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-on-background min-h-screen flex flex-col selection:bg-primary selection:text-on-primary overflow-x-hidden w-full max-w-full`}>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
