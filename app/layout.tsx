import "./globals.css";

export const metadata = {
  title: "ElectionPath AI",
  description: "A smart civic assistant for Indian elections",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
