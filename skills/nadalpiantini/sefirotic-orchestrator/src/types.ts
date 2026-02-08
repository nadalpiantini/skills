/**
 * Sefirotic Orchestrator - Type Definitions
 * The foundational types for the Tree of Life topology
 */

// ============================================================================
// Core Sefirot Types
// ============================================================================

export type SefirahName =
  | 'keter'    // Crown - Intent Classification
  | 'chokmah'  // Wisdom - Creative Expansion
  | 'binah'    // Understanding - Analytical Restriction
  | 'daat'     // Knowledge - Hot Context Cache (hidden)
  | 'chesed'   // Mercy - Skill Expansion
  | 'gevurah'  // Severity - Security Gate
  | 'tiferet'  // Beauty - Central Orchestrator
  | 'netzach'  // Victory - Proactive Actions
  | 'hod'      // Glory - Structured Output
  | 'yesod'    // Foundation - Memory/Persistence
  | 'malkuth'; // Kingdom - Channel Delivery

export type Pillar = 'left' | 'right' | 'middle';
export type World = 'atzilut' | 'beriah' | 'yetzirah' | 'assiah';

export interface Sefirah {
  name: SefirahName;
  hebrewName: string;
  meaning: string;
  pillar: Pillar;
  world: World;
  function: string;
  connections: SefirahName[];
}

// ============================================================================
// Path Types
// ============================================================================

export type PathType = 'fast' | 'graph' | 'abort' | 'consultation' | 'mental';

export interface PathDecision {
  type: PathType;
  score: number;
  reasons: string[];
  shieldTriggered?: ShieldAlert;
}

// ============================================================================
// Task & Channel Types
// ============================================================================

export type Channel = 'whatsapp' | 'slack' | 'email' | 'cli' | 'api';

export interface Task {
  id: string;
  content: string;
  channel: Channel;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface TaskClassification {
  intent: string;
  language: 'en' | 'es' | 'mixed';
  complexity: number;
  patterns: PatternMatch[];
}

// ============================================================================
// Complexity Scoring Types
// ============================================================================

export type PatternCategory = 'simple' | 'complex' | 'security' | 'modifier';

export interface PatternMatch {
  pattern: string;
  category: PatternCategory;
  weight: number;
  matched: string;
}

export interface ComplexityResult {
  score: number;
  matches: PatternMatch[];
  path: PathType;
  breakdown: {
    simplePatterns: number;
    complexPatterns: number;
    modifiers: number;
    security: number;
  };
}

// ============================================================================
// SHIELD Security Types
// ============================================================================

export type ShieldSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ShieldPattern {
  id: string;
  pattern: RegExp;
  severity: ShieldSeverity;
  description: string;
  category: string;
}

export interface ShieldAlert {
  triggered: boolean;
  severity: ShieldSeverity;
  pattern: ShieldPattern;
  matched: string;
  action: 'abort' | 'confirm' | 'warn' | 'allow';
}

export interface ShieldResult {
  safe: boolean;
  alerts: ShieldAlert[];
  highestSeverity: ShieldSeverity | null;
  recommendation: 'proceed' | 'confirm' | 'abort';
}

// ============================================================================
// Skill Types
// ============================================================================

export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  tags?: string[];
  emoji?: string;
  requires?: string[];
}

export interface SkillMatch {
  skill: SkillMetadata;
  relevance: number;
  matchedKeywords: string[];
  source: 'scanner' | 'keywords' | 'both';
}

export interface SkillScanResult {
  available: SkillMetadata[];
  matched: SkillMatch[];
  fallbackUsed: boolean;
}

// ============================================================================
// Memory Types
// ============================================================================

export interface MemoryEntry {
  id: string;
  timestamp: Date;
  task: string;
  result: string;
  path: PathType;
  sefirotActivated: SefirahName[];
  context?: Record<string, unknown>;
}

export interface MemoryStore {
  entries: MemoryEntry[];
  lastUpdated: Date;
  sessionId: string;
}

// ============================================================================
// Orchestrator Types
// ============================================================================

export interface OrchestratorInput {
  task: Task;
  context?: Record<string, unknown>;
  options?: OrchestratorOptions;
}

export interface OrchestratorOptions {
  forcePath?: PathType;
  debug?: boolean;
  dryRun?: boolean;
  skipSecurity?: boolean;
}

export interface SefirahResult {
  sefirah: SefirahName;
  success: boolean;
  output: unknown;
  duration: number;
  error?: string;
}

export interface OrchestratorResult {
  id: string;
  task: Task;
  path: PathType;
  score: number;
  results: SefirahResult[];
  finalOutput: string;
  duration: number;
  memoryStored: boolean;
  shieldResult: ShieldResult;
}

// ============================================================================
// Event Types (for v0.3 Event Bus)
// ============================================================================

export type EventType =
  | 'task:received'
  | 'path:decided'
  | 'sefirah:enter'
  | 'sefirah:exit'
  | 'shield:alert'
  | 'memory:stored'
  | 'output:delivered';

export interface OrchestratorEvent {
  type: EventType;
  timestamp: Date;
  data: unknown;
  sefirah?: SefirahName;
}

// ============================================================================
// 22 Paths (Senderos) Types
// ============================================================================

export interface Sendero {
  id: number;
  from: SefirahName;
  to: SefirahName;
  hebrewLetter: string;
  condition?: (context: Record<string, unknown>) => boolean;
  description: string;
}

// ============================================================================
// Demo/Test Types
// ============================================================================

export interface TestScenario {
  name: string;
  task: string;
  channel: Channel;
  expectedPath: PathType;
  expectedScoreRange?: [number, number];
  description: string;
}
