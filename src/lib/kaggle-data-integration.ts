// Kaggle Data Integration for EduSight
// This module integrates the downloaded Kaggle datasets into our application

export interface KaggleCareerData {
  career_fields: any[];
  skills: any[];
  skill_career_mapping: Record<string, any>;
}

export interface KaggleCollegeData {
  colleges: any[];
  programs: any[];
  admission_criteria: Record<string, any>;
}

export interface ProcessedCareerField {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  growthRate: number;
  avgSalary?: number;
  educationLevel: string;
  skills: string[];
  personalityTraits: string[];
  workEnvironment: string[];
  requirements?: string[];
  opportunities?: string[];
}

export interface ProcessedCollege {
  id: string;
  name: string;
  type: string;
  location: string;
  ranking?: number;
  programs: string[];
  admissionCriteria: {
    cutoff?: number;
    requirements: string[];
    exams: string[];
  };
  fees?: {
    min: number;
    max: number;
    currency: string;
  };
  placement?: {
    averagePackage: number;
    topCompanies: string[];
  };
}

export class KaggleDataIntegration {
  private static careerData: KaggleCareerData | null = null;
  private static collegeData: KaggleCollegeData | null = null;

  // Load Kaggle data from processed files
  static async loadKaggleData(): Promise<{ career: KaggleCareerData | null; college: KaggleCollegeData | null }> {
    try {
      // Load career data
      const careerResponse = await fetch('/data/processed/career-mapping-from-kaggle.json');
      if (careerResponse.ok) {
        this.careerData = await careerResponse.json();
      }

      // Load college data
      const collegeResponse = await fetch('/data/processed/college-database.json');
      if (collegeResponse.ok) {
        this.collegeData = await collegeResponse.json();
      }

      return {
        career: this.careerData,
        college: this.collegeData
      };
    } catch (error) {
      console.error('Error loading Kaggle data:', error);
      return { career: null, college: null };
    }
  }

  // Process career data for our application
  static processCareerData(rawData: any[]): ProcessedCareerField[] {
    const processedCareers: ProcessedCareerField[] = [];

    rawData.forEach((item, index) => {
      // Extract relevant information from the raw data
      const career: ProcessedCareerField = {
        id: `kaggle-career-${index}`,
        name: item.title || item.job_title || item.career || item.name || `Career ${index + 1}`,
        description: item.description || item.job_description || 'Career field from Kaggle dataset',
        category: this.categorizeCareer(item.category || item.field || item.type || 'GENERAL'),
        subcategory: item.subcategory || item.specialization,
        growthRate: this.parseGrowthRate(item.growth_rate || item.growth || item.projection),
        avgSalary: this.parseSalary(item.salary || item.avg_salary || item.compensation),
        educationLevel: this.mapEducationLevel(item.education || item.qualification || item.degree),
        skills: this.extractSkills(item.skills || item.requirements || item.competencies),
        personalityTraits: this.extractPersonalityTraits(item.traits || item.personality || item.characteristics),
        workEnvironment: this.extractWorkEnvironment(item.environment || item.setting || item.workplace),
        requirements: this.extractRequirements(item.requirements || item.prerequisites),
        opportunities: this.extractOpportunities(item.opportunities || item.prospects || item.advancement)
      };

      processedCareers.push(career);
    });

    return processedCareers;
  }

  // Process college data for our application
  static processCollegeData(rawData: any[]): ProcessedCollege[] {
    const processedColleges: ProcessedCollege[] = [];

    rawData.forEach((item, index) => {
      const college: ProcessedCollege = {
        id: `kaggle-college-${index}`,
        name: item.name || item.college_name || item.university || item.institute || `College ${index + 1}`,
        type: item.type || item.category || item.kind || 'UNIVERSITY',
        location: item.location || item.city || item.state || item.address || 'India',
        ranking: this.parseRanking(item.ranking || item.rank || item.position),
        programs: this.extractPrograms(item.programs || item.courses || item.degrees),
        admissionCriteria: {
          cutoff: this.parseCutoff(item.cutoff || item.minimum_score),
          requirements: this.extractRequirements(item.requirements || item.criteria),
          exams: this.extractExams(item.exams || item.entrance_tests)
        },
        fees: this.parseFees(item.fees || item.tuition || item.cost),
        placement: this.parsePlacement(item.placement || item.jobs || item.recruitment)
      };

      processedColleges.push(college);
    });

    return processedColleges;
  }

  // Helper methods for data processing
  private static categorizeCareer(category: string): string {
    const categoryMap: Record<string, string> = {
      'technology': 'TECHNOLOGY',
      'engineering': 'TECHNOLOGY',
      'software': 'TECHNOLOGY',
      'it': 'TECHNOLOGY',
      'healthcare': 'HEALTHCARE',
      'medical': 'HEALTHCARE',
      'doctor': 'HEALTHCARE',
      'nurse': 'HEALTHCARE',
      'business': 'BUSINESS',
      'finance': 'BUSINESS',
      'marketing': 'BUSINESS',
      'management': 'BUSINESS',
      'education': 'EDUCATION',
      'teaching': 'EDUCATION',
      'arts': 'ARTS',
      'design': 'ARTS',
      'creative': 'ARTS',
      'service': 'SERVICE',
      'customer': 'SERVICE',
      'hospitality': 'SERVICE'
    };

    const lowerCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCategory.includes(key)) {
        return value;
      }
    }
    return 'GENERAL';
  }

  private static parseGrowthRate(growth: any): number {
    if (typeof growth === 'number') return growth;
    if (typeof growth === 'string') {
      const match = growth.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 5.0;
    }
    return 5.0; // Default growth rate
  }

  private static parseSalary(salary: any): number | undefined {
    if (typeof salary === 'number') return salary;
    if (typeof salary === 'string') {
      const match = salary.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : undefined;
    }
    return undefined;
  }

  private static mapEducationLevel(education: any): string {
    if (!education) return 'BACHELORS';
    
    const lowerEducation = education.toLowerCase();
    if (lowerEducation.includes('phd') || lowerEducation.includes('doctorate')) return 'DOCTORATE';
    if (lowerEducation.includes('master') || lowerEducation.includes('mba')) return 'MASTERS';
    if (lowerEducation.includes('bachelor') || lowerEducation.includes('degree')) return 'BACHELORS';
    if (lowerEducation.includes('diploma') || lowerEducation.includes('certificate')) return 'CERTIFICATION';
    if (lowerEducation.includes('high school') || lowerEducation.includes('12th')) return 'HIGH_SCHOOL';
    
    return 'BACHELORS';
  }

  private static extractSkills(skills: any): string[] {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
      return skills.split(/[,;|]/).map(s => s.trim()).filter(s => s.length > 0);
    }
    return [];
  }

  private static extractPersonalityTraits(traits: any): string[] {
    if (!traits) return [];
    if (Array.isArray(traits)) return traits;
    if (typeof traits === 'string') {
      return traits.split(/[,;|]/).map(t => t.trim()).filter(t => t.length > 0);
    }
    return [];
  }

  private static extractWorkEnvironment(environment: any): string[] {
    if (!environment) return [];
    if (Array.isArray(environment)) return environment;
    if (typeof environment === 'string') {
      return environment.split(/[,;|]/).map(e => e.trim()).filter(e => e.length > 0);
    }
    return [];
  }

  private static extractRequirements(requirements: any): string[] {
    if (!requirements) return [];
    if (Array.isArray(requirements)) return requirements;
    if (typeof requirements === 'string') {
      return requirements.split(/[,;|]/).map(r => r.trim()).filter(r => r.length > 0);
    }
    return [];
  }

  private static extractOpportunities(opportunities: any): string[] {
    if (!opportunities) return [];
    if (Array.isArray(opportunities)) return opportunities;
    if (typeof opportunities === 'string') {
      return opportunities.split(/[,;|]/).map(o => o.trim()).filter(o => o.length > 0);
    }
    return [];
  }

  private static parseRanking(ranking: any): number | undefined {
    if (typeof ranking === 'number') return ranking;
    if (typeof ranking === 'string') {
      const match = ranking.match(/(\d+)/);
      return match ? parseInt(match[1]) : undefined;
    }
    return undefined;
  }

  private static extractPrograms(programs: any): string[] {
    if (!programs) return [];
    if (Array.isArray(programs)) return programs;
    if (typeof programs === 'string') {
      return programs.split(/[,;|]/).map(p => p.trim()).filter(p => p.length > 0);
    }
    return [];
  }

  private static parseCutoff(cutoff: any): number | undefined {
    if (typeof cutoff === 'number') return cutoff;
    if (typeof cutoff === 'string') {
      const match = cutoff.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : undefined;
    }
    return undefined;
  }

  private static extractExams(exams: any): string[] {
    if (!exams) return [];
    if (Array.isArray(exams)) return exams;
    if (typeof exams === 'string') {
      return exams.split(/[,;|]/).map(e => e.trim()).filter(e => e.length > 0);
    }
    return [];
  }

  private static parseFees(fees: any): { min: number; max: number; currency: string } | undefined {
    if (!fees) return undefined;
    
    if (typeof fees === 'object' && fees.min && fees.max) {
      return {
        min: fees.min,
        max: fees.max,
        currency: fees.currency || 'INR'
      };
    }
    
    if (typeof fees === 'string') {
      const match = fees.match(/(\d+(?:,\d{3})*(?:\.\d+)?)\s*-\s*(\d+(?:,\d{3})*(?:\.\d+)?)/);
      if (match) {
        return {
          min: parseFloat(match[1].replace(/,/g, '')),
          max: parseFloat(match[2].replace(/,/g, '')),
          currency: 'INR'
        };
      }
    }
    
    return undefined;
  }

  private static parsePlacement(placement: any): { averagePackage: number; topCompanies: string[] } | undefined {
    if (!placement) return undefined;
    
    if (typeof placement === 'object') {
      return {
        averagePackage: placement.averagePackage || placement.avg_package || 0,
        topCompanies: placement.topCompanies || placement.companies || []
      };
    }
    
    return undefined;
  }

  // Get processed career data
  static getProcessedCareerData(): ProcessedCareerField[] {
    if (!this.careerData) return [];
    return this.processCareerData(this.careerData.career_fields);
  }

  // Get processed college data
  static getProcessedCollegeData(): ProcessedCollege[] {
    if (!this.collegeData) return [];
    return this.processCollegeData(this.collegeData.colleges);
  }

  // Search careers by skills
  static searchCareersBySkills(skills: string[]): ProcessedCareerField[] {
    const careers = this.getProcessedCareerData();
    return careers.filter(career => 
      skills.some(skill => 
        career.skills.some(careerSkill => 
          careerSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }

  // Search colleges by program
  static searchCollegesByProgram(program: string): ProcessedCollege[] {
    const colleges = this.getProcessedCollegeData();
    return colleges.filter(college =>
      college.programs.some(collegeProgram =>
        collegeProgram.toLowerCase().includes(program.toLowerCase())
      )
    );
  }

  // Get career recommendations based on personality and skills
  static getCareerRecommendations(
    personalityTraits: string[],
    skills: string[],
    interests: string[]
  ): ProcessedCareerField[] {
    const careers = this.getProcessedCareerData();
    
    return careers
      .map(career => {
        let score = 0;
        
        // Score based on personality traits match
        const personalityMatch = personalityTraits.filter(trait =>
          career.personalityTraits.some(careerTrait =>
            careerTrait.toLowerCase().includes(trait.toLowerCase())
          )
        ).length;
        score += personalityMatch * 2;
        
        // Score based on skills match
        const skillsMatch = skills.filter(skill =>
          career.skills.some(careerSkill =>
            careerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ).length;
        score += skillsMatch * 3;
        
        // Score based on interests match
        const interestsMatch = interests.filter(interest =>
          career.description.toLowerCase().includes(interest.toLowerCase()) ||
          career.category.toLowerCase().includes(interest.toLowerCase())
        ).length;
        score += interestsMatch * 1;
        
        return { ...career, matchScore: score };
      })
      .filter(career => career.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }
}

// Export utility functions
export const loadKaggleData = KaggleDataIntegration.loadKaggleData;
export const getProcessedCareerData = KaggleDataIntegration.getProcessedCareerData;
export const getProcessedCollegeData = KaggleDataIntegration.getProcessedCollegeData;
export const searchCareersBySkills = KaggleDataIntegration.searchCareersBySkills;
export const searchCollegesByProgram = KaggleDataIntegration.searchCollegesByProgram;
export const getCareerRecommendations = KaggleDataIntegration.getCareerRecommendations;
