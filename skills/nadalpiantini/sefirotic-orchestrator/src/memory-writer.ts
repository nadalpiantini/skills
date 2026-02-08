/**
 * Sefirotic Orchestrator - Memory Writer (Yesod)
 * Persistence layer that writes to MEMORY.md
 * Foundation for future vector search
 */

import * as fs from 'fs';
import * as path from 'path';
import type { MemoryEntry, MemoryStore, PathType, SefirahName } from './types.js';

// ============================================================================
// Configuration
// ============================================================================

const MEMORY_FILE = 'MEMORY.md';
const MAX_ENTRIES = 100; // Keep last 100 entries

// ============================================================================
// Memory Store
// ============================================================================

let memoryStore: MemoryStore = {
  entries: [],
  lastUpdated: new Date(),
  sessionId: generateSessionId(),
};

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Add entry to memory
 */
export function addMemory(
  task: string,
  result: string,
  pathType: PathType,
  sefirotActivated: SefirahName[],
  context?: Record<string, unknown>
): MemoryEntry {
  const entry: MemoryEntry = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    timestamp: new Date(),
    task,
    result,
    path: pathType,
    sefirotActivated,
    context,
  };

  memoryStore.entries.push(entry);
  memoryStore.lastUpdated = new Date();

  // Trim old entries
  if (memoryStore.entries.length > MAX_ENTRIES) {
    memoryStore.entries = memoryStore.entries.slice(-MAX_ENTRIES);
  }

  return entry;
}

/**
 * Get recent memories
 */
export function getRecentMemories(count: number = 10): MemoryEntry[] {
  return memoryStore.entries.slice(-count);
}

/**
 * Search memories by keyword
 */
export function searchMemories(query: string): MemoryEntry[] {
  const queryLower = query.toLowerCase();
  return memoryStore.entries.filter(
    entry =>
      entry.task.toLowerCase().includes(queryLower) ||
      entry.result.toLowerCase().includes(queryLower)
  );
}

/**
 * Get memories by path type
 */
export function getMemoriesByPath(pathType: PathType): MemoryEntry[] {
  return memoryStore.entries.filter(entry => entry.path === pathType);
}

/**
 * Get context for Da'at (hot context cache)
 * Returns recent relevant context for current task
 */
export function getHotContext(currentTask: string, limit: number = 5): MemoryEntry[] {
  const keywords = currentTask.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  // Score each memory by relevance to current task
  const scored = memoryStore.entries.map(entry => {
    let score = 0;
    const entryText = (entry.task + ' ' + entry.result).toLowerCase();

    for (const keyword of keywords) {
      if (entryText.includes(keyword)) {
        score += 1;
      }
    }

    // Recency bonus
    const age = Date.now() - entry.timestamp.getTime();
    const hoursSinceCreation = age / (1000 * 60 * 60);
    if (hoursSinceCreation < 1) score += 3;
    else if (hoursSinceCreation < 24) score += 1;

    return { entry, score };
  });

  // Return top matches
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry);
}

// ============================================================================
// File Persistence
// ============================================================================

/**
 * Save memory to MEMORY.md file
 */
export function saveToFile(directory: string = '.'): void {
  const filePath = path.join(directory, MEMORY_FILE);

  let content = `# 🌳 Sefirotic Orchestrator Memory\n\n`;
  content += `> Last Updated: ${memoryStore.lastUpdated.toISOString()}\n`;
  content += `> Session: ${memoryStore.sessionId}\n`;
  content += `> Entries: ${memoryStore.entries.length}\n\n`;
  content += `---\n\n`;

  // Group by date
  const byDate: Record<string, MemoryEntry[]> = {};

  for (const entry of memoryStore.entries) {
    const dateKey = entry.timestamp.toISOString().split('T')[0];
    if (!byDate[dateKey]) {
      byDate[dateKey] = [];
    }
    byDate[dateKey].push(entry);
  }

  // Write entries grouped by date (newest first)
  const dates = Object.keys(byDate).sort().reverse();

  for (const date of dates) {
    content += `## ${date}\n\n`;

    for (const entry of byDate[date].reverse()) {
      const pathIcon = {
        fast: '⚡',
        graph: '🌳',
        abort: '🛡️',
        consultation: '💬',
        mental: '🧠',
      };

      const time = entry.timestamp.toISOString().split('T')[1].substring(0, 5);

      content += `### ${time} ${pathIcon[entry.path]} ${entry.path.toUpperCase()}\n\n`;
      content += `**Task:** ${entry.task}\n\n`;
      content += `**Result:** ${entry.result.substring(0, 200)}${entry.result.length > 200 ? '...' : ''}\n\n`;
      content += `**Sefirot:** ${entry.sefirotActivated.join(' → ')}\n\n`;
      content += `---\n\n`;
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Load memory from MEMORY.md file
 */
export function loadFromFile(directory: string = '.'): boolean {
  const filePath = path.join(directory, MEMORY_FILE);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  // For now, just check if file exists
  // Full parsing would require more complex logic
  // This is a placeholder for v0.3's vector search integration

  console.log(`📖 Memory file found: ${filePath}`);
  return true;
}

// ============================================================================
// Memory Statistics
// ============================================================================

/**
 * Get memory statistics
 */
export function getMemoryStats(): {
  totalEntries: number;
  entriesThisSession: number;
  byPath: Record<PathType, number>;
  bySefirah: Record<SefirahName, number>;
  oldestEntry: Date | null;
  newestEntry: Date | null;
} {
  const byPath: Record<PathType, number> = {
    fast: 0,
    graph: 0,
    abort: 0,
    consultation: 0,
    mental: 0,
  };

  const bySefirah: Record<SefirahName, number> = {
    keter: 0,
    chokmah: 0,
    binah: 0,
    daat: 0,
    chesed: 0,
    gevurah: 0,
    tiferet: 0,
    netzach: 0,
    hod: 0,
    yesod: 0,
    malkuth: 0,
  };

  for (const entry of memoryStore.entries) {
    byPath[entry.path]++;
    for (const sefirah of entry.sefirotActivated) {
      bySefirah[sefirah]++;
    }
  }

  return {
    totalEntries: memoryStore.entries.length,
    entriesThisSession: memoryStore.entries.length, // In production, track across sessions
    byPath,
    bySefirah,
    oldestEntry: memoryStore.entries.length > 0 ? memoryStore.entries[0].timestamp : null,
    newestEntry: memoryStore.entries.length > 0 ? memoryStore.entries[memoryStore.entries.length - 1].timestamp : null,
  };
}

/**
 * Format memory stats for display
 */
export function formatMemoryStats(): string {
  const stats = getMemoryStats();

  let output = `📚 Memory Statistics\n`;
  output += `═══════════════════════\n\n`;
  output += `Total Entries: ${stats.totalEntries}\n`;
  output += `Session: ${memoryStore.sessionId}\n\n`;

  output += `By Path:\n`;
  for (const [path, count] of Object.entries(stats.byPath)) {
    if (count > 0) {
      output += `  ${path}: ${count}\n`;
    }
  }

  output += `\nMost Active Sefirot:\n`;
  const sortedSefirot = Object.entries(stats.bySefirah)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (const [sefirah, count] of sortedSefirot) {
    output += `  ${sefirah}: ${count}\n`;
  }

  return output;
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Clear current session memory
 */
export function clearMemory(): void {
  memoryStore = {
    entries: [],
    lastUpdated: new Date(),
    sessionId: generateSessionId(),
  };
}

/**
 * Export memory for backup
 */
export function exportMemory(): MemoryStore {
  return { ...memoryStore };
}

/**
 * Import memory from backup
 */
export function importMemory(store: MemoryStore): void {
  memoryStore = store;
}
