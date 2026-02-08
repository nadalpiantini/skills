/**
 * Sefirotic Orchestrator - Complexity Scoring (Keter/Binah)
 * Heuristic scoring to determine Fast vs Graph path
 * Restored with full pattern tables from v0.1
 */

import type { PatternMatch, ComplexityResult, PathType } from './types.js';

// ============================================================================
// Pattern Definitions
// ============================================================================

interface PatternDef {
  name: string;
  patterns: RegExp[];
  weight: number;
  category: 'simple' | 'complex' | 'security' | 'modifier';
}

// Simple patterns (reduce complexity)
const SIMPLE_PATTERNS: PatternDef[] = [
  {
    name: 'greeting',
    patterns: [
      /^(hello|hi|hey|hola|buenos?\s+d[ií]as?|buenas?\s+(tardes?|noches?))/i,
      /^(what'?s?\s+up|howdy|greetings|saludos)/i,
    ],
    weight: -20,
    category: 'simple',
  },
  {
    name: 'lookup',
    patterns: [
      /^(what\s+is|define|qu[eé]\s+es|significa)\s+/i,
      /^(tell\s+me\s+about|explain|describe)/i,
      /^(how\s+do\s+you|c[oó]mo\s+se)/i,
    ],
    weight: -15,
    category: 'simple',
  },
  {
    name: 'acknowledgment',
    patterns: [
      /^(ok|okay|thanks?|got\s+it|understood|entendido|gracias|perfecto|listo)/i,
      /^(sure|yes|no|s[ií]|claro)/i,
    ],
    weight: -10,
    category: 'simple',
  },
  {
    name: 'yes_no_question',
    patterns: [
      /^(is\s+it|can\s+(i|you)|should\s+(i|we)|do\s+(you|i))/i,
      /^(are\s+(you|we|they)|will\s+(it|you))/i,
      /\?$/,
    ],
    weight: -10,
    category: 'simple',
  },
];

// Complex patterns (increase complexity)
const COMPLEX_PATTERNS: PatternDef[] = [
  {
    name: 'multi_step',
    patterns: [
      /(first|then|after\s+that|finally|next|before|despu[eé]s|luego|primero)/i,
      /(step\s+\d|phase\s+\d|parte\s+\d|paso\s+\d)/i,
      /(\d+\.\s*\w|\d+\)\s*\w)/i, // Numbered lists
    ],
    weight: 25,
    category: 'complex',
  },
  {
    name: 'proactive',
    patterns: [
      /(monitor|watch|track|alert|notify|observe|av[ií]same|notif[ií]came)/i,
      /(keep\s+an?\s+eye|stay\s+on\s+top|mantente\s+atento)/i,
      /(schedule|recurring|every\s+(day|hour|week)|cada\s+(d[ií]a|hora|semana))/i,
    ],
    weight: 20,
    category: 'complex',
  },
  {
    name: 'conditional',
    patterns: [
      /(if|when|unless|until|while|si|cuando|hasta\s+que|mientras)/i,
      /(in\s+case|should\s+.+\s+happen|en\s+caso\s+de)/i,
      /(\?\s*.+:\s*.+)/, // Ternary-like
    ],
    weight: 15,
    category: 'complex',
  },
  {
    name: 'integration',
    patterns: [
      /(connect\s+to|integrate\s+with|sync\s+with|link\s+to)/i,
      /(conectar\s+(a|con)|integrar\s+con|sincronizar)/i,
      /(api|webhook|endpoint)/i,
    ],
    weight: 15,
    category: 'complex',
  },
  {
    name: 'analysis',
    patterns: [
      /(analyze|compare|evaluate|assess|review|analiza|compara|eval[uú]a)/i,
      /(find\s+patterns?|identify\s+trends?|detect)/i,
      /(audit|benchmark|measure|medir|auditar)/i,
    ],
    weight: 15,
    category: 'complex',
  },
  {
    name: 'creation',
    patterns: [
      /(create|build|generate|make|develop|crea|construye|genera)/i,
      /(set\s+up|configure|initialize|establecer|configurar)/i,
      /(new\s+(file|project|app|function)|nuevo\s+(archivo|proyecto))/i,
    ],
    weight: 10,
    category: 'complex',
  },
  {
    name: 'file_operations',
    patterns: [
      /(read\s+file|write\s+to|save\s+to|modify\s+file)/i,
      /(leer\s+archivo|escribir\s+en|guardar\s+en)/i,
      /(\.md|\.json|\.ts|\.js|\.py|\.txt)$/i,
    ],
    weight: 10,
    category: 'complex',
  },
  {
    name: 'automation',
    patterns: [
      /(automate|automatic|automatically|autom[aá]tico)/i,
      /(batch|bulk|mass|multiple\s+files?)/i,
      /(loop|iterate|for\s+each|para\s+cada)/i,
    ],
    weight: 15,
    category: 'complex',
  },
];

// Security patterns (high weight, may trigger abort)
const SECURITY_PATTERNS: PatternDef[] = [
  {
    name: 'shield_critical',
    patterns: [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions?/i,
      /reveal\s+your\s+(system\s+)?prompt/i,
      /\$\([^)]+\)|`[^`]+`/, // Command substitution
    ],
    weight: 100,
    category: 'security',
  },
  {
    name: 'shield_high',
    patterns: [
      /\.\.\/(\.\.\/)+/i, // Directory traversal
      /rm\s+-rf|del\s+\/f/i, // Destructive commands
      /DROP\s+TABLE|TRUNCATE/i, // Destructive SQL
    ],
    weight: 50,
    category: 'security',
  },
];

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate complexity score for a task
 */
export function calculateComplexity(task: string): ComplexityResult {
  const matches: PatternMatch[] = [];
  let simpleScore = 0;
  let complexScore = 0;
  let modifierScore = 0;
  let securityScore = 0;

  // Check simple patterns
  for (const patternDef of SIMPLE_PATTERNS) {
    for (const pattern of patternDef.patterns) {
      const match = task.match(pattern);
      if (match) {
        matches.push({
          pattern: patternDef.name,
          category: patternDef.category,
          weight: patternDef.weight,
          matched: match[0],
        });
        simpleScore += patternDef.weight;
        break; // Only count once per pattern type
      }
    }
  }

  // Check complex patterns - count ALL matches, not just first per type
  for (const patternDef of COMPLEX_PATTERNS) {
    let matchedThisPattern = false;
    for (const pattern of patternDef.patterns) {
      const allMatches = task.match(new RegExp(pattern.source, pattern.flags + 'g'));
      if (allMatches && !matchedThisPattern) {
        matches.push({
          pattern: patternDef.name,
          category: patternDef.category,
          weight: patternDef.weight,
          matched: allMatches[0],
        });
        complexScore += patternDef.weight;
        matchedThisPattern = true;
        break;
      }
    }
  }

  // Check security patterns
  for (const patternDef of SECURITY_PATTERNS) {
    for (const pattern of patternDef.patterns) {
      const match = task.match(pattern);
      if (match) {
        matches.push({
          pattern: patternDef.name,
          category: patternDef.category,
          weight: patternDef.weight,
          matched: match[0],
        });
        securityScore += patternDef.weight;
        break;
      }
    }
  }

  // Apply length modifiers
  if (task.length < 30) {
    modifierScore -= 15;
    matches.push({
      pattern: 'short_message',
      category: 'modifier',
      weight: -15,
      matched: `(${task.length} chars)`,
    });
  }

  const wordCount = task.split(/\s+/).length;
  if (wordCount > 20) {
    modifierScore += 10;
    matches.push({
      pattern: 'long_message',
      category: 'modifier',
      weight: 10,
      matched: `(${wordCount} words)`,
    });
  }

  // Calculate total score
  const score = simpleScore + complexScore + modifierScore + securityScore;

  // Determine path
  let path: PathType;
  if (securityScore >= 100) {
    path = 'abort';
  } else if (score >= 45) {
    path = 'graph';
  } else {
    path = 'fast';
  }

  return {
    score,
    matches,
    path,
    breakdown: {
      simplePatterns: simpleScore,
      complexPatterns: complexScore,
      modifiers: modifierScore,
      security: securityScore,
    },
  };
}

/**
 * Format complexity result for display
 */
export function formatComplexityResult(result: ComplexityResult): string {
  const pathIcon = {
    fast: '⚡',
    graph: '🌳',
    abort: '🛡️',
    consultation: '💬',
    mental: '🧠',
  };

  let output = `📊 Complexity Analysis\n`;
  output += `═══════════════════════\n\n`;
  output += `Score: ${result.score}\n`;
  output += `Path: ${pathIcon[result.path]} ${result.path.toUpperCase()}\n\n`;

  output += `Breakdown:\n`;
  output += `  Simple patterns: ${result.breakdown.simplePatterns}\n`;
  output += `  Complex patterns: ${result.breakdown.complexPatterns}\n`;
  output += `  Modifiers: ${result.breakdown.modifiers}\n`;
  output += `  Security: ${result.breakdown.security}\n\n`;

  if (result.matches.length > 0) {
    output += `Matches:\n`;
    for (const match of result.matches) {
      const sign = match.weight >= 0 ? '+' : '';
      output += `  [${sign}${match.weight}] ${match.pattern}: "${match.matched}"\n`;
    }
  }

  return output;
}

/**
 * Get threshold explanation
 */
export function getThresholdExplanation(): string {
  return `
Complexity Thresholds:
═════════════════════
• Score < 45  → ⚡ Fast Path (minimal traversal)
• Score >= 45 → 🌳 Graph Path (full traversal)
• SHIELD Critical → 🛡️ Abort Path (security block)

Scoring Weights:
════════════════
SIMPLE (reduce score):
  • Greeting: -20
  • Lookup: -15
  • Acknowledgment: -10
  • Yes/No question: -10

COMPLEX (increase score):
  • Multi-step: +25
  • Proactive: +20
  • Conditional: +15
  • Integration: +15
  • Analysis: +15
  • Creation: +10
  • File operations: +10
  • Automation: +15

MODIFIERS:
  • Short message (<30 chars): -15
  • Long message (>20 words): +10

SECURITY:
  • SHIELD Critical: +100 (triggers abort)
  • SHIELD High: +50
`;
}
