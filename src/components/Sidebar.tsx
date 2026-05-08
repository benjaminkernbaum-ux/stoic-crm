"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, Kanban, Mail, BarChart3,
  Settings, ChevronLeft, ChevronRight, Search,
  Zap, Bell, HelpCircle, LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/", badge: null },
  { icon: Bot, label: "Agents", href: "/agents", badge: "8/12" },
  { icon: Kanban, label: "Pipeline", href: "/pipeline", badge: "47" },
  { icon: Mail, label: "Campaigns", href: "/campaigns", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
];

const BOTTOM_ITEMS = [
  { icon: HelpCircle, label: "Help & Docs", href: "/docs" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border-subtle)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 40,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? "20px 12px" : "20px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid var(--border-subtle)",
        minHeight: 64,
      }}>
        <div style={{
          width: 32, height: 32,
          background: "linear-gradient(135deg, var(--purple-500), var(--purple-700))",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 20px var(--purple-glow)",
        }}>
          <Zap size={18} color="white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)" }}
            >
              STOIC
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.href;
          return (
            <button
              key={item.href}
              onClick={() => onTabChange(item.href)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "10px 12px" : "10px 12px",
                borderRadius: "var(--radius-md)",
                border: "none", cursor: "pointer", width: "100%",
                background: isActive ? "var(--bg-active)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: "all 0.15s ease",
                position: "relative",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 3, height: 20, borderRadius: 2,
                    background: "var(--purple-500)",
                    boxShadow: "0 0 8px var(--purple-glow-strong)",
                  }}
                />
              )}
              <item.icon size={18} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ flex: 1, textAlign: "left" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  padding: "2px 6px", borderRadius: "var(--radius-full)",
                  background: isActive ? "var(--purple-500)" : "var(--bg-hover)",
                  color: isActive ? "white" : "var(--text-tertiary)",
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px 8px", borderTop: "1px solid var(--border-subtle)" }}>
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => onTabChange(item.href)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 12px", borderRadius: "var(--radius-md)",
              border: "none", cursor: "pointer", width: "100%",
              background: "transparent", color: "var(--text-tertiary)",
              fontSize: 13, fontWeight: 400, transition: "all 0.15s",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
          >
            <item.icon size={16} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {/* User */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 12px", marginTop: 8,
          borderRadius: "var(--radius-md)",
          background: "var(--bg-hover)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0,
          }}>
            RK
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>Rodrigo K.</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green-500)", display: "inline-block" }} />
                Online
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute", top: 76, right: -12,
          width: 24, height: 24, borderRadius: "50%",
          background: "var(--bg-surface)", border: "1px solid var(--border-default)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--text-tertiary)", zIndex: 50,
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
