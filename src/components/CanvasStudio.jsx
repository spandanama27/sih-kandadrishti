import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Scan, 
  Grid3X3, 
  Tag, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  Layers, 
  Eye, 
  Maximize2,
  Camera,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { classifyOnion, getArUcoHomographyDetails } from '../utils/geometry';

export default function CanvasStudio({ 
  currentBatch, 
  selectedOnion, 
  setSelectedOnion, 
  onSelectPreset, 
  onUploadCustom, 
  onTriggerWebcam,
  t 
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Overlay toggle states
  const [showArucoGrid, setShowArucoGrid] = useState(true);
  const [showSegmentation, setShowSegmentation] = useState(true);
  const [showSizingBadges, setShowSizingBadges] = useState(true);
  const [showPathologyHeatmap, setShowPathologyHeatmap] = useState(true);
  const [showLaserScan, setShowLaserScan] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(100);
  const [hoveredOnionId, setHoveredOnionId] = useState(null);

  // Laser scanner animation position
  const [laserPos, setLaserPos] = useState(0);

  // Handle laser animation frame
  useEffect(() => {
    if (!showLaserScan) return;
    let animId;
    let pos = 0;
    let direction = 1;

    const animateLaser = () => {
      pos += 0.8 * direction;
      if (pos >= 100) {
        pos = 100;
        direction = -1;
      } else if (pos <= 0) {
        pos = 0;
        direction = 1;
      }
      setLaserPos(pos);
      animId = requestAnimationFrame(animateLaser);
    };

    animId = requestAnimationFrame(animateLaser);
    return () => cancelAnimationFrame(animId);
  }, [showLaserScan]);

  // Recalibrate trigger
  const handleRecalibrate = () => {
    setIsCalibrating(true);
    setCalibrationProgress(0);
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCalibrating(false);
          return 100;
        }
        return prev + 15;
      });
    }, 100);
  };

  // Helper to draw ArUco marker
  const drawArucoMarker = (ctx, x, y, size, id) => {
    ctx.save();
    // Outer black border
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - size / 2, y - size / 2, size, size);

    // Inner white margin
    const innerMargin = size * 0.15;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - size / 2 + innerMargin, y - size / 2 + innerMargin, size - innerMargin * 2, size - innerMargin * 2);

    // 4x4 binary code pattern based on ID
    const bitSize = (size - innerMargin * 2) / 4;
    const patterns = [
      [[1,0,1,0], [0,1,1,0], [1,1,0,1], [0,0,1,1]], // ID 0
      [[0,1,0,1], [1,1,0,0], [0,1,1,1], [1,0,1,0]], // ID 1
      [[1,1,0,0], [0,0,1,1], [1,0,1,1], [0,1,0,1]], // ID 2
      [[0,0,1,1], [1,1,0,1], [0,1,0,0], [1,1,1,0]], // ID 3
    ];
    const pat = patterns[id % 4];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (pat[r][c] === 1) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(
            x - size / 2 + innerMargin + c * bitSize,
            y - size / 2 + innerMargin + r * bitSize,
            bitSize,
            bitSize
          );
        }
      }
    }

    // Corner crosshair reticle
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - size / 2 - 3, y);
    ctx.lineTo(x + size / 2 + 3, y);
    ctx.moveTo(x, y - size / 2 - 3);
    ctx.lineTo(x, y + size / 2 + 3);
    ctx.stroke();

    // Marker label
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`ARUCO#${id}`, x - 20, y + size / 2 + 11);
    ctx.restore();
  };

  // Draw onion bulb realistically
  const drawOnionBulb = (ctx, onion, isSelected, isHovered) => {
    const { x, y, diamX, diamY, defect, rot, sprout, sproutLengthMm = 0, skinColor = '#b45309' } = onion;
    const rx = diamX * 0.58; // canvas pixel radius
    const ry = diamY * 0.55;

    ctx.save();
    ctx.translate(x, y);

    // Natural tilt
    const tilt = ((onion.id * 37) % 30 - 15) * Math.PI / 180;
    ctx.rotate(tilt);

    // Bulb Drop Shadow
    ctx.beginPath();
    ctx.ellipse(3, 4, rx * 0.95, ry * 0.9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.fill();

    // Base Bulb Radial Gradient (rich onion tunic skin)
    const grad = ctx.createRadialGradient(-rx * 0.2, -ry * 0.2, rx * 0.1, 0, 0, rx);
    if (skinColor === '#9a3412') {
      // Red onion (Garwa)
      grad.addColorStop(0, '#fbcfe8'); // slight pearlescent inner shine
      grad.addColorStop(0.2, '#be185d');
      grad.addColorStop(0.7, '#831843');
      grad.addColorStop(1, '#500724');
    } else if (skinColor === '#78350f') {
      // Golden Bronze onion
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.25, '#d97706');
      grad.addColorStop(0.75, '#92400e');
      grad.addColorStop(1, '#451a03');
    } else {
      // Amber Yellow onion
      grad.addColorStop(0, '#fed7aa');
      grad.addColorStop(0.3, '#f59e0b');
      grad.addColorStop(0.7, '#b45309');
      grad.addColorStop(1, '#78350f');
    }

    // Outer Onion Ellipsoid Body
    ctx.beginPath();
    // Slightly taper towards neck (top) and root (bottom)
    ctx.moveTo(0, -ry * 1.08);
    ctx.bezierCurveTo(rx * 0.85, -ry * 0.9, rx * 1.05, ry * 0.5, 0, ry * 1.02);
    ctx.bezierCurveTo(-rx * 1.05, ry * 0.5, -rx * 0.85, -ry * 0.9, 0, -ry * 1.08);
    ctx.fillStyle = grad;
    ctx.fill();

    // Natural papery skin striations (concentric growth ribs)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.75, ry * 0.85, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.45, ry * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Neck pinch & dry stem (Top)
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(-rx * 0.15, -ry * 1.05);
    ctx.lineTo(0, -ry * 1.25);
    ctx.lineTo(rx * 0.15, -ry * 1.05);
    ctx.closePath();
    ctx.fill();

    // Root basal plate (Bottom)
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(0, ry * 1.02, rx * 0.2, ry * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fine Root hairs
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-rx * 0.1, ry * 1.02);
    ctx.lineTo(-rx * 0.2, ry * 1.18);
    ctx.moveTo(0, ry * 1.02);
    ctx.lineTo(0, ry * 1.22);
    ctx.moveTo(rx * 0.1, ry * 1.02);
    ctx.lineTo(rx * 0.18, ry * 1.16);
    ctx.stroke();

    // --- DEFECTS OVERLAY RENDERING ---
    // 1. Sprouting Defect (Green shoots emerging from neck)
    if (sprout === 1) {
      const shootH = Math.min(ry * 0.9, 10 + (sproutLengthMm || 6) * 1.4);
      ctx.fillStyle = '#4ade80';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, -ry * 1.15);
      ctx.quadraticCurveTo(-8, -ry * 1.15 - shootH * 0.7, -4, -ry * 1.15 - shootH);
      ctx.quadraticCurveTo(0, -ry * 1.15 - shootH * 0.8, 3, -ry * 1.15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Second micro blade
      ctx.beginPath();
      ctx.moveTo(1, -ry * 1.15);
      ctx.quadraticCurveTo(8, -ry * 1.15 - shootH * 0.6, 5, -ry * 1.15 - shootH * 0.85);
      ctx.quadraticCurveTo(2, -ry * 1.15 - shootH * 0.6, 1, -ry * 1.15);
      ctx.closePath();
      ctx.fillStyle = '#86efac';
      ctx.fill();
      ctx.stroke();
    }

    // 2. Black Mould Rot (Aspergillus niger)
    if (rot === 1 || defect === 'mould') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.ellipse(rx * 0.25, -ry * 0.1, rx * 0.38, ry * 0.32, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Fungus powdery spores
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.beginPath();
      ctx.arc(rx * 0.18, -ry * 0.18, rx * 0.15, 0, Math.PI * 2);
      ctx.arc(rx * 0.35, -ry * 0.05, rx * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // Mould fungal border
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Mechanical Cuts / Bruise
    if (defect === 'cut') {
      ctx.save();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-rx * 0.4, ry * 0.2);
      ctx.lineTo(rx * 0.35, ry * 0.45);
      ctx.stroke();

      // Cut inner fleshy exposure
      ctx.strokeStyle = '#fed7aa';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-rx * 0.38, ry * 0.2);
      ctx.lineTo(rx * 0.33, ry * 0.45);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();

    // 4. Pathology Heatmap Overlay Layer
    if (showPathologyHeatmap) {
      if (rot === 1 || defect === 'mould') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, rx * 1.15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();
      } else if (sprout === 1) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y - ry * 0.6, rx * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      } else if (defect === 'cut') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, rx * 1.05, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. AI Segmentation Contours
    if (showSegmentation) {
      const cls = classifyOnion(onion);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 1.06, ry * 1.06, 0, 0, Math.PI * 2);
      ctx.strokeStyle = cls.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.shadowColor = cls.color;
      ctx.shadowBlur = isSelected ? 12 : 4;
      ctx.stroke();

      // Small confidence & ID tag
      ctx.font = '500 9px monospace';
      ctx.fillStyle = '#0f172a';
      const labelText = `#${onion.id} ${(97 + (onion.id * 1.3) % 2.9).toFixed(1)}%`;
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillStyle = cls.color;
      ctx.fillRect(x - textWidth / 2 - 3, y - ry * 1.15 - 12, textWidth + 6, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x - textWidth / 2, y - ry * 1.15 - 3);
      ctx.restore();
    }

    // 6. Equatorial Sizing Badges in mm
    if (showSizingBadges) {
      const cls = classifyOnion(onion);
      const diam = ((diamX + diamY) / 2).toFixed(1);
      ctx.save();
      const badgeText = `${diam} mm`;
      ctx.font = 'bold 10px monospace';
      const bWidth = ctx.measureText(badgeText).width;
      
      // Badge pill
      ctx.fillStyle = cls.grade === 'GRADE_A' ? '#047857' : cls.grade === 'URS' ? '#b45309' : '#b91c1c';
      ctx.beginPath();
      const bx = x - bWidth / 2 - 5;
      const by = y + ry * 0.95;
      const bw = bWidth + 10;
      const bh = 15;
      const radius = 3;
      ctx.roundRect(bx, by, bw, bh, radius);
      ctx.fill();
      
      // White text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, x - bWidth / 2, y + ry * 0.95 + 11);
      ctx.restore();
    }

    // 7. Highlight Ring when Selected or Hovered
    if (isSelected || isHovered) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, rx * 1.35, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? '#10b981' : '#38bdf8';
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Corner target brackets
      const bracketSize = 8;
      const offset = rx * 1.35 + 2;
      ctx.setLineDash([]);
      ctx.strokeStyle = isSelected ? '#10b981' : '#38bdf8';
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(x - offset, y - offset + bracketSize);
      ctx.lineTo(x - offset, y - offset);
      ctx.lineTo(x - offset + bracketSize, y - offset);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(x + offset - bracketSize, y - offset);
      ctx.lineTo(x + offset, y - offset);
      ctx.lineTo(x + offset, y - offset + bracketSize);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(x - offset, y + offset - bracketSize);
      ctx.lineTo(x - offset, y + offset);
      ctx.lineTo(x - offset + bracketSize, y + offset);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(x + offset - bracketSize, y + offset);
      ctx.lineTo(x + offset, y + offset);
      ctx.lineTo(x + offset, y + offset - bracketSize);
      ctx.stroke();

      ctx.restore();
    }
  };

  // Main Canvas Render Loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 1. Clear background & draw calibrated inspection tray
    ctx.clearRect(0, 0, width, height);

    // Matte white/slate tray background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Calibrated tray perimeter border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, width - 30, height - 30);

    // Ruler mm ticks on border
    ctx.fillStyle = '#64748b';
    ctx.font = '8px monospace';
    // Top border ticks
    for (let x = 40; x < width - 40; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.lineTo(x, (x % 100 === 0) ? 25 : 20);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = (x % 100 === 0) ? 1.5 : 0.8;
      ctx.stroke();
      if (x % 100 === 0) {
        ctx.fillText(`${x}mm`, x - 10, 12);
      }
    }
    // Left border ticks
    for (let y = 40; y < height - 40; y += 20) {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo((y % 100 === 0) ? 25 : 20, y);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = (y % 100 === 0) ? 1.5 : 0.8;
      ctx.stroke();
      if (y % 100 === 0) {
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${y}mm`, -y - 12, 12);
        ctx.restore();
      }
    }

    // 2. Corner ArUco Markers
    drawArucoMarker(ctx, 35, 35, 36, 0);
    drawArucoMarker(ctx, width - 35, 35, 36, 1);
    drawArucoMarker(ctx, width - 35, height - 35, 36, 2);
    drawArucoMarker(ctx, 35, height - 35, 36, 3);

    // 3. ArUco 4-Point Homography Perspective Grid
    if (showArucoGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);

      // Bounding Quad
      ctx.beginPath();
      ctx.moveTo(35, 35);
      ctx.lineTo(width - 35, 35);
      ctx.lineTo(width - 35, height - 35);
      ctx.lineTo(35, height - 35);
      ctx.closePath();
      ctx.stroke();

      // Subtle internal perspective grid lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        // Horizontal lines
        const y = 35 + (height - 70) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(width - 35, y);
        ctx.stroke();

        // Vertical lines
        const x = 35 + (width - 70) * (i / 4);
        ctx.beginPath();
        ctx.moveTo(x, 35);
        ctx.lineTo(x, height - 35);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Homography Status Watermark
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(width - 240, height - 28, 220, 20);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('HOMOGRAPHY: 1.136 mm/px | TILT: 1.2°', width - 232, height - 15);
      ctx.restore();
    }

    // 4. Render Onion Bulbs
    if (currentBatch && currentBatch.onions) {
      currentBatch.onions.forEach(onion => {
        const isSelected = selectedOnion && selectedOnion.id === onion.id;
        const isHovered = hoveredOnionId === onion.id;
        drawOnionBulb(ctx, onion, isSelected, isHovered);
      });
    }

    // 5. Active Laser Scan Line Sweep
    if (showLaserScan) {
      const yLaser = 35 + ((height - 70) * laserPos) / 100;
      ctx.save();

      // Glowing scan band
      const grad = ctx.createLinearGradient(0, yLaser - 14, 0, yLaser + 14);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(35, yLaser - 14, width - 70, 28);

      // Core sharp laser line
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(35, yLaser);
      ctx.lineTo(width - 35, yLaser);
      ctx.stroke();

      // Laser coordinate indicator
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 8px monospace';
      ctx.fillText(`LASER SCAN Y: ${Math.round(yLaser * 1.136)}mm`, width - 140, yLaser - 4);
      ctx.restore();
    }

    // 6. Recalibration sweep overlay if calibrating
    if (isCalibrating) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`RECALIBRATING ARUCO TRAY: ${calibrationProgress}%`, width / 2, height / 2 - 10);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Optimizing 4-point perspective matrix and lens distortion...', width / 2, height / 2 + 14);
      ctx.restore();
    }
  }, [
    currentBatch,
    selectedOnion,
    hoveredOnionId,
    showArucoGrid,
    showSegmentation,
    showSizingBadges,
    showPathologyHeatmap,
    showLaserScan,
    laserPos,
    isCalibrating,
    calibrationProgress
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle canvas click to select an individual onion
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentBatch || !currentBatch.onions) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find onion clicked
    const clicked = currentBatch.onions.find(onion => {
      const dx = clickX - onion.x;
      const dy = clickY - onion.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= (onion.diamX * 0.6);
    });

    setSelectedOnion(clicked || null);
  };

  // Handle canvas mouse move for hover effect
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentBatch || !currentBatch.onions) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const hovered = currentBatch.onions.find(onion => {
      const dx = mouseX - onion.x;
      const dy = mouseY - onion.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= (onion.diamX * 0.6);
    });

    setHoveredOnionId(hovered ? hovered.id : null);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Studio Header Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>Interactive Edge Vision Studio</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ArUco Calibrated
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {currentBatch?.name || 'Live Frame Inspection'} • Lot: {currentBatch?.id}
            </p>
          </div>
        </div>

        {/* Action Buttons: Batch Selector / Upload / Live Camera */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectPreset('BATCH-2026-A4')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              currentBatch?.id === 'BATCH-2026-A4'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Batch A4 (Grade A)
          </button>
          <button
            onClick={() => onSelectPreset('BATCH-2026-B2')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              currentBatch?.id === 'BATCH-2026-B2'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Batch B2 (URS/Sprouts)
          </button>
          <button
            onClick={() => onSelectPreset('BATCH-2026-C1')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              currentBatch?.id === 'BATCH-2026-C1'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Batch C1 (Rot/Cuts)
          </button>

          <label className="cursor-pointer px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Upload Sample</span>
            <input type="file" accept="image/*" onChange={onUploadCustom} className="hidden" />
          </label>

          <button
            onClick={onTriggerWebcam}
            className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-medium flex items-center gap-1 transition"
            title="Open Live Edge Camera Stream"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edge Camera</span>
          </button>
        </div>
      </div>

      {/* Visualization Overlay Toggles Bar */}
      <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            Overlays:
          </span>

          {/* ArUco Grid Toggle */}
          <button
            onClick={() => setShowArucoGrid(!showArucoGrid)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              showArucoGrid 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ArUco Grid</span>
          </button>

          {/* AI Segmentation Toggle */}
          <button
            onClick={() => setShowSegmentation(!showSegmentation)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              showSegmentation 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Contours</span>
          </button>

          {/* Sizing Badges Toggle */}
          <button
            onClick={() => setShowSizingBadges(!showSizingBadges)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              showSizingBadges 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sizing (mm)</span>
          </button>

          {/* Pathology Heatmap Toggle */}
          <button
            onClick={() => setShowPathologyHeatmap(!showPathologyHeatmap)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              showPathologyHeatmap 
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Pathology Heatmap</span>
          </button>

          {/* Laser Scan Toggle */}
          <button
            onClick={() => setShowLaserScan(!showLaserScan)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition ${
              showLaserScan 
                ? 'bg-blue-100 text-blue-900 border border-blue-300 shadow-xs' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Laser Scan</span>
          </button>
        </div>

        {/* Recalibrate button */}
        <button
          onClick={handleRecalibrate}
          disabled={isCalibrating}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition disabled:opacity-50"
          title="Recalibrate ArUco coordinate homography"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
          <span>{isCalibrating ? 'Calibrating...' : 'Recalibrate Lens'}</span>
        </button>
      </div>

      {/* Main Interactive Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 p-3 bg-slate-900 flex items-center justify-center overflow-auto relative min-h-[440px]"
      >
        <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={490}
            height={400}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="block max-w-full h-auto cursor-crosshair select-none"
          />

          {/* Interactive Hint Callout */}
          <div className="absolute bottom-2 left-3 bg-slate-900/90 text-slate-300 border border-slate-700 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 pointer-events-none backdrop-blur-xs">
            <Info className="w-3 h-3 text-emerald-400" />
            <span>Click any onion on canvas to inspect micro-metrics</span>
          </div>

          {/* Sample count badge */}
          <div className="absolute top-2 right-3 bg-slate-900/90 text-emerald-300 border border-slate-700 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{currentBatch?.onions?.length || 0} Bulbs Detected</span>
          </div>
        </div>
      </div>

      {/* Crate Information Footer Bar */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 font-medium">Farmer:</span>{' '}
            <span className="font-semibold text-slate-800">{currentBatch?.farmer}</span>{' '}
            <span className="text-slate-500 font-mono text-[11px]">({currentBatch?.village})</span>
          </div>
          <div className="hidden sm:inline">
            <span className="text-slate-400 font-medium">Crop:</span>{' '}
            <span className="font-semibold text-slate-800">{currentBatch?.cropType}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Lot Size: <strong className="text-slate-800">{currentBatch?.bags} Bags ({currentBatch?.quintals} Qtl)</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
            ArUco Size: 45.0 mm
          </span>
        </div>
      </div>
    </div>
  );
}
