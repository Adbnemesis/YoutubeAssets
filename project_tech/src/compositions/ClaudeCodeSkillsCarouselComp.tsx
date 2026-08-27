import React from "react";
import { useCurrentFrame } from "remotion";
import { CarouselSlideLayout } from "../components/CarouselSlideLayout";
import { AdaMascot } from "../components/AdaMascot";

export const ClaudeCodeSkillsCarouselComp: React.FC = () => {
  const frame = useCurrentFrame();
  const slideIndex = frame; // 0 to 6 for 7 slides

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 1: COVER (DARK MATTE AESTHETIC)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 0) {
    return (
      <CarouselSlideLayout
        slideNumber={1}
        totalSlides={7}
        categoryTag="ai developer tools:"
        title="TOP 5 CLAUDE CODE SKILLS"
        mascotPose="explaining"
        mascotScale={2.3}
        showNemiShoulder={true}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 2: WHAT IS A SKILL.md FILE?
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 1) {
    return (
      <CarouselSlideLayout
        slideNumber={2}
        totalSlides={7}
        topText={
          <div>
            <div className="manga-header" style={{ fontSize: 42, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              What is a SKILL.md File?
            </div>
            Unlike standard one-off chat prompts, a <b>Skill</b> is a version-controlled folder containing a <code>SKILL.md</code> playbook that teaches Claude specialized workflows.
          </div>
        }
        bottomText="Zero token waste! Claude loads the full instructions only when your prompt specifically needs them."
      >
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 840, gap: 14 }}>
          {/* Progressive Disclosure Diagram */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, backgroundColor: "#E0F2FE", padding: "6px 12px", borderRadius: 10, border: "2px solid #0284C7" }}>
                1. YAML Header
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#334155" }}>
                Skill name & trigger description (Ultra-lightweight)
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, backgroundColor: "#FEF3C7", padding: "6px 12px", borderRadius: 10, border: "2px solid #D97706" }}>
                2. Markdown Body
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#334155" }}>
                Step-by-step Standard Operating Procedure (SOP)
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, backgroundColor: "#DCFCE7", padding: "6px 12px", borderRadius: 10, border: "2px solid #16A34A" }}>
                3. /scripts & Tools
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#334155" }}>
                Reusable helper scripts & execution utilities
              </span>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 3: SKILL #1 — CODE REVIEWER & SECURITY AUDIT
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 2) {
    return (
      <CarouselSlideLayout
        slideNumber={3}
        totalSlides={7}
        topText={
          <div>
            <div className="manga-header" style={{ fontSize: 42, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              1. Code Reviewer & PR Gatekeeper
            </div>
            A specialized skill that audits your diffs, detects security vulnerabilities, and simplifies complex logic before you merge.
          </div>
        }
        bottomText="Ensures every Pull Request meets your team's strict engineering quality bar automatically."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            maxWidth: 840,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>🛡️</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>Security Scan:</b> Catches hardcoded API keys & memory leaks
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>⚡</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>Complexity Check:</b> Flags nested loops & anti-patterns
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>📝</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>PR Changelog:</b> Generates concise GitHub summary notes
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 4: SKILL #2 — BROWSER AUTOMATION & E2E TESTING
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 3) {
    return (
      <CarouselSlideLayout
        slideNumber={4}
        totalSlides={7}
        topText={
          <div>
            <div className="manga-header" style={{ fontSize: 42, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              2. Browser Testing (browser-act)
            </div>
            Gives Claude the power to launch a real browser, click elements, fill forms, and visually verify UI rendering in live web apps.
          </div>
        }
        bottomText="Catches layout glitches, responsive design bugs, and broken user journeys in seconds."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            maxWidth: 840,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* 4-Step Browser Action Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              width: "100%",
              maxWidth: 840,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 32 }}>🌐</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>1. Open URL</div>
                <div style={{ fontSize: 16, color: "#64748B" }}>Headless chromium</div>
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 32 }}>🖱️</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>2. Click & Fill</div>
                <div style={{ fontSize: 16, color: "#64748B" }}>Autonomous user flow</div>
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 32 }}>📸</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1E293B" }}>3. Visual Snapshot</div>
                <div style={{ fontSize: 16, color: "#64748B" }}>Captures render screenshot</div>
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", border: "3px solid #1E293B", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 32 }}>✅</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>4. Verify Layout</div>
                <div style={{ fontSize: 16, color: "#64748B" }}>Validates DOM & CSS</div>
              </div>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 5: SKILL #3 — FRONTEND DESIGN SYSTEM BUILDER
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 4) {
    return (
      <CarouselSlideLayout
        slideNumber={5}
        totalSlides={7}
        topText={
          <div>
            <div className="manga-header" style={{ fontSize: 42, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              3. Frontend Design & Styling Skill
            </div>
            Enforces strict design tokens, accessible markup, fluid typography, and premium animations instead of ugly default HTML.
          </div>
        }
        bottomText="Transforms simple component prompts into stunning, production-ready interfaces."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: "100%",
            maxWidth: 840,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>🎨</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>Token System:</b> Curated HSL colors, dark mode, glassmorphism
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>♿</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>Accessibility (a11y):</b> Proper ARIA tags & keyboard focus
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 18,
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontSize: 28 }}>✨</span>
            <div style={{ fontSize: 21, fontWeight: 700, color: "#1E293B" }}>
              <b>Micro-Interactions:</b> Hover transitions & responsive layout
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 6: SKILL #4 — SELF-HEALING TEST-DEBUG LOOP
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 5) {
    return (
      <CarouselSlideLayout
        slideNumber={6}
        totalSlides={7}
        topText={
          <div>
            <div className="manga-header" style={{ fontSize: 42, fontWeight: 800, color: "#1E293B", marginBottom: 12 }}>
              4. Self-Healing Test-Debug Loop
            </div>
            A specialized skill that runs your test suite, parses stack traces, applies surgical diffs, and re-executes tests automatically.
          </div>
        }
        bottomText="Eliminates the tedious cycle of copying and pasting error logs from your terminal."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 840, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: "#FEF2F2", border: "3px solid #EF4444", padding: "14px 22px", borderRadius: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 26 }}>❌</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#991B1B" }}>1. Execute <code>npm test</code> → Catches 2 Failing Tests</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: "#FFFBEB", border: "3px solid #F59E0B", padding: "14px 22px", borderRadius: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 26 }}>⚡</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#92400E" }}>2. Reads Stack Trace & Applies Surgical Code Fix</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: "#F0FDF4", border: "3px solid #10B981", padding: "14px 22px", borderRadius: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 26 }}>✅</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#065F46" }}>3. Re-runs Tests → 100% Passed & Verified!</span>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 7: SKILL #5 & TEMPLATE CHEAT SHEET
  // ═══════════════════════════════════════════════════════════════
  return (
    <CarouselSlideLayout
      slideNumber={7}
      totalSlides={7}
      topText={
        <div>
          <div className="manga-header" style={{ fontSize: 38, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>
            5. DB & Infra Manager + Quick Template
          </div>
          Create your own custom <code>SKILL.md</code> in 30 seconds:
        </div>
      }
      bottomText="Save this cheat sheet to build your first Claude Skill! 📌 Follow @nemi.explains"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          width: "100%",
          maxWidth: 840,
        }}
      >
        {/* SKILL.md Code Snippet Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "3.5px solid #1E293B",
            borderRadius: 20,
            padding: "20px 24px",
            width: "100%",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 19,
            lineHeight: 1.55,
            color: "#1E293B",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ color: "#94A3B8" }}>---</div>
          <div><span style={{ color: "#0284C7", fontWeight: 800 }}>name:</span> db-migrator</div>
          <div><span style={{ color: "#0284C7", fontWeight: 800 }}>description:</span> Safely plans and applies DB schema migrations</div>
          <div style={{ color: "#94A3B8" }}>---</div>
          <div style={{ fontWeight: 800, color: "#059669", marginTop: 4 }}># Step-by-Step SOP:</div>
          <div>1. Inspect schema in <code>/prisma/schema.prisma</code></div>
          <div>2. Generate SQL diff & run safety checks</div>
          <div>3. Execute migration and verify integration tests</div>
        </div>

        <AdaMascot pose="aha" scale={0.85} showNemiShoulder={true} />
      </div>
    </CarouselSlideLayout>
  );
};
