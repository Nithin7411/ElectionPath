"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ userState }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/assistant", label: "Assistant" }
  ];

  return (
    <header className="header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          ElectionPath AI
        </Link>
        {userState && (
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }} className="text-muted">
            📍 {userState}
          </div>
        )}
      </div>
      
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} 
                style={{ 
                  color: pathname === link.href ? 'white' : 'var(--text-muted)',
                  fontWeight: pathname === link.href ? '600' : '400',
                  borderBottom: pathname === link.href ? '2px solid var(--primary)' : 'none',
                  paddingBottom: '0.25rem',
                  transition: 'all 0.2s'
                }}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
