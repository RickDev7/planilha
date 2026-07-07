import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "KILE Serviceblatt",
  description:
    "Digitales Serviceblatt der KILE Gebäudereinigung — ausfüllen und als druckfertiges A4-PDF erstellen.",
  applicationName: "KILE Serviceblatt",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KILE Serviceblatt",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180" }],
  },
  // Impede a tradução automática do navegador (evita erro de hidratação).
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" translate="no" suppressHydrationWarning>
      <body className="antialiased notranslate" suppressHydrationWarning>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
