import React, { useEffect, useState, useRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { ResumeData } from '../types/resume';
import { usePagination } from '../hooks/usePagination';

interface Props {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export const ResumePreview: React.FC<Props> = ({ data, previewRef }) => {
  const { personalInfo, experiences, educations, skills, settings } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const { pageSplits } = usePagination(measureRef, settings?.paperSize || 'letter', data);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const paperWidth = settings?.paperSize === 'letter' ? 816 : 794;
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth < paperWidth) {
          setScale(containerWidth / paperWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [settings?.paperSize]);

  const parseSkills = (skillsText: string) => {
    return skillsText.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
  };

  const isHtml = (text: string): boolean => /^<[a-z][\s\S]*>/i.test(text.trim());

  const isModern = settings?.template === 'modern';
  const primaryColor = settings?.primaryColor || '#0f172a';
  const fontFamily = settings?.fontFamily || 'Arial, sans-serif';
  const textColor = settings?.textColor || '#334155';
  const fontSize = settings?.fontSize || '11pt';
  const lang = settings?.language || 'en';

  const translations: Record<string, Record<string, string>> = {
    en: { summary: 'Professional Summary', experience: 'Experience', education: 'Education', skills: 'Skills', present: 'Present', at: 'at', in: 'in' },
    id: { summary: 'Ringkasan Profesional', experience: 'Pengalaman', education: 'Pendidikan', skills: 'Keahlian', present: 'Sekarang', at: 'di', in: 'bidang' },
    es: { summary: 'Resumen Profesional', experience: 'Experiencia', education: 'Educación', skills: 'Habilidades', present: 'Presente', at: 'en', in: 'en' },
    fr: { summary: 'Résumé Professionnel', experience: 'Expérience', education: 'Formation', skills: 'Compétences', present: 'Présent', at: 'chez', in: 'en' },
    de: { summary: 'Berufsprofil', experience: 'Berufserfahrung', education: 'Ausbildung', skills: 'Kenntnisse', present: 'Gegenwart', at: 'bei', in: 'in' },
    pt: { summary: 'Resumo Profissional', experience: 'Experiência', education: 'Educação', skills: 'Habilidades', present: 'Presente', at: 'na', in: 'em' },
    zh: { summary: '专业概述', experience: '工作经验', education: '教育背景', skills: '专业技能', present: '至今', at: '于', in: '' },
    ja: { summary: '職務概要', experience: '職歴', education: '学歴', skills: 'スキル', present: '現在', at: '', in: '' },
    ko: { summary: '전문 요약', experience: '경력', education: '학력', skills: '기술', present: '현재', at: '', in: '' },
    ar: { summary: 'الملخص المهني', experience: 'الخبرة', education: 'التعليم', skills: 'المهارات', present: 'حالياً', at: 'في', in: 'في' },
    nl: { summary: 'Professioneel Profiel', experience: 'Werkervaring', education: 'Opleiding', skills: 'Vaardigheden', present: 'Heden', at: 'bij', in: 'in' },
    it: { summary: 'Profilo Professionale', experience: 'Esperienza', education: 'Istruzione', skills: 'Competenze', present: 'Presente', at: 'presso', in: 'in' },
    ru: { summary: 'Профессиональный профиль', experience: 'Опыт работы', education: 'Образование', skills: 'Навыки', present: 'По настоящее время', at: 'в', in: 'по направлению' },
    tr: { summary: 'Profesyonel Özet', experience: 'Deneyim', education: 'Eğitim', skills: 'Beceriler', present: 'Devam ediyor', at: '', in: '' },
    hi: { summary: 'पेशेवर सारांश', experience: 'अनुभव', education: 'शिक्षा', skills: 'कौशल', present: 'वर्तमान', at: 'में', in: 'में' },
  };
  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;

  const sectionSpacing = {
    tight: '1rem',
    normal: '1.5rem',
    relaxed: '2rem'
  }[settings?.documentSpacing || 'normal'];

  const headerPadding = {
    tight: 'px-10 pt-6 pb-4',
    normal: 'px-10 pt-10 pb-6',
    relaxed: 'px-10 pt-12 pb-8'
  }[settings?.documentSpacing || 'normal'];

  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const Divider = ({ show = true, isHeader = false }: { show?: boolean, isHeader?: boolean }) => {
    if (!show) return <div className={isHeader ? "mt-6" : "mt-3"} />;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '15, 23, 42';
    };

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

  const blocks: React.ReactNode[] = [];

  blocks.push(
    <header
      key="header"
      data-page-block="true"
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
            className={`${settings?.nameSize || 'text-4xl'} font-bold tracking-tight mb-2 ${settings?.nameTransform || 'uppercase'}`}
            style={{
              color: isModern ? '#ffffff' : primaryColor
            }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className={`${settings?.jobTitleSize || 'text-lg'} mb-2 opacity-90`} style={{ color: isModern ? 'rgba(255,255,255,0.9)' : '#475569' }}>
              {personalInfo.jobTitle}
            </p>
          )}
          <div className={`flex flex-wrap gap-x-4 gap-y-2 ${settings?.contactInfoSize || 'text-sm'} ${settings?.headerAlignment === 'center' || settings?.photoPosition === 'top' ? 'justify-center' : settings?.headerAlignment === 'right' ? 'justify-end' : 'justify-start'}`} style={{ color: isModern ? 'rgba(255,255,255,0.8)' : '#64748b' }}>
            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {personalInfo.location}</span>}
            {personalInfo.website && <span className="flex items-center gap-1.5"><Globe size={12} /> {personalInfo.website}</span>}
          </div>
        </div>
      </div>
      <Divider show={settings?.showMainHeaderDivider ?? true} isHeader={true} />
    </header>
  );

  const sectionOrder = settings?.sectionOrder || ['summary', 'experience', 'education', 'skills'];

  sectionOrder.forEach((sectionId) => {
    if (sectionId === 'summary' && personalInfo.summary) {
      blocks.push(
        <section key="summary" data-page-block="true" className="px-10" style={{ marginBottom: sectionSpacing }}>
          <h2 className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`} style={{ color: primaryColor }}>
            {t('summary')}
          </h2>
          <Divider show={settings?.showSummaryDivider ?? true} />
          {isHtml(personalInfo.summary) ? (
            <div className="text-sm leading-relaxed text-slate-700 resume-html-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
          ) : (
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{personalInfo.summary}</p>
          )}
        </section>
      );
    }

    if (sectionId === 'experience' && experiences.length > 0) {
      blocks.push(
        <div key="exp-header" data-page-block="true" className="px-10 pt-2">
          <h2 className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`} style={{ color: primaryColor }}>
            {t('experience')}
          </h2>
          <Divider show={settings?.showExperienceDivider ?? true} />
        </div>
      );
      experiences.forEach(exp => {
        blocks.push(
          <div key={`exp-${exp.id}`} data-page-block="true" className="px-10 mb-4 page-break-inside-avoid">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
                {exp.position}
                {exp.company && <span className="font-normal text-slate-600 text-[0.95em]">{(settings?.showAtConnector ?? true) ? `${t('at')} ` : ''}{exp.company}</span>}
                {exp.employmentType && <span className="font-normal italic text-slate-400 text-[0.85em]">({exp.employmentType})</span>}
              </h3>
              <span className="text-sm text-slate-600 whitespace-nowrap ml-4 font-medium" style={{ color: isModern ? primaryColor : 'inherit' }}>
                {formatDateStr(exp.startDate)} - {exp.current ? (t('present') || 'Present') : formatDateStr(exp.endDate)}
              </span>
            </div>
            {exp.description && (
              <div className="text-sm text-slate-700 mt-1 resume-html-content">
                {isHtml(exp.description) ? (
                  <div dangerouslySetInnerHTML={{ __html: exp.description }} />
                ) : (
                  settings?.experienceFormat === 'paragraph' ? (
                    <p>{exp.description.replace(/^[•-]\s*/gm, '').replace(/\n+/g, ' ')}</p>
                  ) : (
                    exp.description.split('\n').map((line, i) => (
                      <p key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? '-ml-3' : ''}>{line}</p>
                    ))
                  )
                )}
              </div>
            )}
          </div>
        );
      });
    }

    if (sectionId === 'education' && educations.length > 0) {
      blocks.push(
        <div key="edu-header" data-page-block="true" className="px-10 pt-2">
          <h2 className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`} style={{ color: primaryColor }}>
            {t('education')}
          </h2>
          <Divider show={settings?.showEducationDivider ?? true} />
        </div>
      );
      educations.forEach(edu => {
        blocks.push(
          <div key={`edu-${edu.id}`} data-page-block="true" className="px-10 mb-4 page-break-inside-avoid">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold" style={{ color: '#0f172a' }}>
                {edu.degree
                  ? `${edu.degree}${edu.fieldOfStudy ? ` ${(settings?.showInConnector ?? true) ? `${t('in')} ` : ''}${edu.fieldOfStudy}` : ''}`
                  : edu.fieldOfStudy || edu.institution || t('education')}
              </h3>
              <span className="text-sm font-medium whitespace-nowrap ml-4" style={{ color: isModern ? primaryColor : '#475569' }}>
                {formatDateStr(edu.startDate)} - {formatDateStr(edu.endDate)}
              </span>
            </div>
            {edu.institution && <div className="text-sm font-medium" style={{ color: '#334155' }}>{edu.institution}</div>}
            {edu.description && (
              isHtml(edu.description) ? (
                <div className="text-sm mt-1 text-slate-700 resume-html-content" dangerouslySetInnerHTML={{ __html: edu.description }} />
              ) : (
                <p className="text-sm mt-1 whitespace-pre-wrap text-slate-700">{edu.description}</p>
              )
            )}
          </div>
        );
      });
    }

    if (sectionId === 'skills' && skills) {
      blocks.push(
        <section key="skills" data-page-block="true" className="px-10" style={{ marginBottom: sectionSpacing }}>
          <h2 className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`} style={{ color: primaryColor }}>
            {t('skills')}
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
      );
    }

    if (sectionId.startsWith('custom-')) {
      const customSection = data.customSections?.find(sec => sec.id === sectionId);
      if (customSection && customSection.visible) {
        blocks.push(
          <div key={`custom-${customSection.id}-header`} data-page-block="true" className="px-10 pt-2">
            <h2 className={`text-sm font-bold tracking-wider pb-1 ${settings?.headerTransform || 'uppercase'}`} style={{ color: primaryColor }}>
              {customSection.name}
            </h2>
            <Divider show={true} />
          </div>
        );
        if (customSection.type === 'text') {
          blocks.push(
            <div key={`custom-${customSection.id}-text`} data-page-block="true" className="px-10 mb-4 text-sm text-slate-700">
              {isHtml(customSection.content) ? (
                <div className="resume-html-content" dangerouslySetInnerHTML={{ __html: customSection.content }} />
              ) : (
                <p className="whitespace-pre-wrap">{customSection.content}</p>
              )}
            </div>
          );
        } else {
          (customSection.items || []).forEach(item => {
            blocks.push(
              <div key={`custom-${item.id}`} data-page-block="true" className="px-10 mb-4 page-break-inside-avoid">
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
                  <div className="text-sm text-slate-700 mt-1 resume-html-content">
                    {isHtml(item.description) ? (
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    ) : (
                      settings?.experienceFormat === 'paragraph' ? (
                        <p>{item.description.replace(/^[•-]\s*/gm, '').replace(/\n+/g, ' ')}</p>
                      ) : (
                        item.description.split('\n').map((line, i) => (
                          <p key={i} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? '-ml-3' : ''}>{line}</p>
                        ))
                      )
                    )}
                  </div>
                )}
              </div>
            );
          });
        }
      }
    }
  });

  const pages: React.ReactNode[][] = [[]];
  let currentPage = 0;
  blocks.forEach((block, index) => {
    if (pageSplits.includes(index)) {
      currentPage++;
      pages[currentPage] = [];
    }
    pages[currentPage].push(block);
  });

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-x-auto overflow-y-auto custom-scrollbar bg-slate-200 p-8">
      <div
        ref={measureRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        style={{
          width: settings?.paperSize === 'letter' ? '8.5in' : '210mm',
          fontSize: fontSize,
          lineHeight: 1.5,
          fontFamily,
          color: textColor
        }}
      >
        {blocks}
      </div>

      <div
        className="transform origin-top flex flex-col items-center justify-start gap-8"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          ref={previewRef}
          className="hidden print:block"
          style={{
            width: settings?.paperSize === 'letter' ? '8.5in' : '210mm',
            fontSize: fontSize,
            lineHeight: 1.5,
            fontFamily,
            color: textColor,
          }}
        >
          {blocks.map((block, i) => (
            <div key={`print-block-${i}`} className="page-break-inside-avoid">
              {block}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 items-center w-full print:hidden">
          {pages.map((pageBlocks, index) => (
            <div key={`page-${index}`} className="flex flex-col items-center w-full">
              <div className="text-slate-500 font-medium mb-4">Page {index + 1}</div>
              <div
                className={`bg-white shadow-2xl relative pb-10 ${index > 0 ? 'pt-10' : ''}`}
                style={{
                  width: settings?.paperSize === 'letter' ? '8.5in' : '210mm',
                  minHeight: settings?.paperSize === 'letter' ? '11in' : '297mm',
                  fontSize: fontSize,
                  lineHeight: 1.5,
                  fontFamily,
                  color: textColor,
                }}
              >
                {pageBlocks}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
