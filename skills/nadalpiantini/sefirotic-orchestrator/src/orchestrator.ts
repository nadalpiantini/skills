/**
 * Sefirotic Orchestrator - Core Orchestrator (Tiferet)
 * The heart of the Tree - balances all inputs and orchestrates flow
 */

import type {
  Task,
  Channel,
  PathType,
  SefirahName,
  SefirahResult,
  OrchestratorInput,
  OrchestratorResult,
  OrchestratorOptions,
  TaskClassification,
} from './types.js';

import { TREE, getGraphTraversalOrder, getFastTraversalOrder, getAbortTraversalOrder } from './tree.js';
import { calculateComplexity } from './complexity.js';
import { analyzeThreats, getAbortMessage, formatShieldResult } from './shield.js';
import { matchSkills, formatSkillMatches } from './skill-scanner.js';
import { addMemory, getHotContext, saveToFile, getMemoryStats } from './memory-writer.js';

// ============================================================================
// Orchestrator State
// ============================================================================

let orchestratorId = 0;

function generateId(): string {
  return `orch_${Date.now()}_${++orchestratorId}`;
}

// ============================================================================
// Sefirah Processors
// ============================================================================

/**
 * Keter - Intent Classification
 */
async function processKeter(task: Task): Promise<SefirahResult> {
  const start = Date.now();

  // Calculate complexity and determine path
  const complexity = calculateComplexity(task.content);

  // Detect language
  const hasSpanish = /[áéíóúñ¿¡]|hola|gracias|buenos|por\s+favor/i.test(task.content);
  const language = hasSpanish ? (task.content.match(/[a-zA-Z]/g)?.length ?? 0) > 10 ? 'mixed' : 'es' : 'en';

  const classification: TaskClassification = {
    intent: complexity.path === 'abort' ? 'security_threat' : complexity.path,
    language,
    complexity: complexity.score,
    patterns: complexity.matches,
  };

  return {
    sefirah: 'keter',
    success: true,
    output: classification,
    duration: Date.now() - start,
  };
}

/**
 * Chokmah - Creative Expansion
 */
async function processChokmah(task: Task, classification: TaskClassification): Promise<SefirahResult> {
  const start = Date.now();

  // Generate creative expansions/alternatives
  const expansions = [];

  if (classification.complexity > 30) {
    expansions.push('Consider breaking into smaller steps');
    expansions.push('Explore alternative approaches');
  }

  if (classification.intent === 'graph') {
    expansions.push('Full tree traversal recommended');
    expansions.push('Multiple skills may be needed');
  }

  return {
    sefirah: 'chokmah',
    success: true,
    output: { expansions },
    duration: Date.now() - start,
  };
}

/**
 * Binah - Analytical Restriction
 */
async function processBinah(task: Task, classification: TaskClassification): Promise<SefirahResult> {
  const start = Date.now();

  // Apply analytical constraints
  const constraints = [];

  if (classification.complexity > 60) {
    constraints.push('High complexity - proceed with caution');
  }

  if (classification.language === 'mixed') {
    constraints.push('Bilingual input detected - maintain language consistency');
  }

  // Check for specific restrictions
  if (/database|db|sql/i.test(task.content)) {
    constraints.push('Database operations - require explicit confirmation');
  }

  if (/delete|remove|drop/i.test(task.content)) {
    constraints.push('Destructive operation - require confirmation');
  }

  return {
    sefirah: 'binah',
    success: true,
    output: { constraints },
    duration: Date.now() - start,
  };
}

/**
 * Da'at - Hot Context Cache
 */
async function processDaat(task: Task): Promise<SefirahResult> {
  const start = Date.now();

  // Get relevant context from recent memory
  const hotContext = getHotContext(task.content, 5);

  return {
    sefirah: 'daat',
    success: true,
    output: {
      relevantMemories: hotContext.length,
      context: hotContext.map(m => ({
        task: m.task.substring(0, 50),
        path: m.path,
        timestamp: m.timestamp,
      })),
    },
    duration: Date.now() - start,
  };
}

/**
 * Chesed - Skill Expansion
 */
async function processChesed(task: Task): Promise<SefirahResult> {
  const start = Date.now();

  // Match skills using dual matching (scanner + keywords)
  const skillResult = await matchSkills(task.content);

  return {
    sefirah: 'chesed',
    success: true,
    output: {
      availableSkills: skillResult.available.length,
      matchedSkills: skillResult.matched.slice(0, 5),
      fallbackUsed: skillResult.fallbackUsed,
    },
    duration: Date.now() - start,
  };
}

/**
 * Gevurah - Security Gate
 */
async function processGevurah(task: Task): Promise<SefirahResult> {
  const start = Date.now();

  // Analyze for security threats
  const shieldResult = analyzeThreats(task.content);

  return {
    sefirah: 'gevurah',
    success: shieldResult.safe,
    output: shieldResult,
    duration: Date.now() - start,
    error: shieldResult.safe ? undefined : getAbortMessage(shieldResult),
  };
}

/**
 * Tiferet - Central Orchestration
 */
async function processTiferet(
  task: Task,
  previousResults: SefirahResult[]
): Promise<SefirahResult> {
  const start = Date.now();

  // Gather all inputs from previous sefirot
  const keterResult = previousResults.find(r => r.sefirah === 'keter');
  const chokmahResult = previousResults.find(r => r.sefirah === 'chokmah');
  const binahResult = previousResults.find(r => r.sefirah === 'binah');
  const daatResult = previousResults.find(r => r.sefirah === 'daat');
  const chesedResult = previousResults.find(r => r.sefirah === 'chesed');
  const gevurahResult = previousResults.find(r => r.sefirah === 'gevurah');

  // Check if Gevurah blocked
  if (gevurahResult && !gevurahResult.success) {
    return {
      sefirah: 'tiferet',
      success: false,
      output: { blocked: true, reason: 'Security gate triggered' },
      duration: Date.now() - start,
      error: 'Blocked by Gevurah',
    };
  }

  // Harmonize all inputs
  const orchestration = {
    classification: keterResult?.output,
    expansions: chokmahResult?.output,
    constraints: binahResult?.output,
    context: daatResult?.output,
    skills: chesedResult?.output,
    security: gevurahResult?.output,
    decision: 'proceed',
    notes: [] as string[],
  };

  // Add notes based on inputs
  if ((binahResult?.output as any)?.constraints?.length > 0) {
    orchestration.notes.push('Constraints applied from Binah');
  }

  if ((chesedResult?.output as any)?.matchedSkills?.length > 0) {
    orchestration.notes.push(`${(chesedResult?.output as any).matchedSkills.length} skills matched`);
  }

  return {
    sefirah: 'tiferet',
    success: true,
    output: orchestration,
    duration: Date.now() - start,
  };
}

/**
 * Netzach - Proactive Actions
 */
async function processNetzach(task: Task, tiferetResult: SefirahResult): Promise<SefirahResult> {
  const start = Date.now();

  // Suggest proactive follow-up actions
  const suggestions = [];

  if (/monitor|watch|track/i.test(task.content)) {
    suggestions.push({
      action: 'schedule_check',
      description: 'Set up periodic monitoring',
      interval: 'hourly',
    });
  }

  if (/create|generate|build/i.test(task.content)) {
    suggestions.push({
      action: 'validate_output',
      description: 'Validate created artifacts',
    });
  }

  if (/analyze|review/i.test(task.content)) {
    suggestions.push({
      action: 'save_report',
      description: 'Save analysis for future reference',
    });
  }

  return {
    sefirah: 'netzach',
    success: true,
    output: { suggestions },
    duration: Date.now() - start,
  };
}

/**
 * Hod - Structured Output
 */
async function processHod(
  task: Task,
  previousResults: SefirahResult[]
): Promise<SefirahResult> {
  const start = Date.now();

  // Structure the output based on all results
  const tiferetResult = previousResults.find(r => r.sefirah === 'tiferet');
  const netzachResult = previousResults.find(r => r.sefirah === 'netzach');

  // Build structured response
  const structured = {
    status: tiferetResult?.success ? 'success' : 'blocked',
    summary: buildSummary(task, previousResults),
    details: {
      classification: previousResults.find(r => r.sefirah === 'keter')?.output,
      skills: previousResults.find(r => r.sefirah === 'chesed')?.output,
      proactive: netzachResult?.output,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      sefirotTraversed: previousResults.map(r => r.sefirah),
      totalDuration: previousResults.reduce((sum, r) => sum + r.duration, 0),
    },
  };

  return {
    sefirah: 'hod',
    success: true,
    output: structured,
    duration: Date.now() - start,
  };
}

/**
 * Yesod - Memory/Persistence
 */
async function processYesod(
  task: Task,
  previousResults: SefirahResult[],
  path: PathType
): Promise<SefirahResult> {
  const start = Date.now();

  // Build result summary
  const hodResult = previousResults.find(r => r.sefirah === 'hod');
  const summary = (hodResult?.output as any)?.summary || 'Task processed';

  // Store in memory
  const sefirotActivated = previousResults.map(r => r.sefirah);
  const memoryEntry = addMemory(
    task.content,
    summary,
    path,
    sefirotActivated
  );

  return {
    sefirah: 'yesod',
    success: true,
    output: {
      stored: true,
      memoryId: memoryEntry.id,
      entriesTotal: getMemoryStats()?.totalEntries || 1,
    },
    duration: Date.now() - start,
  };
}

/**
 * Malkuth - Channel Delivery
 */
async function processMalkuth(
  task: Task,
  previousResults: SefirahResult[]
): Promise<SefirahResult> {
  const start = Date.now();

  const hodResult = previousResults.find(r => r.sefirah === 'hod');
  const structured = hodResult?.output as any;

  // Format for channel
  const formatted = formatForChannel(structured, task.channel);

  return {
    sefirah: 'malkuth',
    success: true,
    output: {
      channel: task.channel,
      formatted,
    },
    duration: Date.now() - start,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildSummary(task: Task, results: SefirahResult[]): string {
  const keterResult = results.find(r => r.sefirah === 'keter');
  const classification = keterResult?.output as TaskClassification | undefined;

  if (!classification) {
    return 'Task processed through sefirotic tree';
  }

  const pathName = classification.intent === 'security_threat' ? 'ABORTED' : classification.intent.toUpperCase();
  return `Task classified as ${pathName} (score: ${classification.complexity}). Traversed ${results.length} sefirot.`;
}

function formatForChannel(structured: any, channel: Channel): string {
  const summary = structured?.summary || 'Task processed';

  switch (channel) {
    case 'whatsapp':
      // WhatsApp-friendly markdown
      return `*🌳 Sefirotic Response*\n\n${summary}`;

    case 'slack':
      // Slack blocks format
      return `*🌳 Sefirotic Response*\n\n${summary}\n\n_Traversed: ${structured?.metadata?.sefirotTraversed?.join(' → ') || 'N/A'}_`;

    case 'email':
      // HTML-friendly
      return `<h2>🌳 Sefirotic Response</h2><p>${summary}</p>`;

    case 'cli':
    case 'api':
    default:
      return summary;
  }
}

// ============================================================================
// Main Orchestrator
// ============================================================================

/**
 * Main orchestrator entry point
 */
export async function orchestrate(input: OrchestratorInput): Promise<OrchestratorResult> {
  const startTime = Date.now();
  const id = generateId();
  const results: SefirahResult[] = [];

  const { task, options = {} } = input;

  // Step 1: Keter - Classification
  const keterResult = await processKeter(task);
  results.push(keterResult);

  const classification = keterResult.output as TaskClassification;
  let path: PathType = options.forcePath || classification.intent as PathType;

  // Step 2: Security check (always via Gevurah)
  if (!options.skipSecurity) {
    const gevurahResult = await processGevurah(task);
    results.push(gevurahResult);

    if (!gevurahResult.success) {
      path = 'abort';
    }
  }

  // Step 3: Execute based on path
  if (path === 'abort') {
    // Abort path - minimal traversal
    const malkuthResult = await processMalkuth(task, results);
    results.push(malkuthResult);

    return {
      id,
      task,
      path: 'abort',
      score: classification.complexity,
      results,
      finalOutput: getAbortMessage(results.find(r => r.sefirah === 'gevurah')?.output as any),
      duration: Date.now() - startTime,
      memoryStored: false,
      shieldResult: results.find(r => r.sefirah === 'gevurah')?.output as any,
    };
  }

  if (path === 'fast') {
    // Fast path - minimal traversal
    const tiferetResult = await processTiferet(task, results);
    results.push(tiferetResult);

    const hodResult = await processHod(task, results);
    results.push(hodResult);

    const malkuthResult = await processMalkuth(task, results);
    results.push(malkuthResult);

  } else {
    // Graph path - full traversal
    const chokmahResult = await processChokmah(task, classification);
    results.push(chokmahResult);

    const binahResult = await processBinah(task, classification);
    results.push(binahResult);

    const daatResult = await processDaat(task);
    results.push(daatResult);

    const chesedResult = await processChesed(task);
    results.push(chesedResult);

    const tiferetResult = await processTiferet(task, results);
    results.push(tiferetResult);

    const netzachResult = await processNetzach(task, tiferetResult);
    results.push(netzachResult);

    const hodResult = await processHod(task, results);
    results.push(hodResult);

    const yesodResult = await processYesod(task, results, path);
    results.push(yesodResult);

    const malkuthResult = await processMalkuth(task, results);
    results.push(malkuthResult);
  }

  // Get final output
  const malkuthResult = results.find(r => r.sefirah === 'malkuth');
  const finalOutput = (malkuthResult?.output as any)?.formatted || 'Task processed';

  return {
    id,
    task,
    path,
    score: classification.complexity,
    results,
    finalOutput,
    duration: Date.now() - startTime,
    memoryStored: path === 'graph',
    shieldResult: results.find(r => r.sefirah === 'gevurah')?.output as any || { safe: true, alerts: [], highestSeverity: null, recommendation: 'proceed' },
  };
}

/**
 * Format orchestrator result for display
 */
export function formatResult(result: OrchestratorResult): string {
  const pathIcon = {
    fast: '⚡',
    graph: '🌳',
    abort: '🛡️',
    consultation: '💬',
    mental: '🧠',
  };

  let output = `\n${'═'.repeat(60)}\n`;
  output += `🌳 SEFIROTIC ORCHESTRATOR RESULT\n`;
  output += `${'═'.repeat(60)}\n\n`;

  output += `ID: ${result.id}\n`;
  output += `Path: ${pathIcon[result.path]} ${result.path.toUpperCase()}\n`;
  output += `Score: ${result.score}\n`;
  output += `Duration: ${result.duration}ms\n`;
  output += `Memory Stored: ${result.memoryStored ? 'Yes' : 'No'}\n\n`;

  output += `Traversal:\n`;
  for (const sefirahResult of result.results) {
    const status = sefirahResult.success ? '✅' : '❌';
    output += `  ${status} ${sefirahResult.sefirah.padEnd(10)} (${sefirahResult.duration}ms)\n`;
  }

  output += `\nFinal Output:\n`;
  output += `${'─'.repeat(40)}\n`;
  output += result.finalOutput;
  output += `\n${'─'.repeat(40)}\n`;

  if (!result.shieldResult.safe) {
    output += `\n${formatShieldResult(result.shieldResult)}`;
  }

  return output;
}
