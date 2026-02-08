/**
 * Sefirotic Orchestrator - Main Entry Point
 * A decision-making framework based on the Tree of Life
 */

// Core exports
export { orchestrate, formatResult } from './orchestrator.js';

// Tree topology
export {
  TREE,
  PILLARS,
  WORLDS,
  PILLAR_NAMES,
  WORLD_NAMES,
  getSefirah,
  getSefirotByPillar,
  getSefirotByWorld,
  getConnections,
  areConnected,
  getGraphTraversalOrder,
  getFastTraversalOrder,
  getAbortTraversalOrder,
  printTree,
  TREE_ASCII,
} from './tree.js';

// 22 Paths
export {
  SENDEROS,
  getPathsFrom,
  getPathsTo,
  getPath,
  isPathActive,
  getActivePathsFrom,
  getNextSefirah,
  printPaths,
  getPathStats,
} from './paths.js';

// Complexity scoring
export {
  calculateComplexity,
  formatComplexityResult,
  getThresholdExplanation,
} from './complexity.js';

// SHIELD security
export {
  SHIELD_PATTERNS,
  analyzeThreats,
  formatShieldResult,
  isSafe,
  getAbortMessage,
  getShieldStats,
} from './shield.js';

// Skill scanner
export {
  SKILL_KEYWORDS,
  scanSkills,
  matchKeywords,
  matchSkills,
  getTopSkills,
  formatSkillMatches,
  getSkillKeywordStats,
} from './skill-scanner.js';

// Memory
export {
  addMemory,
  getRecentMemories,
  searchMemories,
  getMemoriesByPath,
  getHotContext,
  saveToFile,
  loadFromFile,
  getMemoryStats,
  formatMemoryStats,
  clearMemory,
  exportMemory,
  importMemory,
} from './memory-writer.js';

// Types
export type {
  SefirahName,
  Pillar,
  World,
  Sefirah,
  PathType,
  PathDecision,
  Channel,
  Task,
  TaskClassification,
  PatternCategory,
  PatternMatch,
  ComplexityResult,
  ShieldSeverity,
  ShieldPattern,
  ShieldAlert,
  ShieldResult,
  SkillMetadata,
  SkillMatch,
  SkillScanResult,
  MemoryEntry,
  MemoryStore,
  OrchestratorInput,
  OrchestratorOptions,
  SefirahResult,
  OrchestratorResult,
  EventType,
  OrchestratorEvent,
  Sendero,
  TestScenario,
} from './types.js';
