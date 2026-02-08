/**
 * Sefirotic Orchestrator - 22 Paths (Senderos)
 * The 22 conditional paths connecting the Sefirot
 * Based on the 22 letters of the Hebrew alphabet
 */

import type { Sendero, SefirahName } from './types.js';

// ============================================================================
// The 22 Paths (Senderos)
// ============================================================================

export const SENDEROS: Sendero[] = [
  // Path 1-3: From Keter (Crown)
  {
    id: 1,
    from: 'keter',
    to: 'chokmah',
    hebrewLetter: 'א (Aleph)',
    description: 'The breath of creation - intent becomes wisdom',
    condition: (ctx) => ctx.needsExpansion === true,
  },
  {
    id: 2,
    from: 'keter',
    to: 'binah',
    hebrewLetter: 'ב (Bet)',
    description: 'The house of understanding - intent becomes analysis',
    condition: (ctx) => ctx.needsAnalysis === true,
  },
  {
    id: 3,
    from: 'keter',
    to: 'tiferet',
    hebrewLetter: 'ג (Gimel)',
    description: 'Direct path to harmony - simple tasks bypass upper sefirot',
    condition: (ctx) => ctx.complexity < 45,
  },

  // Path 4-6: From Chokmah (Wisdom)
  {
    id: 4,
    from: 'chokmah',
    to: 'binah',
    hebrewLetter: 'ד (Dalet)',
    description: 'Wisdom meets understanding - creative ideas need validation',
    condition: (ctx) => ctx.hasCreativeOutput === true,
  },
  {
    id: 5,
    from: 'chokmah',
    to: 'chesed',
    hebrewLetter: 'ה (He)',
    description: 'Expansion flows to skills - ideas need implementation',
    condition: (ctx) => ctx.skillsNeeded === true,
  },
  {
    id: 6,
    from: 'chokmah',
    to: 'tiferet',
    hebrewLetter: 'ו (Vav)',
    description: 'Wisdom to beauty - creative balance',
  },

  // Path 7-9: From Binah (Understanding)
  {
    id: 7,
    from: 'binah',
    to: 'gevurah',
    hebrewLetter: 'ז (Zayin)',
    description: 'Analysis demands security - understanding reveals threats',
    condition: (ctx) => ctx.securityConcerns === true,
  },
  {
    id: 8,
    from: 'binah',
    to: 'tiferet',
    hebrewLetter: 'ח (Chet)',
    description: 'Understanding to harmony - constraints shape beauty',
  },

  // Path 9-11: Da'at connections (hidden paths)
  {
    id: 9,
    from: 'daat',
    to: 'tiferet',
    hebrewLetter: 'ט (Tet)',
    description: 'Knowledge informs orchestration - context shapes decisions',
    condition: (ctx) => ctx.hasRelevantContext === true,
  },

  // Path 10-13: From Chesed (Mercy)
  {
    id: 10,
    from: 'chesed',
    to: 'gevurah',
    hebrewLetter: 'י (Yod)',
    description: 'Cross-pillar balance - expansion checked by severity',
    condition: (ctx) => ctx.needsSecurityCheck === true,
  },
  {
    id: 11,
    from: 'chesed',
    to: 'tiferet',
    hebrewLetter: 'כ (Kaf)',
    description: 'Skills flow to orchestrator - available resources shape plan',
  },
  {
    id: 12,
    from: 'chesed',
    to: 'netzach',
    hebrewLetter: 'ל (Lamed)',
    description: 'Mercy enables victory - skills enable proactive action',
    condition: (ctx) => ctx.hasProactiveNeeds === true,
  },

  // Path 13-15: From Gevurah (Severity)
  {
    id: 13,
    from: 'gevurah',
    to: 'tiferet',
    hebrewLetter: 'מ (Mem)',
    description: 'Security shapes orchestration - constraints define boundaries',
  },
  {
    id: 14,
    from: 'gevurah',
    to: 'hod',
    hebrewLetter: 'נ (Nun)',
    description: 'Severity structures output - discipline creates form',
    condition: (ctx) => ctx.structuredOutputNeeded === true,
  },

  // Path 15-17: From Tiferet (Beauty) - The Heart
  {
    id: 15,
    from: 'tiferet',
    to: 'netzach',
    hebrewLetter: 'ס (Samekh)',
    description: 'Beauty enables action - harmony inspires proactivity',
    condition: (ctx) => ctx.hasFollowUpActions === true,
  },
  {
    id: 16,
    from: 'tiferet',
    to: 'hod',
    hebrewLetter: 'ע (Ayin)',
    description: 'Beauty structures output - orchestration shapes response',
  },
  {
    id: 17,
    from: 'tiferet',
    to: 'yesod',
    hebrewLetter: 'פ (Pe)',
    description: 'Beauty builds foundation - decisions become memory',
  },

  // Path 18-19: From Netzach (Victory)
  {
    id: 18,
    from: 'netzach',
    to: 'hod',
    hebrewLetter: 'צ (Tsade)',
    description: 'Cross-pillar synthesis - action meets structure',
  },
  {
    id: 19,
    from: 'netzach',
    to: 'yesod',
    hebrewLetter: 'ק (Qof)',
    description: 'Victory builds foundation - actions create patterns',
  },

  // Path 20-21: From Hod (Glory)
  {
    id: 20,
    from: 'hod',
    to: 'yesod',
    hebrewLetter: 'ר (Resh)',
    description: 'Structure becomes foundation - form crystallizes',
  },

  // Path 21-22: To Malkuth (Kingdom)
  {
    id: 21,
    from: 'yesod',
    to: 'malkuth',
    hebrewLetter: 'ש (Shin)',
    description: 'Foundation manifests - memory becomes action',
  },
  {
    id: 22,
    from: 'tiferet',
    to: 'malkuth',
    hebrewLetter: 'ת (Tav)',
    description: 'Direct manifestation - beauty becomes reality (emergency path)',
    condition: (ctx) => ctx.isEmergency === true,
  },
];

// ============================================================================
// Path Functions
// ============================================================================

/**
 * Get all paths from a sefirah
 */
export function getPathsFrom(sefirah: SefirahName): Sendero[] {
  return SENDEROS.filter(s => s.from === sefirah);
}

/**
 * Get all paths to a sefirah
 */
export function getPathsTo(sefirah: SefirahName): Sendero[] {
  return SENDEROS.filter(s => s.to === sefirah);
}

/**
 * Get path between two sefirot (if exists)
 */
export function getPath(from: SefirahName, to: SefirahName): Sendero | undefined {
  return SENDEROS.find(s => s.from === from && s.to === to);
}

/**
 * Check if a path is active given current context
 */
export function isPathActive(path: Sendero, context: Record<string, unknown>): boolean {
  if (!path.condition) {
    return true; // No condition = always active
  }
  return path.condition(context);
}

/**
 * Get all active paths from a sefirah given context
 */
export function getActivePathsFrom(sefirah: SefirahName, context: Record<string, unknown>): Sendero[] {
  return getPathsFrom(sefirah).filter(path => isPathActive(path, context));
}

/**
 * Determine next sefirah based on context
 */
export function getNextSefirah(
  current: SefirahName,
  context: Record<string, unknown>
): SefirahName | null {
  const activePaths = getActivePathsFrom(current, context);

  if (activePaths.length === 0) {
    return null;
  }

  // Priority: conditional paths first, then default paths
  const conditionalPaths = activePaths.filter(p => p.condition);
  if (conditionalPaths.length > 0) {
    return conditionalPaths[0].to;
  }

  return activePaths[0].to;
}

// ============================================================================
// Path Visualization
// ============================================================================

export function printPaths(): void {
  console.log('\n=== The 22 Paths (Senderos) ===\n');

  for (const path of SENDEROS) {
    const conditionStr = path.condition ? ' [CONDITIONAL]' : '';
    console.log(`Path ${path.id}: ${path.from} → ${path.to}`);
    console.log(`  Letter: ${path.hebrewLetter}`);
    console.log(`  Description: ${path.description}${conditionStr}`);
    console.log('');
  }
}

/**
 * Get path statistics
 */
export function getPathStats(): {
  total: number;
  conditional: number;
  unconditional: number;
  bySefirah: Record<SefirahName, { outgoing: number; incoming: number }>;
} {
  const stats: Record<SefirahName, { outgoing: number; incoming: number }> = {} as any;

  const sefirot: SefirahName[] = [
    'keter', 'chokmah', 'binah', 'daat', 'chesed', 'gevurah',
    'tiferet', 'netzach', 'hod', 'yesod', 'malkuth'
  ];

  for (const s of sefirot) {
    stats[s] = { outgoing: 0, incoming: 0 };
  }

  for (const path of SENDEROS) {
    stats[path.from].outgoing++;
    stats[path.to].incoming++;
  }

  return {
    total: SENDEROS.length,
    conditional: SENDEROS.filter(p => p.condition).length,
    unconditional: SENDEROS.filter(p => !p.condition).length,
    bySefirah: stats,
  };
}
