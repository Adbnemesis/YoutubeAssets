# FREE Models (verified from the Agent Manager catalog)

> All models below are FREE tier. Use the exact model name as the `model` in
> Agent Manager tasks. **⚠️ = free but produced no output in agent sessions
> (use the verified ones first).**

## 🖼️ Image Analysis (Vision)

> **IMPORTANT:** Agent Manager's free vision routes (`auto/best-vision` etc.)
> resolve to NON-vision models and silently fail on images. For reference-frame
> analysis use the OpenRouter API directly with `OPENROUTER_API_KEY` from
> `OpenMontage/.env` and **`:free` models only** (never paid):
> POST `https://openrouter.ai/api/v1/chat/completions` with base64 `image_url`
> content. Verified working free model: **`nvidia/nemotron-nano-12b-v2-vl:free`**
> (small images ~360x480 per frame, batch ≤6 frames, max_tokens ≤1600).
> `google/gemma-4-31b-it:free` works but is often 429 rate-limited.

| Model (exact name) | Provider | Notes |
|---|---|---|
| **Nemotron Nano 12B v2 VL** | nvidia | ✅ VERIFIED WORKING via API (read reference frames + reported) |
| Llama 3.1 Nemotron Nano VL 8B v1 | nvidia | VL vision |
| Llama 3.2 11b Vision Instruct | nvidia | vision |
| paligemma | nvidia | vision-language |
| cf/Gemma 3 12B (🆓) | omniroute (Cloudflare) | Gemma 3 multimodal |
| cf/Gemma 4 26B (🆓) | omniroute (Cloudflare) | Gemma 4 multimodal |
| zenmux/z-ai/glm-4.6v-flash-free | omniroute | GLM 4.6V vision (⚠️ silent in agent) |
| zm/z-ai/glm-4.6v-flash-free | omniroute | same as above |
| cf/GLM 4.7 Flash (🆓) | omniroute | GLM 4.7 multimodal |
| cloudflare-ai/GLM 4.7 Flash (🆓) | omniroute | same |
| Gemini 1.5/2.0/3 Flash (The Old LLM 🆓) | omniroute | Gemini multimodal (⚠️ silent in agent) |
| Gemini 2.5 Pro / 3 Pro (The Old LLM 🆓) | omniroute | Gemini Pro 🆓 (⚠️ silent in agent) |
| OpenRouter Free Models Router | kilo | free OpenRouter models incl. vision (Qwen2.5-VL, Moondream…) |

## 💻 Coding
| Model | Provider | Notes |
|---|---|---|
| **oc/DeepSeek V4 Flash Free** | omniroute | default free coder |
| cf/Qwen 2.5 Coder 15B (🆓) | omniroute (Cloudflare) | free coder |
| cf/Qwen 2.5 Coder 32B (🆓) | omniroute (Cloudflare) | free coder, stronger |
| cf/Kimi K2.6 (🆓) | omniroute (Cloudflare) | strong free coder |
| cloudflare-ai/Kimi K2.6 (🆓) | omniroute | same |
| cf/DeepSeek R1 Distill 32B (🆓) | omniroute | reasoning/coding |
| Poolside: Laguna S 2.1 (free) | kilo | Poolside coding |
| Poolside: Laguna XS 2.1 (free) | kilo | smaller Poolside |
| oc/laguna-s-2.1-free | omniroute | same |
| Cohere: North Mini Code (free) | kilo | coding |
| oc/north-mini-code-free | omniroute | same |
| oc/GLM-5, oc/GLM-5.1, oc/glm-5.2 | omniroute | GLM free routes |
| oc/Kimi K2.5, oc/Kimi K2.6, oc/kimi-k2.7-code | omniroute | Kimi free routes |
| Qwen2.5 Coder 32b Instruct | nvidia | free NIM |
| cf/Mistral 7B (🆓) | omniroute | free |

## 🎨 Image Generation
| Model | Provider | Notes |
|---|---|---|
| **Qwen Image** | nvidia | ✅ free image gen |
| **Qwen Image Edit** | nvidia | ✅ free image editing |
| FLUX.1-schnell | nvidia | fast free image gen |
| FLUX.1-dev | nvidia | image gen |
| FLUX.1-Kontext-dev | nvidia | image gen |
| FLUX.2 Klein 4B | nvidia | image gen |

## 🎬 Video Generation
| Model | Provider | Notes |
|---|---|---|
| veo-free/Seedance | omniroute | free video gen |
| veo-free/VEO 3.1 | omniroute | free video gen |

## 🧭 Auto Routers (omniroute)
`auto/best-free`, `auto/best-chat`, `auto/best-fast`, `auto/best-coding`,
`auto/best-vision`, `auto/cheap`, `auto/coding:cheap`, `auto/coding:fast`,
`auto/coding:reliable`, `auto/gemini`, `auto/glm`

## ✅ Recommended defaults
- **Image analysis:** `Nemotron Nano 12B v2 VL`
- **Image generation:** `Qwen Image` (or `FLUX.1-schnell` for speed)
- **Coding:** `cf/Kimi K2.6 (🆓)` or `oc/DeepSeek V4 Flash Free`
