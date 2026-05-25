import type { ResumeData } from '../types/resume';

/**
 * Detects whether a string is already HTML content.
 */
function isHtml(text: string): boolean {
  return /^<[a-z][\s\S]*>/i.test(text.trim());
}

/**
 * Converts a plain-text description (with optional bullet characters)
 * into clean HTML that TipTap can work with.
 *
 * - Lines starting with • or - are converted to <ul><li>...</li></ul>
 * - Other lines become <p>...</p>
 * - Already-HTML content is returned untouched.
 */
function plainTextToHtml(text: string): string {
  if (!text || text.trim() === '') return '';
  if (isHtml(text)) return text;

  const lines = text.split('\n');
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bulletMatch = trimmed.match(/^[•\-]\s*(.*)/);
    if (bulletMatch) {
      if (!inList) {
        htmlParts.push('<ul>');
        inList = true;
      }
      htmlParts.push(`<li><p>${bulletMatch[1]}</p></li>`);
    } else {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      htmlParts.push(`<p>${trimmed}</p>`);
    }
  }

  if (inList) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('');
}

/**
 * Migrates all plain-text description fields in ResumeData to HTML format.
 * This is idempotent — already-HTML content is left untouched.
 */
export function migrateDescriptionsToHtml(data: ResumeData): ResumeData {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      summary: plainTextToHtml(data.personalInfo.summary),
    },
    experiences: data.experiences.map(exp => ({
      ...exp,
      description: plainTextToHtml(exp.description),
    })),
    educations: data.educations.map(edu => ({
      ...edu,
      description: plainTextToHtml(edu.description),
    })),
    customSections: (data.customSections || []).map(sec => ({
      ...sec,
      content: sec.type === 'text' ? plainTextToHtml(sec.content) : sec.content,
      items: (sec.items || []).map(item => ({
        ...item,
        description: plainTextToHtml(item.description),
      })),
    })),
  };
}
