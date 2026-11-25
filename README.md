# कांदा-दृष्टि | KandaDrishti AI
### AI-Powered Edge Vision & Objective Grading System for National Onion Buffer Procurement
**Client / Ministry:** Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution  
**Hackathon Prototype:** Smart India Hackathon 2026

---

## 🌟 Overview & Key Problem Solved
Under the Price Stabilization Fund (PSF), the Government of India procures **5 Lakh Metric Tonnes (LMT)** of Rabi onions annually through agencies like **NAFED** and **NCCF** to build a strategic buffer stock. Historically, quality assessment at Mandi procurement gates has relied on subjective visual appraisal, leading to quality disputes, slow truck turnaround, and post-harvest storage losses.

**KandaDrishti AI** is a zero-backend, 100% client-side Edge Vision prototype that performs:
1. **Calibrated ArUco 4-Point Homography:** Millimeter-accurate sizing ($1\text{ px} \approx 1.136\text{ mm}$) that cancels perspective tilt and lens distortion.
2. **Automated Grade A vs URS Classification:** Segregates Sound Bulbs ($\ge 45\text{ mm}$), Under Relaxed Specifications ($35-45\text{ mm}$), and Rejections ($<35\text{ mm}$, sprouting, black mould).
3. **Bio-Pathology Heatmap:** Detects *Aspergillus niger* black mould, premature vegetative sprouts, and mechanical handling cuts.
4. **Cryptographic Digital Quality Certificate (DQC):** Generates tamper-proof SHA-256 digests, Ed25519 hardware enclave signatures, and dynamic QR codes that can be verified offline by warehouse managers.
5. **Edge SQLite WASM Queue:** Offline-first caching that queues procurement receipts locally on device with zero cloud latency.

---

## 🚀 Live Demo & Development Setup

### Prerequisites
- Node.js (v18+)
- npm

### Running Locally
```bash
# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Open in browser:
http://127.0.0.1:5173/
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Frontend Core:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3.4 (Government Enterprise AgriTech Palette: Slate-900, Emerald-600, Amber-500, Crimson-500, Tiranga accents)
- **Computer Vision & Calibration:** HTML5 Canvas 2D API + ArUco Homography Geometry Engine
- **Cryptographic Hashing & Signing:** Web Crypto API (`crypto.subtle` SHA-256) + Ed25519 Hardware Enclave Simulator
- **QR Code Verification:** `qrcode.react` (encodes verifiable JSON payload)
- **Icons:** `lucide-react`
- **Visual Polish:** `canvas-confetti` + Web Speech API (English / मराठी / हिंदी Voice Feedback)

---

## 📱 Interactive User Journey
1. **Mandi Selection & Geofence:** Select between Lasalgaon APMC, Pimpalgaon Baswant, Yeola, or Neemuch Mandi.
2. **Visual Overlay Toggles:** Toggle ArUco Grid, AI Segmentation Contours, Millimeter Badges, Pathology Heatmap, and Laser Sweep.
3. **Bulb Micro-Inspection:** Click any individual onion on the canvas to open the HUD inspector showing diameter, sphericity, estimated mass in grams, and pathology breakdown.
4. **Batch Comparison:** Switch between **Batch #2026-A4** (Grade A Dominant), **Batch #2026-B2** (URS/Sprouts), and **Batch #2026-C1** (Rot/Cuts), or upload your own sample.
5. **Lot Payout Calculator:** Adjust base MSP slider (₹/Quintal) and lot volume to view net farmer payout.
6. **Certificate Issuance:** Click **"Generate Digital Quality Certificate"** to view the printable certificate with dynamic QR code and cryptographic proof.
7. **Offline Sync Queue:** View cached SQLite lots and trigger batch synchronization to the central DoCA portal.
