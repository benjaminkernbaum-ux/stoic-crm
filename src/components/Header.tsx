"use client";
import { Search, Bell, Command, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header style={{
      height: 56,
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      flexShrink: 0,
      zIndex: 30,
    }}>
      {/* Left: Title */}
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1 }}>{subtitle}</p>
        )}
      </div>

      {/* Center: Search */}
      <button
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px", borderRadius: "var(--radius-full)",
          background: "var(--bg-surface)", border: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)", fontSize: 13,
          cursor: "pointer", minWidth: 260, transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-active)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-tertiary)"; }}
      >
        <Search size={14} />
        <span style={{ flex: 1, textAlign: "left" }}>Search agents, leads, commands...</span>
        <kbd style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "2px 5px", borderRadius: 4,
          background: "var(--bg-hover)", fontSize: 10,
          fontFamily: "var(--font-mono)", color: "var(--text-muted)",
          border: "1px solid var(--border-subtle)",
        }}>
          <Command size={10} /> K
        </kbd>
      </button>

      {/* Right: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notifications */}
        <button style={{
          position: "relative", width: 36, height: 36, borderRadius: "var(--radius-md)",
          background: "transparent", border: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-secondary)", transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <Bell size={16} />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--red-500)",
            border: "2px solid var(--bg-primary)",
          }} />
        </button>

        {/* Deploy Agent */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--purple-600), var(--purple-500))",
          border: "none", cursor: "pointer",
          color: "white", fontSize: 13, fontWeight: 600,
          boxShadow: "0 0 20px var(--purple-glow), 0 2px 8px rgba(0,0,0,0.3)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 30px var(--purple-glow-strong), 0 4px 12px rgba(0,0,0,0.4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px var(--purple-glow), 0 2px 8px rgba(0,0,0,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <Plus size={14} />
          Deploy Agent
        </button>
      </div>
    </header>
  );
}
