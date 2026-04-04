// File: src/features/ats/atsAnalyzer.ts
import { v4 as uuidv4 } from 'uuid';
import type { Resume, ATSResult, ATSSuggestion, ATSBreakdown, ATSKeywordMatch } from '../../types/resume';

// ─── Stopwords ────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from',
  'is','are','was','were','be','been','being','have','has','had','do','does','did',
  'will','would','could','should','may','might','shall','that','this','these',
  'those','i','me','my','we','our','you','your','they','their','it','its',
  'as','up','if','so','no','not','can','also','about','more','than','then',
  'when','where','who','which','how','what','any','all','both','each','every',
  'just','very','too','well','into','through','during','before','after','above',
  'below','between','out','off','over','under','again','further','once',
]);

// ─── Action verbs for ATS scoring ────────────────────────────────────────────
const ACTION_VERBS = new Set([
  'achieved','architected','automated','built','collaborated','created','designed',
  'developed','drove','engineered','established','executed','expanded','facilitated',
  'generated','implemented','improved','increased','initiated','integrated','launched',
  'led','maintained','managed','mentored','migrated','optimized','oversaw','partnered',
  'reduced','refactored','resolved','scaled','shipped','spearheaded','streamlined',
  'strengthened','supported','transformed','utilized','contributed','delivered','deployed',
  'configured','coordinated','presented','conducted','performed','published','trained',
  'accelerated','advanced','boosted','consolidated','converted','customized','directed',
  'enabled','enhanced','ensured','evaluated','extended','founded','guided','identified',
  'influenced','led','modernized','negotiated','operated','owned','prioritized',
  'produced','researched','restructured','reviewed','simplified','solved','supervised',
]);

// ─── Tokenize ─────────────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function extractBigrams(tokens: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

function getTermFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
}

// ─── Extract all text from resume ─────────────────────────────────────────────
function extractResumeText(resume: Resume): string {
  const parts: string[] = [
    resume.header.name,
    resume.header.title,
    resume.header.location,
  ];
  for (const section of resume.sections) {
    if (!section.enabled) continue;
    const c = section.content;
    if (c.type === 'summary') {
      parts.push(c.text);
    } else if (c.type === 'experience') {
      for (const item of c.items) {
        parts.push(item.company, item.role, item.location);
        for (const b of item.bullets) parts.push(b.text);
      }
    } else if (c.type === 'education') {
      for (const item of c.items) parts.push(item.institution, item.degree, item.field, item.honors);
    } else if (c.type === 'skills') {
      for (const g of c.groups) parts.push(g.category, g.skills);
    } else if (c.type === 'projects') {
      for (const item of c.items) {
        parts.push(item.name, item.description, item.techStack);
        for (const b of item.bullets) parts.push(b.text);
      }
    }
  }
  return parts.join(' ');
}

// ─── Extract keywords from JD ─────────────────────────────────────────────────
function extractJDKeywords(jd: string): string[] {
  const tokens = tokenize(jd);
  const bigrams = extractBigrams(tokens);
  const freq = getTermFrequency([...tokens, ...bigrams]);

  // Sort by frequency, prefer bigrams over unigrams when they appear >=2 times
  const sorted = Array.from(freq.entries())
    .filter(([term, count]) => count >= 1 && term.length > 2)
    .sort((a, b) => {
      const bigramBoost = (t: string) => t.includes(' ') ? 2 : 1;
      return b[1] * bigramBoost(b[0]) - a[1] * bigramBoost(a[0]);
    });

  // Top 40 keywords
  return sorted.slice(0, 40).map(([term]) => term);
}

// ─── Score Sections Completeness ──────────────────────────────────────────────
function scoreCompleteness(resume: Resume): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let score = 0;

  const h = resume.header;
  let headerScore = 0;
  if (h.name.trim()) headerScore += 20;
  if (h.email.trim()) headerScore += 20;
  if (h.phone.trim()) headerScore += 15;
  if (h.title.trim()) headerScore += 20;
  if (h.linkedin.trim() || h.github.trim()) headerScore += 15;
  if (h.location.trim()) headerScore += 10;
  score += Math.min(100, headerScore);

  if (!h.email.trim()) warnings.push('Missing email address in header.');
  if (!h.phone.trim()) warnings.push('Missing phone number in header.');

  const enabledTypes = new Set(resume.sections.filter((s) => s.enabled).map((s) => s.type));

  let sectionScore = 0;
  if (enabledTypes.has('summary')) sectionScore += 25;
  else warnings.push('No summary section — ATS systems often scan summaries for role fit.');
  if (enabledTypes.has('experience')) sectionScore += 35;
  else warnings.push('No experience section found.');
  if (enabledTypes.has('education')) sectionScore += 20;
  if (enabledTypes.has('skills')) sectionScore += 20;
  else warnings.push('No skills section — keyword matching may be lower.');
  score += sectionScore;

  const expSection = resume.sections.find((s) => s.type === 'experience' && s.enabled);
  if (expSection && expSection.content.type === 'experience') {
    for (const item of expSection.content.items) {
      if (item.bullets.length === 0) warnings.push(`Experience at "${item.company || 'unknown'}" has no bullet points.`);
      if (item.bullets.length > 8) warnings.push(`Experience at "${item.company}" has many bullets (${item.bullets.length}); consider trimming to 4–6.`);
    }
  }

  return { score: Math.round(score / 2), warnings };
}

// ─── Score Readability ────────────────────────────────────────────────────────
function scoreReadability(resume: Resume): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let totalBullets = 0;
  let actionVerbBullets = 0;
  let tooLongBullets = 0;
  let tooShortBullets = 0;
  let metricBullets = 0;

  const processSection = (items: { bullets: { text: string }[] }[]) => {
    for (const item of items) {
      for (const bullet of item.bullets) {
        totalBullets++;
        const words = bullet.text.trim().split(/\s+/);
        const firstWord = words[0]?.toLowerCase() ?? '';
        if (ACTION_VERBS.has(firstWord)) actionVerbBullets++;
        if (words.length > 25) tooLongBullets++;
        if (words.length < 5 && bullet.text.trim().length > 0) tooShortBullets++;
        if (/\d+[\%\$kKmM]?\+?|\d+x/.test(bullet.text)) metricBullets++;
      }
    }
  };

  for (const section of resume.sections) {
    if (!section.enabled) continue;
    if (section.content.type === 'experience') processSection(section.content.items);
    if (section.content.type === 'projects') processSection(section.content.items);
  }

  if (tooLongBullets > 0) warnings.push(`${tooLongBullets} bullet point(s) are too long (>25 words); keep bullets concise.`);
  if (tooShortBullets > 0) warnings.push(`${tooShortBullets} bullet point(s) are very short — add more context.`);

  let score = 100;

  // Action verb score (0–35 pts)
  const actionVerbRatio = totalBullets > 0 ? actionVerbBullets / totalBullets : 0;
  const actionVerbScore = Math.round(actionVerbRatio * 35);
  score = actionVerbScore + 65;

  if (actionVerbRatio < 0.5 && totalBullets > 0) {
    warnings.push(`Only ${Math.round(actionVerbRatio * 100)}% of bullets start with action verbs. Aim for 80%+.`);
  }

  // Metric bonus
  const metricRatio = totalBullets > 0 ? metricBullets / totalBullets : 0;
  if (metricRatio < 0.3 && totalBullets > 0) {
    warnings.push('Few quantifiable metrics found. Adding numbers (%, $, time saved) strongly improves impact.');
  }

  // Deduct for too long/short
  score -= tooLongBullets * 3;
  score -= tooShortBullets * 2;

  return { score: Math.max(0, Math.min(100, score)), warnings };
}

// ─── Score Formatting ─────────────────────────────────────────────────────────
function scoreFormatting(resume: Resume): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let score = 100;

  const summarySection = resume.sections.find((s) => s.type === 'summary' && s.enabled);
  if (summarySection && summarySection.content.type === 'summary') {
    const words = summarySection.content.text.trim().split(/\s+/);
    if (words.length > 100) {
      warnings.push('Summary is very long (>100 words). Many ATS systems truncate long summaries.');
      score -= 10;
    }
  }

  if (resume.styles.columns === 2) {
    warnings.push('Two-column layout may not parse correctly in some ATS systems. Consider single-column for submission.');
    score -= 20;
  }

  // Excessive symbols
  const fullText = extractResumeText(resume);
  const symbolCount = (fullText.match(/[★✓•→◆▪▸]/g) ?? []).length;
  if (symbolCount > 10) {
    warnings.push('Unusual symbols detected. Some ATS parsers struggle with non-standard characters.');
    score -= 10;
  }

  return { score: Math.max(0, score), warnings };
}

// ─── Generate Rewrite Suggestions ────────────────────────────────────────────
function generateSuggestions(resume: Resume, missingKeywords: string[]): ATSSuggestion[] {
  const suggestions: ATSSuggestion[] = [];

  const topMissing = missingKeywords.slice(0, 5);

  for (const section of resume.sections) {
    if (!section.enabled) continue;

    // Experience bullets
    if (section.content.type === 'experience') {
      for (const item of section.content.items) {
        for (const bullet of item.bullets) {
          const words = bullet.text.trim().split(/\s+/);
          const firstWord = words[0]?.toLowerCase() ?? '';

          // Suggest action verb if missing
          if (bullet.text.trim() && !ACTION_VERBS.has(firstWord)) {
            suggestions.push({
              id: uuidv4(),
              type: 'rewrite',
              sectionId: section.id,
              itemId: item.id,
              bulletId: bullet.id,
              original: bullet.text,
              suggestion: `Led ${bullet.text.charAt(0).toLowerCase()}${bullet.text.slice(1)}`,
              reason: 'Starting with an action verb (e.g., "Led", "Built", "Improved") increases ATS score and impact.',
              applied: false,
              rejected: false,
            });
          }

          // Suggest adding a metric if none
          if (bullet.text.trim() && !/\d/.test(bullet.text) && words.length >= 8) {
            suggestions.push({
              id: uuidv4(),
              type: 'rewrite',
              sectionId: section.id,
              itemId: item.id,
              bulletId: bullet.id,
              original: bullet.text,
              suggestion: bullet.text.replace(/\.$/, '') + ', resulting in measurable improvements.',
              reason: 'Add quantifiable impact (%, time, money, scale) to strengthen this bullet.',
              applied: false,
              rejected: false,
            });
          }
        }
      }
    }

    // Summary: suggest adding missing keywords
    if (section.content.type === 'summary' && topMissing.length > 0) {
      const missingStr = topMissing.slice(0, 3).join(', ');
      suggestions.push({
        id: uuidv4(),
        type: 'add',
        sectionId: section.id,
        original: section.content.text,
        suggestion: section.content.text + ` Experienced with ${missingStr}.`,
        reason: `Adding key terms (${missingStr}) from the job description improves keyword match.`,
        applied: false,
        rejected: false,
      });
    }

    // Projects bullets
    if (section.content.type === 'projects') {
      for (const item of section.content.items) {
        for (const bullet of item.bullets) {
          const words = bullet.text.trim().split(/\s+/);
          const firstWord = words[0]?.toLowerCase() ?? '';
          if (bullet.text.trim() && !ACTION_VERBS.has(firstWord)) {
            suggestions.push({
              id: uuidv4(),
              type: 'rewrite',
              sectionId: section.id,
              itemId: item.id,
              bulletId: bullet.id,
              original: bullet.text,
              suggestion: `Built ${bullet.text.charAt(0).toLowerCase()}${bullet.text.slice(1)}`,
              reason: 'Start project bullets with strong action verbs to enhance readability.',
              applied: false,
              rejected: false,
            });
          }
        }
      }
    }
  }

  // Deduplicate by original text
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    const key = `${s.sectionId}:${s.bulletId}:${s.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 20);
}

// ─── Main Analyzer ────────────────────────────────────────────────────────────
export function analyzeResume(resume: Resume, jobDescription: string): ATSResult {
  const resumeText = extractResumeText(resume);
  const resumeTokens = tokenize(resumeText);
  const resumeBigrams = extractBigrams(resumeTokens);
  const resumeTermSet = new Set([...resumeTokens, ...resumeBigrams]);

  const jdKeywords = extractJDKeywords(jobDescription);
  const jdBigrams = extractBigrams(tokenize(jobDescription));
  const allJDTerms = [...new Set([...jdKeywords, ...jdBigrams.filter((b) => {
    const parts = b.split(' ');
    return parts.every((p) => !STOPWORDS.has(p));
  })])].slice(0, 40);

  // Keyword matching
  const keywordMatches: ATSKeywordMatch[] = allJDTerms.map((kw) => {
    const found = resumeTermSet.has(kw);
    const occ = found ? (resumeTokens.filter((t) => t === kw).length +
      resumeText.toLowerCase().split(kw).length - 1) : 0;
    return { keyword: kw, found, occurrences: occ };
  });

  const matchedCount = keywordMatches.filter((k) => k.found).length;
  const keywordScore = allJDTerms.length > 0 ? Math.round((matchedCount / allJDTerms.length) * 100) : 50;

  const missingKeywords = keywordMatches
    .filter((k) => !k.found)
    .map((k) => k.keyword)
    .slice(0, 15);

  // Sub-scores
  const { score: completenessScore, warnings: completeWarnings } = scoreCompleteness(resume);
  const { score: readabilityScore, warnings: readWarnings } = scoreReadability(resume);
  const { score: formattingScore, warnings: formatWarnings } = scoreFormatting(resume);

  const warnings = [...completeWarnings, ...readWarnings, ...formatWarnings];

  // Weighted total
  const totalScore = Math.round(
    keywordScore * 0.45 +
    completenessScore * 0.25 +
    readabilityScore * 0.20 +
    formattingScore * 0.10
  );

  const suggestions = generateSuggestions(resume, missingKeywords);

  const breakdown: ATSBreakdown = {
    keywordScore,
    completenessScore,
    readabilityScore,
    formattingScore,
  };

  return {
    totalScore,
    breakdown,
    missingKeywords,
    matchedKeywords: keywordMatches.filter((k) => k.found),
    suggestions,
    warnings,
    analyzedAt: new Date().toISOString(),
  };
}
