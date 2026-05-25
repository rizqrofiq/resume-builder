import React, { useState, useEffect, useRef } from 'react';
import type { ResumeData, Experience, Education } from '../types/resume';
import { Plus, Trash2, Settings2, MoveVertical, Droplet, Ruler, AlignLeft, AlignCenter, AlignRight, Check, LayoutTemplate, Palette, Type, Rows, AArrowUp, Baseline, FileText, List, Eye, EyeOff, ChevronUp, ChevronDown, CalendarDays, Building2, Briefcase, GraduationCap, Award, BookOpen, Calendar, ALargeSmall, CaseUpper, Type as TypeIcon, Mail, Phone, MapPin, Globe, Image as ImageIcon, Link2, Unlink2, GripVertical } from 'lucide-react';
import { CustomSelect, CustomMonthPicker } from './FormControls';
import { RichTextEditor } from './RichTextEditor';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const Input = ({ label, value, onChange, placeholder = '', type = 'text', as = 'input', disabled = false, icon: Icon, children, noMargin = false }: any) => {
  const Component = as;
  return (
    <div className={noMargin ? "" : "mb-4"}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10">
            <Icon size={16} className={disabled ? 'opacity-50' : ''} />
          </div>
        )}
        <Component
          type={type}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-9' : 'px-3'} ${as === 'select' ? 'pr-10' : 'pr-3'} py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-slate-50 hover:bg-white text-slate-800'} ${as === 'select' ? 'appearance-none cursor-pointer' : ''} ${as === 'textarea' ? 'py-3' : ''}`}
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          placeholder={placeholder}
          {...(as === 'textarea' ? { rows: 4 } : {})}
        >
          {children}
        </Component>
        {as === 'select' && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={16} />
        )}
      </div>
    </div>
  );
};

export const ResumeEditor: React.FC<Props> = ({ data, onChange }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const toolbarRef = useRef<HTMLDivElement>(null);
  const headerToolbarRef = useRef<HTMLDivElement>(null);

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node) && (!headerToolbarRef.current || !headerToolbarRef.current.contains(e.target as Node))) {
        setActivePopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      employmentType: 'Full-time',
      description: ''
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    onChange({
      ...data,
      experiences: data.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter(exp => exp.id !== id)
    });
  };

  const moveExperienceUp = (index: number) => {
    if (index <= 0) return;
    const newExperiences = [...data.experiences];
    [newExperiences[index - 1], newExperiences[index]] = [newExperiences[index], newExperiences[index - 1]];
    onChange({ ...data, experiences: newExperiences });
  };

  const moveExperienceDown = (index: number) => {
    if (index >= data.experiences.length - 1) return;
    const newExperiences = [...data.experiences];
    [newExperiences[index + 1], newExperiences[index]] = [newExperiences[index], newExperiences[index + 1]];
    onChange({ ...data, experiences: newExperiences });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, educations: [...data.educations, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      educations: data.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      educations: data.educations.filter(edu => edu.id !== id)
    });
  };

  const moveEducationUp = (index: number) => {
    if (index <= 0) return;
    const newEducations = [...data.educations];
    [newEducations[index - 1], newEducations[index]] = [newEducations[index], newEducations[index - 1]];
    onChange({ ...data, educations: newEducations });
  };

  const moveEducationDown = (index: number) => {
    if (index >= data.educations.length - 1) return;
    const newEducations = [...data.educations];
    [newEducations[index + 1], newEducations[index]] = [newEducations[index], newEducations[index + 1]];
    onChange({ ...data, educations: newEducations });
  };

  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    const newSection = {
      id: newId,
      name: 'New Section',
      type: 'list' as const,
      items: [],
      content: '',
      visible: true,
    };
    const newOrder = [...(data.settings.sectionOrder || ['summary', 'experience', 'education', 'skills']), newId];
    onChange({
      ...data,
      customSections: [...(data.customSections || []), newSection],
      settings: { ...data.settings, sectionOrder: newOrder }
    });
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => sec.id === id ? { ...sec, [field]: value } : sec)
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).filter(sec => sec.id !== id),
      settings: {
        ...data.settings,
        sectionOrder: (data.settings.sectionOrder || []).filter(sid => sid !== id)
      }
    });
  };

  const addCustomSectionItem = (sectionId: string) => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec =>
        sec.id === sectionId ? { ...sec, items: [...(sec.items || []), newItem] } : sec
      )
    });
  };

  const updateCustomSectionItem = (sectionId: string, itemId: string, field: string, value: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec =>
        sec.id === sectionId ? {
          ...sec,
          items: (sec.items || []).map(item => item.id === itemId ? { ...item, [field]: value } : item)
        } : sec
      )
    });
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec =>
        sec.id === sectionId ? {
          ...sec,
          items: (sec.items || []).filter(item => item.id !== itemId)
        } : sec
      )
    });
  };

  const moveCustomSectionItemUp = (sectionId: string, index: number) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => {
        if (sec.id !== sectionId || index <= 0) return sec;
        const newItems = [...(sec.items || [])];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        return { ...sec, items: newItems };
      })
    });
  };

  const moveCustomSectionItemDown = (sectionId: string, index: number) => {
    onChange({
      ...data,
      customSections: (data.customSections || []).map(sec => {
        if (sec.id !== sectionId || index >= (sec.items || []).length - 1) return sec;
        const newItems = [...(sec.items || [])];
        [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
        return { ...sec, items: newItems };
      })
    });
  };

  const moveSectionUp = (id: string) => {
    const order = data.settings.sectionOrder || ['summary', 'experience', 'education', 'skills'];
    const idx = order.indexOf(id);
    if (idx > 0) {
      const newOrder = [...order];
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      updateSettings('sectionOrder', newOrder);
    }
  };

  const moveSectionDown = (id: string) => {
    const order = data.settings.sectionOrder || ['summary', 'experience', 'education', 'skills'];
    const idx = order.indexOf(id);
    if (idx < order.length - 1) {
      const newOrder = [...order];
      [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
      updateSettings('sectionOrder', newOrder);
    }
  };

  const renderMoveControls = (id: string) => {
    const order = data.settings.sectionOrder || ['summary', 'experience', 'education', 'skills'];
    const idx = order.indexOf(id);
    return (
      <React.Fragment>
        <button
          onClick={() => moveSectionUp(id)}
          disabled={idx === 0}
          className={`w-8 h-8 p-1.5 mr-1 rounded-sm transition-colors flex items-center justify-center shadow-sm ${idx === 0 ? 'opacity-50 cursor-not-allowed bg-white text-slate-400' : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50'} group relative`}
        >
          <ChevronUp size={16} />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            Move Up
          </span>
        </button>
        <button
          onClick={() => moveSectionDown(id)}
          disabled={idx === order.length - 1}
          className={`w-8 h-8 p-1.5 mr-1 rounded-sm transition-colors flex items-center justify-center shadow-sm ${idx === order.length - 1 ? 'opacity-50 cursor-not-allowed bg-white text-slate-400' : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50'} group relative`}
        >
          <ChevronDown size={16} />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
            Move Down
          </span>
        </button>
      </React.Fragment>
    );
  };

  const updateSettings = (field: string, value: string | boolean | string[]) => {
    onChange({
      ...data,
      settings: { ...data.settings, [field]: value }
    });
  };

  const FONTS = [
    { label: 'Arial / sans-serif', value: 'Arial, sans-serif' },
    { label: 'Helvetica / sans-serif', value: 'Helvetica, sans-serif' },
    { label: 'Times New Roman / serif', value: '"Times New Roman", serif' },
    { label: 'Georgia / serif', value: 'Georgia, serif' },
    { label: 'Courier New / monospace', value: '"Courier New", monospace' },
    { label: 'Segoe UI / sans-serif', value: '"Segoe UI", sans-serif' },
    { label: 'Roboto / sans-serif', value: 'Roboto, sans-serif' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200" ref={toolbarRef}>
        <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b">Design & Layout</h2>

        <div className="mb-6 flex flex-col lg:flex-row gap-6 lg:gap-12">

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-800">Theme Configuration</h3>

            <div className="flex bg-slate-100 p-1 rounded-md overflow-visible relative items-center max-w-fit">
              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'template' ? null : 'template')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'template' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <LayoutTemplate size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Template Layout`}
                  </span>
                </button>
                {activePopup === 'template' && (
                  <div className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {['classic', 'modern'].map((tpl) => (
                      <button
                        key={tpl}
                        onClick={() => { updateSettings('template', tpl); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${data.settings?.template === tpl ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {tpl.charAt(0).toUpperCase() + tpl.slice(1)} {data.settings?.template === tpl && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'paperSize' ? null : 'paperSize')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'paperSize' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <FileText size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Paper Size`}
                  </span>
                </button>
                {activePopup === 'paperSize' && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {['a4', 'letter'].map((size) => (
                      <button
                        key={size}
                        onClick={() => { updateSettings('paperSize', size); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${data.settings?.paperSize === size ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {size === 'a4' ? 'A4' : 'US Letter'} {data.settings?.paperSize === size && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'language' ? null : 'language')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'language' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                >
                  <Globe size={16} />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Language`}
                  </span>
                </button>
                {activePopup === 'language' && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1 max-h-60 overflow-y-auto custom-scrollbar">
                    {[
                      { val: 'en', label: '🇺🇸 English' },
                      { val: 'id', label: '🇮🇩 Bahasa Indonesia' },
                      { val: 'es', label: '🇪🇸 Español' },
                      { val: 'fr', label: '🇫🇷 Français' },
                      { val: 'de', label: '🇩🇪 Deutsch' },
                      { val: 'pt', label: '🇧🇷 Português' },
                      { val: 'it', label: '🇮🇹 Italiano' },
                      { val: 'nl', label: '🇳🇱 Nederlands' },
                      { val: 'tr', label: '🇹🇷 Türkçe' },
                      { val: 'ru', label: '🇷🇺 Русский' },
                      { val: 'zh', label: '🇨🇳 中文' },
                      { val: 'ja', label: '🇯🇵 日本語' },
                      { val: 'ko', label: '🇰🇷 한국어' },
                      { val: 'ar', label: '🇸🇦 العربية' },
                      { val: 'hi', label: '🇮🇳 हिन्दी' },
                    ].map((lang) => (
                      <button
                        key={lang.val}
                        onClick={() => { updateSettings('language', lang.val); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${(data.settings?.language || 'en') === lang.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {lang.label} {(data.settings?.language || 'en') === lang.val && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'dateFormat' ? null : 'dateFormat')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'dateFormat' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                >
                  <CalendarDays size={16} />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Date Format`}
                  </span>
                </button>
                {activePopup === 'dateFormat' && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {[
                      { val: 'short', label: 'Jan 2020' },
                      { val: 'slash', label: '01/2020' },
                      { val: 'dot', label: '01.2020' },
                      { val: 'full', label: 'January 2020' }
                    ].map((fmt) => (
                      <button
                        key={fmt.val}
                        onClick={() => { updateSettings('dateFormat', fmt.val); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${(data.settings?.dateFormat || 'short') === fmt.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {fmt.label} {(data.settings?.dateFormat || 'short') === fmt.val && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'color' ? null : 'color')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'color' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <Palette size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Primary Color`}
                  </span>
                </button>
                {activePopup === 'color' && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Accent Color</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-10 w-full rounded border border-slate-300 cursor-pointer p-0.5"
                        value={data.settings?.primaryColor || '#0f172a'}
                        onChange={(e) => updateSettings('primaryColor', e.target.value)}
                      />
                      <span className="text-sm font-mono text-slate-600">{data.settings?.primaryColor || '#0f172a'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'textColor' ? null : 'textColor')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'textColor' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <Baseline size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Text Color`}
                  </span>
                </button>
                {activePopup === 'textColor' && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Text Color</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="h-10 w-full rounded border border-slate-300 cursor-pointer p-0.5"
                        value={data.settings?.textColor || '#334155'}
                        onChange={(e) => updateSettings('textColor', e.target.value)}
                      />
                      <span className="text-sm font-mono text-slate-600">{data.settings?.textColor || '#334155'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'typography' ? null : 'typography')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'typography' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <Type size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Typography`}
                  </span>
                </button>
                {activePopup === 'typography' && (
                  <div className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {FONTS.map(font => (
                      <button
                        key={font.value}
                        onClick={() => { updateSettings('fontFamily', font.value); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${data.settings?.fontFamily === font.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        style={{ fontFamily: font.value }}
                      >
                        <span className="truncate">{font.label.split('/')[0].trim()}</span>
                        {data.settings?.fontFamily === font.value && <Check size={14} className="flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'fontSize' ? null : 'fontSize')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'fontSize' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <AArrowUp size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Font Size`}
                  </span>
                </button>
                {activePopup === 'fontSize' && (
                  <div className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {['10pt', '11pt', '12pt'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => { updateSettings('fontSize', sz); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${data.settings?.fontSize === sz ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {sz} {data.settings?.fontSize === sz && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'headerTransform' ? null : 'headerTransform')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'headerTransform' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                >
                  <ALargeSmall size={16} />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Header Casing`}
                  </span>
                </button>
                {activePopup === 'headerTransform' && (
                  <div className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {[
                      { val: 'uppercase', label: 'UPPERCASE' },
                      { val: 'capitalize', label: 'Capitalize' },
                      { val: 'lowercase', label: 'lowercase' },
                      { val: 'normal-case', label: 'None' }
                    ].map((sz) => (
                      <button
                        key={sz.val}
                        onClick={() => { updateSettings('headerTransform', sz.val); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${(data.settings?.headerTransform || 'uppercase') === sz.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {sz.label} {(data.settings?.headerTransform || 'uppercase') === sz.val && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>


              <div className="relative">
                <button
                  onClick={() => setActivePopup(activePopup === 'spacing' ? null : 'spacing')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'spacing' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <Rows size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Document Spacing`}
                  </span>
                </button>
                {activePopup === 'spacing' && (
                  <div className="absolute top-full mt-2 right-0 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                    {['tight', 'normal', 'relaxed'].map((space) => (
                      <button
                        key={space}
                        onClick={() => { updateSettings('documentSpacing', space); setActivePopup(null); }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${data.settings?.documentSpacing === space ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {space.charAt(0).toUpperCase() + space.slice(1)} {data.settings?.documentSpacing === space && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>


          <div className="">
            <div className="flex flex-col gap-2 mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Section Dividers</h3>

              <div className="flex bg-slate-100 p-1 rounded-md overflow-visible relative items-center max-w-fit">
                <div className="relative">
                  <button
                    onClick={() => setActivePopup(activePopup === 'style' ? null : 'style')}
                    className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${activePopup === 'style' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                  >
                    <Settings2 size={16} />

                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                      {`Visibility / Style`}
                    </span>
                  </button>
                  {activePopup === 'style' && (
                    <div className="absolute top-full mt-2 left-0 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                      {['solid', 'dashed', 'dotted', 'none'].map((style) => (
                        <button
                          key={style}
                          onClick={() => { updateSettings('dividerStyle', style); setActivePopup(null); }}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${data.settings?.dividerStyle === style ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)} {data.settings?.dividerStyle === style && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    disabled={data.settings?.dividerStyle === 'none'}
                    onClick={() => setActivePopup(activePopup === 'width' ? null : 'width')}
                    className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${activePopup === 'width' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                  >
                    <MoveVertical size={16} />

                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                      {`Thickness`}
                    </span>
                  </button>
                  {activePopup === 'width' && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                      {['1px', '2px', '3px', '4px'].map((w) => (
                        <button
                          key={w}
                          onClick={() => { updateSettings('dividerWidth', w); setActivePopup(null); }}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${data.settings?.dividerWidth === w ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          {w.replace('px', ' Pixel' + (w === '1px' ? '' : 's'))} {data.settings?.dividerWidth === w && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    disabled={data.settings?.dividerStyle === 'none'}
                    onClick={() => setActivePopup(activePopup === 'opacity' ? null : 'opacity')}
                    className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${activePopup === 'opacity' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                  >
                    <Droplet size={16} />

                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                      {`Opacity`}
                    </span>
                  </button>
                  {activePopup === 'opacity' && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-3">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Opacity: {data.settings?.dividerOpacity ?? 100}%</p>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        value={data.settings?.dividerOpacity ?? 100}
                        onChange={(e) => updateSettings('dividerOpacity', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    disabled={data.settings?.dividerStyle === 'none'}
                    onClick={() => setActivePopup(activePopup === 'length' ? null : 'length')}
                    className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${activePopup === 'length' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                  >
                    <Ruler size={16} />

                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                      {`Length`}
                    </span>
                  </button>
                  {activePopup === 'length' && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                      {['100%', '75%', '50%', '25%'].map((len) => (
                        <button
                          key={len}
                          onClick={() => { updateSettings('dividerLength', len); setActivePopup(null); }}
                          className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${data.settings?.dividerLength === len ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          {len} {data.settings?.dividerLength === len && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-[1px] h-4 bg-slate-300 mx-1.5"></div>

                <button
                  disabled={data.settings?.dividerStyle === 'none' || data.settings?.dividerLength === '100%'}
                  onClick={() => updateSettings('dividerAlignment', 'left')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${data.settings?.dividerAlignment === 'left' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <AlignLeft size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Align Left`}
                  </span>
                </button>
                <button
                  disabled={data.settings?.dividerStyle === 'none' || data.settings?.dividerLength === '100%'}
                  onClick={() => updateSettings('dividerAlignment', 'center')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${data.settings?.dividerAlignment === 'center' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <AlignCenter size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Align Center`}
                  </span>
                </button>
                <button
                  disabled={data.settings?.dividerStyle === 'none' || data.settings?.dividerLength === '100%'}
                  onClick={() => updateSettings('dividerAlignment', 'right')}
                  className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center disabled:opacity-40 ${data.settings?.dividerAlignment === 'right' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}

                >
                  <AlignRight size={16} />

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                    {`Align Right`}
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection('personalInfo')}>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
              {collapsedSections['personalInfo'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-md" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => updateSettings('showMainHeaderDivider', !(data.settings?.showMainHeaderDivider ?? true))}
              className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${data.settings?.showMainHeaderDivider ?? true ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}

            >
              {data.settings?.showMainHeaderDivider ?? true ? <Eye size={16} /> : <EyeOff size={16} />}

              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                {`Toggle Border`}
              </span>
            </button>
          </div>
        </div>
        {!collapsedSections['personalInfo'] && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pr-8">
              <Input icon={TypeIcon} label="Full Name" value={data.personalInfo.fullName} onChange={(v: string) => updatePersonalInfo('fullName', v)} placeholder="Jane Doe" />
              <Input icon={Briefcase} label="Job Title" value={data.personalInfo.jobTitle} onChange={(v: string) => updatePersonalInfo('jobTitle', v)} placeholder="Software Engineer" />
              <Input icon={Mail} label="Email" type="email" value={data.personalInfo.email} onChange={(v: string) => updatePersonalInfo('email', v)} placeholder="jane@example.com" />
              <Input icon={Phone} label="Phone" type="tel" value={data.personalInfo.phone} onChange={(v: string) => updatePersonalInfo('phone', v)} placeholder="(555) 123-4567" />
              <Input icon={MapPin} label="Location" value={data.personalInfo.location} onChange={(v: string) => updatePersonalInfo('location', v)} placeholder="City, State" />
              <Input icon={Globe} label="Website / LinkedIn" value={data.personalInfo.website} onChange={(v: string) => updatePersonalInfo('website', v)} placeholder="linkedin.com/in/jane" />
            </div>

            <div className="border-t border-slate-100 pt-6 pr-8">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Profile Photo (Optional)</h3>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input icon={ImageIcon} label="Photo URL" value={data.personalInfo.photoUrl || ''} onChange={(v: string) => updatePersonalInfo('photoUrl', v)} placeholder="https://example.com/photo.jpg" />
                </div>
                {data.personalInfo.photoUrl && (
                  <div className="flex gap-2">
                    <div className="w-32">
                      <CustomSelect label="Shape" value={data.settings?.photoShape || 'circle'} onChange={(v: string) => updateSettings('photoShape', v)} options={[
                        { label: 'Circle', value: 'circle' },
                        { label: 'Square', value: 'square' },
                        { label: 'Rounded', value: 'rounded' }
                      ]} />
                    </div>
                    <div className="w-32">
                      <CustomSelect label="Size" value={data.settings?.photoSize || 'medium'} onChange={(v: string) => updateSettings('photoSize', v)} options={[
                        { label: 'Small', value: 'small' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Large', value: 'large' },
                        { label: 'X-Large', value: 'xlarge' }
                      ]} />
                    </div>
                    <div className="w-32">
                      <CustomSelect label="Position" value={data.settings?.photoPosition || 'left'} onChange={(v: string) => updateSettings('photoPosition', v)} options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                        { label: 'Top', value: 'top' }
                      ]} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 pr-8" ref={headerToolbarRef}>
              <div className="flex flex-col gap-2 mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Header Styling</h3>

                <div className="flex flex-wrap gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-md overflow-visible relative items-center gap-1">
                    {/* Alignment */}
                    <div className="relative">
                      <button
                        onClick={() => setActivePopup(activePopup === 'headerAlignment' ? null : 'headerAlignment')}
                        className={`h-8 px-2 rounded-sm transition-colors flex items-center justify-center text-sm ${activePopup === 'headerAlignment' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                      >
                        {data.settings?.headerAlignment === 'center' ? <AlignCenter size={14} className="mr-1 opacity-70" /> : data.settings?.headerAlignment === 'right' ? <AlignRight size={14} className="mr-1 opacity-70" /> : <AlignLeft size={14} className="mr-1 opacity-70" />} Align
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                          {`Alignment`}
                        </span>
                      </button>
                      {activePopup === 'headerAlignment' && (
                        <div className="absolute top-full mt-2 left-0 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                          {['left', 'center', 'right'].map((align) => (
                            <button
                              key={align}
                              onClick={() => { updateSettings('headerAlignment', align); setActivePopup(null); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${data.settings?.headerAlignment === align ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              {align.charAt(0).toUpperCase() + align.slice(1)} {data.settings?.headerAlignment === align && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setActivePopup(activePopup === 'nameTransform' ? null : 'nameTransform')}
                        className={`h-8 px-2 rounded-sm transition-colors flex items-center justify-center text-sm ${activePopup === 'nameTransform' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                      >
                        <CaseUpper size={14} className="mr-1 opacity-70" /> Casing
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                          {`Name Casing`}
                        </span>
                      </button>
                      {activePopup === 'nameTransform' && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                          {[
                            { val: 'uppercase', label: 'UPPERCASE' },
                            { val: 'capitalize', label: 'Capitalize' },
                            { val: 'lowercase', label: 'lowercase' },
                            { val: 'normal-case', label: 'None' }
                          ].map((sz) => (
                            <button
                              key={sz.val}
                              onClick={() => { updateSettings('nameTransform', sz.val as any); setActivePopup(null); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${(data.settings?.nameTransform || 'uppercase') === sz.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              {sz.label} {(data.settings?.nameTransform || 'uppercase') === sz.val && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="w-px h-4 bg-slate-300 mx-0.5"></div>

                    <div className="relative">
                      <button
                        onClick={() => setActivePopup(activePopup === 'nameSize' ? null : 'nameSize')}
                        className={`h-8 px-2 rounded-sm transition-colors flex items-center justify-center text-sm ${activePopup === 'nameSize' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                      >
                        <TypeIcon size={14} className="mr-1 opacity-70" /> Name
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                          {`Name Size`}
                        </span>
                      </button>
                      {activePopup === 'nameSize' && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                          {[
                            { val: 'text-2xl', label: 'Small' },
                            { val: 'text-3xl', label: 'Medium' },
                            { val: 'text-4xl', label: 'Large' },
                            { val: 'text-5xl', label: 'X-Large' }
                          ].map((sz) => (
                            <button
                              key={sz.val}
                              onClick={() => { updateSettings('nameSize', sz.val); setActivePopup(null); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${(data.settings?.nameSize || 'text-4xl') === sz.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              {sz.label} {(data.settings?.nameSize || 'text-4xl') === sz.val && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-px h-4 bg-slate-300 mx-0.5"></div>
                    <div className="relative">
                      <button
                        onClick={() => setActivePopup(activePopup === 'jobTitleSize' ? null : 'jobTitleSize')}
                        className={`h-8 px-2 rounded-sm transition-colors flex items-center justify-center text-sm ${activePopup === 'jobTitleSize' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                      >
                        <Briefcase size={14} className="mr-1 opacity-70" /> Title
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                          {`Job Title Size`}
                        </span>
                      </button>
                      {activePopup === 'jobTitleSize' && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                          {[
                            { val: 'text-sm', label: 'Small' },
                            { val: 'text-base', label: 'Medium' },
                            { val: 'text-lg', label: 'Large' },
                            { val: 'text-xl', label: 'X-Large' }
                          ].map((sz) => (
                            <button
                              key={sz.val}
                              onClick={() => { updateSettings('jobTitleSize', sz.val); setActivePopup(null); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${(data.settings?.jobTitleSize || 'text-lg') === sz.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              {sz.label} {(data.settings?.jobTitleSize || 'text-lg') === sz.val && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-px h-4 bg-slate-300 mx-0.5"></div>
                    <div className="relative">
                      <button
                        onClick={() => setActivePopup(activePopup === 'contactInfoSize' ? null : 'contactInfoSize')}
                        className={`h-8 px-2 rounded-sm transition-colors flex items-center justify-center text-sm ${activePopup === 'contactInfoSize' ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-600'} group relative`}
                      >
                        <Phone size={14} className="mr-1 opacity-70" /> Contact
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                          {`Contact Info Size`}
                        </span>
                      </button>
                      {activePopup === 'contactInfoSize' && (
                        <div className="absolute top-full mt-2 right-0 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10 p-1">
                          {[
                            { val: 'text-xs', label: 'Small' },
                            { val: 'text-sm', label: 'Medium' },
                            { val: 'text-base', label: 'Large' }
                          ].map((sz) => (
                            <button
                              key={sz.val}
                              onClick={() => { updateSettings('contactInfoSize', sz.val); setActivePopup(null); }}
                              className={`block w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between ${(data.settings?.contactInfoSize || 'text-sm') === sz.val ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              {sz.label} {(data.settings?.contactInfoSize || 'text-sm') === sz.val && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection('summary')}>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
              {collapsedSections['summary'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Professional Summary</h2>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-md" onClick={(e) => e.stopPropagation()}>
            {renderMoveControls("summary")}
            <button
              onClick={() => updateSettings('showSummaryDivider', !(data.settings?.showSummaryDivider ?? true))}
              className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${data.settings?.showSummaryDivider ?? true ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}

            >
              {data.settings?.showSummaryDivider ?? true ? <Eye size={16} /> : <EyeOff size={16} />}

              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                {`Toggle Border`}
              </span>
            </button>
          </div>
        </div>
        {!collapsedSections['summary'] && (
          <RichTextEditor label="Summary Text" value={data.personalInfo.summary} onChange={(v: string) => updatePersonalInfo('summary', v)} placeholder="A brief summary of your professional background..." />
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection('experience')}>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
              {collapsedSections['experience'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Work Experience</h2>
          </div>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex bg-slate-100 p-1 rounded-md">
              {renderMoveControls("experience")}
              <button
                onClick={() => updateSettings('experienceFormat', data.settings?.experienceFormat === 'paragraph' ? 'bullets' : 'paragraph')}
                className="w-8 h-8 p-1.5 mr-1 rounded-sm transition-colors flex items-center justify-center bg-white shadow-sm text-blue-600 group relative"

              >
                {data.settings?.experienceFormat === 'paragraph' ? <AlignLeft size={16} /> : <List size={16} />}

                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                  {data.settings?.experienceFormat === 'paragraph' ? 'Paragraph Format' : 'Bullet Format'}
                </span>
              </button>
              <button
                onClick={() => updateSettings('showAtConnector', !(data.settings?.showAtConnector ?? true))}
                className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${(data.settings?.showAtConnector ?? true) ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}
              >
                {(data.settings?.showAtConnector ?? true) ? <Link2 size={16} /> : <Unlink2 size={16} />}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                  {(data.settings?.showAtConnector ?? true) ? 'Hide "at" connector' : 'Show "at" connector'}
                </span>
              </button>
              <button
                onClick={() => updateSettings('showExperienceDivider', !(data.settings?.showExperienceDivider ?? true))}
                className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${data.settings?.showExperienceDivider ?? true ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}

              >
                {data.settings?.showExperienceDivider ?? true ? <Eye size={16} /> : <EyeOff size={16} />}

                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                  {`Toggle Border`}
                </span>
              </button>
            </div>
            <button onClick={addExperience} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
              <Plus size={16} className="mr-1" /> Add Experience
            </button>
          </div>
        </div>
        {!collapsedSections['experience'] && (
          <>
            <div className="space-y-6">
              {data.experiences.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 relative group">
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {data.experiences.length > 1 && (
                      <>
                        <button
                          title="Move Up"
                          onClick={() => moveExperienceUp(index)}
                          disabled={index === 0}
                          className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          title="Move Down"
                          onClick={() => moveExperienceDown(index)}
                          disabled={index === data.experiences.length - 1}
                          className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${index === data.experiences.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                      </>
                    )}
                    <button title="Remove Experience" onClick={() => removeExperience(exp.id)} className="w-7 h-7 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {data.experiences.length > 1 && (
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none">
                      <GripVertical size={16} className="text-slate-400" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pr-8">
                    <Input icon={Building2} label="Company" value={exp.company} onChange={(v: string) => updateExperience(exp.id, 'company', v)} placeholder="Company Name" />
                    <Input icon={Briefcase} label="Position" value={exp.position} onChange={(v: string) => updateExperience(exp.id, 'position', v)} placeholder="Job Title" />
                    <CustomSelect icon={Briefcase} label="Employment Type" value={exp.employmentType || ''} onChange={(v: string) => updateExperience(exp.id, 'employmentType', v)} options={[
                      { label: 'None (Hide)', value: '' },
                      { label: 'Full-time', value: 'Full-time' },
                      { label: 'Part-time', value: 'Part-time' },
                      { label: 'Contract', value: 'Contract' },
                      { label: 'Freelance', value: 'Freelance' },
                      { label: 'Internship', value: 'Internship' }
                    ]} />
                    <CustomMonthPicker icon={Calendar} label="Start Date" value={exp.startDate} onChange={(v: string) => updateExperience(exp.id, 'startDate', v)} />
                    <CustomMonthPicker
                      icon={Calendar}
                      label="End Date"
                      value={exp.current ? '' : exp.endDate}
                      onChange={(v: string) => updateExperience(exp.id, 'endDate', v)}
                      disabled={exp.current}
                      suffix={
                        <button
                          onClick={(e) => { e.stopPropagation(); updateExperience(exp.id, 'current', !exp.current); }}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${exp.current ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                        >
                          Present
                        </button>
                      }
                    />
                  </div>
                  <RichTextEditor label="Description" value={exp.description} onChange={(v: string) => updateExperience(exp.id, 'description', v)} placeholder="Describe your achievements and responsibilities..." />
                </div>
              ))}
              {data.experiences.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No experience added yet.</p>}
            </div>
          </>
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection('education')}>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
              {collapsedSections['education'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Education</h2>
          </div>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex bg-slate-100 p-1 rounded-md">
              {renderMoveControls("education")}
              <button
                onClick={() => updateSettings('showInConnector', !(data.settings?.showInConnector ?? true))}
                className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${(data.settings?.showInConnector ?? true) ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}
              >
                {(data.settings?.showInConnector ?? true) ? <Link2 size={16} /> : <Unlink2 size={16} />}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                  {(data.settings?.showInConnector ?? true) ? 'Hide "in" connector' : 'Show "in" connector'}
                </span>
              </button>
              <button
                onClick={() => updateSettings('showEducationDivider', !(data.settings?.showEducationDivider ?? true))}
                className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${data.settings?.showEducationDivider ?? true ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}

              >
                {data.settings?.showEducationDivider ?? true ? <Eye size={16} /> : <EyeOff size={16} />}

                <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                  {`Toggle Border`}
                </span>
              </button>
            </div>
            <button onClick={addEducation} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
              <Plus size={16} className="mr-1" /> Add Education
            </button>
          </div>
        </div>
        {!collapsedSections['education'] && (
          <>
            <div className="space-y-6">
              {data.educations.map((edu, index) => (
                <div key={edu.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 relative group">
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {data.educations.length > 1 && (
                      <>
                        <button
                          title="Move Up"
                          onClick={() => moveEducationUp(index)}
                          disabled={index === 0}
                          className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          title="Move Down"
                          onClick={() => moveEducationDown(index)}
                          disabled={index === data.educations.length - 1}
                          className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${index === data.educations.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                      </>
                    )}
                    <button title="Remove Education" onClick={() => removeEducation(edu.id)} className="w-7 h-7 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {data.educations.length > 1 && (
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none">
                      <GripVertical size={16} className="text-slate-400" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pr-8">
                    <Input icon={GraduationCap} label="Institution" value={edu.institution} onChange={(v: string) => updateEducation(edu.id, 'institution', v)} placeholder="University Name" />
                    <Input icon={Award} label="Degree (Optional)" value={edu.degree} onChange={(v: string) => updateEducation(edu.id, 'degree', v)} placeholder="Bachelor of Science" />
                    <Input icon={BookOpen} label="Field of Study" value={edu.fieldOfStudy} onChange={(v: string) => updateEducation(edu.id, 'fieldOfStudy', v)} placeholder="Computer Science" />
                    <div className="grid grid-cols-2 gap-2">
                      <CustomMonthPicker icon={Calendar} label="Start Date" value={edu.startDate} onChange={(v: string) => updateEducation(edu.id, 'startDate', v)} />
                      <CustomMonthPicker icon={Calendar} label="End Date" value={edu.endDate} onChange={(v: string) => updateEducation(edu.id, 'endDate', v)} />
                    </div>
                  </div>
                  <RichTextEditor label="Description / Honors" value={edu.description} onChange={(v: string) => updateEducation(edu.id, 'description', v)} placeholder="Graduated with honors, relevant coursework..." />
                </div>
              ))}
              {data.educations.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No education added yet.</p>}
            </div>
          </>
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection('skills')}>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
              {collapsedSections['skills'] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
            <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-md" onClick={(e) => e.stopPropagation()}>
            {renderMoveControls("skills")}
            <button
              onClick={() => updateSettings('showSkillsDivider', !(data.settings?.showSkillsDivider ?? true))}
              className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${data.settings?.showSkillsDivider ?? true ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}

            >
              {data.settings?.showSkillsDivider ?? true ? <Eye size={16} /> : <EyeOff size={16} />}

              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[100]">
                {`Toggle Border`}
              </span>
            </button>
          </div>
        </div>
        {!collapsedSections['skills'] && (
          <Input as="textarea" label="Core Skills (comma separated)" value={data.skills} onChange={(v: string) => onChange({ ...data, skills: v })} placeholder="JavaScript, React, Team Leadership, Agile..." />
        )}
      </section>

      {(data.customSections || []).map(section => (
        <section key={section.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b cursor-pointer" onClick={() => toggleSection(section.id)}>
            <div className="flex-1 flex gap-4 items-center">
              <button className="text-slate-400 hover:text-blue-600 transition-colors pointer-events-none">
                {collapsedSections[section.id] ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
              <div className="w-48" onClick={(e) => e.stopPropagation()}><Input label="" noMargin value={section.name} onChange={(v: string) => updateCustomSection(section.id, 'name', v)} placeholder="Section Name" /></div>
              <div className="w-40" onClick={(e) => e.stopPropagation()}><CustomSelect label="" noMargin value={section.type} onChange={(v: string) => updateCustomSection(section.id, 'type', v)} options={[{ label: 'List Layout', value: 'list' }, { label: 'Text Layout', value: 'text' }]} /></div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-md ml-4" onClick={(e) => e.stopPropagation()}>
              {renderMoveControls(section.id)}
              <button onClick={() => updateCustomSection(section.id, 'visible', !section.visible)} className={`w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center ${section.visible ? 'bg-white shadow-sm text-blue-600' : 'hover:bg-slate-200 text-slate-400'} group relative`}>
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => removeCustomSection(section.id)} className="w-8 h-8 p-1.5 rounded-sm transition-colors flex items-center justify-center hover:bg-slate-200 text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {!collapsedSections[section.id] && (
            <>
              {section.type === 'text' ? (
                <RichTextEditor label="Content" value={section.content} onChange={(v: string) => updateCustomSection(section.id, 'content', v)} placeholder="Type your custom content here..." />
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-slate-800">Items</h3>
                    <button onClick={() => addCustomSectionItem(section.id)} className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <Plus size={16} className="mr-1" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-6">
                    {(section.items || []).map((item, itemIndex) => (
                      <div key={item.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50 relative group">
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {(section.items || []).length > 1 && (
                            <>
                              <button
                                title="Move Up"
                                onClick={() => moveCustomSectionItemUp(section.id, itemIndex)}
                                disabled={itemIndex === 0}
                                className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${itemIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                              >
                                <ChevronUp size={16} />
                              </button>
                              <button
                                title="Move Down"
                                onClick={() => moveCustomSectionItemDown(section.id, itemIndex)}
                                disabled={itemIndex === (section.items || []).length - 1}
                                className={`w-7 h-7 p-1 rounded-md transition-all flex items-center justify-center ${itemIndex === (section.items || []).length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                              >
                                <ChevronDown size={16} />
                              </button>
                              <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
                            </>
                          )}
                          <button title="Remove Item" onClick={() => removeCustomSectionItem(section.id, item.id)} className="w-7 h-7 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {(section.items || []).length > 1 && (
                          <div className="absolute top-1/2 -translate-y-1/2 -left-1 opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none">
                            <GripVertical size={16} className="text-slate-400" />
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pr-8">
                          <Input label="Title" value={item.title} onChange={(v: string) => updateCustomSectionItem(section.id, item.id, 'title', v)} placeholder="e.g. Project Name" />
                          <Input label="Subtitle" value={item.subtitle} onChange={(v: string) => updateCustomSectionItem(section.id, item.id, 'subtitle', v)} placeholder="e.g. Role or Tech Stack" />
                          <div className="grid grid-cols-2 gap-2">
                            <CustomMonthPicker icon={Calendar} label="Start Date" value={item.startDate} onChange={(v: string) => updateCustomSectionItem(section.id, item.id, 'startDate', v)} />
                            <CustomMonthPicker icon={Calendar} label="End Date" value={item.endDate} onChange={(v: string) => updateCustomSectionItem(section.id, item.id, 'endDate', v)} />
                          </div>
                        </div>
                        <RichTextEditor label="Description" value={item.description} onChange={(v: string) => updateCustomSectionItem(section.id, item.id, 'description', v)} placeholder="Details..." />
                      </div>
                    ))}
                    {(section.items || []).length === 0 && <p className="text-sm text-slate-500 text-center py-4">No items added yet.</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      ))}

      <div className="flex justify-center mt-6">
        <button onClick={addCustomSection} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium">
          <Plus size={20} />
          Add Custom Section
        </button>
      </div>

    </div>
  );
};
