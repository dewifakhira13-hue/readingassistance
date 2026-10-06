import {
  StudentAggregate,
  EnrichedRecord,
  AIInsight,
  PedagogicalRecommendation,
  PriorityLevel,
  ClassKPISummary,
} from '../types';

export function generateStudentAIInsight(student: StudentAggregate): AIInsight {
  const latest = student.latestRecord;
  const growthText = student.scoreGrowth > 0
    ? `showing an upward trend of +${student.scoreGrowth} points across sessions`
    : student.scoreGrowth < 0
    ? `with a slight plateau of ${student.scoreGrowth} points requiring targeted reinforcement`
    : `demonstrating consistent performance across sessions`;

  const strengths: string[] = [];
  const areasForImprovement: string[] = [];

  if (student.avgMainIdea >= 75) {
    strengths.push(`Strong capacity in identifying main idea and central themes (${student.avgMainIdea}%)`);
  } else {
    areasForImprovement.push(`Extracting central themes and paragraph thesis statements (${student.avgMainIdea}%)`);
  }

  if (student.avgSpecificInfo >= 78) {
    strengths.push(`Skilled in locating explicit factual information and textual details (${student.avgSpecificInfo}%)`);
  } else {
    areasForImprovement.push(`Scanning for precise supporting evidence and key details (${student.avgSpecificInfo}%)`);
  }

  if (student.avgInference >= 72) {
    strengths.push(`Capable of drawing logical inferences from textual cues (${student.avgInference}%)`);
  } else {
    areasForImprovement.push(`Distinguishing implied conclusions from literal statements (${student.avgInference}%)`);
  }

  if (student.avgVocabulary >= 75) {
    strengths.push(`Proficient contextual vocabulary deduction within diverse genres (${student.avgVocabulary}%)`);
  } else {
    areasForImprovement.push(`Inferring unfamiliar words from cotext and syntactic signals (${student.avgVocabulary}%)`);
  }

  if (student.avgEngagement >= 3.8) {
    strengths.push(`High classroom task engagement (${student.avgEngagement}/5)`);
  }

  // Affective filter appraisal (Krashen)
  let affectiveAssessment = '';
  if (student.avgAnxiety >= 3.5 && student.avgConfidence <= 3.0) {
    affectiveAssessment = `${student.name}'s data reflects elevated reading anxiety (${student.avgAnxiety}/5) alongside modest confidence (${student.avgConfidence}/5). In light of Krashen's Affective Filter hypothesis, this affective profile suggests that perceived task anxiety may act as a barrier to optimal reading comprehension and spontaneous text engagement.`;
  } else if (student.avgConfidence >= 4.0 && student.avgAnxiety <= 2.5) {
    affectiveAssessment = `${student.name} demonstrates a highly favorable affective profile (confidence: ${student.avgConfidence}/5, low anxiety: ${student.avgAnxiety}/5). This suggests a lowered affective filter conducive to receptive reading exploration and autonomous challenge-seeking.`;
  } else {
    affectiveAssessment = `${student.name}'s affective indicators remain balanced (confidence: ${student.avgConfidence}/5, anxiety: ${student.avgAnxiety}/5), suggesting steady classroom receptivity without overt affective obstruction.`;
  }

  // Summary with cautious educational language
  const summary = `${student.name} demonstrates ${
    student.overallLevel === 'Excellent'
      ? 'advanced reading comprehension with high consistency across diverse text types'
      : student.overallLevel === 'Good'
      ? 'solid reading capabilities with commendable grasp of explicit text elements'
      : student.overallLevel === 'Fair'
      ? 'developing comprehension skills with emerging abilities in text processing'
      : 'fundamental reading skills requiring scaffolded instructional support'
  }, ${growthText}. Data patterns suggest that ${student.strongestSkill} represents a key relative strength, whereas ${student.weakestSkill.toLowerCase()} appears to be an area that may benefit from structured scaffolding.`;

  return {
    id: `insight-${student.studentId}`,
    studentId: student.studentId,
    studentName: student.name,
    studentCode: student.code,
    level: student.overallLevel,
    summary,
    strengths: strengths.length ? strengths : [`Steady progress in basic reading tasks (${student.avgReadingScore}%)`],
    areasForImprovement: areasForImprovement.length ? areasForImprovement : ['Consolidating advanced inference in complex informational texts'],
    learningTrend: growthText,
    affectiveAssessment,
    evidence: [
      `Overall Reading Score: ${student.avgReadingScore}%`,
      `Main Idea: ${student.avgMainIdea}% | Specific Info: ${student.avgSpecificInfo}%`,
      `Inference: ${student.avgInference}% | Vocabulary: ${student.avgVocabulary}%`,
      `Engagement: ${student.avgEngagement}/5 | Confidence: ${student.avgConfidence}/5 | Anxiety: ${student.avgAnxiety}/5`,
      `Task Completion: ${student.avgTaskCompletion}% over ${student.sessions.length} sessions`,
    ],
    dateGenerated: 'Today, 10:24 AM',
  };
}

export function generateInitialRecommendations(students: StudentAggregate[]): PedagogicalRecommendation[] {
  const recommendations: PedagogicalRecommendation[] = [];

  students.forEach((s, idx) => {
    let issue = '';
    let evidence = '';
    let aiRec = '';
    let actions: string[] = [];
    let priority: PriorityLevel = 'Medium';
    let focus: PedagogicalRecommendation['skillFocus'] = 'Vocabulary in Context';

    if (s.avgVocabulary < 70) {
      focus = 'Vocabulary in Context';
      priority = s.avgVocabulary < 60 ? 'High' : 'Medium';
      issue = `Contextual vocabulary score (${s.avgVocabulary}%) lags behind explicit comprehension skills.`;
      evidence = `Vocabulary in context score: ${s.avgVocabulary}%, vs. Specific Information: ${s.avgSpecificInfo}%. Task response time indicates hesitation on lexical items.`;
      aiRec = `${s.name} demonstrates solid literal understanding, but appears to encounter difficulty decoding academic vocabulary from context clues. Providing vocabulary pre-teaching and semantic mapping may improve comprehension.`;
      actions = [
        'Provide reading texts with contextual vocabulary glossaries.',
        'Implement context-clue sentence exercises (semantic mapping).',
        'Pre-teach 3-5 core academic keywords prior to whole-text reading.',
        'Encourage peer discussion on inferring word meanings from surrounding paragraphs.',
      ];
    } else if (s.avgInference < 70) {
      focus = 'Inference';
      priority = s.avgInference < 60 ? 'High' : 'Medium';
      issue = `Inference and implicit deduction score (${s.avgInference}%) requires scaffolded questioning.`;
      evidence = `Inference score: ${s.avgInference}% compared to Main Idea: ${s.avgMainIdea}%. Student frequently selects literal answers instead of inferred meaning.`;
      aiRec = `Data patterns suggest that ${s.name} understands literal events but may benefit from explicit modeling of 'reading between the lines' using textual clues.`;
      actions = [
        "Incorporate two-column 'Text Evidence vs. My Inference' graphic organizers.",
        'Practice distinguishing explicit factual assertions from implied conclusions.',
        "Use guided 'Think-Aloud' modeling during whole-class text analysis.",
      ];
    } else if (s.avgAnxiety >= 3.5) {
      focus = 'Affective & Confidence';
      priority = 'High';
      issue = `Elevated reading anxiety (${s.avgAnxiety}/5) may restrict active participation.`;
      evidence = `Reported anxiety: ${s.avgAnxiety}/5, confidence: ${s.avgConfidence}/5. Student exhibits longer response times during timed readings.`;
      aiRec = `In alignment with Krashen's Affective Filter hypothesis, high anxiety may impede text processing. Providing low-stakes reading opportunities in cooperative pairs may lower affective tension.`;
      actions = [
        'Reduce strict timed reading constraints during formative check-ins.',
        'Pair student with a supportive peer for collaborative reciprocal reading.',
        'Provide clear, chunked task instructions with self-monitoring rubrics.',
      ];
    } else if (s.avgEngagement <= 2.5) {
      focus = 'Engagement';
      priority = 'Medium';
      issue = `Classroom reading engagement score (${s.avgEngagement}/5) indicates potential text disengagement.`;
      evidence = `Engagement: ${s.avgEngagement}/5 with task completion of ${s.avgTaskCompletion}%.`;
      aiRec = `${s.name} may respond favorably to culturally relevant, multimodal reading materials and gamified comprehension checks to boost intrinsic motivation.`;
      actions = [
        'Incorporate multimodal reading texts (infographics, diagrams, video prompts).',
        'Assign short, high-interest reading passages tied to youth interests.',
        'Integrate interactive formative quiz checks (e.g. digital exit tickets).',
      ];
    } else {
      focus = 'Main Idea';
      priority = 'Low';
      issue = 'Maintaining mastery and advancing to higher-order evaluative synthesis.';
      evidence = `Reading score: ${s.avgReadingScore}%, confidence: ${s.avgConfidence}/5. Consistently achieves above grade-level benchmark.`;
      aiRec = `${s.name} demonstrates strong baseline reading autonomy. Providing extension texts and argumentative critique activities will foster higher-order critical literacy.`;
      actions = [
        'Introduce extension readings with opposing viewpoints on current societal topics.',
        'Encourage student to formulate debate arguments based on text evidence.',
        'Engage as a student peer mentor in guided reading groups.',
      ];
    }

    // Default status: EXP-5001 is pending to match screenshot or accepted
    const initialStatus = idx === 0 ? 'Pending' : idx % 3 === 0 ? 'Accepted' : 'Pending';

    recommendations.push({
      id: `rec-${s.studentId}`,
      studentId: s.studentId,
      studentName: s.name,
      studentCode: s.code,
      class: s.class,
      session: 5,
      detectedIssue: issue,
      supportingEvidence: evidence,
      aiRecommendation: aiRec,
      suggestedActions: actions,
      priority,
      skillFocus: focus,
      status: initialStatus,
      dateCreated: 'Today, 09:47 AM',
    });
  });

  return recommendations;
}

export function generateClassAIAnalysis(
  kpis: ClassKPISummary,
  students: StudentAggregate[],
  selectedClass: string
) {
  const supportCount = students.filter(s => s.overallLevel === 'Needs Support').length;
  const excellentCount = students.filter(s => s.overallLevel === 'Excellent').length;
  const vocabLagCount = students.filter(s => s.avgVocabulary < 70).length;
  const highAnxietyCount = students.filter(s => s.avgAnxiety >= 3.5).length;

  return {
    summary: `Comprehensive evaluation for ${selectedClass} indicates an overall positive reading trajectory (average score ${kpis.avgReadingScore}/100, +${kpis.readingScoreChange} improvement). Subskill decomposition suggests that while Main Idea and Specific Information remain robust strengths across the cohort, Vocabulary in Context represents a common pedagogical bottleneck (${vocabLagCount} students below benchmark).`,
    strengths: [
      `Cohort demonstrates high competency in locating explicit textual information (cohort average > 78%).`,
      `Task completion rates remain elevated at ${kpis.avgTaskCompletion}%, indicating sustained classroom adherence.`,
      `Average affective confidence has improved (+${kpis.confidenceChange} pts), indicating growing familiarity with reading routines.`,
    ],
    areas_for_improvement: [
      `Contextual lexical inference: ${vocabLagCount} students demonstrate notable lag in deducing unfamiliar words without external glossaries.`,
      `Higher-order inferencing on expository and report genres presents persistent challenge for ${Math.round(students.length * 0.35)}% of students.`,
      `${highAnxietyCount} students report elevated reading anxiety (≥ 3.5/5), which may hinder spontaneous participation.`,
    ],
    learning_trends: [
      `Steady session-over-session score progression from S1 to S5 (+${kpis.readingScoreChange} points average).`,
      `Anxiety indicators reflect a downward trend (-${Math.abs(kpis.anxietyChange)} pts), pointing toward lowered affective filter in later sessions.`,
      `Expository and Argumentative text types induced slightly longer response latencies than Narrative texts.`,
    ],
    students_needing_attention: students
      .filter(s => s.overallLevel === 'Needs Support' || s.avgAnxiety >= 4.0)
      .slice(0, 5)
      .map(s => ({
        name: s.name,
        code: s.code,
        score: s.avgReadingScore,
        keyArea: s.weakestSkill,
        anxiety: s.avgAnxiety,
      })),
    recommended_actions: [
      `Implement dedicated 10-minute Context Clue warm-ups focusing on semantic and syntactic deciphering prior to new reading texts.`,
      `Scaffold inference questions using two-column graphic organizers ('Text Clue' vs 'My Deduction').`,
      `Provide low-stakes peer collaborative reading pairs to alleviate anxiety for students with high affective filter indicators.`,
    ],
    evidence: [
      `Class average score: ${kpis.avgReadingScore} / 100`,
      `Task completion rate: ${kpis.avgTaskCompletion}%`,
      `Average confidence: ${kpis.avgConfidence} / 5 | Average engagement: ${kpis.avgEngagement} / 5`,
      `Cohort size: ${kpis.totalStudents} students evaluated across 5 instructional sessions`,
    ],
  };
}
