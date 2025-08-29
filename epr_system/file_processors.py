"""
File processing services for handling CSV, Excel, PDF, DOC, and image uploads
Extracts data and converts to structured format for EPR analysis
"""

# Temporarily commented out to fix server startup issues
# import pandas as pd
# import pytesseract
# from PIL import Image
# import PyPDF2
# import docx
import json
import re
# import cv2
# import numpy as np
from typing import Dict, List, Any, Tuple, Optional
from django.core.files.base import ContentFile
from django.utils import timezone
import logging
import io
import os

logger = logging.getLogger(__name__)

class FileProcessor:
    """Base class for file processing"""
    
    def __init__(self, file_path: str, file_type: str):
        self.file_path = file_path
        self.file_type = file_type
        self.extracted_data = {}
        self.validation_errors = []
        self.confidence_score = 0.0
    
    def process(self) -> Dict[str, Any]:
        """Main processing method"""
        try:
            if self.file_type == 'csv':
                return self.process_csv()
            elif self.file_type == 'excel':
                return self.process_excel()
            elif self.file_type == 'pdf':
                return self.process_pdf()
            elif self.file_type in ['doc', 'docx']:
                return self.process_doc()
            elif self.file_type == 'image':
                return self.process_image()
            else:
                raise ValueError(f"Unsupported file type: {self.file_type}")
        except Exception as e:
            logger.error(f"Error processing file {self.file_path}: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'extracted_data': {},
                'validation_errors': [f"Processing failed: {str(e)}"]
            }
    
    def process_csv(self) -> Dict[str, Any]:
        """Process CSV files"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
            df = None
            
            for encoding in encodings:
                try:
                    # df = pd.read_csv(self.file_path, encoding=encoding)
                    return self.error_response("CSV processing temporarily disabled - pandas not available")
                    break
                except UnicodeDecodeError:
                    continue
            
            if df is None:
                raise ValueError("Could not read CSV file with any encoding")
            
            # Detect data type based on columns
            data_type = self.detect_data_type(df.columns.tolist())
            
            if data_type == 'academic':
                return self.process_academic_csv(df)
            elif data_type == 'psychological':
                return self.process_psychological_csv(df)
            elif data_type == 'physical':
                return self.process_physical_csv(df)
            else:
                return self.process_generic_csv(df)
                
        except Exception as e:
            return self.error_response(f"CSV processing failed: {str(e)}")
    
    def process_excel(self) -> Dict[str, Any]:
        """Process Excel files"""
        try:
            # Read all sheets
            # excel_file = pd.ExcelFile(self.file_path)
            return self.error_response("Excel processing temporarily disabled - pandas not available")
            all_data = {}
            
            for sheet_name in excel_file.sheet_names:
                # df = pd.read_excel(self.file_path, sheet_name=sheet_name)
                
                # Detect data type for each sheet
                data_type = self.detect_data_type(df.columns.tolist())
                
                if data_type == 'academic':
                    sheet_data = self.process_academic_csv(df)
                elif data_type == 'psychological':
                    sheet_data = self.process_psychological_csv(df)
                elif data_type == 'physical':
                    sheet_data = self.process_physical_csv(df)
                else:
                    sheet_data = self.process_generic_csv(df)
                
                all_data[sheet_name] = sheet_data
            
            return {
                'success': True,
                'data_type': 'multi_sheet',
                'extracted_data': all_data,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Excel processing failed: {str(e)}")
    
    def process_pdf(self) -> Dict[str, Any]:
        """Process PDF files using OCR and text extraction"""
        try:
            # First try to extract text directly
            text_content = ""
            
            with open(self.file_path, 'rb') as file:
                # pdf_reader = PyPDF2.PdfReader(file)
                return self.error_response("PDF processing temporarily disabled - PyPDF2 not available")
                
                for page in pdf_reader.pages:
                    text_content += page.extract_text() + "\n"
            
            # If no text extracted, try OCR
            if not text_content.strip():
                text_content = self.pdf_ocr_extraction()
            
            # Process extracted text
            structured_data = self.extract_structured_data_from_text(text_content)
            
            return {
                'success': True,
                'extracted_text': text_content,
                'extracted_data': structured_data,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"PDF processing failed: {str(e)}")
    
    def process_doc(self) -> Dict[str, Any]:
        """Process Word documents"""
        try:
            if self.file_type == 'docx':
                # doc = docx.Document(self.file_path)
                return self.error_response("DOC processing temporarily disabled - docx not available")
                text_content = "\n".join([paragraph.text for paragraph in doc.paragraphs])
                
                # Extract tables if any
                tables_data = []
                for table in doc.tables:
                    table_data = []
                    for row in table.rows:
                        row_data = [cell.text for cell in row.cells]
                        table_data.append(row_data)
                    tables_data.append(table_data)
                
            else:
                # For .doc files, would need python-docx2txt or conversion
                text_content = "DOC file processing requires additional conversion"
                tables_data = []
            
            # Process extracted text
            structured_data = self.extract_structured_data_from_text(text_content)
            structured_data['tables'] = tables_data
            
            return {
                'success': True,
                'extracted_text': text_content,
                'extracted_data': structured_data,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Document processing failed: {str(e)}")
    
    def process_image(self) -> Dict[str, Any]:
        """Process image files using OCR"""
        try:
            # Preprocess image for better OCR
            processed_image = self.preprocess_image()
            
            # Extract text using OCR
            # text_content = pytesseract.image_to_string(processed_image)
            return self.error_response("Image OCR temporarily disabled - pytesseract not available")
            
            # Extract structured data from text
            structured_data = self.extract_structured_data_from_text(text_content)
            
            # Try to detect if it's a report card, score sheet, etc.
            document_type = self.detect_document_type_from_text(text_content)
            
            return {
                'success': True,
                'document_type': document_type,
                'extracted_text': text_content,
                'extracted_data': structured_data,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Image processing failed: {str(e)}")
    
    def detect_data_type(self, columns: List[str]) -> str:
        """Detect data type based on column names"""
        columns_lower = [col.lower() for col in columns]
        
        # Academic indicators
        academic_keywords = [
            'subject', 'marks', 'grade', 'score', 'percentage', 'exam', 'test',
            'math', 'science', 'english', 'hindi', 'social', 'attendance'
        ]
        
        # Psychological indicators
        psychological_keywords = [
            'stress', 'anxiety', 'depression', 'mood', 'behavior', 'emotion',
            'personality', 'confidence', 'social', 'sdq', 'dass', 'perma'
        ]
        
        # Physical indicators
        physical_keywords = [
            'height', 'weight', 'bmi', 'fitness', 'health', 'exercise',
            'activity', 'sleep', 'nutrition', 'medical', 'physical'
        ]
        
        academic_score = sum(1 for keyword in academic_keywords if any(keyword in col for col in columns_lower))
        psychological_score = sum(1 for keyword in psychological_keywords if any(keyword in col for col in columns_lower))
        physical_score = sum(1 for keyword in physical_keywords if any(keyword in col for col in columns_lower))
        
        if academic_score >= max(psychological_score, physical_score):
            return 'academic'
        elif psychological_score >= physical_score:
            return 'psychological'
        elif physical_score > 0:
            return 'physical'
        else:
            return 'unknown'
    
    def process_academic_csv(self, df: Any) -> Dict[str, Any]:
        """Process academic data from CSV"""
        try:
            academic_records = []
            
            # Common column mappings
            column_mappings = {
                'subject': ['subject', 'subject_name', 'course', 'paper'],
                'marks_obtained': ['marks', 'marks_obtained', 'score', 'points'],
                'total_marks': ['total_marks', 'max_marks', 'total_score', 'maximum'],
                'percentage': ['percentage', 'percent', '%'],
                'grade': ['grade', 'letter_grade', 'rating'],
                'academic_year': ['year', 'academic_year', 'class_year', 'session'],
                'class_grade': ['class', 'standard', 'grade_level', 'level'],
                'attendance': ['attendance', 'attendance_percent', 'present_days']
            }
            
            # Map columns
            mapped_columns = self.map_columns(df.columns, column_mappings)
            
            for _, row in df.iterrows():
                record = {}
                
                for field, column in mapped_columns.items():
                    if column and column in df.columns:
                        value = row[column]
                        if value is not None and str(value).strip():
                            record[field] = self.clean_numeric_value(value) if field in ['marks_obtained', 'total_marks', 'percentage', 'attendance'] else str(value)
                
                # Calculate percentage if not provided
                if 'marks_obtained' in record and 'total_marks' in record and 'percentage' not in record:
                    try:
                        record['percentage'] = (float(record['marks_obtained']) / float(record['total_marks'])) * 100
                    except (ValueError, ZeroDivisionError):
                        pass
                
                if record:  # Only add if we have some data
                    academic_records.append(record)
            
            self.confidence_score = 0.8 if len(academic_records) > 0 else 0.2
            
            return {
                'success': True,
                'data_type': 'academic',
                'extracted_data': academic_records,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Academic CSV processing failed: {str(e)}")
    
    def process_psychological_csv(self, df: Any) -> Dict[str, Any]:
        """Process psychological data from CSV"""
        try:
            psychological_records = []
            
            # Column mappings for psychological assessments
            column_mappings = {
                'assessment_name': ['assessment', 'test_name', 'evaluation', 'survey'],
                'assessment_date': ['date', 'assessment_date', 'test_date', 'evaluation_date'],
                'stress_level': ['stress', 'stress_level', 'stress_score'],
                'anxiety_level': ['anxiety', 'anxiety_level', 'anxiety_score'],
                'mood_score': ['mood', 'mood_score', 'emotional_state'],
                'confidence_level': ['confidence', 'self_confidence', 'confidence_score'],
                'social_skills': ['social', 'social_skills', 'interpersonal'],
                'academic_year': ['year', 'academic_year', 'class_year']
            }
            
            mapped_columns = self.map_columns(df.columns, column_mappings)
            
            for _, row in df.iterrows():
                record = {}
                
                for field, column in mapped_columns.items():
                    if column and column in df.columns:
                        value = row[column]
                        if value is not None and str(value).strip():
                            if field in ['stress_level', 'anxiety_level', 'mood_score', 'confidence_level', 'social_skills']:
                                record[field] = self.clean_numeric_value(value)
                            else:
                                record[field] = str(value)
                
                if record:
                    psychological_records.append(record)
            
            self.confidence_score = 0.7 if len(psychological_records) > 0 else 0.2
            
            return {
                'success': True,
                'data_type': 'psychological',
                'extracted_data': psychological_records,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Psychological CSV processing failed: {str(e)}")
    
    def process_physical_csv(self, df: Any) -> Dict[str, Any]:
        """Process physical health data from CSV"""
        try:
            physical_records = []
            
            # Column mappings for physical data
            column_mappings = {
                'measurement_date': ['date', 'measurement_date', 'checkup_date', 'test_date'],
                'height_cm': ['height', 'height_cm', 'height_cms'],
                'weight_kg': ['weight', 'weight_kg', 'weight_kgs'],
                'bmi': ['bmi', 'body_mass_index'],
                'fitness_score': ['fitness', 'fitness_score', 'physical_fitness'],
                'activity_hours': ['activity', 'exercise_hours', 'physical_activity'],
                'sleep_hours': ['sleep', 'sleep_hours', 'hours_of_sleep'],
                'academic_year': ['year', 'academic_year', 'class_year']
            }
            
            mapped_columns = self.map_columns(df.columns, column_mappings)
            
            for _, row in df.iterrows():
                record = {}
                
                for field, column in mapped_columns.items():
                    if column and column in df.columns:
                        value = row[column]
                        if value is not None and str(value).strip():
                            if field in ['height_cm', 'weight_kg', 'bmi', 'fitness_score', 'activity_hours', 'sleep_hours']:
                                record[field] = self.clean_numeric_value(value)
                            else:
                                record[field] = str(value)
                
                # Calculate BMI if height and weight provided
                if 'height_cm' in record and 'weight_kg' in record and 'bmi' not in record:
                    try:
                        height_m = float(record['height_cm']) / 100
                        record['bmi'] = float(record['weight_kg']) / (height_m ** 2)
                    except (ValueError, ZeroDivisionError):
                        pass
                
                if record:
                    physical_records.append(record)
            
            self.confidence_score = 0.7 if len(physical_records) > 0 else 0.2
            
            return {
                'success': True,
                'data_type': 'physical',
                'extracted_data': physical_records,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Physical CSV processing failed: {str(e)}")
    
    def process_generic_csv(self, df: Any) -> Dict[str, Any]:
        """Process generic CSV when type cannot be determined"""
        try:
            # Convert to list of dictionaries
            records = df.to_dict('records')
            
            # Clean the data
            cleaned_records = []
            for record in records:
                cleaned_record = {}
                for key, value in record.items():
                    if value is not None and str(value).strip():
                        cleaned_record[str(key)] = str(value)
                if cleaned_record:
                    cleaned_records.append(cleaned_record)
            
            self.confidence_score = 0.5
            
            return {
                'success': True,
                'data_type': 'generic',
                'extracted_data': cleaned_records,
                'validation_errors': self.validation_errors,
                'confidence_score': self.confidence_score
            }
            
        except Exception as e:
            return self.error_response(f"Generic CSV processing failed: {str(e)}")
    
    def map_columns(self, actual_columns: List[str], column_mappings: Dict[str, List[str]]) -> Dict[str, str]:
        """Map actual column names to expected field names"""
        mapped = {}
        actual_lower = [col.lower() for col in actual_columns]
        
        for field, possible_names in column_mappings.items():
            best_match = None
            for possible_name in possible_names:
                for i, actual_col in enumerate(actual_lower):
                    if possible_name in actual_col or actual_col in possible_name:
                        best_match = actual_columns[i]
                        break
                if best_match:
                    break
            mapped[field] = best_match
        
        return mapped
    
    def clean_numeric_value(self, value) -> Optional[float]:
        """Clean and convert value to float"""
        try:
            if isinstance(value, (int, float)):
                return float(value)
            
            # Remove non-numeric characters except decimal point
            cleaned = re.sub(r'[^\d.-]', '', str(value))
            return float(cleaned) if cleaned else None
        except (ValueError, TypeError):
            return None
    
    def preprocess_image(self) -> Any:
        """Preprocess image for better OCR results"""
        try:
            # Open image
            # image = cv2.imread(self.file_path)
            return None  # Image processing temporarily disabled
            
            # Convert to grayscale
            # gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply noise reduction
            # denoised = cv2.medianBlur(gray, 3)
            
            # Apply sharpening
            # kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
            # sharpened = cv2.filter2D(denoised, -1, kernel)
            
            # Convert back to PIL Image
            # return Image.fromarray(sharpened)
            
        except Exception as e:
            logger.warning(f"Image preprocessing failed, using original: {str(e)}")
            # return Image.open(self.file_path)
            return None
    
    def pdf_ocr_extraction(self) -> str:
        """Extract text from PDF using OCR"""
        try:
            import fitz  # PyMuPDF
            
            doc = fitz.open(self.file_path)
            text_content = ""
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                
                # Convert to PIL Image and apply OCR
                # image = Image.open(io.BytesIO(img_data))
                # text_content += pytesseract.image_to_string(image) + "\n"
                text_content += ""  # OCR disabled
            
            doc.close()
            return text_content
            
        except Exception as e:
            logger.error(f"PDF OCR extraction failed: {str(e)}")
            return ""
    
    def extract_structured_data_from_text(self, text: str) -> Dict[str, Any]:
        """Extract structured data from text using pattern matching"""
        structured_data = {}
        
        # Patterns for different types of data
        patterns = {
            'academic': {
                'subjects_marks': r'(\w+)\s*:?\s*(\d+)(?:/(\d+))?(?:\s*\((\d+\.?\d*)%\))?',
                'total_marks': r'total\s*:?\s*(\d+)',
                'percentage': r'percentage\s*:?\s*(\d+\.?\d*)%?',
                'grade': r'grade\s*:?\s*([A-F][\+\-]?)',
                'rank': r'rank\s*:?\s*(\d+)'
            },
            'physical': {
                'height': r'height\s*:?\s*(\d+\.?\d*)\s*(?:cm|centimeter)',
                'weight': r'weight\s*:?\s*(\d+\.?\d*)\s*(?:kg|kilogram)',
                'bmi': r'bmi\s*:?\s*(\d+\.?\d*)',
                'blood_pressure': r'(?:bp|blood pressure)\s*:?\s*(\d+)/(\d+)'
            },
            'psychological': {
                'stress_level': r'stress\s*(?:level)?\s*:?\s*(\d+)',
                'anxiety_level': r'anxiety\s*(?:level)?\s*:?\s*(\d+)',
                'mood_score': r'mood\s*(?:score)?\s*:?\s*(\d+)'
            }
        }
        
        # Extract academic data
        academic_data = {}
        for pattern_name, pattern in patterns['academic'].items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                academic_data[pattern_name] = matches
        if academic_data:
            structured_data['academic'] = academic_data
        
        # Extract physical data
        physical_data = {}
        for pattern_name, pattern in patterns['physical'].items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                physical_data[pattern_name] = matches[0] if len(matches[0]) == 1 else matches[0]
        if physical_data:
            structured_data['physical'] = physical_data
        
        # Extract psychological data
        psychological_data = {}
        for pattern_name, pattern in patterns['psychological'].items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                psychological_data[pattern_name] = matches[0]
        if psychological_data:
            structured_data['psychological'] = psychological_data
        
        # Set confidence based on amount of structured data found
        if structured_data:
            self.confidence_score = min(0.8, len(structured_data) * 0.3)
        else:
            self.confidence_score = 0.1
        
        return structured_data
    
    def detect_document_type_from_text(self, text: str) -> str:
        """Detect document type from extracted text"""
        text_lower = text.lower()
        
        if any(keyword in text_lower for keyword in ['report card', 'mark sheet', 'academic report', 'grade report']):
            return 'academic_report'
        elif any(keyword in text_lower for keyword in ['medical report', 'health checkup', 'fitness test']):
            return 'medical_report'
        elif any(keyword in text_lower for keyword in ['psychological assessment', 'behavioral report', 'counseling']):
            return 'psychological_report'
        elif any(keyword in text_lower for keyword in ['transcript', 'certificate', 'diploma']):
            return 'academic_certificate'
        else:
            return 'unknown'
    
    def error_response(self, error_message: str) -> Dict[str, Any]:
        """Generate error response"""
        return {
            'success': False,
            'error': error_message,
            'extracted_data': {},
            'validation_errors': [error_message],
            'confidence_score': 0.0
        }

class DataValidator:
    """Validate extracted data and identify issues"""
    
    def __init__(self):
        self.validation_rules = {
            'academic': {
                'marks_obtained': {'type': 'numeric', 'min': 0, 'max': 1000},
                'total_marks': {'type': 'numeric', 'min': 1, 'max': 1000},
                'percentage': {'type': 'numeric', 'min': 0, 'max': 100},
                'attendance': {'type': 'numeric', 'min': 0, 'max': 100}
            },
            'physical': {
                'height_cm': {'type': 'numeric', 'min': 50, 'max': 250},
                'weight_kg': {'type': 'numeric', 'min': 10, 'max': 200},
                'bmi': {'type': 'numeric', 'min': 10, 'max': 50}
            },
            'psychological': {
                'stress_level': {'type': 'numeric', 'min': 0, 'max': 10},
                'anxiety_level': {'type': 'numeric', 'min': 0, 'max': 10},
                'mood_score': {'type': 'numeric', 'min': 0, 'max': 10}
            }
        }
    
    def validate_data(self, data: Dict[str, Any], data_type: str) -> List[Dict[str, Any]]:
        """Validate data and return list of issues"""
        issues = []
        
        if data_type not in self.validation_rules:
            return issues
        
        rules = self.validation_rules[data_type]
        
        for field, rule in rules.items():
            if field in data:
                value = data[field]
                issue = self.validate_field(field, value, rule)
                if issue:
                    issues.append(issue)
        
        return issues
    
    def validate_field(self, field_name: str, value: Any, rule: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Validate individual field"""
        try:
            if rule['type'] == 'numeric':
                numeric_value = float(value)
                
                if 'min' in rule and numeric_value < rule['min']:
                    return {
                        'field': field_name,
                        'issue': 'value_too_low',
                        'current_value': value,
                        'expected_range': f"{rule['min']} - {rule.get('max', 'unlimited')}",
                        'severity': 'medium'
                    }
                
                if 'max' in rule and numeric_value > rule['max']:
                    return {
                        'field': field_name,
                        'issue': 'value_too_high',
                        'current_value': value,
                        'expected_range': f"{rule.get('min', 0)} - {rule['max']}",
                        'severity': 'medium'
                    }
            
            return None
            
        except (ValueError, TypeError):
            return {
                'field': field_name,
                'issue': 'invalid_type',
                'current_value': value,
                'expected_type': rule['type'],
                'severity': 'high'
            }
