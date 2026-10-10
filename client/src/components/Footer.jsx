import { Link, NavLink } from 'react-router-dom';

const CRAFT_LINKS = [
  { label: 'Basketry', to: '/shop?category=Basketry' },
  { label: 'Pottery', to: '/shop?category=Pottery' },
  { label: 'Textiles', to: '/shop?category=Textiles' },
  { label: 'Jewellery', to: '/shop?category=Jewellery' },
  { label: 'Woodwork', to: '/shop?category=Woodwork' },
  { label: 'Paintings', to: '/shop?category=Paintings' },
  { label: 'Home Decor', to: '/shop?category=Home Decor' },
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--indigo)',
      color: 'rgba(255,255,255,0.75)',
      marginTop: 80,
    }}>
      {/* ── Top strip ─────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '40px 24px',
        maxWidth: 1160,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 40,
      }}>
        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'inline-block' }}>
            <img
              src="/logo.jpg"
              alt="Kaivinai"
              style={{
                height: 40,
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.92,
              }}
            />
          </Link>

          <p style={{ fontSize: '0.88rem', lineHeight: 1.65, margin: '12px 0 0', maxWidth: 26 + 'ch' }}>
            Connecting village and community artisans with customers across India.
            Every purchase supports a maker directly.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[
              { icon: '🏆', text: 'Maker-first' },
              { icon: '🌿', text: 'Sustainable' },
              { icon: '🔒', text: 'Secure' },
            ].map((b) => (
              <div key={b.text} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                color: 'rgba(255,255,255,0.85)',
              }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Shop by craft */}
        <div>
          <h4 style={{ color: '#fff', margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Shop by craft
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CRAFT_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} style={{
                  color: 'rgba(255,255,255,0.68)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.18s',
                }}
                  onMouseEnter={(e) => e.target.style.color = '#fff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.68)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Artisans */}
        <div>
          <h4 style={{ color: '#fff', margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Artisans
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Meet the makers', to: '/artisans' },
              { label: 'Sell your craft', to: '/register' },
              { label: 'Artisan dashboard', to: '/artisan' },
              { label: 'AI-powered listings', to: '/register' },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} style={{
                  color: 'rgba(255,255,255,0.68)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.18s',
                }}
                  onMouseEnter={(e) => e.target.style.color = '#fff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.68)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter signup */}
        <div>
          <h4 style={{ color: '#fff', margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Stay in the loop
          </h4>
          <p style={{ fontSize: '0.88rem', margin: '0 0 14px', lineHeight: 1.55 }}>
            Get notified when new artisans join and new collections drop.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                minWidth: 160,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#fff',
                fontSize: '0.88rem',
              }}
            />
            <button style={{
              background: 'linear-gradient(135deg, #d97706, #fbbf24)',
              color: '#1b1e2e',
              border: 'none',
              borderRadius: 8,
              padding: '9px 16px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
          © 2024 Kaivinai. Built with ❤️ to support Indian artisans.
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color 0.18s',
            }}
              onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.45)'}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
