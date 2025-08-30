'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Assessment form schema
const assessmentSchema = z.object({
  // Academic Assessment Fields
  academicPerformance: z.object({
    overallGrade: z.string().min(1, 'Overall grade is required'),
    favoriteSubjects: z.array(z.string()).min(1, 'Select at least one subject'),
    strugglingSubjects: z.array(z.string()).optional(),
    studyHoursPerDay: z.number().min(0).max(24),
    homeworkCompletion: z.number().min(0).max(100),
    classParticipation: z.number().min(1).max(5),
    testAnxiety: z.number().min(1).max(5),
  }),
  
  // Psychological Assessment Fields
  psychologicalWellbeing: z.object({
    moodRating: z.number().min(1).max(10),
    stressLevel: z.number().min(1).max(10),
    socialInteraction: z.number().min(1).max(5),
    selfConfidence: z.number().min(1).max(5),
    motivationLevel: z.number().min(1).max(5),
    sleepQuality: z.number().min(1).max(5),
    behavioralConcerns: z.array(z.string()).optional(),
  }),
  
  // Physical Assessment Fields
  physicalHealth: z.object({
    height: z.number().positive('Height must be positive'),
    weight: z.number().positive('Weight must be positive'),
    exerciseFrequency: z.number().min(0).max(7),
    sportsParticipation: z.array(z.string()).optional(),
    healthConditions: z.array(z.string()).optional(),
    dietaryRestrictions: z.array(z.string()).optional(),
    screenTime: z.number().min(0).max(24),
  }),
  
  // Career Interest Fields
  careerInterests: z.object({
    interestedFields: z.array(z.string()).min(1, 'Select at least one field'),
    careerGoals: z.string().min(10, 'Please provide more details about career goals'),
    skillsToImprove: z.array(z.string()).optional(),
    extracurricularActivities: z.array(z.string()).optional(),
    leadershipExperience: z.string().optional(),
  }),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => Promise<void>;
  initialData?: Partial<AssessmentFormData>;
  isLoading?: boolean;
}

const subjects = [
  'Mathematics', 'Science', 'English', 'History', 'Geography',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art',
  'Music', 'Physical Education', 'Foreign Languages'
];

const careerFields = [
  'Technology', 'Healthcare', 'Education', 'Business', 'Arts',
  'Engineering', 'Science', 'Sports', 'Media', 'Law',
  'Finance', 'Social Work', 'Environment', 'Politics'
];

const behavioralConcerns = [
  'Attention difficulties', 'Hyperactivity', 'Social anxiety',
  'Aggression', 'Withdrawal', 'Perfectionism', 'Procrastination'
];

const healthConditions = [
  'Asthma', 'Allergies', 'Diabetes', 'Vision problems',
  'Hearing problems', 'Learning disabilities', 'ADHD'
];

export function AssessmentForm({ onSubmit, initialData, isLoading = false }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: initialData,
  });

  const steps = [
    { title: 'Academic Performance', key: 'academic' },
    { title: 'Psychological Wellbeing', key: 'psychological' },
    { title: 'Physical Health', key: 'physical' },
    { title: 'Career Interests', key: 'career' },
  ];

  const handleFormSubmit = async (data: AssessmentFormData) => {
    try {
      await onSubmit(data);
      toast.success('Assessment submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderLikertScale = (
    name: string,
    label: string,
    min: number = 1,
    max: number = 5,
    labels?: string[]
  ) => (
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <label className="form-label">{label}</label>
          <div className="flex items-center space-x-4">
            {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((value) => (
              <label key={value} className="flex flex-col items-center space-y-1">
                <input
                  type="radio"
                  value={value}
                  checked={field.value === value}
                  onChange={() => field.onChange(value)}
                  className="form-radio text-primary-600"
                />
                <span className="text-xs text-gray-600">{value}</span>
                {labels && labels[value - min] && (
                  <span className="text-xs text-gray-500 text-center max-w-16">
                    {labels[value - min]}
                  </span>
                )}
              </label>
            ))}
          </div>
          {errors[name as keyof typeof errors] && (
            <p className="form-error">
              {errors[name as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );

  const renderMultiSelect = (
    name: string,
    label: string,
    options: string[],
    required: boolean = false
  ) => (
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <label className="form-label">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.value?.includes(option) || false}
                  onChange={(e) => {
                    const currentValue = field.value || [];
                    if (e.target.checked) {
                      field.onChange([...currentValue, option]);
                    } else {
                      field.onChange(currentValue.filter((item: string) => item !== option));
                    }
                  }}
                  className="form-checkbox text-primary-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {errors[name as keyof typeof errors] && (
            <p className="form-error">
              {errors[name as keyof typeof errors]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );

  const renderAcademicStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
      
      <Controller
        name="academicPerformance.overallGrade"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Overall Grade *</label>
            <select {...field} className="form-input">
              <option value="">Select grade</option>
              <option value="A+">A+ (90-100%)</option>
              <option value="A">A (80-89%)</option>
              <option value="B">B (70-79%)</option>
              <option value="C">C (60-69%)</option>
              <option value="D">D (50-59%)</option>
              <option value="F">F (Below 50%)</option>
            </select>
            {errors.academicPerformance?.overallGrade && (
              <p className="form-error">{errors.academicPerformance.overallGrade.message}</p>
            )}
          </div>
        )}
      />

      {renderMultiSelect(
        'academicPerformance.favoriteSubjects',
        'Favorite Subjects',
        subjects,
        true
      )}

      {renderMultiSelect(
        'academicPerformance.strugglingSubjects',
        'Subjects You Struggle With',
        subjects
      )}

      <Controller
        name="academicPerformance.studyHoursPerDay"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Study Hours Per Day</label>
            <input
              {...field}
              type="number"
              min="0"
              max="24"
              step="0.5"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              className="form-input"
              placeholder="e.g., 2.5"
            />
          </div>
        )}
      />

      {renderLikertScale(
        'academicPerformance.classParticipation',
        'Class Participation Level',
        1,
        5,
        ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
      )}

      {renderLikertScale(
        'academicPerformance.testAnxiety',
        'Test Anxiety Level',
        1,
        5,
        ['None', 'Low', 'Moderate', 'High', 'Severe']
      )}
    </motion.div>
  );

  const renderPsychologicalStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900">Psychological Wellbeing</h3>
      
      {renderLikertScale(
        'psychologicalWellbeing.moodRating',
        'Overall Mood Rating',
        1,
        10
      )}

      {renderLikertScale(
        'psychologicalWellbeing.stressLevel',
        'Stress Level',
        1,
        10
      )}

      {renderLikertScale(
        'psychologicalWellbeing.socialInteraction',
        'Social Interaction Comfort',
        1,
        5,
        ['Very Uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very Comfortable']
      )}

      {renderLikertScale(
        'psychologicalWellbeing.selfConfidence',
        'Self-Confidence Level',
        1,
        5,
        ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
      )}

      {renderLikertScale(
        'psychologicalWellbeing.motivationLevel',
        'Motivation Level',
        1,
        5,
        ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
      )}

      {renderLikertScale(
        'psychologicalWellbeing.sleepQuality',
        'Sleep Quality',
        1,
        5,
        ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
      )}

      {renderMultiSelect(
        'psychologicalWellbeing.behavioralConcerns',
        'Behavioral Concerns (if any)',
        behavioralConcerns
      )}
    </motion.div>
  );

  const renderPhysicalStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900">Physical Health</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="physicalHealth.height"
          control={control}
          render={({ field }) => (
            <div>
              <label className="form-label">Height (cm) *</label>
              <input
                {...field}
                type="number"
                min="50"
                max="250"
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="form-input"
                placeholder="e.g., 165"
              />
              {errors.physicalHealth?.height && (
                <p className="form-error">{errors.physicalHealth.height.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="physicalHealth.weight"
          control={control}
          render={({ field }) => (
            <div>
              <label className="form-label">Weight (kg) *</label>
              <input
                {...field}
                type="number"
                min="10"
                max="200"
                step="0.1"
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                className="form-input"
                placeholder="e.g., 55.5"
              />
              {errors.physicalHealth?.weight && (
                <p className="form-error">{errors.physicalHealth.weight.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        name="physicalHealth.exerciseFrequency"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Exercise Frequency (days per week)</label>
            <input
              {...field}
              type="number"
              min="0"
              max="7"
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="form-input"
              placeholder="e.g., 3"
            />
          </div>
        )}
      />

      {renderMultiSelect(
        'physicalHealth.sportsParticipation',
        'Sports/Physical Activities',
        ['Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling', 'Yoga', 'Dance', 'Martial Arts', 'Other']
      )}

      {renderMultiSelect(
        'physicalHealth.healthConditions',
        'Health Conditions (if any)',
        healthConditions
      )}

      <Controller
        name="physicalHealth.screenTime"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Daily Screen Time (hours)</label>
            <input
              {...field}
              type="number"
              min="0"
              max="24"
              step="0.5"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              className="form-input"
              placeholder="e.g., 4.5"
            />
          </div>
        )}
      />
    </motion.div>
  );

  const renderCareerStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-900">Career Interests</h3>
      
      {renderMultiSelect(
        'careerInterests.interestedFields',
        'Fields of Interest',
        careerFields,
        true
      )}

      <Controller
        name="careerInterests.careerGoals"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Career Goals *</label>
            <textarea
              {...field}
              rows={4}
              className="form-input"
              placeholder="Describe your career aspirations and goals..."
            />
            {errors.careerInterests?.careerGoals && (
              <p className="form-error">{errors.careerInterests.careerGoals.message}</p>
            )}
          </div>
        )}
      />

      {renderMultiSelect(
        'careerInterests.skillsToImprove',
        'Skills You Want to Improve',
        ['Communication', 'Leadership', 'Problem Solving', 'Creativity', 'Technical Skills', 'Time Management', 'Teamwork', 'Critical Thinking']
      )}

      {renderMultiSelect(
        'careerInterests.extracurricularActivities',
        'Extracurricular Activities',
        ['Student Council', 'Debate Club', 'Drama Club', 'Music Band', 'Science Club', 'Sports Team', 'Volunteer Work', 'Art Club']
      )}

      <Controller
        name="careerInterests.leadershipExperience"
        control={control}
        render={({ field }) => (
          <div>
            <label className="form-label">Leadership Experience</label>
            <textarea
              {...field}
              rows={3}
              className="form-input"
              placeholder="Describe any leadership roles or experiences..."
            />
          </div>
        )}
      />
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderAcademicStep();
      case 1:
        return renderPsychologicalStep();
      case 2:
        return renderPhysicalStep();
      case 3:
        return renderCareerStep();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Assessment'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
