"use client";
import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import {
  Search, Target, Mail, Zap, Shield, GripVertical,
  Building2, User, DollarSign, Clock, MoreHorizontal
} from "lucide-react";

interface Lead {
  id: string;
  company: string;
  contact: string;
  contactRole: string;
  value: number;
  confidence: number;
  agent: string;
  agentColor: string;
  tags: string[];
  updatedAgo: string;
}

interface Stage {
  id: string;
  label: string;
  color: string;
  leads: Lead[];
}

const INITIAL_STAGES: Stage[] = [
  {
    id: "new", label: "New Leads", color: "#22D3EE",
    leads: [
      { id: "l1", company: "TechVentures Inc.", contact: "Sarah Chen", contactRole: "VP Sales", value: 85000, confidence: 92, agent: "HUNTER", agentColor: "#22D3EE", tags: ["Enterprise", "Hot"], updatedAgo: "2h ago" },
      { id: "l2", company: "Nexus AI Labs", contact: "Marcus Lee", contactRole: "CTO", value: 62000, confidence: 78, agent: "SCRAPER", agentColor: "#14B8A6", tags: ["Startup", "AI"], updatedAgo: "5h ago" },
      { id: "l3", company: "Prism Analytics", contact: "Julia Ferreira", contactRole: "Head of Growth", value: 45000, confidence: 65, agent: "HUNTER", agentColor: "#22D3EE", tags: ["Mid-market"], updatedAgo: "1d ago" },
      { id: "l4", company: "OrbitalStack", contact: "Devon Patel", contactRole: "CEO", value: 120000, confidence: 55, agent: "SCRAPER", agentColor: "#14B8A6", tags: ["Enterprise"], updatedAgo: "2d ago" },
    ],
  },
  {
    id: "contacted", label: "Contacted", color: "#3B82F6",
    leads: [
      { id: "l5", company: "DataForge Systems", contact: "Alex Novak", contactRole: "VP Engineering", value: 95000, confidence: 72, agent: "NURTURE", agentColor: "#3B82F6", tags: ["Enterprise"], updatedAgo: "3h ago" },
      { id: "l6", company: "CloudPeak SaaS", contact: "Elena Rodriguez", contactRole: "Director Sales", value: 54000, confidence: 68, agent: "NURTURE", agentColor: "#3B82F6", tags: ["Mid-market", "SaaS"], updatedAgo: "8h ago" },
      { id: "l7", company: "Zenith Corp", contact: "Tomás Almeida", contactRole: "COO", value: 78000, confidence: 61, agent: "NURTURE", agentColor: "#3B82F6", tags: ["Enterprise"], updatedAgo: "1d ago" },
    ],
  },
  {
    id: "qualified", label: "Qualified", color: "#A855F7",
    leads: [
      { id: "l8", company: "Helios Trading", contact: "Ryan Kim", contactRole: "Head of Sales", value: 142000, confidence: 85, agent: "QUALIFIER", agentColor: "#A855F7", tags: ["Enterprise", "Hot"], updatedAgo: "1h ago" },
      { id: "l9", company: "Nova Dynamics", contact: "Isabelle Moreau", contactRole: "VP BD", value: 67000, confidence: 80, agent: "QUALIFIER", agentColor: "#A855F7", tags: ["Growth"], updatedAgo: "4h ago" },
    ],
  },
  {
    id: "proposal", label: "Proposal", color: "#F59E0B",
    leads: [
      { id: "l10", company: "Acme Corp", contact: "James Wilson", contactRole: "CRO", value: 125000, confidence: 89, agent: "CLOSER", agentColor: "#22C55E", tags: ["Enterprise", "Hot"], updatedAgo: "30m ago" },
      { id: "l11", company: "Vertex Solutions", contact: "Priya Sharma", contactRole: "VP Operations", value: 88000, confidence: 74, agent: "CLOSER", agentColor: "#22C55E", tags: ["Mid-market"], updatedAgo: "6h ago" },
    ],
  },
  {
    id: "won", label: "Won", color: "#22C55E",
    leads: [
      { id: "l12", company: "BlueStar Media", contact: "Liam O'Connor", contactRole: "CEO", value: 175000, confidence: 100, agent: "CLOSER", agentColor: "#22C55E", tags: ["Enterprise"], updatedAgo: "2d ago" },
      { id: "l13", company: "Apex Digital", contact: "Sofia Andersen", contactRole: "Director", value: 52000, confidence: 100, agent: "CLOSER", agentColor: "#22C55E", tags: ["SMB"], updatedAgo: "4d ago" },
    ],
  },
];

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  const barColor = value >= 80 ? "#22C55E" : value >= 60 ? "#F59E0B" : "#EF4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
      <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#1A1A1A", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${barColor}88, ${barColor})`, borderRadius: 2 }}
        />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: barColor, fontFamily: "'JetBrains Mono', monospace", minWidth: 28, textAlign: "right" }}>
        {value}%
      </span>
    </div>
  );
}

function LeadCard({ lead, stageColor }: { lead: Lead; stageColor: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
      style={{
        background: "#0D0D0D",
        border: "1px solid #1A1A1A",
        borderRadius: 10,
        padding: "14px",
        cursor: "grab",
        transition: "border-color 0.15s",
      }}
    >
      {/* Company + Actions */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#FAFAFA" }}>{lead.company}</div>
          <div style={{ fontSize: 11, color: "#71717A", marginTop: 2 }}>{lead.contact} · {lead.contactRole}</div>
        </div>
        <button style={{
          background: "none", border: "none", cursor: "pointer", color: "#3F3F46",
          padding: 2, borderRadius: 4,
        }}>
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Value */}
      <div style={{
        fontSize: 18, fontWeight: 800, color: stageColor,
        letterSpacing: "-0.5px", marginBottom: 8,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        ${lead.value.toLocaleString()}
      </div>

      {/* Confidence */}
      <ConfidenceBar value={lead.confidence} color={stageColor} />

      {/* Tags + Agent */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {lead.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
              background: tag === "Hot" ? "rgba(239,68,68,0.15)" : tag === "Enterprise" ? "rgba(147,51,234,0.15)" : "rgba(255,255,255,0.05)",
              color: tag === "Hot" ? "#F87171" : tag === "Enterprise" ? "#A855F7" : "#71717A",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 9, fontWeight: 600, color: lead.agentColor,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: lead.agentColor,
          }} />
          {lead.agent}
        </div>
      </div>

      {/* Updated */}
      <div style={{ fontSize: 9, color: "#3F3F46", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
        <Clock size={9} /> {lead.updatedAgo}
      </div>
    </motion.div>
  );
}

export default function PipelineView() {
  const [stages] = useState(INITIAL_STAGES);
  const totalValue = stages.flatMap(s => s.leads).reduce((sum, l) => sum + l.value, 0);
  const totalLeads = stages.flatMap(s => s.leads).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid var(--border-subtle)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* View toggles */}
          {["Kanban", "Table", "Timeline"].map((v, i) => (
            <button key={v} style={{
              fontSize: 12, fontWeight: i === 0 ? 600 : 400, padding: "6px 12px", borderRadius: 6,
              background: i === 0 ? "var(--bg-active)" : "transparent",
              border: "1px solid " + (i === 0 ? "var(--purple-500)" : "transparent"),
              color: i === 0 ? "var(--text-primary)" : "var(--text-tertiary)",
              cursor: "pointer",
            }}>
              {v}
            </button>
          ))}
          <span style={{ width: 1, height: 20, background: "var(--border-subtle)", margin: "0 4px" }} />
          {/* Filter pills */}
          {["All Agents", "Q2 2026", "High Priority"].map((f) => (
            <button key={f} style={{
              fontSize: 11, padding: "4px 10px", borderRadius: 20,
              background: "var(--bg-hover)", border: "1px solid var(--border-subtle)",
              color: "var(--text-tertiary)", cursor: "pointer",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Pipeline value */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Pipeline Value</span>
          <span style={{
            fontSize: 22, fontWeight: 800, color: "var(--purple-400)",
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px",
          }}>
            ${(totalValue / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{
        flex: 1, display: "flex", gap: 12, padding: "16px 24px",
        overflowX: "auto", overflowY: "hidden",
      }}>
        {stages.map((stage) => {
          const stageValue = stage.leads.reduce((s, l) => s + l.value, 0);
          return (
            <div key={stage.id} style={{
              flex: "1 1 0", minWidth: 280, maxWidth: 320,
              display: "flex", flexDirection: "column",
              background: "rgba(10,10,10,0.5)",
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
            }}>
              {/* Column Header */}
              <div style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border-subtle)",
                position: "relative",
              }}>
                {/* Colored top accent */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${stage.color}, ${stage.color}40)`,
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{stage.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 10,
                      background: `${stage.color}20`, color: stage.color,
                    }}>
                      {stage.leads.length}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                    ${(stageValue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div style={{
                flex: 1, padding: "8px 8px",
                display: "flex", flexDirection: "column", gap: 8,
                overflowY: "auto",
              }}>
                {stage.leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} stageColor={stage.color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div style={{
        height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 32,
        background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-subtle)",
        fontSize: 11, color: "var(--text-tertiary)", fontFamily: "'JetBrains Mono', monospace",
        flexShrink: 0,
      }}>
        <span>Weighted Pipeline: <span style={{ color: "#A855F7", fontWeight: 600 }}>$1.8M</span></span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>Win Rate: <span style={{ color: "#22C55E", fontWeight: 600 }}>34%</span></span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>Avg Deal: <span style={{ color: "#22D3EE", fontWeight: 600 }}>$89K</span></span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>Avg Cycle: <span style={{ color: "#F59E0B", fontWeight: 600 }}>23 days</span></span>
      </div>
    </motion.div>
  );
}
