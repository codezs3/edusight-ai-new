/**
 * Grade Level Constants
 * Centralized grade options for consistent use across the application
 * Covers Nursery to Grade 12 as per the EduSight platform scope
 */

export interface GradeOption {
  value: string;
  label: string;
  category: 'early_childhood' | 'primary' | 'middle' | 'secondary' | 'higher_secondary';
  ageRange: string;
}

export const GRADE_OPTIONS: GradeOption[] = [
  // Early Childhood (Pre-Primary)
  { value: 'nursery', label: 'Nursery', category: 'early_childhood', ageRange: '3-4 years' },
  { value: 'lkg', label: 'LKG (Lower Kindergarten)', category: 'early_childhood', ageRange: '4-5 years' },
  { value: 'ukg', label: 'UKG (Upper Kindergarten)', category: 'early_childhood', ageRange: '5-6 years' },
  
  // Primary Education
  { value: '1', label: 'Grade 1', category: 'primary', ageRange: '6-7 years' },
  { value: '2', label: 'Grade 2', category: 'primary', ageRange: '7-8 years' },
  { value: '3', label: 'Grade 3', category: 'primary', ageRange: '8-9 years' },
  { value: '4', label: 'Grade 4', category: 'primary', ageRange: '9-10 years' },
  { value: '5', label: 'Grade 5', category: 'primary', ageRange: '10-11 years' },
  
  // Middle School
  { value: '6', label: 'Grade 6', category: 'middle', ageRange: '11-12 years' },
  { value: '7', label: 'Grade 7', category: 'middle', ageRange: '12-13 years' },
  { value: '8', label: 'Grade 8', category: 'middle', ageRange: '13-14 years' },
  
  // Secondary Education
  { value: '9', label: 'Grade 9', category: 'secondary', ageRange: '14-15 years' },
  { value: '10', label: 'Grade 10', category: 'secondary', ageRange: '15-16 years' },
  
  // Higher Secondary Education
  { value: '11', label: 'Grade 11', category: 'higher_secondary', ageRange: '16-17 years' },
  { value: '12', label: 'Grade 12', category: 'higher_secondary', ageRange: '17-18 years' },
];

// Helper functions for common use cases
export const getGradesByCategory = (category: GradeOption['category']): GradeOption[] => {
  return GRADE_OPTIONS.filter(grade => grade.category === category);
};

export const getGradeLabel = (value: string): string => {
  const grade = GRADE_OPTIONS.find(g => g.value === value);
  return grade?.label || value;
};

export const getEarlyChildhoodGrades = (): GradeOption[] => {
  return getGradesByCategory('early_childhood');
};

export const getPrimaryGrades = (): GradeOption[] => {
  return getGradesByCategory('primary');
};

export const getMiddleSchoolGrades = (): GradeOption[] => {
  return getGradesByCategory('middle');
};

export const getSecondaryGrades = (): GradeOption[] => {
  return getGradesByCategory('secondary');
};

export const getHigherSecondaryGrades = (): GradeOption[] => {
  return getGradesByCategory('higher_secondary');
};

// Simple array of values for basic dropdowns
export const GRADE_VALUES = GRADE_OPTIONS.map(grade => grade.value);

// Simple array of labels for display
export const GRADE_LABELS = GRADE_OPTIONS.map(grade => grade.label);

// Grade options for select dropdowns (value-label pairs)
export const GRADE_SELECT_OPTIONS = GRADE_OPTIONS.map(grade => ({
  value: grade.value,
  label: grade.label
}));
