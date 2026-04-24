import React from 'react';
import type { ResumeData } from '../types/resume';

interface Props {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export const ResumePreview: React.FC<Props> = ({ data, previewRef }) => {
  const { personalInfo, experiences, educations, skills, settings } = data;

  const parseSkills = (skillsText: string) => {
    return skillsText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
  };

  const isModern = settings?.template === 'modern';
  const primaryColor = settings?.primaryColor || '#0f172a';
  const fontFamily = settings?.fontFamily || 'Arial, sans-serif';
  const textColor = settings?.textColor || '#334155';
  const fontSize = settings?.fontSize || '11pt';

  const sectionSpacing = {
    tight: '1rem',
    normal: '1.5rem',
    relaxed: '2rem'
  }[settings?.documentSpacing || 'normal'];

  const headerPadding = {
    tight: 'px-10 pt-6 pb-4',
    normal: 'px-10 pt-10 pb-6',
    relaxed: 'px-10 pt-14 pb-8'
  }[settings?.documentSpacing || 'normal'];

  const formatDateStr = (dateStr?: string) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return dateStr || '';
    const parts = dateStr.split('-');
    if (parts.length !== 2) return dateStr;

    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    const dateObj = new Date(parseInt(year), monthNum - 1);
    if (isNaN(dateObj.getTime())) return dateStr;

    switch (settings?.dateFormat) {
      case 'slash': return `${parts[1]}/${year}`;
      case 'dot': return `${parts[1]}.${year}`;
      case 'full': return `${dateObj.toLocaleString('en-US', { month: 'long' })} ${year}`;
      case 'short':
      default: return `${dateObj.toLocaleString('en-US', { month: 'short' })} ${year}`;
    }
  };

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '15, 23, 42';
  }

  const Divider = ({ show = true, isHeader = false }: { show?: boolean, isHeader?: boolean }) => {
    if (settings?.dividerStyle === 'none' || !show) return null;
    if (isModern && isHeader) return null;

    const colorRGB = hexToRgb(primaryColor);
    const opacity = (settings?.dividerOpacity ?? 100) / 100;
    const dividerColor = isModern && !isHeader
      ? `rgba(226, 232, 240, ${opacity})`
      : `rgba(${colorRGB}, ${opacity})`;

    const alignment = settings?.dividerAlignment || 'left';
    let margin = '0';
    if (alignment === 'center') margin = '0 auto';
    if (alignment === 'right') margin = '0 0 0 auto';

    return (
      <div
        style={{
          borderBottomStyle: settings?.dividerStyle || 'solid',
          borderBottomWidth: settings?.dividerWidth || '1px',
          borderBottomColor: dividerColor,
          width: settings?.dividerLength || '100%',
          margin: margin,
          marginTop: isHeader ? '1.5rem' : '0.5rem',
          marginBottom: isHeader ? '0' : '0.75rem',
        }}
      />
    );
  };

  return (
    <div className="bg-white shadow-lg resume-preview-container h-full overflow-y-auto">
      <div
        ref={previewRef}
        className="bg-white mx-auto flex flex-col"
        style={{
          width: settings?.paperSize === 'letter' ? '8.5in' : '210mm',
          minHeight: settings?.paperSize === 'letter' ? '11in' : '297mm',
          fontSize: fontSize,
          lineHeight: 1.5,
          fontFamily,
          color: textColor
        }}
      >
        <header
          className={`${headerPadding} ${isModern ? '' : 'mb-6'}`}
          style={{
            backgroundColor: isModern ? primaryColor : 'transparent',
            color: isModern ? '#ffffff' : 'inherit',
          }}
        >
          <div className={`flex ${settings?.photoPosition === 'right' ? 'flex-row-reverse' : settings?.photoPosition === 'top' ? 'flex-col items-center text-center' : 'flex-row items-center'} gap-6 ${settings?.headerAlignment === 'center' ? 'justify-center' : settings?.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>

            {personalInfo.photoUrl && (
              <div className={`flex-shrink-0 ${settings?.photoPosition === 'top' ? 'mb-2' : ''}`}>
                <img
                  src={personalInfo.photoUrl}
                  alt="Profile"
                  className={`object-cover ${settings?.photoSize === 'small' ? 'w-16 h-16' :
                    settings?.photoSize === 'large' ? 'w-32 h-32' :
                      settings?.photoSize === 'xlarge' ? 'w-40 h-40' :
                        'w-24 h-24'
                    } ${settings?.photoShape === 'square' ? 'rounded-none' :
                      settings?.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                    }`}
                />
              </div>
            )}

            <div className={`flex flex-col flex-1 justify-center ${settings?.headerAlignment === 'center' || settings?.photoPosition === 'top' ? 'items-center text-center' : settings?.headerAlignment === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
              <h1
                className={`${settings?.nameSize || 'text-4xl'} font-bold tracking-wide mb-1 ${settings?.nameTransform || 'uppercase'}`}
                style={{ color: isModern ? '#ffffff' : primaryColor }}
              >
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className={`${settings?.jobTitleSize || 'text-lg'} mb-2 opacity-90`}>
                {personalInfo.jobTitle || 'Job Title'}
              </p>
              <div className={`flex flex-wrap gap-x-4 gap-y-1 ${settings?.contactInfoSize || 'text-sm'} ${isModern ? 'text-white/80' : 'text-slate-600'} ${settings?.headerAlignment === 'center' || settings?.photoPosition === 'top' ? 'justify-center' : settings?.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                {personalInfo.email && (
                  <span className="flex items-center">
                    <a href={`mailto:${personalInfo.email}`} style={{ color: 'inherit' }}>{personalInfo.email}</a>
                  </span>
                )}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.website && (
                  <span>
                    <a href={`https://${personalInfo.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
          <Divider show={settings?.showMainHeaderDivider ?? true} isHeader={true} />
        </header>

        <main className="px-10 flex-grow">
          {(settings.sectionOrder || ['summary', 'experience', 'education', 'skills']).map((sectionId) => {
            if (sectionId === 'summary') return (
              <React.Fragment key="summary">
                {personalInfo.summary && (
                  <section className="resume-section" style={{ marginBottom: sectionSpacing }}>
                    <h2
                      className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`}
                      style={{ color: primaryColor }}
                    >
                      Professional Summary
                    </h2>
                    <Divider show={settings?.showSummaryDivider ?? true} />
                    <p className="text-justify whitespace-pre-wrap">{personalInfo.summary}</p>
                  </section>
                )}
              </React.Fragment>
            );
            if (sectionId === 'experience') return (
              <React.Fragment key="experience">
                {experiences.length > 0 && (
                  <section className="resume-section" style={{ marginBottom: sectionSpacing }}>
                    <h2
                      className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`}
                      style={{ color: primaryColor }}
                    >
                      Experience
                    </h2>
                    <Divider show={settings?.showExperienceDivider ?? true} />
                    <div className="flex flex-col gap-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="page-break-inside-avoid">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
                              {exp.position}
                              {exp.company && <span className="font-normal text-slate-600 text-[0.95em]">at {exp.company}</span>}
                              {exp.employmentType && <span className="font-normal italic text-slate-400 text-[0.85em]">({exp.employmentType})</span>}
                            </h3>
                            <span className="text-sm text-slate-600 whitespace-nowrap ml-4 font-medium" style={{ color: isModern ? primaryColor : 'inherit' }}>
                              {formatDateStr(exp.startDate)} - {exp.current ? 'Present' : formatDateStr(exp.endDate)}
                            </span>
                          </div>
                          {exp.description && (
                            <div className={`text-sm text-slate-700 ${settings?.experienceFormat === 'paragraph' ? 'mt-1 text-justify' : 'pl-4 list-disc whitespace-pre-wrap'}`}>
                              {settings?.experienceFormat === 'paragraph' ? (
                                <p>{exp.description.replace(/^[•-]\s*/gm, '').replace(/\n+/g, ' ')}</p>
                              ) : (
                                exp.description.split('\n').map((line, i) => (
                                  <p key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? '-ml-3' : ''}>
                                    {line}
                                  </p>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            );
            if (sectionId === 'education') return (
              <React.Fragment key="education">
                {educations.length > 0 && (
                  <section className="resume-section" style={{ marginBottom: sectionSpacing }}>
                    <h2
                      className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`}
                      style={{ color: primaryColor }}
                    >
                      Education
                    </h2>
                    <Divider show={settings?.showEducationDivider ?? true} />
                    <div className="flex flex-col gap-3">
                      {educations.map((edu) => (
                        <div key={edu.id} className="page-break-inside-avoid">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold" style={{ color: '#0f172a' }}>
                              {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                            </h3>
                            <span className="text-sm font-medium whitespace-nowrap ml-4" style={{ color: isModern ? primaryColor : '#475569' }}>
                              {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
                            </span>
                          </div>
                          {edu.institution && <div className="text-sm font-medium" style={{ color: '#334155' }}>{edu.institution}</div>}
                          {edu.description && (
                            <p className="text-sm mt-1 whitespace-pre-wrap text-slate-700">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            );
            if (sectionId === 'skills') return (
              <React.Fragment key="skills">
                {skills && (
                  <section className="resume-section" style={{ marginBottom: sectionSpacing }}>
                    <h2
                      className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`}
                      style={{ color: primaryColor }}
                    >
                      Skills
                    </h2>
                    <Divider show={settings?.showSkillsDivider ?? true} />
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-800">
                      {parseSkills(skills).map((skill, index) => (
                        <span key={index} className="flex items-center">
                          <span style={{ color: primaryColor }} className="mr-1.5">•</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </React.Fragment>
            );
            if (sectionId.startsWith('custom-')) {
              const customSection = data.customSections?.find(sec => sec.id === sectionId);
              if (!customSection || !customSection.visible) return null;

              return (
                <React.Fragment key={customSection.id}>
                  <section className="resume-section" style={{ marginBottom: sectionSpacing }}>
                    <h2
                      className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`}
                      style={{ color: primaryColor }}
                    >
                      {customSection.name}
                    </h2>
                    <Divider show={true} />

                    {customSection.type === 'text' ? (
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">{customSection.content}</div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {(customSection.items || []).map((item) => (
                          <div key={item.id} className="page-break-inside-avoid">
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
                                {item.title}
                                {item.subtitle && <span className="font-normal text-slate-600 text-[0.95em]">| {item.subtitle}</span>}
                              </h3>
                              {(item.startDate || item.endDate) && (
                                <span className="text-sm font-medium whitespace-nowrap ml-4" style={{ color: isModern ? primaryColor : '#475569' }}>
                                  {item.startDate ? formatDateStr(item.startDate) : ''} {item.startDate && item.endDate ? ' - ' : ''} {item.endDate ? formatDateStr(item.endDate) : ''}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <div className={`text-sm text-slate-700 ${settings?.experienceFormat === 'paragraph' ? 'mt-1 text-justify' : 'pl-4 list-disc whitespace-pre-wrap'}`}>
                                {settings?.experienceFormat === 'paragraph' ? (
                                  <p>{item.description.replace(/^[•-]\s*/gm, '').replace(/\n+/g, ' ')}</p>
                                ) : (
                                  item.description.split('\n').map((line, i) => (
                                    <p key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? '-ml-3' : ''}>
                                      {line}
                                    </p>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </React.Fragment>
              );
            }

            return null;
          })}

        </main>
      </div>
    </div>
  );
};
