/**
 * Sefirotic Orchestrator - SHIELD v2 (Gevurah)
 * Security patterns and threat detection
 * Gevurah blocks, not filters - threats trigger abort
 */

import type { ShieldPattern, ShieldResult, ShieldAlert, ShieldSeverity } from './types.js';

// ============================================================================
// SHIELD Patterns - Critical (Immediate Abort)
// ============================================================================

const CRITICAL_PATTERNS: ShieldPattern[] = [
  {
    id: 'PROMPT_INJECTION_1',
    pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|rules?)/i,
    severity: 'critical',
    description: 'Prompt injection attempt - ignore instructions',
    category: 'prompt_injection',
  },
  {
    id: 'PROMPT_INJECTION_2',
    pattern: /forget\s+(everything|all|what)\s+(you|i)\s+(told|said|know)/i,
    severity: 'critical',
    description: 'Prompt injection attempt - forget context',
    category: 'prompt_injection',
  },
  {
    id: 'PROMPT_INJECTION_3',
    pattern: /you\s+are\s+now\s+(a|an|the)\s+/i,
    severity: 'critical',
    description: 'Prompt injection attempt - role hijacking',
    category: 'prompt_injection',
  },
  {
    id: 'SYSTEM_PROMPT_EXTRACT',
    pattern: /(reveal|show|display|print|output)\s+(your\s+)?(system\s+)?prompt/i,
    severity: 'critical',
    description: 'System prompt extraction attempt',
    category: 'prompt_extraction',
  },
  {
    id: 'SYSTEM_PROMPT_EXTRACT_2',
    pattern: /what\s+(are|is)\s+your\s+(instructions?|system\s+prompt|rules?)/i,
    severity: 'critical',
    description: 'System prompt extraction attempt',
    category: 'prompt_extraction',
  },
  {
    id: 'COMMAND_INJECTION_1',
    pattern: /;\s*(rm|del|format|mkfs|dd|shutdown|reboot)\s/i,
    severity: 'critical',
    description: 'Command injection - destructive command',
    category: 'command_injection',
  },
  {
    id: 'COMMAND_INJECTION_2',
    pattern: /\$\([^)]*\)|`[^`]*`|\|\s*(bash|sh|zsh|cmd)/i,
    severity: 'critical',
    description: 'Command injection - shell execution',
    category: 'command_injection',
  },
  {
    id: 'CREDENTIAL_EXPOSURE',
    pattern: /(api[_-]?key|secret[_-]?key|password|token|credential)[=:]\s*['"]?[a-zA-Z0-9_-]{20,}/i,
    severity: 'critical',
    description: 'Credential/API key exposure',
    category: 'data_exposure',
  },
  {
    id: 'DATA_EXFIL_1',
    pattern: /curl\s+.*\s+-d\s+.*\$|wget\s+.*--post-data/i,
    severity: 'critical',
    description: 'Data exfiltration via HTTP POST',
    category: 'data_exfiltration',
  },
  {
    id: 'PRIVILEGE_ESCALATION',
    pattern: /sudo\s+chmod\s+777|sudo\s+chown\s+root|sudo\s+su\s+-/i,
    severity: 'critical',
    description: 'Privilege escalation attempt',
    category: 'privilege_escalation',
  },
];

// ============================================================================
// SHIELD Patterns - High (Require Confirmation)
// ============================================================================

const HIGH_PATTERNS: ShieldPattern[] = [
  {
    id: 'FILE_SYSTEM_OUTSIDE',
    pattern: /\.\.\/(\.\.\/)+|\/etc\/|\/var\/|\/root\/|~\//i,
    severity: 'high',
    description: 'File system access outside project directory',
    category: 'file_access',
  },
  {
    id: 'NETWORK_UNKNOWN',
    pattern: /curl\s+https?:\/\/(?!github\.com|api\.anthropic\.com|localhost)/i,
    severity: 'high',
    description: 'Network request to unknown host',
    category: 'network_access',
  },
  {
    id: 'CODE_EXECUTION',
    pattern: /eval\s*\(|exec\s*\(|Function\s*\(|new\s+Function/i,
    severity: 'high',
    description: 'Dynamic code execution',
    category: 'code_execution',
  },
  {
    id: 'DATABASE_MODIFICATION',
    pattern: /DROP\s+TABLE|TRUNCATE\s+TABLE|DELETE\s+FROM\s+\w+\s*;/i,
    severity: 'high',
    description: 'Destructive database operation',
    category: 'database',
  },
  {
    id: 'ENV_ACCESS',
    pattern: /process\.env\.|getenv\s*\(|os\.environ/i,
    severity: 'high',
    description: 'Environment variable access',
    category: 'env_access',
  },
  {
    id: 'FILE_DELETE',
    pattern: /rm\s+-rf|rmdir\s+\/s|del\s+\/f|unlink\s*\(/i,
    severity: 'high',
    description: 'File/directory deletion',
    category: 'file_access',
  },
  {
    id: 'NETWORK_DOWNLOAD',
    pattern: /wget\s+|curl\s+-O|fetch\s*\(\s*['"]https?:/i,
    severity: 'high',
    description: 'External file download',
    category: 'network_access',
  },
  {
    id: 'SUBPROCESS_SPAWN',
    pattern: /child_process|subprocess\.call|os\.system|exec\s*\(/i,
    severity: 'high',
    description: 'Subprocess spawning',
    category: 'code_execution',
  },
];

// ============================================================================
// SHIELD Patterns - Medium (Log and Warn)
// ============================================================================

const MEDIUM_PATTERNS: ShieldPattern[] = [
  {
    id: 'SENSITIVE_FILE_READ',
    pattern: /\.env|\.ssh|\.aws|credentials|config\.json/i,
    severity: 'medium',
    description: 'Reading potentially sensitive files',
    category: 'file_access',
  },
  {
    id: 'REFLECTION_PATTERN',
    pattern: /what\s+are\s+you|who\s+are\s+you|describe\s+yourself/i,
    severity: 'medium',
    description: 'Self-reflection query',
    category: 'introspection',
  },
  {
    id: 'JAILBREAK_ATTEMPT',
    pattern: /pretend\s+you\s+are|act\s+as\s+if|roleplay\s+as/i,
    severity: 'medium',
    description: 'Potential jailbreak attempt',
    category: 'prompt_injection',
  },
];

// ============================================================================
// All Patterns Combined
// ============================================================================

export const SHIELD_PATTERNS: ShieldPattern[] = [
  ...CRITICAL_PATTERNS,
  ...HIGH_PATTERNS,
  ...MEDIUM_PATTERNS,
];

// ============================================================================
// SHIELD Functions
// ============================================================================

/**
 * Analyze input for security threats
 */
export function analyzeThreats(input: string): ShieldResult {
  const alerts: ShieldAlert[] = [];

  for (const pattern of SHIELD_PATTERNS) {
    const match = input.match(pattern.pattern);
    if (match) {
      alerts.push({
        triggered: true,
        severity: pattern.severity,
        pattern,
        matched: match[0],
        action: getAction(pattern.severity),
      });
    }
  }

  // Sort by severity
  const severityOrder: Record<ShieldSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const highestSeverity = alerts.length > 0 ? alerts[0].severity : null;

  return {
    safe: alerts.length === 0 || !alerts.some(a => a.severity === 'critical'),
    alerts,
    highestSeverity,
    recommendation: getRecommendation(alerts),
  };
}

/**
 * Get action for severity level
 */
function getAction(severity: ShieldSeverity): ShieldAlert['action'] {
  switch (severity) {
    case 'critical':
      return 'abort';
    case 'high':
      return 'confirm';
    case 'medium':
      return 'warn';
    case 'low':
      return 'allow';
  }
}

/**
 * Get recommendation based on alerts
 */
function getRecommendation(alerts: ShieldAlert[]): ShieldResult['recommendation'] {
  if (alerts.some(a => a.severity === 'critical')) {
    return 'abort';
  }
  if (alerts.some(a => a.severity === 'high')) {
    return 'confirm';
  }
  return 'proceed';
}

/**
 * Format shield result for output
 */
export function formatShieldResult(result: ShieldResult): string {
  if (result.safe && result.alerts.length === 0) {
    return '🛡️ SHIELD: No threats detected. Proceeding.';
  }

  let output = `🛡️ SHIELD ALERT\n`;
  output += `Recommendation: ${result.recommendation.toUpperCase()}\n\n`;

  for (const alert of result.alerts) {
    const icon = alert.severity === 'critical' ? '🚨' : alert.severity === 'high' ? '⚠️' : '⚡';
    output += `${icon} [${alert.severity.toUpperCase()}] ${alert.pattern.description}\n`;
    output += `   Matched: "${alert.matched}"\n`;
    output += `   Action: ${alert.action}\n\n`;
  }

  return output;
}

/**
 * Quick check if input is safe (no critical threats)
 */
export function isSafe(input: string): boolean {
  return analyzeThreats(input).safe;
}

/**
 * Get abort message for critical threat
 */
export function getAbortMessage(result: ShieldResult): string {
  const criticalAlert = result.alerts.find(a => a.severity === 'critical');
  if (!criticalAlert) {
    return '🛡️ Security check failed. Request terminated.';
  }

  return `🛡️ SECURITY ABORT

Category: ${criticalAlert.pattern.category}
Reason: ${criticalAlert.pattern.description}

This request has been blocked for security reasons.
If you believe this is an error, please rephrase your request.`;
}

// ============================================================================
// SHIELD Statistics
// ============================================================================

export function getShieldStats(): {
  total: number;
  bySeverity: Record<ShieldSeverity, number>;
  byCategory: Record<string, number>;
} {
  const bySeverity: Record<ShieldSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const byCategory: Record<string, number> = {};

  for (const pattern of SHIELD_PATTERNS) {
    bySeverity[pattern.severity]++;
    byCategory[pattern.category] = (byCategory[pattern.category] || 0) + 1;
  }

  return {
    total: SHIELD_PATTERNS.length,
    bySeverity,
    byCategory,
  };
}
