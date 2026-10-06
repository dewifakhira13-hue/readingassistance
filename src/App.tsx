import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavPage } from './components/Sidebar';
import { TopNavigation } from './components/TopNavigation';
import { MetricCards } from './components/MetricCard';
import { PerformanceChart } from './components/PerformanceChart';
import { DistributionChart } from './components/DistributionChart';
import { AffectiveChart } from './components/AffectiveChart';
import { StudentTable } from './components/StudentTable';
import { AIInsightCard } from './components/AIInsightCard';
import { RecentActivity } from './components/RecentActivity';
import { GoogleSheetsConnectionBar } from './components/GoogleSheetsConnectionBar';
import { LandingPage } from './components/LandingPage';
import { StudentReadingActivity } from './components/StudentReadingActivity';
import { Aurora3D } from './components/Aurora3D';
import { OnboardingGuide } from './components/OnboardingGuide';
import { Sparkles } from 'lucide-react';

// Pages
import { StudentsPage } from './pages/StudentsPage';
import { ReadingAnalyticsPage } from './pages/ReadingAnalyticsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { StudentModal } from './components/StudentModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { ModifyRecommendationModal } from './components/ModifyRecommendationModal';
import { RejectRecommendationModal } from './components/RejectRecommendationModal';

// Data & Services
import { RAW_CSV_RECORDS, getEnrichedRecords, READING_TEXTS, addStudentToRoster } from './data/studentData';
import {
  calculateStudentAggregates,
  calculateKPISummary,
  calculateSessionAverages,
  calculatePerformanceDistribution,
  filterRecords,
} from './services/analyticsService';
import {
  generateStudentAIInsight,
  generateInitialRecommendations,
} from './services/aiService';
import {
  getStoredSheetConfig,
  saveSheetConfig,
  getStoredCustomData,
  saveCustomData,
  clearCustomData,
  fetchFromGoogleAppsScript,
} from './services/googleSheetsService';
import {
  RawSessionRecord,
  GoogleSheetsConfig,
  PedagogicalRecommendation,
  TeacherProfile,
} from './types';

export default function App() {
  // Teacher Profile state (stored in localStorage)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('iclarity_teacher_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.school) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Ms. Dewi',
      school: 'SMP Negeri 1',
      role: 'English Teacher',
      defaultClass: 'VIII-A',
      isAuthenticated: false, // Show Landing Page first as requested
    };
  });

  // Student active session state (Default null to display student landing page)
  const [studentSession, setStudentSession] = useState<{
    name: string;
    attendanceCode: string;
    school: string;
    grade: string;
    activityId?: string;
  } | null>(null);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);

  // Navigation & Primary Filter States
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [selectedSchool, setSelectedSchool] = useState<string>(teacherProfile.school || 'SD Negeri 1');
  const [selectedClass, setSelectedClass] = useState<string>(teacherProfile.defaultClass || 'Grade 5-A');
  const [selectedSession, setSelectedSession] = useState<string>('Session 1–5');
  const [selectedTextId, setSelectedTextId] = useState<string>('READ-02');

  // Screen 2: Petunjuk Penggunaan Awal state
  const [showOnboardingGuide, setShowOnboardingGuide] = useState<boolean>(false);

  const handleEnterDashboard = (newProfile: TeacherProfile) => {
    setTeacherProfile(newProfile);
    setSelectedSchool(newProfile.school);
    if (newProfile.defaultClass) {
      setSelectedClass(newProfile.defaultClass);
    }
    localStorage.setItem('iclarity_teacher_profile', JSON.stringify(newProfile));
    setIsTeacherMode(true);
  };

  const handleFinishGuide = () => {
    setShowOnboardingGuide(false);
  };

  const handleSwitchProfile = () => {
    setIsTeacherMode(false);
    setStudentSession(null);
    setShowOnboardingGuide(false);
  };

  const handleUpdateProfile = (updated: TeacherProfile) => {
    setTeacherProfile(updated);
    setSelectedSchool(updated.school);
    localStorage.setItem('iclarity_teacher_profile', JSON.stringify(updated));
  };

  // Add new student from StudentsPage
  const handleAddNewStudent = (newS: { name: string; attendanceName: string; class: string }) => {
    const studentIdx = Math.floor(rawRecords.length / 5) + 1;
    const newStudentId = `Student_${String(studentIdx).padStart(3, '0')}`;
    const newCode = `STU-${String(studentIdx).padStart(2, '0')}`;

    addStudentToRoster({
      student_id: newStudentId,
      raw_id: newStudentId,
      code: newCode,
      name: newS.name,
      class: newS.class,
      gender: 'Female',
      attendanceRate: 98,
    });

    const newSessions: RawSessionRecord[] = [1, 2, 3, 4, 5].map((sNum) => ({
      Student_ID: newStudentId,
      Class: newS.class,
      Session: sNum,
      Reading_Text_ID: `READ-0${sNum}`,
      Text_Type: 'Narrative',
      Text_Level: 'A2',
      Reading_Score: 78,
      Main_Idea_Score: 80,
      Specific_Information_Score: 82,
      Inference_Score: 75,
      Vocabulary_Context_Score: 77,
      Task_Completion_Percent: 88,
      Response_Time_Seconds: 340,
      Engagement_Level_1to5: 4,
      Confidence_Level_1to5: 4,
      Reading_Anxiety_1to5: 2,
      Motivation_Level_1to5: 4,
      Performance_Level: 'Good',
    }));

    const updated = [...rawRecords, ...newSessions];
    setRawRecords(updated);
    saveCustomData(updated);

    const newAggs = calculateStudentAggregates(getEnrichedRecords(updated));
    setRecommendations(generateInitialRecommendations(newAggs));
  };

  // Data Store
  const [rawRecords, setRawRecords] = useState<RawSessionRecord[]>(() => {
    return getStoredCustomData() || RAW_CSV_RECORDS;
  });

  const [sheetConfig, setSheetConfig] = useState<GoogleSheetsConfig>(() => {
    return getStoredSheetConfig();
  });

  // Enriched & Computed Data
  const enrichedRecords = useMemo(() => {
    return getEnrichedRecords(rawRecords);
  }, [rawRecords]);

  const studentAggregates = useMemo(() => {
    return calculateStudentAggregates(enrichedRecords);
  }, [enrichedRecords]);

  // Recommendations state with LocalStorage persistence
  const [recommendations, setRecommendations] = useState<PedagogicalRecommendation[]>(() => {
    const saved = localStorage.getItem('iclarity_recommendations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initialAggs = calculateStudentAggregates(getEnrichedRecords(rawRecords));
    return generateInitialRecommendations(initialAggs);
  });

  useEffect(() => {
    localStorage.setItem('iclarity_recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  // Featured student for right sidebar AI card
  const [featuredStudentIndex, setFeaturedStudentIndex] = useState<number>(0);

  // Filtered student list for Class selection
  const classStudents = useMemo(() => {
    if (selectedClass === 'All Classes') return studentAggregates;
    return studentAggregates.filter((s) => s.class === selectedClass);
  }, [studentAggregates, selectedClass]);

  const currentFeaturedStudent = useMemo(() => {
    if (!classStudents.length) return null;
    const safeIdx = Math.min(featuredStudentIndex, classStudents.length - 1);
    return classStudents[safeIdx] || classStudents[0];
  }, [classStudents, featuredStudentIndex]);

  const currentRecommendation = useMemo(() => {
    if (!currentFeaturedStudent) return null;
    return (
      recommendations.find((r) => r.studentId === currentFeaturedStudent.studentId) ||
      recommendations[0] ||
      null
    );
  }, [recommendations, currentFeaturedStudent]);

  const currentInsight = useMemo(() => {
    if (!currentFeaturedStudent) return null;
    return generateStudentAIInsight(currentFeaturedStudent);
  }, [currentFeaturedStudent]);

  // Dynamic Metrics for Selected Class and Session
  const kpiSummary = useMemo(() => {
    return calculateKPISummary(enrichedRecords, selectedClass, selectedSession);
  }, [enrichedRecords, selectedClass, selectedSession]);

  const sessionAverages = useMemo(() => {
    return calculateSessionAverages(enrichedRecords, selectedClass);
  }, [enrichedRecords, selectedClass]);

  const performanceDistribution = useMemo(() => {
    return calculatePerformanceDistribution(enrichedRecords, selectedClass, selectedSession);
  }, [enrichedRecords, selectedClass, selectedSession]);

  const filteredRecordsForTable = useMemo(() => {
    return filterRecords(enrichedRecords, selectedClass, selectedSession);
  }, [enrichedRecords, selectedClass, selectedSession]);

  // Modals state
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<string | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [modifyingRec, setModifyingRec] = useState<PedagogicalRecommendation | null>(null);
  const [rejectingRec, setRejectingRec] = useState<PedagogicalRecommendation | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Stepper handlers for AI card in right sidebar
  const handlePrevStudent = () => {
    setFeaturedStudentIndex((prev) => (prev > 0 ? prev - 1 : classStudents.length - 1));
  };

  const handleNextStudent = () => {
    setFeaturedStudentIndex((prev) => (prev < classStudents.length - 1 ? prev + 1 : 0));
  };

  // Teacher Agency Decision Handlers
  const handleAcceptRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: 'Accepted',
              decisionTimestamp: new Date().toLocaleTimeString(),
            }
          : r
      )
    );
  };

  const handleSaveModification = (recId: string, modifiedText: string, note: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: 'Modified',
              modifiedAction: modifiedText,
              teacherNote: note,
              decisionTimestamp: new Date().toLocaleTimeString(),
            }
          : r
      )
    );
  };

  const handleSaveRejection = (recId: string, reason: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: 'Rejected',
              rejectionReason: reason,
              decisionTimestamp: new Date().toLocaleTimeString(),
            }
          : r
      )
    );
  };

  // Google Sheet integration callbacks
  const handleSaveSheetConfig = (cfg: GoogleSheetsConfig) => {
    setSheetConfig(cfg);
    saveSheetConfig(cfg);
  };

  const handleDataLoaded = (records: RawSessionRecord[]) => {
    setRawRecords(records);
    saveCustomData(records);
    const newAggs = calculateStudentAggregates(getEnrichedRecords(records));
    setRecommendations(generateInitialRecommendations(newAggs));
  };

  const handleResetDemoData = () => {
    clearCustomData();
    setRawRecords(RAW_CSV_RECORDS);
    const initialAggs = calculateStudentAggregates(getEnrichedRecords(RAW_CSV_RECORDS));
    setRecommendations(generateInitialRecommendations(initialAggs));
    const defaultCfg: GoogleSheetsConfig = {
      sheetUrl: '',
      appsScriptUrl: '',
      autoSync: false,
      lastSyncTime: null,
      status: 'idle',
    };
    setSheetConfig(defaultCfg);
    saveSheetConfig(defaultCfg);
  };

  const handleQuickSync = async () => {
    if (!sheetConfig.appsScriptUrl) {
      setIsSheetModalOpen(true);
      return;
    }
    setIsSyncing(true);
    try {
      const records = await fetchFromGoogleAppsScript(sheetConfig.appsScriptUrl);
      handleDataLoaded(records);
      const newCfg: GoogleSheetsConfig = {
        ...sheetConfig,
        lastSyncTime: new Date().toLocaleTimeString(),
        status: 'connected',
      };
      handleSaveSheetConfig(newCfg);
    } catch (e: any) {
      console.error(e);
      setIsSheetModalOpen(true);
    } finally {
      setIsSyncing(false);
    }
  };

  // Student drill-down modal data
  const studentInModal = useMemo(() => {
    if (!selectedStudentForModal) return null;
    return (
      studentAggregates.find((s) => s.studentId === selectedStudentForModal) || null
    );
  }, [studentAggregates, selectedStudentForModal]);

  const insightInModal = useMemo(() => {
    if (!studentInModal) return null;
    return generateStudentAIInsight(studentInModal);
  }, [studentInModal]);

  const recInModal = useMemo(() => {
    if (!studentInModal) return null;
    return (
      recommendations.find((r) => r.studentId === studentInModal.studentId) || null
    );
  }, [recommendations, studentInModal]);

  const pendingRecCount = useMemo(() => {
    return recommendations.filter((r) => r.status === 'Pending').length;
  }, [recommendations]);

  // 1. First Screen: Landing Page (Default for Grade 5 Students)
  if (!studentSession && !isTeacherMode) {
    return (
      <>
        <LandingPage
          currentProfile={teacherProfile}
          onStartStudentReading={(name, attendanceCode, school, grade, activityId) => {
            setStudentSession({ name, attendanceCode, school, grade, activityId });
          }}
          onEnterTeacherDashboard={(profile) => {
            setTeacherProfile(profile);
            setIsTeacherMode(true);
          }}
        />
        {showOnboardingGuide && (
          <OnboardingGuide onFinishGuide={handleFinishGuide} />
        )}
      </>
    );
  }

  // 2. Student Reading Activity Mode (AI-READ Grade 5)
  if (studentSession && !isTeacherMode) {
    return (
      <>
        <StudentReadingActivity
          studentName={studentSession.name}
          attendanceCode={studentSession.attendanceCode}
          studentSchool={studentSession.school}
          studentGrade={studentSession.grade}
          initialPassageId={studentSession.activityId}
          onExit={() => setStudentSession(null)}
          onOpenGuide={() => setShowOnboardingGuide(true)}
        />
        {showOnboardingGuide && (
          <OnboardingGuide onFinishGuide={handleFinishGuide} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-800 font-['Inter',sans-serif] flex">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        pendingRecCount={pendingRecCount}
        onOpenGoogleSheetSync={() => setIsSheetModalOpen(true)}
        teacherProfile={teacherProfile}
        onSwitchProfile={handleSwitchProfile}
        onOpenGuide={() => setShowOnboardingGuide(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        {/* Top Filter and Navigation Bar */}
        <TopNavigation
          teacherProfile={teacherProfile}
          selectedSchool={selectedSchool}
          selectedClass={selectedClass}
          selectedTextId={selectedTextId}
          onClassChange={(cls) => {
            setSelectedClass(cls);
            setFeaturedStudentIndex(0);
          }}
          onTextChange={(tid) => setSelectedTextId(tid)}
          sheetConfig={sheetConfig}
          onOpenSheetModal={() => setIsSheetModalOpen(true)}
          onQuickSync={handleQuickSync}
          isSyncing={isSyncing}
          onSwitchProfile={handleSwitchProfile}
          onOpenGuide={() => setShowOnboardingGuide(true)}
        />

        {/* Page Body */}
        <main className="p-4 sm:p-6 flex-1 max-w-[1600px] w-full mx-auto min-w-0">
          {/* Dashboard Home View */}
          {activePage === 'dashboard' && (
            <div className="space-y-6 text-left min-w-0">
              {/* Welcome Hero with 3D Aurora Ambient Ribbon */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071326] via-[#0c2340] to-[#071326] p-5 sm:p-6 text-white shadow-lg border border-slate-800">
                <Aurora3D intensity="subtle" className="opacity-90" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>3D Aurora Pedagogy Engine</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                      Welcome, {teacherProfile.name}! 👋
                    </h1>
                    <p className="text-xs text-slate-300 mt-1 font-normal">
                      Here is an overview of your students&apos; English reading performance at <strong className="text-white font-semibold">{teacherProfile.school}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Sheets Connection Bar (Matching screenshot) */}
              <GoogleSheetsConnectionBar
                config={sheetConfig}
                onSaveConfig={handleSaveSheetConfig}
                onDataLoaded={handleDataLoaded}
                onOpenScriptModal={() => setIsSheetModalOpen(true)}
              />

              {/* 5 KPI Metric Cards */}
              <MetricCards summary={kpiSummary} selectedClass={selectedClass} />

              {/* 3 Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-5 min-h-[340px]">
                  <PerformanceChart sessionAverages={sessionAverages} />
                </div>
                <div className="lg:col-span-3 min-h-[340px]">
                  <DistributionChart distribution={performanceDistribution} />
                </div>
                <div className="lg:col-span-4 min-h-[340px]">
                  <AffectiveChart sessionAverages={sessionAverages} />
                </div>
              </div>

              {/* Bottom Row: Table (Left) + AI Insights & Recent Activity (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Student Performance Table */}
                <div className="lg:col-span-8">
                  <StudentTable
                    records={filteredRecordsForTable}
                    onSelectStudent={(id) => {
                      setSelectedStudentForModal(id);
                      const idx = classStudents.findIndex((s) => s.studentId === id);
                      if (idx !== -1) setFeaturedStudentIndex(idx);
                    }}
                    selectedSession={selectedSession}
                  />
                </div>

                {/* Right: AI Insights & Recommendations + Recent Activity */}
                <div className="lg:col-span-4 space-y-4">
                  <AIInsightCard
                    currentRecommendation={currentRecommendation}
                    insight={currentInsight}
                    onAccept={handleAcceptRecommendation}
                    onOpenModify={(rec) => setModifyingRec(rec)}
                    onOpenReject={(rec) => setRejectingRec(rec)}
                    onViewAll={() => setActivePage('recommendations')}
                    onPrevStudent={handlePrevStudent}
                    onNextStudent={handleNextStudent}
                    studentIndex={featuredStudentIndex + 1}
                    totalStudents={classStudents.length}
                    teacherName={teacherProfile.name}
                  />

                  <RecentActivity onViewAll={() => setActivePage('reports')} />
                </div>
              </div>
            </div>
          )}

          {/* Students Directory Page */}
          {activePage === 'students' && (
            <StudentsPage
              students={studentAggregates}
              onSelectStudent={(id) => setSelectedStudentForModal(id)}
              selectedClass={selectedClass}
              onAddStudent={handleAddNewStudent}
            />
          )}

          {/* Reading Analytics Page */}
          {activePage === 'analytics' && (
            <ReadingAnalyticsPage
              sessionAverages={sessionAverages}
              students={classStudents}
              selectedClass={selectedClass}
            />
          )}

          {/* AI Insights Page */}
          {activePage === 'insights' && (
            <AIInsightsPage
              students={classStudents}
              kpis={kpiSummary}
              selectedClass={selectedClass}
              onSelectStudent={(id) => setSelectedStudentForModal(id)}
            />
          )}

          {/* Recommendations Page */}
          {activePage === 'recommendations' && (
            <RecommendationsPage
              recommendations={recommendations}
              onAccept={handleAcceptRecommendation}
              onOpenModify={(rec) => setModifyingRec(rec)}
              onOpenReject={(rec) => setRejectingRec(rec)}
              selectedClass={selectedClass}
            />
          )}

          {/* Reports Page */}
          {activePage === 'reports' && (
            <ReportsPage
              students={classStudents}
              kpis={kpiSummary}
              recommendations={recommendations}
              selectedClass={selectedClass}
              teacherProfile={teacherProfile}
            />
          )}

          {/* Settings Page */}
          {activePage === 'settings' && (
            <SettingsPage
              sheetConfig={sheetConfig}
              onSaveConfig={handleSaveSheetConfig}
              onDataLoaded={handleDataLoaded}
              onResetDemoData={handleResetDemoData}
              currentRecords={rawRecords}
              teacherProfile={teacherProfile}
              onSaveProfile={handleUpdateProfile}
              onReturnToLanding={handleSwitchProfile}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {studentInModal && (
        <StudentModal
          student={studentInModal}
          insight={insightInModal}
          recommendation={recInModal}
          onClose={() => setSelectedStudentForModal(null)}
          onAccept={handleAcceptRecommendation}
          onOpenModify={(rec) => setModifyingRec(rec)}
          onOpenReject={(rec) => setRejectingRec(rec)}
        />
      )}

      {isSheetModalOpen && (
        <GoogleSheetModal
          config={sheetConfig}
          onSaveConfig={handleSaveSheetConfig}
          onDataLoaded={handleDataLoaded}
          onResetDemoData={handleResetDemoData}
          onClose={() => setIsSheetModalOpen(false)}
          currentRecords={rawRecords}
        />
      )}

      {modifyingRec && (
        <ModifyRecommendationModal
          recommendation={modifyingRec}
          onClose={() => setModifyingRec(null)}
          onSaveModification={handleSaveModification}
        />
      )}

      {rejectingRec && (
        <RejectRecommendationModal
          recommendation={rejectingRec}
          onClose={() => setRejectingRec(null)}
          onSaveRejection={handleSaveRejection}
        />
      )}
    </div>
  );
}
