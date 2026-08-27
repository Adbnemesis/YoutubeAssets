import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CarouselSlideLayout } from "../components/CarouselSlideLayout";

export const BinarySearchCarouselComp: React.FC = () => {
  const frame = useCurrentFrame();

  // In our carousel composition, frame index = slide index (0 to 5 for 6 slides)
  const slideIndex = frame; // 0, 1, 2, 3, 4, 5

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 1: HOOK COVER
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 0) {
    return (
      <CarouselSlideLayout
        slideNumber={1}
        totalSlides={6}
        category="DSA & ALGORITHMS"
        categoryColor="#06B6D4"
        title={
          <>
            Guess 1 to 1 Billion in <span style={{ color: "#06B6D4" }}>Just 30 Steps!</span> 🤯⚡
          </>
        }
        subtitle="How Binary Search turns impossible search scales into instant O(log N) speed."
        mascotType="ada"
        adaPose="shocked"
        mascotSpeech="Wait... 1 Billion in 30 guesses?!"
        mascotPosition="bottom-right"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, width: "100%" }}>
          {/* Big Visual Comparison Cards */}
          <div style={{ display: "flex", gap: 24, width: "100%", justifyContent: "center" }}>
            {/* Card 1: Linear Search */}
            <div
              style={{
                flex: 1,
                maxWidth: 420,
                backgroundColor: "rgba(30, 41, 59, 0.6)",
                border: "2px solid rgba(239, 68, 68, 0.4)",
                borderRadius: 24,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, color: "#EF4444", textTransform: "uppercase" }}>
                Linear Search O(N)
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#FCA5A5", fontFamily: "monospace" }}>
                1,000,000,000
              </div>
              <div style={{ fontSize: 14, color: "#94A3B8", textAlign: "center" }}>
                Checking one by one takes up to <b>31 years</b> at 1 guess/sec! 🐢
              </div>
            </div>

            {/* Card 2: Binary Search */}
            <div
              style={{
                flex: 1,
                maxWidth: 420,
                backgroundColor: "rgba(6, 182, 212, 0.15)",
                border: "2.5px solid #06B6D4",
                borderRadius: 24,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 0 35px rgba(6, 182, 212, 0.3)",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, color: "#06B6D4", textTransform: "uppercase" }}>
                Binary Search O(log N)
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#10B981", fontFamily: "monospace" }}>
                30 GUESSES
              </div>
              <div style={{ fontSize: 14, color: "#A7F3D0", textAlign: "center" }}>
                Halving the search space finds the item in <b>0.00003 seconds</b>! ⚡
              </div>
            </div>
          </div>

          {/* Golden Rule Badge */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(255, 209, 102, 0.5)",
              borderRadius: 20,
              padding: "12px 28px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>🔑</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#FFD166" }}>
              The One Requirement: The array MUST be <u>SORTED</u>.
            </span>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 2: THE INTUITION (WHY IT WORKS)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 1) {
    return (
      <CarouselSlideLayout
        slideNumber={2}
        totalSlides={6}
        category="DSA & ALGORITHMS"
        categoryColor="#06B6D4"
        title={
          <>
            The Secret: <span style={{ color: "#38BDF8" }}>Eliminate 50%</span> Every Single Step! ✂️
          </>
        }
        subtitle="You don't search items — you throw away half of everything you don't need."
        mascotType="ada"
        adaPose="explaining"
        mascotSpeech="Check the middle, throw away the rest!"
        mascotPosition="bottom-right"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 860 }}>
          {/* Step Progression Diagram */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              border: "2px solid rgba(56, 189, 248, 0.3)",
              borderRadius: 24,
              padding: "24px 30px",
              width: "100%",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, color: "#38BDF8", marginBottom: 16 }}>
              HOW THE SEARCH SPACE COLLAPSES:
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 12 }}>
                <span style={{ color: "#94A3B8" }}>Start:</span>
                <span style={{ color: "#F8FAFC", fontWeight: 900 }}>1,000,000,000 items</span>
                <span style={{ color: "#F43F5E" }}>[Step 0]</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 12 }}>
                <span style={{ color: "#94A3B8" }}>Guess 1:</span>
                <span style={{ color: "#38BDF8", fontWeight: 900 }}>500,000,000 items left (500M deleted!)</span>
                <span style={{ color: "#10B981" }}>[Cut 1/2]</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 12 }}>
                <span style={{ color: "#94A3B8" }}>Guess 2:</span>
                <span style={{ color: "#38BDF8", fontWeight: 900 }}>250,000,000 items left (750M deleted!)</span>
                <span style={{ color: "#10B981" }}>[Cut 1/4]</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 12 }}>
                <span style={{ color: "#94A3B8" }}>Guess 10:</span>
                <span style={{ color: "#FFD166", fontWeight: 900 }}>~976,562 items left</span>
                <span style={{ color: "#10B981" }}>[99.9% Gone]</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(16, 185, 129, 0.2)", border: "1.5px solid #10B981", padding: "10px 16px", borderRadius: 12 }}>
                <span style={{ color: "#A7F3D0" }}>Guess 30:</span>
                <span style={{ color: "#10B981", fontWeight: 900 }}>EXACT 1 ITEM FOUND! 🎯</span>
                <span style={{ color: "#FFD166" }}>[COMPLETE]</span>
              </div>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 3: THE 3 POINTERS (L, M, R)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 2) {
    return (
      <CarouselSlideLayout
        slideNumber={3}
        totalSlides={6}
        category="DSA & ALGORITHMS"
        categoryColor="#06B6D4"
        title={
          <>
            The 3 Pointer Formula: <span style={{ color: "#10B981" }}>L, Mid, R</span> 📐
          </>
        }
        subtitle="Every binary search is just 3 pointers dancing on a sorted array."
        mascotType="ada"
        adaPose="pointing"
        mascotSpeech="mid = L + (R - L) // 2"
        mascotPosition="bottom-right"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 860 }}>
          {/* Visual Array Cells */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", width: "100%" }}>
            {[
              { val: 12, idx: 0 },
              { val: 24, idx: 1 },
              { val: 35, idx: 2, ptr: "L", color: "#38BDF8" },
              { val: 48, idx: 3 },
              { val: 62, idx: 4, ptr: "MID", color: "#FFD166" },
              { val: 75, idx: 5 },
              { val: 89, idx: 6, ptr: "R", color: "#F43F5E" },
              { val: 99, idx: 7 },
            ].map((cell, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {/* Pointer Label */}
                <div
                  style={{
                    height: 24,
                    fontSize: 14,
                    fontWeight: 900,
                    color: cell.color || "transparent",
                    fontFamily: "monospace",
                  }}
                >
                  {cell.ptr || ""}
                </div>

                {/* Box */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 16,
                    backgroundColor: cell.ptr ? "rgba(15, 23, 42, 0.9)" : "rgba(30, 41, 59, 0.5)",
                    border: `2.5px solid ${cell.color || "rgba(255,255,255,0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 900,
                    color: cell.color || "#94A3B8",
                    fontFamily: "monospace",
                    boxShadow: cell.color ? `0 0 20px ${cell.color}40` : "none",
                  }}
                >
                  {cell.val}
                </div>

                {/* Index */}
                <div style={{ fontSize: 13, color: "#64748B", fontFamily: "monospace" }}>
                  [{cell.idx}]
                </div>
              </div>
            ))}
          </div>

          {/* 3 Decisions Card */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1.5px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              padding: "20px 28px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 900, color: "#F8FAFC" }}>3 POSSIBILITIES AT EVERY STEP:</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "#A7F3D0" }}>
              <span style={{ color: "#10B981", fontWeight: 900 }}>1.</span> If <code>arr[mid] === target</code> → Found target! Return <code>mid</code> 🎉
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "#BAE6FD" }}>
              <span style={{ color: "#38BDF8", fontWeight: 900 }}>2.</span> If <code>arr[mid] &lt; target</code> → Target is right → <code>L = mid + 1</code>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: "#FECDD3" }}>
              <span style={{ color: "#F43F5E", fontWeight: 900 }}>3.</span> If <code>arr[mid] &gt; target</code> → Target is left → <code>R = mid - 1</code>
            </div>
          </div>
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 4: STEP-BY-STEP TRACE (1 TO 100 IN 7 STEPS)
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 3) {
    return (
      <CarouselSlideLayout
        slideNumber={4}
        totalSlides={6}
        category="DSA & ALGORITHMS"
        categoryColor="#06B6D4"
        title={
          <>
            Real Example: Guessing <span style={{ color: "#FFD166" }}>73</span> in 1–100 🎯
          </>
        }
        subtitle="Watch how 73 is cornered in exactly 7 guesses."
        mascotType="ada"
        adaPose="thinking"
        mascotSpeech="7 guesses max for 1 to 100!"
        mascotPosition="bottom-right"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 840, fontFamily: "monospace" }}>
          {[
            { step: "G1", range: "1 – 100", mid: "50", verdict: "50 < 73 (Go Higher)", color: "#38BDF8" },
            { step: "G2", range: "51 – 100", mid: "75", verdict: "75 > 73 (Go Lower)", color: "#F43F5E" },
            { step: "G3", range: "51 – 74", mid: "62", verdict: "62 < 73 (Go Higher)", color: "#38BDF8" },
            { step: "G4", range: "63 – 74", mid: "68", verdict: "68 < 73 (Go Higher)", color: "#38BDF8" },
            { step: "G5", range: "69 – 74", mid: "71", verdict: "71 < 73 (Go Higher)", color: "#38BDF8" },
            { step: "G6", range: "72 – 74", mid: "73", verdict: "73 === 73 MATCH! 🎉", color: "#10B981" },
          ].map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: row.verdict.includes("MATCH") ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.8)",
                border: `1.5px solid ${row.color}50`,
                borderRadius: 14,
                padding: "12px 20px",
                fontSize: 16,
              }}
            >
              <span style={{ fontWeight: 900, color: "#FFD166", width: 50 }}>{row.step}</span>
              <span style={{ color: "#94A3B8", width: 140 }}>Range: {row.range}</span>
              <span style={{ color: "#F8FAFC", fontWeight: 800 }}>Mid = {row.mid}</span>
              <span style={{ color: row.color, fontWeight: 900 }}>{row.verdict}</span>
            </div>
          ))}
        </div>
      </CarouselSlideLayout>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SLIDE 5: THE CODE TEMPLATE
  // ═══════════════════════════════════════════════════════════════
  if (slideIndex === 4) {
    return (
      <CarouselSlideLayout
        slideNumber={5}
        totalSlides={6}
        category="DSA & ALGORITHMS"
        categoryColor="#06B6D4"
        title={
          <>
            The 5-Line <span style={{ color: "#10B981" }}>Python & JS Template</span> 💻
          </>
        }
        subtitle="Memorize this exact structure for LeetCode & placements."
        mascotType="ada"
        adaPose="coding"
        mascotSpeech="Prevent overflow with L + (R - L) // 2"
        mascotPosition="bottom-right"
      >
        <div
          style={{
            backgroundColor: "#0B1120",
            border: "2.5px solid #10B981",
            borderRadius: 24,
            padding: "24px 32px",
            width: "100%",
            maxWidth: 860,
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: "0 0 45px rgba(16, 185, 129, 0.3)",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span style={{ color: "#64748B", fontSize: 13, marginLeft: 8 }}>binary_search.py</span>
          </div>

          <div style={{ fontSize: 18, lineHeight: 1.6, color: "#F8FAFC" }}>
            <div><span style={{ color: "#F43F5E" }}>def</span> <span style={{ color: "#60A5FA" }}>binary_search</span>(arr, target):</div>
            <div style={{ paddingLeft: 24 }}>L, R = <span style={{ color: "#FBBF24" }}>0</span>, <span style={{ color: "#60A5FA" }}>len</span>(arr) - <span style={{ color: "#FBBF24" }}>1</span></div>
            <div style={{ paddingLeft: 24 }}><span style={{ color: "#F43F5E" }}>while</span> L &lt;= R:</div>
            <div style={{ paddingLeft: 48 }}>mid = L + (R - L) // <span style={{ color: "#FBBF24" }}>2</span></div>
            <div style={{ paddingLeft: 48 }}><span style={{ color: "#F43F5E" }}>if</span> arr[mid] == target: <span style={{ color: "#F43F5E" }}>return</span> mid</div>
            <div style={{ paddingLeft: 48 }}><span style={{ color: "#F43F5E" }}>elif</span> arr[mid] &lt; target: L = mid + <span style={{ color: "#FBBF24" }}>1</span></div>
            <div style={{ paddingLeft: 48 }}><span style={{ color: "#F43F5E" }}>else</span>: R = mid - <span style={{ color: "#FBBF24" }}>1</span></div>
            <div style={{ paddingLeft: 24 }}><span style={{ color: "#F43F5E" }}>return</span> -<span style={{ color: "#FBBF24" }}>1</span>  <span style={{ color: "#64748B" }}># Not found</span></div>
          </div>
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
      category="DSA & ALGORITHMS"
      categoryColor="#06B6D4"
      title={
        <>
          Save This Cheat Sheet <span style={{ color: "#10B981" }}>For Interviews!</span> 📌⚡
        </>
      }
      subtitle="Follow @nemi.explains for daily visual tech breakdowns."
      mascotType="duo"
      adaPose="smug"
      nemiPose="aha"
      mascotSpeech="Master DSA the visual way!"
      mascotPosition="center"
      footerCta="FOLLOW @NEMI.EXPLAINS 🚀"
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 860 }}>
        {/* Quick Summary Pill Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
          <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", border: "1.5px solid #06B6D4", borderRadius: 18, padding: "16px 20px" }}>
            <div style={{ color: "#06B6D4", fontWeight: 900, fontSize: 16 }}>⏱ TIME COMPLEXITY</div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24, fontFamily: "monospace" }}>O(log N)</div>
          </div>
          <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", border: "1.5px solid #10B981", borderRadius: 18, padding: "16px 20px" }}>
            <div style={{ color: "#10B981", fontWeight: 900, fontSize: 16 }}>💾 SPACE COMPLEXITY</div>
            <div style={{ color: "#F8FAFC", fontWeight: 900, fontSize: 24, fontFamily: "monospace" }}>O(1) Iterative</div>
          </div>
          <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", border: "1.5px solid #FFD166", borderRadius: 18, padding: "16px 20px" }}>
            <div style={{ color: "#FFD166", fontWeight: 900, fontSize: 16 }}>⚠️ COMMON BUG</div>
            <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15 }}>Integer overflow with (L+R)//2</div>
          </div>
          <div style={{ backgroundColor: "rgba(15, 23, 42, 0.85)", border: "1.5px solid #A855F7", borderRadius: 18, padding: "16px 20px" }}>
            <div style={{ color: "#A855F7", fontWeight: 900, fontSize: 16 }}>🔑 PREREQUISITE</div>
            <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 15 }}>Array MUST be sorted</div>
          </div>
        </div>

        {/* Call To Action Box */}
        <div
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "2.5px solid #10B981",
            borderRadius: 24,
            padding: "20px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 0 35px rgba(16, 185, 129, 0.3)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 900, color: "#A7F3D0" }}>
            Liked this visual breakdown?
          </div>
          <div style={{ fontSize: 16, color: "#94A3B8" }}>
            Save 📌 · Share with a coding buddy 🚀 · Follow <b>@nemi.explains</b>
          </div>
        </div>
      </div>
    </CarouselSlideLayout>
  );
};
