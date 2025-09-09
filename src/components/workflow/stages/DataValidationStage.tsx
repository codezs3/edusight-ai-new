'use client';

import React, { useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { AcademicData, PsychometricData, PhysicalData, SkillData, StudentProfile } from '@/types/assessment';
import { toast } from 'react-hot-toast';

interface DataValidationStageProps {
  data: any;
  workflowConfig?: any;
  onComplete: (data: StudentProfile) => void;
  onError: (error: string) => void;
}

const SKILL_CATEGORIES = [
  'TECHNICAL', 'SOFT', 'CREATIVE', 'LEADERSHIP'
] as const;

const SKILL_LEVELS = [
  'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'
] as const;

const PREDEFINED_SKILLS = {
  TECHNICAL: ['Programming', 'Data Analysis', 'Mathematics', 'Science', 'Engineering'],
  SOFT: ['Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management'],
  CREATIVE: ['Art', 'Music', 'Writing', 'Design', 'Innovation'],
  LEADERSHIP: ['Team Leadership', 'Project Management', 'Public Speaking', 'Decision Making', 'Mentoring']
};

export function DataValidationStage({ data, workflowConfig, onComplete, onError }: DataValidationStageProps) {
  const [academicData, setAcademicData] = useState<AcademicData[]>([]);
  const [psychometricData, setPsychometricData] = useState<PsychometricData[]>([]);
  const [physicalData, setPhysicalData] = useState<PhysicalData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    age: 0,
    grade: '',
    school: '',
    board: 'CBSE'
  });
  const [extracurriculars, setExtracurriculars] = useState<string[]>(['']);

  React.useEffect(() => {
    if (data?.extractedData) {
      // Initialize with extracted data
      setAcademicData(data.extractedData[0]?.academicScores || []);
      setPsychometricData(data.extractedData[0]?.psychometricScores || []);
      setPhysicalData(data.extractedData[0]?.physicalMetrics || []);
    }
  }, [data]);

  const addAcademicScore = useCallback(() => {
    setAcademicData(prev => [...prev, {
      subject: '',
      score: 0,
      maxScore: 100,
      grade: '',
      semester: '',
      year: new Date().getFullYear(),
      board: 'CBSE'
    }]);
  }, []);

  const updateAcademicScore = useCallback((index: number, field: keyof AcademicData, value: any) => {
    setAcademicData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeAcademicScore = useCallback((index: number) => {
    setAcademicData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addPsychometricScore = useCallback(() => {
    setPsychometricData(prev => [...prev, {
      trait: '',
      score: 0,
      maxScore: 10,
      category: 'BIG_FIVE'
    }]);
  }, []);

  const updatePsychometricScore = useCallback((index: number, field: keyof PsychometricData, value: any) => {
    setPsychometricData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const removePsychometricScore = useCallback((index: number) => {
    setPsychometricData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addSkill = useCallback(() => {
    setSkills(prev => [...prev, {
      skill: '',
      level: 'BEGINNER',
      category: 'TECHNICAL',
      evidence: ''
    }]);
  }, []);

  const updateSkill = useCallback((index: number, field: keyof SkillData, value: any) => {
    setSkills(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateExtracurricular = useCallback((index: number, value: string) => {
    setExtracurriculars(prev => prev.map((item, i) => i === index ? value : item));
  }, []);

  const addExtracurricular = useCallback(() => {
    setExtracurriculars(prev => [...prev, '']);
  }, []);

  const removeExtracurricular = useCallback((index: number) => {
    setExtracurriculars(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(() => {
    // Validation
    if (!studentInfo.name || !studentInfo.grade || !studentInfo.school) {
      toast.error('Please fill in all required student information');
      return;
    }

    if (academicData.length === 0) {
      toast.error('Please add at least one academic score');
      return;
    }

    const studentProfile: StudentProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: studentInfo.name,
      age: studentInfo.age,
      grade: studentInfo.grade,
      school: studentInfo.school,
      board: studentInfo.board,
      academicData: academicData.filter(item => item.subject && item.score > 0),
      psychometricData: psychometricData.filter(item => item.trait && item.score > 0),
      physicalData: physicalData.filter(item => item.metric && item.value > 0),
      skills: skills.filter(item => item.skill && item.level),
      extracurriculars: extracurriculars.filter(item => item.trim() !== ''),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onComplete(studentProfile);
  }, [studentInfo, academicData, psychometricData, physicalData, skills, extracurriculars, onComplete]);

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name *
            </label>
            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              value={studentInfo.age}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade/Class *
            </label>
            <input
              type="text"
              value={studentInfo.grade}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, grade: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Grade 10, Class 12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School *
            </label>
            <input
              type="text"
              value={studentInfo.school}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, school: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter school name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board
            </label>
            <select
              value={studentInfo.board}
              onChange={(e) => setStudentInfo(prev => ({ ...prev, board: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="STATE">State Board</option>
              <option value="IGCSE">IGCSE</option>
              <option value="IB">IB</option>
            </select>
          </div>
        </div>
      </div>

      {/* Academic Scores */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Academic Scores</h3>
          <button
            onClick={addAcademicScore}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Score
          </button>
        </div>
        
        <div className="space-y-4">
          {academicData.map((score, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={score.subject}
                  onChange={(e) => updateAcademicScore(index, 'subject', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                <input
                  type="number"
                  value={score.score}
                  onChange={(e) => updateAcademicScore(index, 'score', parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                <input
                  type="number"
                  value={score.maxScore}
                  onChange={(e) => updateAcademicScore(index, 'maxScore', parseInt(e.target.value) || 100)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <input
                  type="text"
                  value={score.grade || ''}
                  onChange={(e) => updateAcademicScore(index, 'grade', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="A+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <input
                  type="text"
                  value={score.semester || ''}
                  onChange={(e) => updateAcademicScore(index, 'semester', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Term 1"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => removeAcademicScore(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Skills & Competencies</h3>
          <button
            onClick={addSkill}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Skill
          </button>
        </div>
        
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select
                  value={skill.skill}
                  onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select skill</option>
                  {PREDEFINED_SKILLS[skill.category].map(skillName => (
                    <option key={skillName} value={skillName}>{skillName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={skill.category}
                  onChange={(e) => updateSkill(index, 'category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  {SKILL_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence</label>
                <input
                  type="text"
                  value={skill.evidence || ''}
                  onChange={(e) => updateSkill(index, 'evidence', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Certificates, projects, etc."
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => removeSkill(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracurricular Activities */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Extracurricular Activities</h3>
          <button
            onClick={addExtracurricular}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Activity
          </button>
        </div>
        
        <div className="space-y-3">
          {extracurriculars.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={activity}
                onChange={(e) => updateExtracurricular(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Football, Debate Club, Music"
              />
              <button
                onClick={() => removeExtracurricular(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue to Analysis
        </button>
      </div>
    </div>
  );
}
