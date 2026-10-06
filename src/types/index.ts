export type ClassName = 'VIII-A' | 'VIII-B' | 'VIII-C' | 'All Classes';
export type PerformanceLevel = 'Excellent' | 'Good' | 'Fair' | 'Needs Support' | 'Developing' | 'High';
export type RecommendationStatus = 'Pending' | 'Accepted' | 'Modified' | 'Rejected';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface RawSessionRecord {
  Student_ID: string;
  Class: string;
  Session: number;
  Reading_Text_ID: string;
  Text_Type: string;
  Text_Level: string;
  Reading_Score: number;
  Main_Idea_Score: number;
  Specific_Information_Score: number;
  Inference_Score: number;
  Vocabulary_Context_Score: number;
  Task_Completion_Percent: number;
  Response_Time_Seconds: number;
  Engagement_Level_1to5: number;
  Confidence_Level_1to5: number;
  Reading_Anxiety_1to5: number;
  Motivation_Level_1to5: number;
  Performance_Level: string;
}

export interface StudentMeta {
  student_id: string; // EXP-5001 or Student_001
  raw_id: string; // Student_001
  code: string; // EXP-5001
  name: string;
  class: string;
  gender: 'Female' | 'Male';
  attendanceRate: number;
  avatarSeed?: string;
}

export interface EnrichedRecord extends RawSessionRecord {
  studentName: string;
  displayId: string;
  normalizedLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Support';
}

export interface StudentAggregate {
  studentId: string;
  code: string;
  name: string;
  class: string;
  gender: 'Female' | 'Male';
  sessions: EnrichedRecord[];
  latestRecord: EnrichedRecord;
  avgReadingScore: number;
  avgMainIdea: number;
  avgSpecificInfo: number;
  avgInference: number;
  avgVocabulary: number;
  avgTaskCompletion: number;
  avgEngagement: number;
  avgConfidence: number;
  avgAnxiety: number;
  avgMotivation: number;
  overallLevel: 'Excellent' | 'Good' | 'Fair' | 'Needs Support';
  scoreGrowth: number; // Session 5 vs Session 1
  weakestSkill: 'Main Idea' | 'Specific Information' | 'Inference' | 'Vocabulary in Context';
  strongestSkill: 'Main Idea' | 'Specific Information' | 'Inference' | 'Vocabulary in Context';
}

export interface ClassKPISummary {
  totalStudents: number;
  avgReadingScore: number;
  readingScoreChange: number;
  avgTaskCompletion: number;
  taskCompletionChange: number;
  avgConfidence: number;
  confidenceChange: number;
  avgEngagement: number;
  engagementChange: number;
  avgAnxiety: number;
  anxietyChange: number;
}

export interface PerformanceDistribution {
  excellent: { count: number; percentage: number };
  good: { count: number; percentage: number };
  fair: { count: number; percentage: number };
  needsSupport: { count: number; percentage: number };
  total: number;
}

export interface SessionAverage {
  session: number;
  sessionLabel: string;
  mainIdea: number;
  specificInfo: number;
  inference: number;
  vocabulary: number;
  overallScore: number;
  engagement: number;
  confidence: number;
  anxiety: number;
}

export interface AIInsight {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  level: 'Excellent' | 'Good' | 'Fair' | 'Needs Support';
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  learningTrend: string;
  affectiveAssessment: string;
  evidence: string[];
  dateGenerated: string;
}

export interface PedagogicalRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  class: string;
  session: number;
  detectedIssue: string;
  supportingEvidence: string;
  aiRecommendation: string;
  suggestedActions: string[];
  priority: PriorityLevel;
  skillFocus: 'Vocabulary in Context' | 'Inference' | 'Main Idea' | 'Specific Information' | 'Affective & Confidence' | 'Engagement';
  status: RecommendationStatus;
  teacherNote?: string;
  modifiedAction?: string;
  rejectionReason?: string;
  dateCreated: string;
  decisionTimestamp?: string;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'ai_analysis' | 'recommendation' | 'test_upload' | 'view_report' | 'data_update';
}

export interface TeacherProfile {
  name: string;
  school: string;
  role?: string;
  defaultClass?: string;
  isAuthenticated: boolean;
  hasViewedGuide?: boolean;
}

export interface GoogleSheetsConfig {
  sheetUrl: string;
  appsScriptUrl: string;
  autoSync: boolean;
  lastSyncTime: string | null;
  status: 'idle' | 'syncing' | 'connected' | 'error';
  errorMessage?: string;
}
