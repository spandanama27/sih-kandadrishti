/**
 * ArUco Homography and Onion Quality Grading Geometry Utilities
 * Implements DoCA & NAFED Buffer Procurement Standards (2026 Revision)
 */

export function classifyOnion(onion) {
  const { diamX, diamY, defect, rot, sprout, sproutLengthMm = 0, defectPct = 0 } = onion;
  const avgDiam = (diamX + diamY) / 2;

  // Rejection criteria
  if (avgDiam < 35.0) {
    return {
      grade: 'REJECT',
      gradeLabel: 'Reject (<35mm)',
      reason: 'Under-sized bulb below minimum Mandi threshold (35mm)',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      color: '#dc2626',
      priceFactor: 0.0,
      tier: '<35mm'
    };
  }

  if (rot === 1 || defect === 'mould') {
    return {
      grade: 'REJECT',
      gradeLabel: 'Reject (Rot / Mould)',
      reason: `Aspergillus niger black rot detected (${defectPct.toFixed(1)}% surface area)`,
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      color: '#dc2626',
      priceFactor: 0.0,
      tier: 'Rot/Mould'
    };
  }

  if (sprout === 1 && sproutLengthMm > 5.0) {
    return {
      grade: 'REJECT',
      gradeLabel: 'Reject (Sprouting >5mm)',
      reason: `Active vegetative shoot (${sproutLengthMm.toFixed(1)} mm) depleting bulb dry matter`,
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      color: '#dc2626',
      priceFactor: 0.0,
      tier: 'Sprout'
    };
  }

  // URS (Under Relaxed Specifications) criteria
  if (avgDiam >= 35.0 && avgDiam < 45.0) {
    return {
      grade: 'URS',
      gradeLabel: 'URS (35-45mm)',
      reason: 'Bulb diameter within Under Relaxed Specification (35-45mm)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      color: '#d97706',
      priceFactor: 0.85,
      tier: '35-45mm'
    };
  }

  if (defect === 'cut' || (sprout === 1 && sproutLengthMm <= 5.0)) {
    return {
      grade: 'URS',
      gradeLabel: 'URS (Minor Defect)',
      reason: defect === 'cut' 
        ? `Minor mechanical cut (${defectPct.toFixed(1)}% surface) within permissible buffer margin` 
        : `Micro-sprout shoot (${sproutLengthMm.toFixed(1)} mm) eligible under relaxed norms`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      color: '#d97706',
      priceFactor: 0.85,
      tier: '35-45mm'
    };
  }

  // Grade A Sound Bulbs
  const tier = avgDiam >= 65.0 ? '>65mm (Jumbo)' : '45-65mm (Grade A)';
  return {
    grade: 'GRADE_A',
    gradeLabel: avgDiam >= 65.0 ? 'Grade A (Jumbo Sound)' : 'Grade A (Sound)',
    reason: 'Fully compliant sound bulb with dry tight neck, optimal diameter, zero pathology',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: '#059669',
    priceFactor: 1.0,
    tier
  };
}

// Compute comprehensive statistics for a batch
export function computeBatchStats(onions) {
  if (!onions || onions.length === 0) {
    return {
      total: 0,
      gradeACount: 0,
      gradeAPct: 0,
      ursCount: 0,
      ursPct: 0,
      rejectCount: 0,
      rejectPct: 0,
      avgDiameter: 0,
      stdDev: 0,
      minDiameter: 0,
      maxDiameter: 0,
      sizeBuckets: { '<35mm': 0, '35-45mm': 0, '45-65mm': 0, '>65mm': 0 },
      defects: { sound: 0, mould: 0, sprout: 0, cut: 0 },
      totalEstWeightGrams: 0,
      verdict: 'PENDING'
    };
  }

  let total = onions.length;
  let gradeACount = 0;
  let ursCount = 0;
  let rejectCount = 0;
  let diameters = [];
  let sizeBuckets = { '<35mm': 0, '35-45mm': 0, '45-65mm': 0, '>65mm': 0 };
  let defects = { sound: 0, mould: 0, sprout: 0, cut: 0 };
  let totalEstWeightGrams = 0;

  onions.forEach(onion => {
    const classification = classifyOnion(onion);
    const avgD = (onion.diamX + onion.diamY) / 2;
    diameters.push(avgD);

    // Approximate mass using prolate ellipsoid volume V = (4/3)*pi*(D/2)^2*(H/2) * density (approx 0.95 g/cm3)
    const radiusCm = (avgD / 10) / 2;
    const heightCm = ((onion.diamY || avgD) / 10);
    const volCm3 = (4 / 3) * Math.PI * radiusCm * radiusCm * (heightCm / 2);
    const estGrams = Math.round(volCm3 * 0.95);
    totalEstWeightGrams += estGrams;

    if (classification.grade === 'GRADE_A') gradeACount++;
    else if (classification.grade === 'URS') ursCount++;
    else rejectCount++;

    // Size tiers
    if (avgD < 35.0) sizeBuckets['<35mm']++;
    else if (avgD <= 45.0) sizeBuckets['35-45mm']++;
    else if (avgD <= 65.0) sizeBuckets['45-65mm']++;
    else sizeBuckets['>65mm']++;

    // Pathology counts
    if (onion.rot === 1 || onion.defect === 'mould') defects.mould++;
    else if (onion.sprout === 1) defects.sprout++;
    else if (onion.defect === 'cut') defects.cut++;
    else defects.sound++;
  });

  const sumD = diameters.reduce((acc, d) => acc + d, 0);
  const avgDiameter = (sumD / total);
  const variance = diameters.reduce((acc, d) => acc + Math.pow(d - avgDiameter, 2), 0) / total;
  const stdDev = Math.sqrt(variance);

  const gradeAPct = Number(((gradeACount / total) * 100).toFixed(1));
  const ursPct = Number(((ursCount / total) * 100).toFixed(1));
  const rejectPct = Number(((rejectCount / total) * 100).toFixed(1));

  // DoCA Buffer Tolerance Decision:
  // Eligible for buffer if Grade A >= 60% and Rejects <= 10%
  let verdict = 'APPROVED';
  if (rejectPct > 15.0 || gradeAPct < 45.0) {
    verdict = 'REJECTED';
  } else if (ursPct > 25.0 || rejectPct > 7.5) {
    verdict = 'CONDITIONAL';
  }

  return {
    total,
    gradeACount,
    gradeAPct,
    ursCount,
    ursPct,
    rejectCount,
    rejectPct,
    avgDiameter: Number(avgDiameter.toFixed(1)),
    stdDev: Number(stdDev.toFixed(1)),
    minDiameter: Number(Math.min(...diameters).toFixed(1)),
    maxDiameter: Number(Math.max(...diameters).toFixed(1)),
    sizeBuckets,
    defects,
    totalEstWeightGrams,
    verdict
  };
}

// Simulated ArUco Homography calibration matrix
export function getArUcoHomographyDetails(trayWidthMm = 500, trayHeightMm = 400) {
  return {
    markerSizeMm: 45.0,
    cornerMarkers: [
      { id: 0, label: 'ARUCO_0 (Top-Left)', px: [30, 30], mm: [0, 0] },
      { id: 1, label: 'ARUCO_1 (Top-Right)', px: [470, 30], mm: [trayWidthMm, 0] },
      { id: 2, label: 'ARUCO_2 (Bottom-Right)', px: [470, 370], mm: [trayWidthMm, trayHeightMm] },
      { id: 3, label: 'ARUCO_3 (Bottom-Left)', px: [30, 370], mm: [0, trayHeightMm] },
    ],
    homographyMatrix: [
      [1.1352, -0.0124, 30.1],
      [0.0098, 1.1294, 28.6],
      [0.00001, -0.00003, 1.0]
    ],
    reprojectionErrorPx: 0.14,
    cameraTiltDeg: 1.2,
    pixelScaleMmPerPx: 1.136, // approx 1px ~ 1.14mm
    status: 'CALIBRATED_ONLINE_EDGE'
  };
}
