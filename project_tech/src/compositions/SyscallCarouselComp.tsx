import React from "react";
import { useCurrentFrame } from "remotion";
import { CarouselSlideLayout } from "../components/CarouselSlideLayout";
import { AdaMascot } from "../components/AdaMascot";

export const SyscallCarouselComp: React.FC = () => {
  const frame = useCurrentFrame();
  const slideIndex = frame; // 0 to 5 for 6 slides

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 1: COVER (DARK MATTE AESTHETIC)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 0) {
    return (
      <CarouselSlideLayout
        slideNumber={1}
        totalSlides={6}
        categoryTag="programming basics:"
        title="WHAT IS SYSCALL?"
        mascotPose="neutral"
        mascotScale={2.3}
        showNemiShoulder={true}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 2: THE DILEMMA (WARM CREAM AESTHETIC)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 1) {
    return (
      <CarouselSlideLayout
        slideNumber={2}
        totalSlides={6}
        topText="Your program has no access to hardware resources. For example, it cannot read a file, send a network request, or even print a message on the screen."
        bottomText='You might think "that can&apos;t be right." You&apos;ve written code that has done these things before.'
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "10px 0" }}>
          {/* Box Diagram: hello.c */}
          <div
            style={{
              width: 240,
              padding: "24px 20px",
              backgroundColor: "#FFFFFF",
              border: "3.5px solid #1E293B",
              borderRadius: 16,
              textAlign: "center",
              fontSize: 30,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              color: "#0F172A",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          >
            hello.c
          </div>

          {/* Branched Arrows with Red Crosses */}
          <svg width="480" height="120" viewBox="0 0 480 120" style={{ overflow: "visible" }}>
            {/* Left Branch to Keyboard */}
            <path d="M 200 10 L 120 95" stroke="#1E293B" strokeWidth="3.5" fill="none" />
            <polygon points="115,95 125,85 130,98" fill="#1E293B" />
            {/* Red Cross Left */}
            <path d="M 146 45 L 174 68" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            <path d="M 174 45 L 146 68" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />

            {/* Right Branch to Monitor */}
            <path d="M 280 10 L 360 95" stroke="#1E293B" strokeWidth="3.5" fill="none" />
            <polygon points="365,95 350,98 355,85" fill="#1E293B" />
            {/* Red Cross Right */}
            <path d="M 306 45 L 334 68" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            <path d="M 334 45 L 306 68" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
          </svg>

          {/* Hardware Icons Row */}
          <div style={{ display: "flex", gap: 120, justifyContent: "center", alignItems: "center", marginTop: 8 }}>
            {/* Keyboard Item */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 170,
                  height: 95,
                  backgroundColor: "#FFFFFF",
                  border: "3px solid #1E293B",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                ⌨️
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#64748B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Keyboard</span>
            </div>

            {/* Monitor Item */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 170,
                  height: 95,
                  backgroundColor: "#FFFFFF",
                  border: "3px solid #1E293B",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              >
                🖥️
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#64748B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Screen / File</span>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 3: THE 2 OS MODES (WARM CREAM AESTHETIC)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 2) {
    return (
      <CarouselSlideLayout
        slideNumber={3}
        totalSlides={6}
        topText={
          <>
            That&apos;s because your programming language is using <b>system calls (syscall)</b> under the hood.
            <br /><br />
            The operating system (OS) has two modes:
          </>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            width: "100%",
            maxWidth: 820,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            padding: "20px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              fontSize: 34,
              fontWeight: 600,
              color: "#2D3748",
              lineHeight: 1.45,
            }}
          >
            <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 36 }}>1.</span>
            <div>
              <span style={{ fontWeight: 800, color: "#0F172A" }}>user mode:</span> no access to the hardware
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              fontSize: 34,
              fontWeight: 600,
              color: "#2D3748",
              lineHeight: 1.45,
            }}
          >
            <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 36 }}>2.</span>
            <div>
              <span style={{ fontWeight: 800, color: "#0F172A" }}>kernel mode:</span> access to everything
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 4: SIDE-BY-SIDE MASCOT COMPARISON
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 3) {
    return (
      <CarouselSlideLayout
        slideNumber={4}
        totalSlides={6}
        bottomText={
          <>
            Your program runs in <b>user mode</b>.
            <br /><br />
            When we need to access the hardware, we switch to <b>kernel mode</b> by using a system call and ask the OS to perform the actions on our behalf.
          </>
        }
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 880,
            justifyContent: "space-between",
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {/* Left Column: User Mode */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 25px",
            }}
          >
            <div
              className="manga-header"
              style={{ fontSize: 40, fontWeight: 800, color: "#1E293B", marginBottom: 14 }}
            >
              user mode
            </div>

            {/* Mascot Box */}
            <div
              style={{
                width: 220,
                height: 220,
                backgroundColor: "#FFFFFF",
                border: "3px solid #1E293B",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              <AdaMascot pose="thinking" scale={0.72} showNemiShoulder={false} />
            </div>

            {/* Bullet Points */}
            <div
              className="manga-header"
              style={{
                fontSize: 27,
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              <div>• low privilege</div>
              <div>• restricted sandbox</div>
              <div>• zero direct hardware</div>
            </div>
          </div>

          {/* Center Vertical Divider */}
          <div
            style={{
              width: 3.5,
              backgroundColor: "#1E293B",
              borderRadius: 2,
              margin: "10px 0",
            }}
          />

          {/* Right Column: Kernel Mode */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0 25px",
            }}
          >
            <div
              className="manga-header"
              style={{ fontSize: 40, fontWeight: 800, color: "#1E293B", marginBottom: 14 }}
            >
              kernel mode
            </div>

            {/* Mascot Box */}
            <div
              style={{
                width: 220,
                height: 220,
                backgroundColor: "#FFFFFF",
                border: "3px solid #1E293B",
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                marginBottom: 16,
                overflow: "hidden",
              }}
            >
              <AdaMascot pose="smug" scale={0.72} showNemiShoulder={true} />
            </div>

            {/* Bullet Points */}
            <div
              className="manga-header"
              style={{
                fontSize: 27,
                fontWeight: 700,
                color: "#1E293B",
                lineHeight: 1.5,
                textAlign: "left",
                width: "100%",
              }}
            >
              <div>• high privilege</div>
              <div>• complete power</div>
              <div>• full access to everything</div>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 5: THE 4-STEP SYSCALL SEQUENCE
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 4) {
    return (
      <CarouselSlideLayout
        slideNumber={5}
        totalSlides={6}
        topText="How a simple printf() or send() request happens:"
        bottomText="This boundary prevents a crashing application from taking down your whole machine."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 820,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {[
            { step: "1", title: "User Code executes printf('hello')", desc: "Runs in safe User Mode" },
            { step: "2", title: "Syscall Trap (write() syscall triggered)", desc: "Switches CPU execution mode safely" },
            { step: "3", title: "Kernel writes to display device driver", desc: "Runs in privileged Kernel Mode" },
            { step: "4", title: "CPU switches back to User Mode", desc: "Your code resumes execution" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                backgroundColor: "#FFFFFF",
                border: "3px solid #1E293B",
                borderRadius: 16,
                padding: "16px 24px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#0F172A",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                {item.step}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>{item.title}</div>
                <div style={{ fontSize: 18, color: "#64748B", fontWeight: 600, marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 6: SUMMARY & CTA
  // ═══════════════════════════════════════════════════════════════
  return (
    <CarouselSlideLayout
      slideNumber={6}
      totalSlides={6}
      topText="Summary:"
      bottomText="Save this for your next OS or backend interview! 📌 Follow @nemi.explains"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          width: "100%",
          maxWidth: 820,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "3px solid #1E293B",
            borderRadius: 20,
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 700, color: "#1E293B" }}>
            <span style={{ fontSize: 32 }}>🏖️</span>
            <div><b>User Mode:</b> Restricted Sandbox (Where apps live)</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 700, color: "#1E293B" }}>
            <span style={{ fontSize: 32 }}>⚡</span>
            <div><b>Kernel Mode:</b> Full Hardware Access (Where OS rules)</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontWeight: 700, color: "#1E293B" }}>
            <span style={{ fontSize: 32 }}>🚪</span>
            <div><b>Syscall:</b> The Safe Mode Switch Doorway</div>
          </div>
        </div>

        <AdaMascot pose="aha" scale={0.9} showNemiShoulder={true} />
      </div>
    </CarouselSlideLayout>
  );
};
