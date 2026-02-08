/**
 * Sefirotic Orchestrator - Tree of Life Topology
 * The 10 Sefirot + Da'at (hidden) arranged in the traditional Tree structure
 */

import type { Sefirah, SefirahName, Pillar, World } from './types.js';

// ============================================================================
// Tree of Life Definition
// ============================================================================

export const TREE: Record<SefirahName, Sefirah> = {
  keter: {
    name: 'keter',
    hebrewName: 'כתר',
    meaning: 'Crown',
    pillar: 'middle',
    world: 'atzilut',
    function: 'Intent Classification - Determines the true purpose of the task',
    connections: ['chokmah', 'binah', 'tiferet'],
  },

  chokmah: {
    name: 'chokmah',
    hebrewName: 'חכמה',
    meaning: 'Wisdom',
    pillar: 'right',
    world: 'beriah',
    function: 'Creative Expansion - Generates possibilities and alternatives',
    connections: ['keter', 'binah', 'chesed', 'tiferet'],
  },

  binah: {
    name: 'binah',
    hebrewName: 'בינה',
    meaning: 'Understanding',
    pillar: 'left',
    world: 'beriah',
    function: 'Analytical Restriction - Applies constraints and analysis',
    connections: ['keter', 'chokmah', 'gevurah', 'tiferet'],
  },

  daat: {
    name: 'daat',
    hebrewName: 'דעת',
    meaning: 'Knowledge',
    pillar: 'middle',
    world: 'beriah',
    function: 'Hot Context Cache - Session-relevant context (hidden sefirah)',
    connections: ['keter', 'chokmah', 'binah', 'tiferet'],
  },

  chesed: {
    name: 'chesed',
    hebrewName: 'חסד',
    meaning: 'Mercy/Kindness',
    pillar: 'right',
    world: 'yetzirah',
    function: 'Skill Expansion - Matches available skills to task needs',
    connections: ['chokmah', 'gevurah', 'tiferet', 'netzach'],
  },

  gevurah: {
    name: 'gevurah',
    hebrewName: 'גבורה',
    meaning: 'Severity/Strength',
    pillar: 'left',
    world: 'yetzirah',
    function: 'Security Gate - SHIELD patterns, threat detection, abort protocol',
    connections: ['binah', 'chesed', 'tiferet', 'hod'],
  },

  tiferet: {
    name: 'tiferet',
    hebrewName: 'תפארת',
    meaning: 'Beauty/Harmony',
    pillar: 'middle',
    world: 'yetzirah',
    function: 'Central Orchestrator - Balances all inputs, the heart of the tree',
    connections: ['keter', 'chokmah', 'binah', 'daat', 'chesed', 'gevurah', 'netzach', 'hod', 'yesod'],
  },

  netzach: {
    name: 'netzach',
    hebrewName: 'נצח',
    meaning: 'Victory/Eternity',
    pillar: 'right',
    world: 'yetzirah',
    function: 'Proactive Actions - Suggests follow-up actions and scheduling',
    connections: ['chesed', 'tiferet', 'hod', 'yesod'],
  },

  hod: {
    name: 'hod',
    hebrewName: 'הוד',
    meaning: 'Glory/Splendor',
    pillar: 'left',
    world: 'yetzirah',
    function: 'Structured Output - Formats and structures the response',
    connections: ['gevurah', 'tiferet', 'netzach', 'yesod'],
  },

  yesod: {
    name: 'yesod',
    hebrewName: 'יסוד',
    meaning: 'Foundation',
    pillar: 'middle',
    world: 'assiah',
    function: 'Memory/Persistence - Stores to MEMORY.md for future reference',
    connections: ['tiferet', 'netzach', 'hod', 'malkuth'],
  },

  malkuth: {
    name: 'malkuth',
    hebrewName: 'מלכות',
    meaning: 'Kingdom',
    pillar: 'middle',
    world: 'assiah',
    function: 'Channel Delivery - Formats output for specific channel (WhatsApp, Slack, etc.)',
    connections: ['yesod'],
  },
};

// ============================================================================
// Pillar Definitions
// ============================================================================

export const PILLARS: Record<Pillar, SefirahName[]> = {
  right: ['chokmah', 'chesed', 'netzach'],  // Expansion
  left: ['binah', 'gevurah', 'hod'],         // Restriction
  middle: ['keter', 'daat', 'tiferet', 'yesod', 'malkuth'], // Balance
};

export const PILLAR_NAMES: Record<Pillar, string> = {
  right: 'Pillar of Mercy (Expansion)',
  left: 'Pillar of Severity (Restriction)',
  middle: 'Pillar of Balance (Harmony)',
};

// ============================================================================
// World Definitions
// ============================================================================

export const WORLDS: Record<World, SefirahName[]> = {
  atzilut: ['keter'],                           // Emanation - Pure Intent
  beriah: ['chokmah', 'binah', 'daat'],         // Creation - Ideas
  yetzirah: ['chesed', 'gevurah', 'tiferet', 'netzach', 'hod'], // Formation - Structure
  assiah: ['yesod', 'malkuth'],                 // Action - Manifestation
};

export const WORLD_NAMES: Record<World, string> = {
  atzilut: 'Atzilut (Emanation)',
  beriah: 'Beriah (Creation)',
  yetzirah: 'Yetzirah (Formation)',
  assiah: 'Assiah (Action)',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get sefirah by name
 */
export function getSefirah(name: SefirahName): Sefirah {
  return TREE[name];
}

/**
 * Get all sefirot in a pillar
 */
export function getSefirotByPillar(pillar: Pillar): Sefirah[] {
  return PILLARS[pillar].map(name => TREE[name]);
}

/**
 * Get all sefirot in a world
 */
export function getSefirotByWorld(world: World): Sefirah[] {
  return WORLDS[world].map(name => TREE[name]);
}

/**
 * Get connections for a sefirah
 */
export function getConnections(name: SefirahName): Sefirah[] {
  return TREE[name].connections.map(connName => TREE[connName]);
}

/**
 * Check if two sefirot are connected
 */
export function areConnected(a: SefirahName, b: SefirahName): boolean {
  return TREE[a].connections.includes(b);
}

/**
 * Get the traversal order for Graph Path
 * Follows the Lightning Flash (traditional descent order)
 */
export function getGraphTraversalOrder(): SefirahName[] {
  return [
    'keter',    // 1. Crown - Classification
    'chokmah',  // 2. Wisdom - Expansion
    'binah',    // 3. Understanding - Analysis
    'daat',     // 4. Knowledge - Context (hidden)
    'chesed',   // 5. Mercy - Skills
    'gevurah',  // 6. Severity - Security
    'tiferet',  // 7. Beauty - Orchestration
    'netzach',  // 8. Victory - Proactive
    'hod',      // 9. Glory - Output
    'yesod',    // 10. Foundation - Memory
    'malkuth',  // 11. Kingdom - Delivery
  ];
}

/**
 * Get the fast path order (minimal traversal)
 */
export function getFastTraversalOrder(): SefirahName[] {
  return [
    'keter',    // Classification
    'tiferet',  // Quick orchestration
    'hod',      // Output
    'malkuth',  // Delivery
  ];
}

/**
 * Get the abort path order (security-focused)
 */
export function getAbortTraversalOrder(): SefirahName[] {
  return [
    'keter',    // Classification
    'gevurah',  // Security check
    'malkuth',  // Security warning delivery
  ];
}

// ============================================================================
// ASCII Visualization
// ============================================================================

export const TREE_ASCII = `
                    ┌─────────┐
                    │  KETER  │ ← Intent Classification
                    │ (Crown) │
                    └────┬────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
     ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
     │  CHOKMAH  │ │   DA'AT   │ │   BINAH   │
     │ (Wisdom)  │ │(Knowledge)│ │(Underst.) │
     │ Expansion │ │ Hot Cache │ │ Restrict  │
     └─────┬─────┘ └───────────┘ └─────┬─────┘
           │                           │
     ┌─────▼─────┐               ┌─────▼─────┐
     │  CHESED   │               │  GEVURAH  │
     │  (Mercy)  │               │(Severity) │
     │  Skills   │               │  Security │
     └─────┬─────┘               └─────┬─────┘
           │                           │
           └───────────┬───────────────┘
                       │
                 ┌─────▼─────┐
                 │  TIFERET  │ ← Central Orchestrator
                 │ (Beauty)  │   8 connections
                 └─────┬─────┘
                       │
           ┌───────────┼───────────┐
           │                       │
     ┌─────▼─────┐           ┌─────▼─────┐
     │  NETZACH  │           │    HOD    │
     │ (Victory) │           │  (Glory)  │
     │ Proactive │           │  Output   │
     └─────┬─────┘           └─────┬─────┘
           │                       │
           └───────────┬───────────┘
                       │
                 ┌─────▼─────┐
                 │   YESOD   │ ← Memory/Persistence
                 │(Foundation)│
                 └─────┬─────┘
                       │
                 ┌─────▼─────┐
                 │  MALKUTH  │ ← Channel Delivery
                 │ (Kingdom) │
                 └─────────────┘

PILLARS:
├── Left (Restriction): Binah → Gevurah → Hod
├── Right (Expansion): Chokmah → Chesed → Netzach
└── Middle (Balance): Keter → Da'at → Tiferet → Yesod → Malkuth
`;

/**
 * Print the tree visualization
 */
export function printTree(): void {
  console.log(TREE_ASCII);
}
