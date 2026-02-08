/**
 * Sefirotic Orchestrator - Skill Scanner (Chesed)
 * Dual matching: Scanner for discovery + Keywords for relevance
 * Restores the SKILL_KEYWORDS dictionary from v0.1
 */

import type { SkillMetadata, SkillMatch, SkillScanResult } from './types.js';

// ============================================================================
// SKILL_KEYWORDS Dictionary (Restored from v0.1)
// Used for relevance matching when scanner doesn't have enough info
// ============================================================================

export const SKILL_KEYWORDS: Record<string, string[]> = {
  'shell-exec': [
    'run', 'execute', 'command', 'terminal', 'bash', 'shell', 'script',
    'ejecutar', 'comando', 'terminal', 'correr',
  ],
  'file-read': [
    'read', 'open', 'view', 'show', 'display', 'content', 'file',
    'leer', 'abrir', 'ver', 'mostrar', 'contenido', 'archivo',
  ],
  'file-write': [
    'write', 'save', 'create', 'update', 'modify', 'edit', 'append',
    'escribir', 'guardar', 'crear', 'actualizar', 'modificar', 'editar',
  ],
  'browser-navigate': [
    'browse', 'navigate', 'open', 'url', 'website', 'page', 'link',
    'navegar', 'abrir', 'sitio', 'página', 'enlace', 'web',
  ],
  'git-operations': [
    'git', 'commit', 'push', 'pull', 'branch', 'merge', 'clone', 'repo',
    'repository', 'version', 'checkout', 'stash', 'rebase',
  ],
  'npm-operations': [
    'npm', 'install', 'package', 'dependency', 'node', 'yarn', 'pnpm',
    'dependencia', 'paquete', 'instalar',
  ],
  'email-send': [
    'email', 'send', 'mail', 'message', 'notify', 'notification',
    'correo', 'enviar', 'mensaje', 'notificar', 'notificación',
  ],
  'code-generate': [
    'generate', 'create', 'build', 'code', 'function', 'class', 'component',
    'generar', 'crear', 'construir', 'código', 'función', 'clase', 'componente',
  ],
  'summarize': [
    'summarize', 'summary', 'tldr', 'brief', 'overview', 'digest',
    'resumir', 'resumen', 'breve', 'síntesis',
  ],
  'calendar-manage': [
    'calendar', 'schedule', 'event', 'meeting', 'appointment', 'remind',
    'calendario', 'evento', 'reunión', 'cita', 'recordar', 'agendar',
  ],
  'api-call': [
    'api', 'request', 'fetch', 'endpoint', 'rest', 'graphql', 'webhook',
    'llamada', 'petición', 'solicitud',
  ],
  'database': [
    'database', 'db', 'query', 'sql', 'postgres', 'mysql', 'mongo', 'supabase',
    'base de datos', 'consulta',
  ],
  'image-process': [
    'image', 'photo', 'picture', 'resize', 'crop', 'compress', 'convert',
    'imagen', 'foto', 'redimensionar', 'recortar', 'comprimir',
  ],
  'ai-generate': [
    'ai', 'generate', 'llm', 'gpt', 'claude', 'prompt', 'completion',
    'inteligencia artificial', 'generar', 'completar',
  ],
  'monitoring': [
    'monitor', 'watch', 'track', 'alert', 'notify', 'observe', 'check',
    'monitorear', 'vigilar', 'rastrear', 'alertar', 'observar',
  ],
};

// ============================================================================
// Mock Skills Registry (Would be replaced by real scanner in production)
// ============================================================================

const MOCK_SKILLS: SkillMetadata[] = [
  {
    name: 'shell-exec',
    version: '1.0.0',
    description: 'Execute shell commands safely',
    author: 'openclaw',
    tags: ['shell', 'command', 'execution'],
  },
  {
    name: 'file-ops',
    version: '1.0.0',
    description: 'Read and write files',
    author: 'openclaw',
    tags: ['file', 'read', 'write'],
  },
  {
    name: 'git-helper',
    version: '1.0.0',
    description: 'Git operations helper',
    author: 'openclaw',
    tags: ['git', 'version-control'],
  },
  {
    name: 'browser-nav',
    version: '1.0.0',
    description: 'Browser navigation and automation',
    author: 'openclaw',
    tags: ['browser', 'web', 'automation'],
  },
  {
    name: 'api-client',
    version: '1.0.0',
    description: 'Make API requests',
    author: 'openclaw',
    tags: ['api', 'http', 'rest'],
  },
  {
    name: 'code-gen',
    version: '1.0.0',
    description: 'Generate code snippets and files',
    author: 'openclaw',
    tags: ['code', 'generate', 'create'],
  },
  {
    name: 'summarizer',
    version: '1.0.0',
    description: 'Summarize text and documents',
    author: 'openclaw',
    tags: ['summarize', 'text', 'analysis'],
  },
  {
    name: 'scheduler',
    version: '1.0.0',
    description: 'Schedule tasks and reminders',
    author: 'openclaw',
    tags: ['schedule', 'calendar', 'remind'],
  },
  {
    name: 'monitor-agent',
    version: '1.0.0',
    description: 'Monitor resources and send alerts',
    author: 'openclaw',
    tags: ['monitor', 'alert', 'watch'],
  },
  {
    name: 'db-query',
    version: '1.0.0',
    description: 'Database queries and operations',
    author: 'openclaw',
    tags: ['database', 'sql', 'query'],
  },
];

// ============================================================================
// Scanner Functions
// ============================================================================

/**
 * Scan available skills (would read from filesystem in production)
 */
export async function scanSkills(): Promise<SkillMetadata[]> {
  // In production, this would:
  // 1. Read ~/.openclaw/skills directory
  // 2. Parse each SKILL.md for metadata
  // 3. Cache results

  // For now, return mock data
  return MOCK_SKILLS;
}

/**
 * Match keywords to skill categories
 */
export function matchKeywords(task: string): string[] {
  const matchedCategories: string[] = [];
  const taskLower = task.toLowerCase();

  for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (taskLower.includes(keyword.toLowerCase())) {
        if (!matchedCategories.includes(category)) {
          matchedCategories.push(category);
        }
        break;
      }
    }
  }

  return matchedCategories;
}

/**
 * Calculate relevance score between task and skill
 */
function calculateRelevance(task: string, skill: SkillMetadata, matchedKeywords: string[]): number {
  const taskLower = task.toLowerCase();
  let score = 0;
  const matched: string[] = [];

  // Check skill name
  if (taskLower.includes(skill.name.toLowerCase())) {
    score += 30;
    matched.push(skill.name);
  }

  // Check skill description
  const descWords = skill.description.toLowerCase().split(/\s+/);
  for (const word of descWords) {
    if (word.length > 3 && taskLower.includes(word)) {
      score += 5;
      matched.push(word);
    }
  }

  // Check skill tags
  if (skill.tags) {
    for (const tag of skill.tags) {
      if (taskLower.includes(tag.toLowerCase())) {
        score += 10;
        matched.push(tag);
      }
    }
  }

  // Bonus for keyword category match
  const skillCategories = matchedKeywords.filter(cat => {
    const keywords = SKILL_KEYWORDS[cat] || [];
    return keywords.some(kw =>
      skill.name.toLowerCase().includes(kw.toLowerCase()) ||
      skill.description.toLowerCase().includes(kw.toLowerCase()) ||
      (skill.tags || []).some(t => t.toLowerCase().includes(kw.toLowerCase()))
    );
  });

  if (skillCategories.length > 0) {
    score += 20 * skillCategories.length;
  }

  return score;
}

/**
 * Dual matching: Scanner + Keywords (Chesed's core function)
 * This restores the original v0.1 behavior with the new scanner
 */
export async function matchSkills(task: string): Promise<SkillScanResult> {
  // Step 1: Keyword matching (fast, always works)
  const matchedCategories = matchKeywords(task);

  // Step 2: Scan available skills
  const available = await scanSkills();

  // Step 3: Calculate relevance for each skill
  const matches: SkillMatch[] = [];

  for (const skill of available) {
    const matchedKeywords: string[] = [];

    // Collect matched keywords
    for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
      if (matchedCategories.includes(category)) {
        for (const kw of keywords) {
          if (task.toLowerCase().includes(kw.toLowerCase())) {
            matchedKeywords.push(kw);
          }
        }
      }
    }

    const relevance = calculateRelevance(task, skill, matchedCategories);

    if (relevance > 0) {
      matches.push({
        skill,
        relevance,
        matchedKeywords: [...new Set(matchedKeywords)],
        source: matchedKeywords.length > 0 ? 'both' : 'scanner',
      });
    }
  }

  // Step 4: Sort by relevance
  matches.sort((a, b) => b.relevance - a.relevance);

  // Step 5: Determine if fallback was used
  const fallbackUsed = matches.every(m => m.source === 'keywords');

  return {
    available,
    matched: matches,
    fallbackUsed,
  };
}

/**
 * Get best matching skills (top N)
 */
export async function getTopSkills(task: string, limit: number = 3): Promise<SkillMatch[]> {
  const result = await matchSkills(task);
  return result.matched.slice(0, limit);
}

/**
 * Format skill matches for output
 */
export function formatSkillMatches(matches: SkillMatch[]): string {
  if (matches.length === 0) {
    return '📦 No matching skills found.';
  }

  let output = '📦 Matching Skills:\n\n';

  for (const match of matches) {
    const sourceIcon = match.source === 'both' ? '✨' : match.source === 'scanner' ? '🔍' : '🔑';
    output += `${sourceIcon} ${match.skill.name} (v${match.skill.version})\n`;
    output += `   Relevance: ${match.relevance}\n`;
    output += `   Description: ${match.skill.description}\n`;
    if (match.matchedKeywords.length > 0) {
      output += `   Keywords: ${match.matchedKeywords.join(', ')}\n`;
    }
    output += '\n';
  }

  return output;
}

// ============================================================================
// Skill Statistics
// ============================================================================

export function getSkillKeywordStats(): {
  categories: number;
  totalKeywords: number;
  keywordsPerCategory: Record<string, number>;
} {
  const keywordsPerCategory: Record<string, number> = {};
  let total = 0;

  for (const [category, keywords] of Object.entries(SKILL_KEYWORDS)) {
    keywordsPerCategory[category] = keywords.length;
    total += keywords.length;
  }

  return {
    categories: Object.keys(SKILL_KEYWORDS).length,
    totalKeywords: total,
    keywordsPerCategory,
  };
}
