import { PlaneId, EnemyType, PowerUpType } from '../types/game';

// Canvas drawing helpers for 1945 planes, enemies, items, bullet visual effects

export function drawPlayerPlane(
  ctx: CanvasRenderingContext2D,
  planeId: PlaneId,
  x: number,
  y: number,
  width: number,
  height: number,
  animTick: number,
  isDamageFlicker: boolean = false
) {
  if (isDamageFlicker && Math.floor(animTick / 4) % 2 === 0) return;

  ctx.save();
  ctx.translate(x, y);

  // Plane shadow on ground/sea
  ctx.save();
  ctx.translate(15, 25);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  drawPlaneHull(ctx, planeId, width * 0.9, height * 0.9, true);
  ctx.restore();

  // Actual Plane Hull
  drawPlaneHull(ctx, planeId, width, height, false, animTick);

  ctx.restore();
}

function drawPlaneHull(
  ctx: CanvasRenderingContext2D,
  planeId: PlaneId,
  w: number,
  h: number,
  isShadow: boolean,
  animTick: number = 0
) {
  const hw = w / 2;
  const hh = h / 2;

  if (isShadow) {
    ctx.beginPath();
    ctx.ellipse(0, 0, hw * 0.8, hh * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Spinning propeller animation
  const propWidth = (animTick % 6 < 3) ? w * 0.7 : w * 0.2;

  switch (planeId) {
    case 'p38': {
      // P-38 Twin Boom Lightning
      // Main central nacelle & cockpit
      ctx.fillStyle = '#475569'; // Slate fuselage
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, hh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glass Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(0, -6, 5, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Wing across twin booms
      ctx.fillStyle = '#334155';
      ctx.fillRect(-hw, -2, w, 12);

      // Left Boom & Engine
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-hw * 0.6 - 5, -hh + 5, 10, h - 8);
      // Right Boom & Engine
      ctx.fillRect(hw * 0.6 - 5, -hh + 5, 10, h - 8);

      // Tailplane connecting booms
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-hw * 0.6 - 5, hh - 10, hw * 1.2 + 10, 6);

      // Twin Propellers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-hw * 0.6 - propWidth / 2, -hh + 3, propWidth, 3);
      ctx.fillRect(hw * 0.6 - propWidth / 2, -hh + 3, propWidth, 3);

      // Yellow wing tips
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-hw, 0, 4, 8);
      ctx.fillRect(hw - 4, 0, 4, 8);
      break;
    }

    case 'spitfire': {
      // Spitfire - Elliptical wings & sleek camouflage
      ctx.fillStyle = '#15803d'; // British Dark Green
      // Fuselage
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, hh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Elliptical Wings
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.ellipse(0, 2, hw, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // RAF Roundel on wings
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath(); ctx.arc(-hw * 0.6, 2, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hw * 0.6, 2, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(-hw * 0.6, 2, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hw * 0.6, 2, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(-hw * 0.6, 2, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hw * 0.6, 2, 2, 0, Math.PI * 2); ctx.fill();

      // Glass Cockpit
      ctx.fillStyle = '#7dd3fc';
      ctx.beginPath();
      ctx.ellipse(0, -5, 5, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nose propeller
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(-propWidth / 2, -hh, propWidth, 4);
      break;
    }

    case 'zero': {
      // Zero Fighter A6M - Dark Green & Red Sun Hinomaru
      ctx.fillStyle = '#14532d'; // IJN Deep Green
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, hh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tapered wing
      ctx.beginPath();
      ctx.moveTo(0, -hh + 12);
      ctx.lineTo(-hw, 10);
      ctx.lineTo(-hw * 0.8, 18);
      ctx.lineTo(hw * 0.8, 18);
      ctx.lineTo(hw, 10);
      ctx.closePath();
      ctx.fill();

      // Red Sun Insignia
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(-hw * 0.65, 12, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(hw * 0.65, 12, 6, 0, Math.PI * 2); ctx.fill();

      // Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(0, -6, 4, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Propeller
      ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
      ctx.fillRect(-propWidth / 2, -hh, propWidth, 4);
      break;
    }

    case 'bf109': {
      // Bf 109 Gustav - Angular wings & Luftwaffe camo
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, hh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Straight clipped wings
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(-hw, -2);
      ctx.lineTo(hw, -2);
      ctx.lineTo(hw * 0.9, 14);
      ctx.lineTo(-hw * 0.9, 14);
      ctx.closePath();
      ctx.fill();

      // Yellow Nose Cone
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(-4, -hh + 6);
      ctx.lineTo(0, -hh - 2);
      ctx.lineTo(4, -hh + 6);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(-3, -10, 6, 12);

      // Propeller
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-propWidth / 2, -hh - 2, propWidth, 3);
      break;
    }

    case 'shinden': {
      // J7W1 Shinden - Rear propeller, forward canard wings
      ctx.fillStyle = '#0284c7'; // Navy Cyan
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, hh, 0, 0, Math.PI * 2);
      ctx.fill();

      // Forward canard mini-wings
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-16, -hh + 8, 32, 5);

      // Swept back main wings
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-hw, 18);
      ctx.lineTo(-hw + 8, 24);
      ctx.lineTo(hw - 8, 24);
      ctx.lineTo(hw, 18);
      ctx.closePath();
      ctx.fill();

      // Glass Cockpit
      ctx.fillStyle = '#a5f3fc';
      ctx.beginPath();
      ctx.ellipse(0, -8, 5, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rear propeller!
      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.fillRect(-propWidth / 2, hh - 4, propWidth, 4);
      break;
    }
  }

  // Thruster fire tail flame
  const flameH = 8 + (animTick % 3) * 4;
  const grad = ctx.createLinearGradient(0, hh, 0, hh + flameH);
  grad.addColorStop(0, '#38bdf8');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-5, hh - 2);
  ctx.lineTo(0, hh + flameH);
  ctx.lineTo(5, hh - 2);
  ctx.closePath();
  ctx.fill();
}

// Draw Enemies
export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  enemy: {
    type: EnemyType;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    hp: number;
    maxHp: number;
    isBoss?: boolean;
    name?: string;
  },
  animTick: number
) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const w = enemy.width;
  const h = enemy.height;
  const hw = w / 2;
  const hh = h / 2;

  // Shadow
  ctx.save();
  ctx.translate(10, 15);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (enemy.isBoss) {
    // Super Boss Aircraft / Fortress Rendering
    ctx.fillStyle = '#1e293b'; // Charcoal heavy armor
    ctx.beginPath();
    ctx.ellipse(0, 0, hw, hh * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red warning stripe accents
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-hw * 0.8, -10, hw * 1.6, 6);
    ctx.fillRect(-hw * 0.5, 10, hw, 4);

    // Glowing Power Cores / Turrets
    const corePulse = Math.sin(animTick * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(239, 68, 68, ${corePulse})`;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();

    // Side Cannon Wings
    ctx.fillStyle = '#334155';
    ctx.fillRect(-hw, -hh * 0.3, 20, 40);
    ctx.fillRect(hw - 20, -hh * 0.3, 20, 40);

    // Turrets
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(-hw * 0.5, -20, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hw * 0.5, -20, 10, 0, Math.PI * 2); ctx.fill();

    // Metallic border accent
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, hw, hh * 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();

  } else {
    // Normal enemy ships
    switch (enemy.type) {
      case 'RECON':
        ctx.fillStyle = enemy.color || '#e11d48';
        ctx.beginPath();
        ctx.moveTo(0, hh);
        ctx.lineTo(-hw, -hh);
        ctx.lineTo(0, -hh * 0.4);
        ctx.lineTo(hw, -hh);
        ctx.closePath();
        ctx.fill();
        break;

      case 'FIGHTER':
        ctx.fillStyle = enemy.color || '#ea580c';
        ctx.fillRect(-hw, -hh * 0.3, w, hh * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, hw * 0.5, hh, 0, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'BOMBER':
      case 'GUNSHIP':
        ctx.fillStyle = '#475569';
        ctx.fillRect(-hw, -4, w, 12);
        ctx.fillStyle = enemy.color || '#0284c7';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, hh, 0, 0, Math.PI * 2);
        ctx.fill();
        // Turret dot
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        break;
    }
  }

  ctx.restore();
}

// PowerUp item icons
export function drawPowerUp(
  ctx: CanvasRenderingContext2D,
  type: PowerUpType,
  x: number,
  y: number,
  r: number,
  animTick: number
) {
  ctx.save();
  ctx.translate(x, y);

  const pulse = Math.sin(animTick * 0.15) * 3;
  const radius = r + pulse;

  // Glow ring
  ctx.fillStyle = type === 'POWER' ? 'rgba(234, 179, 8, 0.4)' :
                  type === 'BOMB' ? 'rgba(239, 68, 68, 0.4)' :
                  type === 'HEALTH' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath();
  ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
  ctx.fill();

  // Capsule Body
  ctx.fillStyle = type === 'POWER' ? '#eab308' :
                  type === 'BOMB' ? '#ef4444' :
                  type === 'HEALTH' ? '#22c55e' : '#0284c7';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Symbol text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = type === 'POWER' ? 'P' :
                type === 'BOMB' ? 'B' :
                type === 'HEALTH' ? 'H' : '★';
  ctx.fillText(label, 0, 1);

  ctx.restore();
}
