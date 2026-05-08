"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardView from "@/components/views/DashboardView";
import AgentsView from "@/components/views/AgentsView";
import PipelineView from "@/components/views/PipelineView";
import AnalyticsView from "@/components/views/AnalyticsView";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Command Center", subtitle: "All systems operational" },
  "/agents": { title: "Agent Orchestrator", subtitle: "Canvas View — 8 of 12 agents active" },
  "/pipeline": { title: "Sales Pipeline", subtitle: "68 leads · $2.4M total value" },
  "/campaigns": { title: "Campaigns", subtitle: "Coming soon" },
  "/analytics": { title: "Revenue Intelligence", subtitle: "AI-powered forecasting & performance analytics" },
  "/settings": { title: "Settings", subtitle: "Account & preferences" },
  "/docs": { title: "Documentation", subtitle: "Help & resources" },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("/");
  const pageInfo = TITLES[activeTab] || TITLES["/"];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "var(--bg-primary)",
      overflow: "hidden",
    }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />

        <main style={{
          flex: 1, overflow: "hidden", position: "relative",
        }}>
          {/* Subtle dot grid background */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "24px 24px",
            pointerEvents: "none", zIndex: 0,
          }} />

          <div style={{ position: "relative", zIndex: 1, height: "100%", overflow: "auto" }}>
            {activeTab === "/" && <DashboardView />}
            {activeTab === "/agents" && <AgentsView />}
            {activeTab === "/pipeline" && <PipelineView />}
            {activeTab === "/analytics" && <AnalyticsView />}
            {activeTab !== "/" && activeTab !== "/agents" && activeTab !== "/pipeline" && activeTab !== "/analytics" && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "100%", color: "var(--text-muted)", fontSize: 14,
              }}>
                Coming soon...
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
