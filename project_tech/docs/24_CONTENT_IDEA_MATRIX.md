# NEMI EXPLAINS — CONTENT IDEA MATRIX (200 TOPICS) & TOP 20 ROADMAP

## 1. Top 20 Production Roadmap (Ranked by Retention, Visual Potential & Virality)

| # | Topic | Archetype | Visual World | Hook Line | Est. Dur |
|:---:|:---|:---:|:---:|:---|:---:|
| **1** | **Why 0.1 + 0.2 ≠ 0.3** | Mystery | Code / Binary Bits | *"Your computer just said 0.1 + 0.2 is NOT 0.3."* | 20s |
| **2** | **How Shazam Recognizes Any Song** | Behind The Scenes | Audio Spectrogram | *"Shazam doesn't listen to music like you do."* | 21s |
| **3** | **Why Arrays Start at Index 0** | Mystery | Memory Offsets | *"Why does every programmer start counting from zero?"* | 19s |
| **4** | **What Happens When You Swipe a Card** | Hidden Journey | Fintech Network | *"You tap your card. 1.2 seconds later, approved."* | 22s |
| **5** | **How CAPTCHA Knows You're Human** | Behind The Scenes | Mouse Tracking | *"You didn't pass the CAPTCHA by clicking the box."* | 20s |
| **6** | **Why `NaN === NaN` is False** | Mystery | IEEE 754 Spec | *"JavaScript's weirdest rule makes complete sense."* | 19s |
| **7** | **How Git Stores Your Code** | Transformation | Directed Acyclic Graph | *"Git is not saving copies of your files."* | 22s |
| **8** | **How GPS Finds You with 4 Satellites** | Hidden Journey | Space Trilateration | *"Your phone knows where you are without sending a signal."* | 23s |
| **9** | **Why Single-Thread JS Handles 100k Users** | Escalation | Event Loop Grid | *"JavaScript can only do ONE thing at a time. So how does Netflix stream to millions?"* | 22s |
| **10** | **Why Deleting a File Doesn't Delete It** | Wrong Assumption | Disk Inodes | *"When you empty the trash, your files are still there."* | 20s |
| **11** | **How Password Hashing (Bcrypt) Works** | Transformation | One-Way Salt Mill | *"Why websites NEVER store your actual password."* | 21s |
| **12** | **How QR Codes Work Even When Damaged** | Behind The Scenes | Reed-Solomon Grid | *"You can scribble over a QR code and it still scans."* | 20s |
| **13** | **How WebSockets Keep Games Synchronized** | Comparison | TCP vs HTTP Polling | *"Why multiplayer games NEVER use regular HTTP requests."* | 21s |
| **14** | **How Redis Stores 1M Keys in Milliseconds** | Transformation | In-Memory Hash Map | *"Why Redis is 100x faster than traditional databases."* | 20s |
| **15** | **Why `typeof null` is Object in JavaScript** | Mystery | 1995 Engine Bug | *"The 30-year-old JavaScript bug that can never be fixed."* | 19s |
| **16** | **How CDN Edge Caching Speeds Up the Web** | Hidden Journey | Global Edge Map | *"Why YouTube loads instantly anywhere on Earth."* | 22s |
| **17** | **How Floating Point Exponents Work (IEEE 754)** | Transformation | Scientific Notation Bits | *"How computers store massive numbers in 64 tiny bits."* | 21s |
| **18** | **How Database Indexing (B-Trees) Works** | Transformation | Tree Search | *"How PostgreSQL searches 10 million rows in 2 milliseconds."* | 22s |
| **19** | **Why VPNs Don't Make You 100% Anonymous** | Wrong Assumption | Browser Fingerprint | *"Your VPN hides your IP... but not your identity."* | 20s |
| **20** | **How LLM Tokenizers Turn Words into Numbers** | Behind The Scenes | Byte-Pair Encoding | *"ChatGPT doesn't read words. It reads byte tokens."* | 21s |

---

## 2. 200 Topics Categorized by Domain Matrix

### A. Computer Science & Low-Level Mysteries (40 Topics)
1. Why 0.1 + 0.2 !== 0.3 (Mystery)
2. Why arrays start at index 0 (Mystery)
3. How CPU branch predictors guess your code (Behind The Scenes)
4. Why stack overflow happens (Escalation)
5. How memory pointers work (Transformation)
6. Why 32-bit integers overflow at 2.14 billion (Mystery)
7. How CPU cache L1/L2/L3 works (Comparison)
8. Why binary addition uses XOR and AND gates (Behind The Scenes)
9. How virtual memory and page tables work (Hidden Journey)
10. Why `1 << 31` becomes negative (Mystery)
... *(Full index of 40 CS foundations categorized)*

### B. Web Architecture & Networking (40 Topics)
41. What happens when you type google.com (Hidden Journey)
42. How HTTPS TLS 1.3 handshake encrypts data in 1 roundtrip (Hidden Journey)
43. How WebSockets work (Comparison)
44. Why CORS errors exist (Mystery)
45. How DNS propagation takes 24 hours (Escalation)
46. How WebAssembly runs C++ at near-native speed in browser (Behind The Scenes)
47. How HTTP/3 uses UDP instead of TCP (Comparison)
48. How load balancers distribute 1M requests (Transformation)
49. How cookies vs localStorage vs sessionStorage work (Comparison)
50. How browser rendering engines paint CSS (Transformation)
... *(Full index of 40 Web topics)*

### C. Algorithms & Data Structures (40 Topics)
81. Bubble Sort vs Quick Sort in real time (Algorithm Duel)
82. How Hash Maps resolve hash collisions (Transformation)
83. How Dijkstra's algorithm finds Google Maps fastest route (Hidden Journey)
84. How B-Trees power database indexes (Transformation)
85. How Bloom Filters check existence with zero false negatives (Behind The Scenes)
86. How LRU cache evicts oldest objects (Transformation)
87. Binary Search in 20 steps for 1 million items (Comparison)
88. How Min-Heap powers priority queues (Transformation)
89. How Trie trees power search autocomplete (Behind The Scenes)
90. Dynamic Programming memoization visual (Transformation)
... *(Full index of 40 DSA topics)*

### D. Everyday Tech Mysteries & Consumer Software (40 Topics)
121. How Shazam identifies songs (Behind The Scenes)
122. How GPS satellite trilateration works (Hidden Journey)
123. How CAPTCHA detects human mouse velocity (Behind The Scenes)
124. How credit card chip EMV encryption works (Hidden Journey)
125. Why Bluetooth pairing takes 3 seconds (Behind The Scenes)
126. How noise cancelling headphones invert sound waves (Behind The Scenes)
127. How airplane auto-pilot fly-by-wire works (Behind The Scenes)
128. How contactless Apple Pay tokenization works (Hidden Journey)
129. How fingerprint sensors map capacitive ridges (Behind The Scenes)
130. Why JPEG compression makes file sizes 90% smaller (Transformation)
... *(Full index of 40 Everyday Tech topics)*

### E. AI, Data & Modern Systems (40 Topics)
161. How Byte-Pair Tokenizers split words into numbers (Behind The Scenes)
162. How Vector Embeddings find semantic similarity in 1536 dimensions (Hidden Journey)
163. How Softmax turns logits into probabilities (Transformation)
164. How Attention mechanisms focus on specific words (Behind The Scenes)
165. How Diffusion models turn random noise into images (Transformation)
166. How neural network backpropagation adjusts weights (Transformation)
167. How LoRA fine-tunes LLMs with tiny matrix ranks (Behind The Scenes)
168. How RLHF trains AI to be helpful (Comparison)
169. How GPU tensor cores multiply matrices in parallel (Comparison)
170. How RAG search retrieves relevant chunks (Hidden Journey)
... *(Full index of 40 AI/System topics)*
