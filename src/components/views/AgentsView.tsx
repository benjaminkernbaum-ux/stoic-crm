"use client";
import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import {
  Search, Target, Mail, Zap, Shield, TrendingUp, Link, Cpu,
  Brain, Eye, Sparkles, Radio
} from "lucide-react";

// ── Agent Node Data ──
interface AgentNodeData {
  label: string;
  role: string;
  status: "active" | "processing" | "idle" | "error";
  color: string;
  icon: string;
  leads: number;
  action: string;
  sparkline: number[];
  [key: string]: unknown;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Search, Target, Mail, Zap, Shield, TrendingUp, Link, Cpu, Brain, Eye, Sparkles, Radio,
};

const STATUS_COLORS: Record<string, string> = {
  active: "#22C55E",
  processing: "#F59E0B",
  idle: "#6B7280",
  error: "#EF4444",
};

// ── Custom Agent Node ──
function AgentNode({ data }: { data: AgentNodeData }) {
  const Icon = ICON_MAP[data.icon] || Brain;
  const statusColor = STATUS_COLORS[data.status];
  const isActive = data.status === "active" || data.status === "processing";

  return (
    <div style={{
      background: "#0D0D0D",
      border: `1px solid ${isActive ? data.color + "40" : "#222222"}`,
      borderRadius: 12,
      padding: "16px 20px",
      minWidth: 220,
      cursor: "grab",
      position: "relative",
      transition: "all 0.2s",
      boxShadow: isActive ? `0 0 24px ${data.color}10, 0 4px 16px rgba(0,0,0,0.4)` : "0 4px 16px rgba(0,0,0,0.3)",
    }}>
      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1,
        background: `linear-gradient(90deg, transparent, ${data.color}60, transparent)`,
        borderRadius: "0 0 4px 4px",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `${data.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${data.color}25`,
        }}>
          <Icon size={18} color={data.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FAFAFA", letterSpacing: "-0.2px" }}>
            {data.label}
          </div>
          <div style={{ fontSize: 10, color: "#52525B" }}>{data.role}</div>
        </div>
        {/* Status dot */}
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: statusColor,
          boxShadow: isActive ? `0 0 12px ${statusColor}` : "none",
        }} />
      </div>

      {/* Action text */}
      <div style={{
        fontSize: 10, color: "#71717A",
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1.4,
        marginBottom: 10,
        padding: "6px 8px",
        background: "#0A0A0A",
        borderRadius: 6,
        border: "1px solid #1A1A1A",
      }}>
        {data.action}
      </div>

      {/* Footer: leads + sparkline */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {data.leads > 0 ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: data.color }}>{data.leads}</span>
            <span style={{ fontSize: 9, color: "#52525B" }}>leads</span>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: "#3F3F46", fontStyle: "italic" }}>Monitor mode</span>
        )}

        {/* Mini sparkline */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 20 }}>
          {data.sparkline.map((v, i) => {
            const max = Math.max(...data.sparkline);
            const min = Math.min(...data.sparkline);
            const range = max - min || 1;
            const h = ((v - min) / range) * 100;
            return (
              <div key={i} style={{
                width: 3, borderRadius: 1,
                height: `${Math.max(h, 8)}%`,
                background: `${data.color}${i === data.sparkline.length - 1 ? "CC" : "40"}`,
              }} />
            );
          })}
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} style={{
        width: 8, height: 8, background: data.color, border: "2px solid #0D0D0D",
      }} />
      <Handle type="source" position={Position.Right} style={{
        width: 8, height: 8, background: data.color, border: "2px solid #0D0D0D",
      }} />
    </div>
  );
}

const nodeTypes = { agentNode: AgentNode };

// ── Initial Nodes ──
const initialNodes: Node<AgentNodeData>[] = [
  {
    id: "scraper", type: "agentNode", position: { x: 50, y: 50 },
    data: { label: "SCRAPER", role: "Data Mining", status: "active", color: "#14B8A6", icon: "Cpu", leads: 1247, action: "Mining 3 sources in parallel...", sparkline: [12,18,15,22,28,35,31,40,38,45] },
  },
  {
    id: "hunter", type: "agentNode", position: { x: 350, y: 0 },
    data: { label: "HUNTER", role: "Lead Discovery", status: "active", color: "#22D3EE", icon: "Search", leads: 847, action: "Scanning LinkedIn Sales Nav...", sparkline: [8,12,15,18,22,25,20,28,32,35] },
  },
  {
    id: "qualifier", type: "agentNode", position: { x: 650, y: 50 },
    data: { label: "QUALIFIER", role: "Lead Scoring", status: "active", color: "#A855F7", icon: "Target", leads: 623, action: "Scoring 12 new leads from HUNTER", sparkline: [5,8,10,12,15,18,14,20,22,25] },
  },
  {
    id: "nurture", type: "agentNode", position: { x: 950, y: 0 },
    data: { label: "NURTURE", role: "Email Sequences", status: "active", color: "#3B82F6", icon: "Mail", leads: 412, action: "Drip sequence #3 → 47 contacts", sparkline: [3,5,8,6,10,12,9,14,16,18] },
  },
  {
    id: "closer", type: "agentNode", position: { x: 1250, y: 50 },
    data: { label: "CLOSER", role: "Deal Closing", status: "processing", color: "#22C55E", icon: "Zap", leads: 89, action: "Analyzing Acme Corp → 78% win", sparkline: [1,2,3,2,4,5,3,6,7,8] },
  },
  {
    id: "sentinel", type: "agentNode", position: { x: 500, y: 300 },
    data: { label: "SENTINEL", role: "Risk Monitor", status: "active", color: "#F59E0B", icon: "Shield", leads: 234, action: "Monitoring pipeline anomalies", sparkline: [20,22,18,25,23,27,24,28,26,30] },
  },
  {
    id: "forecast", type: "agentNode", position: { x: 850, y: 300 },
    data: { label: "FORECAST", role: "Revenue AI", status: "active", color: "#EC4899", icon: "TrendingUp", leads: 0, action: "Q3 projection: $185K (+18%)", sparkline: [40,45,48,52,55,58,60,63,67,72] },
  },
  {
    id: "integrator", type: "agentNode", position: { x: 1150, y: 300 },
    data: { label: "INTEGRATOR", role: "CRM Sync", status: "idle", color: "#6B7280", icon: "Link", leads: 0, action: "Standby — awaiting sync trigger", sparkline: [1,1,1,0,1,1,0,1,1,0] },
  },
];

// ── Initial Edges ──
const initialEdges: Edge[] = [
  { id: "e-scraper-hunter", source: "scraper", target: "hunter", animated: true, style: { stroke: "#14B8A6", strokeWidth: 2 } },
  { id: "e-hunter-qualifier", source: "hunter", target: "qualifier", animated: true, style: { stroke: "#22D3EE", strokeWidth: 2 } },
  { id: "e-qualifier-nurture", source: "qualifier", target: "nurture", animated: true, style: { stroke: "#A855F7", strokeWidth: 2 } },
  { id: "e-nurture-closer", source: "nurture", target: "closer", animated: true, style: { stroke: "#3B82F6", strokeWidth: 2 } },
  { id: "e-qualifier-sentinel", source: "qualifier", target: "sentinel", animated: true, style: { stroke: "#A855F7", strokeWidth: 1.5, strokeDasharray: "6,4" } },
  { id: "e-nurture-sentinel", source: "nurture", target: "sentinel", animated: true, style: { stroke: "#3B82F6", strokeWidth: 1.5, strokeDasharray: "6,4" } },
  { id: "e-closer-forecast", source: "closer", target: "forecast", animated: true, style: { stroke: "#22C55E", strokeWidth: 1.5, strokeDasharray: "6,4" } },
  { id: "e-sentinel-forecast", source: "sentinel", target: "forecast", animated: true, style: { stroke: "#F59E0B", strokeWidth: 1.5 } },
  { id: "e-closer-integrator", source: "closer", target: "integrator", style: { stroke: "#6B7280", strokeWidth: 1, strokeDasharray: "4,4" } },
];

export default function AgentsView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#9333EA", strokeWidth: 2 } }, eds));
  }, [setEdges]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ height: "100%", position: "relative" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        style={{ background: "transparent" }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.04)" />
        <Controls
          showInteractive={false}
          style={{
            background: "#111111",
            border: "1px solid #222222",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as AgentNodeData;
            return data?.color || "#6B7280";
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{
            background: "#0A0A0A",
            border: "1px solid #222222",
            borderRadius: 8,
          }}
        />
      </ReactFlow>

      {/* Bottom Status Bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 32,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-subtle)",
        fontSize: 11, color: "var(--text-tertiary)",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span>
          <span style={{ color: "#22C55E", fontWeight: 600 }}>7</span>/8 Agents Active
        </span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>
          <span style={{ color: "#22D3EE", fontWeight: 600 }}>2,847</span> leads in pipeline
        </span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>
          Processing <span style={{ color: "#A855F7", fontWeight: 600 }}>34</span> leads/min
        </span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span>
          Last sync: <span style={{ color: "#22C55E" }}>2s ago</span>
        </span>
      </div>
    </motion.div>
  );
}
