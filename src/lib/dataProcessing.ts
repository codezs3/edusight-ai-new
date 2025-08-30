import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export interface ProcessedData {
  success: boolean;
  data?: any[];
  error?: string;
  metadata?: {
    rowCount: number;
    columnCount: number;
    fileSize: number;
    processingTime: number;
  };
}

export interface FileUploadResult {
  success: boolean;
  data?: any;
  error?: string;
  type: 'csv' | 'excel' | 'pdf' | 'image';
  metadata?: any;
}

// CSV Processing with Papa Parse
export class CSVProcessor {
  static async processCSV(file: File): Promise<ProcessedData> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => {
          // Clean and standardize headers
          return header
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        },
        transform: (value: string, header: string) => {
          // Transform data based on header type
          if (header.includes('score') || header.includes('grade') || header.includes('rating')) {
            const numValue = parseFloat(value);
            return isNaN(numValue) ? value : numValue;
          }
          if (header.includes('date')) {
            const date = new Date(value);
            return isNaN(date.getTime()) ? value : date.toISOString();
          }
          return value.trim();
        },
        complete: (results) => {
          const processingTime = Date.now() - startTime;
          
          if (results.errors.length > 0) {
            resolve({
              success: false,
              error: `CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`,
            });
            return;
          }

          resolve({
            success: true,
            data: results.data,
            metadata: {
              rowCount: results.data.length,
              columnCount: results.meta.fields?.length || 0,
              fileSize: file.size,
              processingTime,
            },
          });
        },
        error: (error) => {
          resolve({
            success: false,
            error: `CSV processing failed: ${error.message}`,
          });
        },
      });
    });
  }

  static validateStudentData(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredFields = ['student_id', 'name', 'grade'];
    
    if (!Array.isArray(data) || data.length === 0) {
      errors.push('No data found in file');
      return { valid: false, errors };
    }

    // Check for required fields
    const firstRow = data[0];
    const availableFields = Object.keys(firstRow);
    
    requiredFields.forEach(field => {
      if (!availableFields.includes(field)) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate data types and ranges
    data.forEach((row, index) => {
      if (row.grade && (isNaN(row.grade) || row.grade < 0 || row.grade > 100)) {
        errors.push(`Invalid grade value at row ${index + 1}: ${row.grade}`);
      }
      
      if (row.age && (isNaN(row.age) || row.age < 5 || row.age > 25)) {
        errors.push(`Invalid age value at row ${index + 1}: ${row.age}`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}

// PDF Processing with PDF.js
export class PDFProcessor {
  static async processPDF(file: File): Promise<ProcessedData> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const pages: string[] = [];
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        pages.push(pageText);
        fullText += pageText + '\n';
      }

      // Parse structured data from text
      const parsedData = this.parseEducationalData(fullText);
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        data: parsedData,
        metadata: {
          rowCount: parsedData.length,
          columnCount: parsedData.length > 0 ? Object.keys(parsedData[0]).length : 0,
          fileSize: file.size,
          processingTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private static parseEducationalData(text: string): any[] {
    const data: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for common educational data patterns
    const patterns = {
      studentRecord: /(?:student|name):\s*([^\n]+)/gi,
      grade: /(?:grade|score|mark):\s*(\d+(?:\.\d+)?)/gi,
      subject: /(?:subject|course):\s*([^\n]+)/gi,
      date: /(?:date|assessment):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    };

    let currentRecord: any = {};
    
    lines.forEach(line => {
      // Try to match each pattern
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = pattern.exec(line);
        if (match) {
          currentRecord[key] = match[1].trim();
          
          // If we have enough data, push the record
          if (Object.keys(currentRecord).length >= 2) {
            data.push({ ...currentRecord });
            currentRecord = {};
          }
        }
      });
    });

    return data;
  }
}

// Image Processing with Tesseract.js
export class ImageProcessor {
  private static worker: any = null;

  static async initializeWorker() {
    if (!this.worker) {
      this.worker = await createWorker('eng');
    }
    return this.worker;
  }

  static async processImage(file: File): Promise<ProcessedData> {
    const startTime = Date.now();
    
    try {
      const worker = await this.initializeWorker();
      
      // Perform OCR
      const { data: { text } } = await worker.recognize(file);
      
      // Parse the extracted text for educational data
      const parsedData = this.parseTextData(text);
      
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        data: parsedData,
        metadata: {
          rowCount: parsedData.length,
          columnCount: parsedData.length > 0 ? Object.keys(parsedData[0]).length : 0,
          fileSize: file.size,
          processingTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private static parseTextData(text: string): any[] {
    const data: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    // Common patterns for educational documents
    const scorePattern = /(\w+(?:\s+\w+)*)\s+(\d+(?:\.\d+)?)/g;
    const gradePattern = /([A-F][+-]?|\d+(?:\.\d+)?%?)/g;
    
    lines.forEach(line => {
      const scoreMatches = [...line.matchAll(scorePattern)];
      scoreMatches.forEach(match => {
        data.push({
          subject: match[1].trim(),
          score: parseFloat(match[2]),
          source: 'ocr',
          confidence: 0.8, // Default confidence
        });
      });
    });

    return data;
  }

  static async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

// Main File Processor
export class FileProcessor {
  static async processFile(file: File): Promise<FileUploadResult> {
    const fileType = this.getFileType(file);
    
    try {
      switch (fileType) {
        case 'csv':
          const csvResult = await CSVProcessor.processCSV(file);
          return {
            success: csvResult.success,
            data: csvResult.data,
            error: csvResult.error,
            type: 'csv',
            metadata: csvResult.metadata,
          };
          
        case 'pdf':
          const pdfResult = await PDFProcessor.processPDF(file);
          return {
            success: pdfResult.success,
            data: pdfResult.data,
            error: pdfResult.error,
            type: 'pdf',
            metadata: pdfResult.metadata,
          };
          
        case 'image':
          const imageResult = await ImageProcessor.processImage(file);
          return {
            success: imageResult.success,
            data: imageResult.data,
            error: imageResult.error,
            type: 'image',
            metadata: imageResult.metadata,
          };
          
        default:
          return {
            success: false,
            error: `Unsupported file type: ${file.type}`,
            type: fileType,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: fileType,
      };
    }
  }

  private static getFileType(file: File): 'csv' | 'excel' | 'pdf' | 'image' {
    const mimeType = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (mimeType.includes('csv') || extension === 'csv') {
      return 'csv';
    }
    
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || 
        ['xlsx', 'xls'].includes(extension || '')) {
      return 'excel';
    }
    
    if (mimeType.includes('pdf') || extension === 'pdf') {
      return 'pdf';
    }
    
    if (mimeType.startsWith('image/') || 
        ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(extension || '')) {
      return 'image';
    }
    
    return 'csv'; // Default fallback
  }

  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  static getSupportedFormats(): string[] {
    return [
      '.csv',
      '.xlsx',
      '.xls',
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.tiff'
    ];
  }
}

// Data Transformation Utilities
export class DataTransformer {
  static normalizeStudentData(rawData: any[]): any[] {
    return rawData.map(row => ({
      studentId: row.student_id || row.id || '',
      name: row.name || row.student_name || '',
      grade: this.parseGrade(row.grade || row.score),
      subject: row.subject || row.course || '',
      date: this.parseDate(row.date || row.assessment_date),
      ...row, // Keep original fields
    }));
  }

  private static parseGrade(grade: any): number | null {
    if (typeof grade === 'number') return grade;
    if (typeof grade === 'string') {
      // Handle letter grades
      const letterGrades: { [key: string]: number } = {
        'A+': 97, 'A': 93, 'A-': 90,
        'B+': 87, 'B': 83, 'B-': 80,
        'C+': 77, 'C': 73, 'C-': 70,
        'D+': 67, 'D': 63, 'D-': 60,
        'F': 50,
      };
      
      if (letterGrades[grade.toUpperCase()]) {
        return letterGrades[grade.toUpperCase()];
      }
      
      // Handle percentage
      const numMatch = grade.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        return parseFloat(numMatch[1]);
      }
    }
    return null;
  }

  private static parseDate(dateStr: any): string | null {
    if (!dateStr) return null;
    
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  static aggregateByStudent(data: any[]): { [studentId: string]: any } {
    const aggregated: { [studentId: string]: any } = {};
    
    data.forEach(row => {
      const studentId = row.studentId || row.student_id;
      if (!studentId) return;
      
      if (!aggregated[studentId]) {
        aggregated[studentId] = {
          studentId,
          name: row.name,
          subjects: {},
          totalScore: 0,
          assessmentCount: 0,
        };
      }
      
      const student = aggregated[studentId];
      const subject = row.subject || 'General';
      const grade = row.grade;
      
      if (grade !== null && grade !== undefined) {
        if (!student.subjects[subject]) {
          student.subjects[subject] = [];
        }
        student.subjects[subject].push(grade);
        student.totalScore += grade;
        student.assessmentCount++;
      }
    });
    
    // Calculate averages
    Object.values(aggregated).forEach((student: any) => {
      student.averageScore = student.assessmentCount > 0 
        ? student.totalScore / student.assessmentCount 
        : 0;
      
      // Calculate subject averages
      Object.keys(student.subjects).forEach(subject => {
        const scores = student.subjects[subject];
        student.subjects[subject] = {
          scores,
          average: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
          count: scores.length,
        };
      });
    });
    
    return aggregated;
  }
}
