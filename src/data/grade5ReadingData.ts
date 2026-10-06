export interface Grade5VocabularyItem {
  word: string;
  paragraph: number;
  meaning: string;
  example: string;
  indonesianTranslation: string;
}

export interface Grade5Question {
  id: string;
  questionNumber: number;
  skill: 'Main Idea' | 'Specific Information' | 'Inference' | 'Vocabulary in Context';
  questionText: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  targetParagraph: number;
  hint: string;
  hint1?: string;
  hint2?: string;
  correctEvidenceSentence: string;
  reasoning?: string;
}

export interface TreatmentSession {
  category?: 'pre-test' | 'treatment' | 'post-test';
  sessionNumber?: 1 | 2 | 3 | 4;
  id: string;
  title: string;
  theme: string;
  focus: string;
  instruction?: string;
  textType?: string;
  estimatedMinutes?: number;
  wordCount: number;
  paragraphs: {
    number: number;
    text: string;
  }[];
  vocabularyList: Grade5VocabularyItem[];
  questions: Grade5Question[];
}

export type Grade5ReadingPassage = TreatmentSession;

export const TREATMENT_SESSIONS: TreatmentSession[] = [
  // ==========================================
  // SESSION 1: The School Garden (±165 words)
  // Focus: Main Idea + Specific Information
  // ==========================================
  {
    sessionNumber: 1,
    id: 'SESSION-01',
    title: 'The School Garden',
    theme: 'Lingkungan Sekolah',
    focus: 'Main Idea + Specific Information',
    wordCount: 168,
    paragraphs: [
      {
        number: 1,
        text: 'Every Tuesday afternoon, the fifth-grade students at Oak Tree Elementary gather behind the school building. They take care of a lively green garden filled with fresh vegetables and colorful flowers. Mrs. Lina, their science teacher, started this garden project so students could learn how plants grow through direct observation.',
      },
      {
        number: 2,
        text: 'The students work in friendly teams. One group pulls out harmful weeds from the moist soil, while another group waters the young tomato plants with green watering cans. They also built a small compost bin in the corner to turn dried leaves and fruit peels into rich soil.',
      },
      {
        number: 3,
        text: 'Yesterday, the class harvested their very first batch of crisp red radishes and green spinach. The students washed the fresh vegetables carefully and shared them with the school cafeteria for lunch.',
      },
      {
        number: 4,
        text: 'Working together in the school garden has taught the students responsibility and cooperation. They take great pride in seeing small seeds turn into healthy food for everyone to enjoy.',
      },
    ],
    vocabularyList: [
      {
        word: 'observation',
        paragraph: 1,
        meaning: 'watching something carefully to notice and learn facts.',
        example: 'Students learn plant life cycles through careful observation.',
        indonesianTranslation: 'pengamatan / observasi secara teliti',
      },
      {
        word: 'harvested',
        paragraph: 3,
        meaning: 'gathered or picked ripe crops and vegetables from the soil.',
        example: 'The class harvested fresh spinach from their garden plot.',
        indonesianTranslation: 'memanen / memetik hasil kebun',
      },
      {
        word: 'cooperation',
        paragraph: 4,
        meaning: 'working together smoothly with others toward a shared goal.',
        example: 'Teamwork and cooperation made the garden project successful.',
        indonesianTranslation: 'kerja sama / gotong royong',
      },
      {
        word: 'weeds',
        paragraph: 2,
        meaning: 'wild plants growing where they are not wanted that take nutrients.',
        example: 'Students pull out harmful weeds around the tomatoes.',
        indonesianTranslation: 'gulma / rumput liar pengganggu',
      },
    ],
    questions: [
      // 1. Main Idea (Screen 4)
      {
        id: 's1-q1',
        questionNumber: 1,
        skill: 'Main Idea',
        questionText: 'What is the main idea of the entire text?',
        options: [
          { key: 'A', text: 'School cafeterias only serve vegetables on Tuesday afternoons.' },
          { key: 'B', text: 'Fifth-grade students learn teamwork and plant care through their school garden project.' },
          { key: 'C', text: 'How to build wooden compost bins using dried leaves.' },
          { key: 'D', text: 'Why red radishes grow faster than green spinach in soil.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: "Let's try again. Think about what the whole text is mostly about. Which answer covers the purpose and activities of the entire story?",
        correctEvidenceSentence: 'Working together in the school garden has taught the students responsibility and cooperation.',
      },
      // 2. Main Idea
      {
        id: 's1-q2',
        questionNumber: 2,
        skill: 'Main Idea',
        questionText: 'Which statement best summarizes paragraph 2?',
        options: [
          { key: 'A', text: 'Students work in teams doing different gardening tasks like weeding and watering.' },
          { key: 'B', text: 'Tomato plants need green watering cans to grow properly.' },
          { key: 'C', text: 'Only fruit peels should be placed inside school corners.' },
          { key: 'D', text: 'Mrs. Lina pulls all the weeds by herself every Tuesday.' },
        ],
        correctKey: 'A',
        targetParagraph: 2,
        hint: 'Look at how paragraph 2 describes groups working together on different duties.',
        correctEvidenceSentence: 'The students work in friendly teams.',
      },
      // 3. Specific Information (Screen 5)
      {
        id: 's1-q3',
        questionNumber: 3,
        skill: 'Specific Information',
        questionText: 'When do the fifth-grade students gather at the garden?',
        options: [
          { key: 'A', text: 'Every Monday morning before class starts.' },
          { key: 'B', text: 'Every Tuesday afternoon behind the school building.' },
          { key: 'C', text: 'Only on weekends during rainy days.' },
          { key: 'D', text: 'Every Friday lunch break in the classroom.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at paragraph 1. Find the sentence stating the exact day and time students meet.',
        correctEvidenceSentence: 'Every Tuesday afternoon, the fifth-grade students at Oak Tree Elementary gather behind the school building.',
      },
      // 4. Specific Information
      {
        id: 's1-q4',
        questionNumber: 4,
        skill: 'Specific Information',
        questionText: 'What vegetables did the students harvest first according to paragraph 3?',
        options: [
          { key: 'A', text: 'Carrots and sweet yellow corn.' },
          { key: 'B', text: 'Crisp red radishes and green spinach.' },
          { key: 'C', text: 'Large round pumpkins and green peas.' },
          { key: 'D', text: 'Cucumbers and purple eggplants.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Look at paragraph 3. Find the names of the two vegetables mentioned directly in the sentence.',
        correctEvidenceSentence: 'Yesterday, the class harvested their very first batch of crisp red radishes and green spinach.',
      },
      // 5. Specific Information
      {
        id: 's1-q5',
        questionNumber: 5,
        skill: 'Specific Information',
        questionText: 'What did the students do with the compost bin in the corner?',
        options: [
          { key: 'A', text: 'They threw away plastic bottles and paper wraps.' },
          { key: 'B', text: 'They used it to turn dried leaves and fruit peels into rich soil.' },
          { key: 'C', text: 'They stored garden tools and boots inside it.' },
          { key: 'D', text: 'They used it to catch rain water from the roof.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at the last sentence of paragraph 2 about the compost bin.',
        correctEvidenceSentence: 'They also built a small compost bin in the corner to turn dried leaves and fruit peels into rich soil.',
      },
      // 6. Inference (Screen 6)
      {
        id: 's1-q6',
        questionNumber: 6,
        skill: 'Inference',
        questionText: 'Why did Mrs. Lina start the garden project for fifth graders?',
        options: [
          { key: 'A', text: 'Because the school had no science textbooks available.' },
          { key: 'B', text: 'So students could learn science by seeing real plants grow instead of just reading.' },
          { key: 'C', text: 'To sell vegetables and make money for the school.' },
          { key: 'D', text: 'Because students had nothing to do on Tuesday afternoons.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Hint: Think about what Mrs. Lina wanted students to learn through "direct observation".',
        correctEvidenceSentence: 'Mrs. Lina, their science teacher, started this garden project so students could learn how plants grow through direct observation.',
      },
      // 7. Inference
      {
        id: 's1-q7',
        questionNumber: 7,
        skill: 'Inference',
        questionText: 'How did sharing the vegetables with the cafeteria make the students feel?',
        options: [
          { key: 'A', text: 'Proud and happy that their hard work helped their school community.' },
          { key: 'B', text: 'Angry because they wanted to eat all the food by themselves.' },
          { key: 'C', text: 'Worried that the vegetables tasted bad.' },
          { key: 'D', text: 'Bored of planting any more seeds.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: 'Hint: Look at how paragraph 4 describes the students taking "great pride" in their results.',
        correctEvidenceSentence: 'They take great pride in seeing small seeds turn into healthy food for everyone to enjoy.',
      },
      // 8. Inference
      {
        id: 's1-q8',
        questionNumber: 8,
        skill: 'Inference',
        questionText: 'What would likely happen if the students stopped pulling weeds from the soil?',
        options: [
          { key: 'A', text: 'The tomato plants would grow much faster.' },
          { key: 'B', text: 'Weeds would take water and nutrients away from the young crops.' },
          { key: 'C', text: 'The compost bin would become completely full.' },
          { key: 'D', text: 'Spinach would turn into flowers overnight.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Hint: Notice that weeds are called "harmful" in paragraph 2. What do harmful weeds do to young plants?',
        correctEvidenceSentence: 'One group pulls out harmful weeds from the moist soil...',
      },
      // 9. Vocabulary in Context (Screen 7)
      {
        id: 's1-q9',
        questionNumber: 9,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 1, what does "observation" mean in the phrase "learn how plants grow through direct observation"?',
        options: [
          { key: 'A', text: 'Playing games loudly in the classroom.' },
          { key: 'B', text: 'Watching and noticing things carefully with your own eyes.' },
          { key: 'C', text: 'Buying vegetables from a grocery store.' },
          { key: 'D', text: 'Drawing pictures on a blackboard.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at what students do in a real garden. Does "observation" mean watching carefully, ignoring, or painting?',
        correctEvidenceSentence: '...so students could learn how plants grow through direct observation.',
      },
      // 10. Vocabulary in Context
      {
        id: 's1-q10',
        questionNumber: 10,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 3, what does "harvested" most likely mean?',
        options: [
          { key: 'A', text: 'Planted new seeds under the ground.' },
          { key: 'B', text: 'Gathered and picked ripe vegetables from the garden.' },
          { key: 'C', text: 'Poured hot water over the soil.' },
          { key: 'D', text: 'Threw away bad plants.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Look at what the students did right after harvesting the radishes and spinach before sharing them for lunch.',
        correctEvidenceSentence: 'Yesterday, the class harvested their very first batch of crisp red radishes and green spinach.',
      },
    ],
  },

  // ==========================================
  // SESSION 2: A Smart Way to Save Water (±175 words)
  // Focus: Specific Information + Vocabulary in Context
  // ==========================================
  {
    sessionNumber: 2,
    id: 'SESSION-02',
    title: 'A Smart Way to Save Water',
    theme: 'Lingkungan',
    focus: 'Specific Information + Vocabulary in Context',
    wordCount: 172,
    paragraphs: [
      {
        number: 1,
        text: 'Clean fresh water is one of the most precious natural resources on Earth. Many cities around the world face dry seasons with very little rainfall. Because of this, learning simple habits to conserve water at home and at school has become essential for every child.',
      },
      {
        number: 2,
        text: 'At Green Valley Primary School, fifth graders started a campaign called "Drop by Drop." They checked every faucet in the school restrooms and placed reminders near the sinks. A single leaking faucet can waste more than twenty liters of clean water every day.',
      },
      {
        number: 3,
        text: 'Students also introduced rain barrels beneath the school roof gutters. When heavy clouds bring rain, the barrels collect runoff water. Instead of using treated tap water, the janitor and students use this rainwater to clean walkways and water outdoor plants.',
      },
      {
        number: 4,
        text: 'By making these small adjustments, Green Valley Primary reduced its water consumption by thirty percent in just two months. The project proves that simple conservation actions can create a huge positive difference.',
      },
    ],
    vocabularyList: [
      {
        word: 'conserve',
        paragraph: 1,
        meaning: 'to protect and use something carefully so it is not wasted.',
        example: 'Turning off the tap while brushing teeth helps conserve water.',
        indonesianTranslation: 'menghemat / menjaga agar tidak terbuang',
      },
      {
        word: 'precious',
        paragraph: 1,
        meaning: 'very valuable and important, something that should not be wasted.',
        example: 'Clean drinking water is precious for every living creature.',
        indonesianTranslation: 'sangat berharga / bernilai tinggi',
      },
      {
        word: 'consumption',
        paragraph: 4,
        meaning: 'the amount of something that is used up over time.',
        example: 'The school reduced its electricity and water consumption.',
        indonesianTranslation: 'pemakaian / konsumsi penggunaan',
      },
      {
        word: 'gutters',
        paragraph: 3,
        meaning: 'channels along the edge of a roof that carry rainwater away.',
        example: 'Rainwater flows from the roof gutters directly into barrels.',
        indonesianTranslation: 'talang air / saluran air di atap',
      },
    ],
    questions: [
      {
        id: 's2-q1',
        questionNumber: 1,
        skill: 'Main Idea',
        questionText: 'What is the main idea of this text?',
        options: [
          { key: 'A', text: 'School roofs are difficult to clean during the rainy season.' },
          { key: 'B', text: 'Students at Green Valley Primary successfully saved water through smart everyday actions.' },
          { key: 'C', text: 'Restrooms should not have any sinks or faucets.' },
          { key: 'D', text: 'Why cities only get rain once every two years.' },
        ],
        correctKey: 'B',
        targetParagraph: 4,
        hint: "Let's try again. What message is shared about water conservation and the students' project across the paragraphs?",
        correctEvidenceSentence: 'The project proves that simple conservation actions can create a huge positive difference.',
      },
      {
        id: 's2-q2',
        questionNumber: 2,
        skill: 'Main Idea',
        questionText: 'What is the main topic of paragraph 3?',
        options: [
          { key: 'A', text: 'How students collected and reused rainwater for gardening and cleaning.' },
          { key: 'B', text: 'Why tap water tastes sweeter than outdoor water.' },
          { key: 'C', text: 'Buying new plastic buckets for school janitors.' },
          { key: 'D', text: 'Painting school roof gutters green.' },
        ],
        correctKey: 'A',
        targetParagraph: 3,
        hint: 'Look at what the rain barrels in paragraph 3 are used for.',
        correctEvidenceSentence: 'Students also introduced rain barrels beneath the school roof gutters.',
      },
      {
        id: 's2-q3',
        questionNumber: 3,
        skill: 'Specific Information',
        questionText: 'What was the name of the campaign started by the fifth graders?',
        options: [
          { key: 'A', text: '"Clean River"' },
          { key: 'B', text: '"Drop by Drop"' },
          { key: 'C', text: '"Save the Ocean"' },
          { key: 'D', text: '"Rainy Days"' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at paragraph 2 inside quotation marks ("...").',
        correctEvidenceSentence: 'At Green Valley Primary School, fifth graders started a campaign called "Drop by Drop."',
      },
      {
        id: 's2-q4',
        questionNumber: 4,
        skill: 'Specific Information',
        questionText: 'How much water can a single leaking faucet waste each day according to paragraph 2?',
        options: [
          { key: 'A', text: 'Less than one glass of water.' },
          { key: 'B', text: 'More than twenty liters of clean water.' },
          { key: 'C', text: 'Exactly five small bottles.' },
          { key: 'D', text: 'Fifty gallons of juice.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at the last sentence of paragraph 2 for the number of liters.',
        correctEvidenceSentence: 'A single leaking faucet can waste more than twenty liters of clean water every day.',
      },
      {
        id: 's2-q5',
        questionNumber: 5,
        skill: 'Specific Information',
        questionText: 'By what percentage did the school reduce its water consumption in two months?',
        options: [
          { key: 'A', text: 'Ten percent.' },
          { key: 'B', text: 'Thirty percent.' },
          { key: 'C', text: 'Fifty percent.' },
          { key: 'D', text: 'Seventy-five percent.' },
        ],
        correctKey: 'B',
        targetParagraph: 4,
        hint: 'Look at the first sentence of paragraph 4 for the percentage number.',
        correctEvidenceSentence: '...reduced its water consumption by thirty percent in just two months.',
      },
      {
        id: 's2-q6',
        questionNumber: 6,
        skill: 'Inference',
        questionText: 'Why is using rainwater better than using tap water to water outdoor plants?',
        options: [
          { key: 'A', text: 'Because tap water is harmful to all flowers.' },
          { key: 'B', text: 'Because it saves clean, treated drinking water from being used for garden tasks.' },
          { key: 'C', text: 'Because rain barrels are colder than indoor sinks.' },
          { key: 'D', text: 'Because plants only drink water from gutters.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Hint: Think about why the text mentions "treated tap water" in paragraph 3.',
        correctEvidenceSentence: 'Instead of using treated tap water, the janitor and students use this rainwater to clean walkways and water outdoor plants.',
      },
      {
        id: 's2-q7',
        questionNumber: 7,
        skill: 'Inference',
        questionText: 'Why did students place reminders near the restroom sinks?',
        options: [
          { key: 'A', text: 'To encourage fellow students to turn faucets off tightly after washing hands.' },
          { key: 'B', text: 'To teach students how to wash their faces with soap.' },
          { key: 'C', text: 'To decorate the bathroom mirrors.' },
          { key: 'D', text: 'To remind students to do science homework.' },
        ],
        correctKey: 'A',
        targetParagraph: 2,
        hint: 'Hint: Combine the clue about leaking faucets wasting water with placing reminders near the sinks.',
        correctEvidenceSentence: 'They checked every faucet in the school restrooms and placed reminders near the sinks.',
      },
      {
        id: 's2-q8',
        questionNumber: 8,
        skill: 'Inference',
        questionText: 'What does this project suggest other schools can do?',
        options: [
          { key: 'A', text: 'Other schools can also save water by adopting simple, thoughtful habits.' },
          { key: 'B', text: 'Only schools in rainy areas can save water.' },
          { key: 'C', text: 'Schools should shut down restrooms completely.' },
          { key: 'D', text: 'Children should never wash hands at school.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: 'Hint: Look at the concluding message in paragraph 4 about "simple conservation actions".',
        correctEvidenceSentence: 'The project proves that simple conservation actions can create a huge positive difference.',
      },
      {
        id: 's2-q9',
        questionNumber: 9,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 1, what does "conserve" mean in the sentence "learning simple habits to conserve water"?',
        options: [
          { key: 'A', text: 'To spill water on the floor.' },
          { key: 'B', text: 'To protect and save water from being wasted.' },
          { key: 'C', text: 'To freeze water into ice blocks.' },
          { key: 'D', text: 'To boil water for cooking.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at the context. Does conserving precious water mean wasting it or protecting it?',
        correctEvidenceSentence: '...learning simple habits to conserve water at home and at school has become essential...',
      },
      {
        id: 's2-q10',
        questionNumber: 10,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 4, what does "consumption" most likely mean?',
        options: [
          { key: 'A', text: 'The amount of water used up.' },
          { key: 'B', text: 'The size of the school building.' },
          { key: 'C', text: 'The number of students in fifth grade.' },
          { key: 'D', text: 'The sound of falling rain.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: 'Look at the words "reduced its water consumption by thirty percent". What was reduced?',
        correctEvidenceSentence: '...reduced its water consumption by thirty percent in just two months.',
      },
    ],
  },

  // ==========================================
  // SESSION 3: Learning with Digital Books (±180 words)
  // Focus: Inference + Vocabulary
  // ==========================================
  {
    sessionNumber: 3,
    id: 'SESSION-03',
    title: 'Learning with Digital Books',
    theme: 'Technology / Education',
    focus: 'Inference + Vocabulary',
    wordCount: 178,
    paragraphs: [
      {
        number: 1,
        text: 'In many modern classrooms, students are using digital tablets alongside traditional paper textbooks. An electronic reading device allows children to carry an entire library in a lightweight backpack. With just a tap, students can access hundreds of interactive stories, science articles, and audiobooks.',
      },
      {
        number: 2,
        text: 'Digital learning tools also provide helpful support for young readers. When students encounter unfamiliar words, they can touch the word on the screen to view its definition or listen to its correct pronunciation. Adjustable font sizes and screen lighting help children read comfortably without straining their eyes.',
      },
      {
        number: 3,
        text: 'Furthermore, digital platforms enable learners in remote rural villages to read the same updated learning materials as children in large cities. Even if a village has no physical bookstore, a tablet connected to the internet can deliver educational resources instantly.',
      },
      {
        number: 4,
        text: 'However, teachers emphasize that balance is key. Spending too much time looking at screens can cause tiredness. Combining digital exploration with quiet paper book reading creates the most effective learning experience for fifth graders.',
      },
    ],
    vocabularyList: [
      {
        word: 'access',
        paragraph: 1,
        meaning: 'to be able to reach, use, or obtain something easily.',
        example: 'Students can access learning materials from home.',
        indonesianTranslation: 'mengakses / menjangkau dan menggunakan',
      },
      {
        word: 'pronunciation',
        paragraph: 2,
        meaning: 'the correct way in which a word is spoken out loud.',
        example: 'The audio feature helps students hear the correct pronunciation.',
        indonesianTranslation: 'pelafalan / cara pengucapan kata',
      },
      {
        word: 'remote',
        paragraph: 3,
        meaning: 'far away from towns or big cities; isolated.',
        example: 'Children living in remote villages received new digital libraries.',
        indonesianTranslation: 'terpencil / jauh dari kota besar',
      },
      {
        word: 'interactive',
        paragraph: 1,
        meaning: 'allowing two-way communication between user and computer.',
        example: 'Interactive stories let children click on characters.',
        indonesianTranslation: 'interaktif / dapat merespons tindakan pembaca',
      },
    ],
    questions: [
      {
        id: 's3-q1',
        questionNumber: 1,
        skill: 'Main Idea',
        questionText: 'What is the main idea of this passage?',
        options: [
          { key: 'A', text: 'Paper books will be banned in all schools by next year.' },
          { key: 'B', text: 'Digital books offer flexible reading benefits, but balancing them with paper books is best.' },
          { key: 'C', text: 'Children should play tablet games instead of doing science homework.' },
          { key: 'D', text: 'How to fix cracked tablet screens.' },
        ],
        correctKey: 'B',
        targetParagraph: 4,
        hint: "Let's try again. Look at how paragraphs 1-3 explain the benefits and paragraph 4 explains keeping a healthy balance.",
        correctEvidenceSentence: 'Combining digital exploration with quiet paper book reading creates the most effective learning experience...',
      },
      {
        id: 's3-q2',
        questionNumber: 2,
        skill: 'Main Idea',
        questionText: 'What is paragraph 2 mainly about?',
        options: [
          { key: 'A', text: 'Helpful features in digital tools that support students while reading.' },
          { key: 'B', text: 'Why school backpacks are too heavy to carry.' },
          { key: 'C', text: 'How to turn off internet routers at night.' },
          { key: 'D', text: 'Selling electronic tablets in city malls.' },
        ],
        correctKey: 'A',
        targetParagraph: 2,
        hint: 'Look at what paragraph 2 lists: touch definitions, pronunciation audio, adjustable font sizes.',
        correctEvidenceSentence: 'Digital learning tools also provide helpful support for young readers.',
      },
      {
        id: 's3-q3',
        questionNumber: 3,
        skill: 'Specific Information',
        questionText: 'What happens when a student touches an unfamiliar word on the screen in paragraph 2?',
        options: [
          { key: 'A', text: 'The tablet shuts down automatically.' },
          { key: 'B', text: 'They can view its definition or listen to its correct pronunciation.' },
          { key: 'C', text: 'The word disappears from the story forever.' },
          { key: 'D', text: 'A bell rings loudly in the room.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at paragraph 2 and find what the screen shows when touching an unfamiliar word.',
        correctEvidenceSentence: '...they can touch the word on the screen to view its definition or listen to its correct pronunciation.',
      },
      {
        id: 's3-q4',
        questionNumber: 4,
        skill: 'Specific Information',
        questionText: 'How do adjustable font sizes and screen lighting help children?',
        options: [
          { key: 'A', text: 'They make the battery last forever.' },
          { key: 'B', text: 'They help children read comfortably without straining their eyes.' },
          { key: 'C', text: 'They change the language of the book into French.' },
          { key: 'D', text: 'They turn the tablet into a television.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at the last sentence of paragraph 2 about eyes and comfort.',
        correctEvidenceSentence: 'Adjustable font sizes and screen lighting help children read comfortably without straining their eyes.',
      },
      {
        id: 's3-q5',
        questionNumber: 5,
        skill: 'Specific Information',
        questionText: 'According to paragraph 4, what can happen if students spend too much time looking at screens?',
        options: [
          { key: 'A', text: 'It can cause tiredness.' },
          { key: 'B', text: 'It makes tablets heavier to hold.' },
          { key: 'C', text: 'It deletes all the books in the library.' },
          { key: 'D', text: 'It makes internet connections faster.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: 'Look at the second sentence of paragraph 4.',
        correctEvidenceSentence: 'Spending too much time looking at screens can cause tiredness.',
      },
      {
        id: 's3-q6',
        questionNumber: 6,
        skill: 'Inference',
        questionText: 'Why can digital learning be especially useful for students living in remote rural villages?',
        options: [
          { key: 'A', text: 'Because rural villages have more computer stores than big cities.' },
          { key: 'B', text: 'Because they can access books online even when there are no physical bookstores nearby.' },
          { key: 'C', text: 'Because children in villages do not like reading paper books.' },
          { key: 'D', text: 'Because tablets do not need any electricity to work.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Hint: Think about what students in remote villages can access through digital platforms when bookstores are far away.',
        correctEvidenceSentence: 'Even if a village has no physical bookstore, a tablet connected to the internet can deliver educational resources instantly.',
      },
      {
        id: 's3-q7',
        questionNumber: 7,
        skill: 'Inference',
        questionText: 'Why do teachers recommend combining digital reading with paper book reading?',
        options: [
          { key: 'A', text: 'To balance the digital benefits with eye rest from quiet offline reading.' },
          { key: 'B', text: 'Because digital books are always incorrect.' },
          { key: 'C', text: 'Because paper books are free for everyone.' },
          { key: 'D', text: 'So children do not need to do any homework.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: 'Hint: Look at paragraph 4 where teachers mention "balance is key" to avoid screen fatigue.',
        correctEvidenceSentence: 'Combining digital exploration with quiet paper book reading creates the most effective learning experience...',
      },
      {
        id: 's3-q8',
        questionNumber: 8,
        skill: 'Inference',
        questionText: 'What makes carrying a tablet easier for a fifth grader than carrying twenty paper books?',
        options: [
          { key: 'A', text: 'A single lightweight device holds hundreds of titles without adding heavy physical weight.' },
          { key: 'B', text: 'Tablets can fly by themselves.' },
          { key: 'C', text: 'Paper books always get wet in rain.' },
          { key: 'D', text: 'Schools do not allow backpacks anymore.' },
        ],
        correctKey: 'A',
        targetParagraph: 1,
        hint: 'Hint: Look at paragraph 1 where it mentions carrying "an entire library in a lightweight backpack".',
        correctEvidenceSentence: 'An electronic reading device allows children to carry an entire library in a lightweight backpack.',
      },
      {
        id: 's3-q9',
        questionNumber: 9,
        skill: 'Vocabulary in Context',
        questionText: 'In the sentence, "students can access hundreds of interactive stories," what does "access" most likely mean?',
        options: [
          { key: 'A', text: 'To avoid or run away from.' },
          { key: 'B', text: 'To reach, open, and use.' },
          { key: 'C', text: 'To break or destroy.' },
          { key: 'D', text: 'To lock inside a box.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at what students do with learning resources on a screen. Does "access" mean to avoid them, use them, or lose them?',
        correctEvidenceSentence: 'With just a tap, students can access hundreds of interactive stories, science articles, and audiobooks.',
      },
      {
        id: 's3-q10',
        questionNumber: 10,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 3, what does "remote" mean in the phrase "learners in remote rural villages"?',
        options: [
          { key: 'A', text: 'Crowded and noisy.' },
          { key: 'B', text: 'Far away and isolated from big cities.' },
          { key: 'C', text: 'Very rich and modern.' },
          { key: 'D', text: 'Close to an airport.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Look at the sentence describing villages without physical bookstores. Are remote villages in the middle of cities or far away?',
        correctEvidenceSentence: 'Furthermore, digital platforms enable learners in remote rural villages to read the same updated learning materials...',
      },
    ],
  },

  // ==========================================
  // SESSION 4: The Amazing World of Mangroves (±185 words)
  // Focus: Integrated Reading
  // ==========================================
  {
    sessionNumber: 4,
    id: 'SESSION-04',
    title: 'The Amazing World of Mangroves',
    theme: 'Environment',
    focus: 'Integrated Reading',
    wordCount: 182,
    paragraphs: [
      {
        number: 1,
        text: 'Along the tropical coastlines of Indonesia, dense green mangrove forests grow where muddy land meets the salty ocean tides. Mangrove trees are unique because their specialized root systems can thrive in brackish water, which is a natural mixture of salt water and fresh river water.',
      },
      {
        number: 2,
        text: 'The tangled, stilt-like roots of mangroves perform several vital roles. They act as a protective natural barrier, absorbing the heavy force of ocean storm waves and preventing coastal erosion. Without these roots, coastal sand and soil would quickly be washed away into the sea.',
      },
      {
        number: 3,
        text: 'Mangrove forests also serve as safe nurseries for marine life. Tiny crabs, juvenile fish, and baby shrimp hide among the underwater roots where large ocean predators cannot catch them. In the branches above, kingfishers and monkeys find abundant food and safe nesting spots.',
      },
      {
        number: 4,
        text: 'Protecting coastal mangrove forests is crucial for preserving marine biodiversity and guarding human villages from fierce ocean storms. When we protect mangroves, we protect both the ocean and the land.',
      },
    ],
    vocabularyList: [
      {
        word: 'thrive',
        paragraph: 1,
        meaning: 'to grow vigorously and remain healthy even in difficult conditions.',
        example: 'Mangrove trees thrive in salty coastal waters.',
        indonesianTranslation: 'tumbuh subur dan berkembang baik',
      },
      {
        word: 'barrier',
        paragraph: 2,
        meaning: 'a natural structure or wall that blocks danger or prevents damage.',
        example: 'The roots act as a protective barrier against high storm waves.',
        indonesianTranslation: 'penghalang / pelindung benteng alami',
      },
      {
        word: 'nurseries',
        paragraph: 3,
        meaning: 'sheltered places where young baby animals can grow safely.',
        example: 'Mangrove roots are safe nurseries for juvenile fish.',
        indonesianTranslation: 'tempat asuhan / pembesaran bibit hewan',
      },
      {
        word: 'erosion',
        paragraph: 2,
        meaning: 'the gradual wearing away and loss of soil caused by water or wind.',
        example: 'Mangroves prevent coastal soil erosion from rough waves.',
        indonesianTranslation: 'erosi / pengikisan tanah oleh air',
      },
    ],
    questions: [
      {
        id: 's4-q1',
        questionNumber: 1,
        skill: 'Main Idea',
        questionText: 'What is the main idea of this entire text?',
        options: [
          { key: 'A', text: 'Mangrove forests are vital coastal ecosystems that protect land and support diverse wildlife.' },
          { key: 'B', text: 'Why monkeys like catching crabs in saltwater.' },
          { key: 'C', text: 'Storm waves only occur in deep ocean trenches.' },
          { key: 'D', text: 'How to build boats using mangrove branches.' },
        ],
        correctKey: 'A',
        targetParagraph: 4,
        hint: "Let's try again. Think about how the text describes mangrove roots protecting shores and providing shelter for animals.",
        correctEvidenceSentence: 'When we protect mangroves, we protect both the ocean and the land.',
      },
      {
        id: 's4-q2',
        questionNumber: 2,
        skill: 'Main Idea',
        questionText: 'What is the main topic of paragraph 2?',
        options: [
          { key: 'A', text: 'How mangrove roots act as natural barriers against storms and coastal erosion.' },
          { key: 'B', text: 'The types of birds flying above muddy shores.' },
          { key: 'C', text: 'Catching crabs under the sand.' },
          { key: 'D', text: 'Why salt water evaporates in sunshine.' },
        ],
        correctKey: 'A',
        targetParagraph: 2,
        hint: 'Look at how paragraph 2 explains absorbing wave force and preventing soil from washing away.',
        correctEvidenceSentence: 'They act as a protective natural barrier, absorbing the heavy force of ocean storm waves...',
      },
      {
        id: 's4-q3',
        questionNumber: 3,
        skill: 'Specific Information',
        questionText: 'According to paragraph 1, what is "brackish water"?',
        options: [
          { key: 'A', text: 'Water that has been boiled for tea.' },
          { key: 'B', text: 'A natural mixture of salt water and fresh river water.' },
          { key: 'C', text: 'Pure mineral water from mountain springs.' },
          { key: 'D', text: 'Frozen water found in cold snowy regions.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at the last sentence of paragraph 1 right after the comma.',
        correctEvidenceSentence: '...brackish water, which is a natural mixture of salt water and fresh river water.',
      },
      {
        id: 's4-q4',
        questionNumber: 4,
        skill: 'Specific Information',
        questionText: 'Which baby animals hide among the underwater roots according to paragraph 3?',
        options: [
          { key: 'A', text: 'Tiny crabs, juvenile fish, and baby shrimp.' },
          { key: 'B', text: 'Baby dolphins and large sharks.' },
          { key: 'C', text: 'Ducks and river frogs.' },
          { key: 'D', text: 'Sea lions and seals.' },
        ],
        correctKey: 'A',
        targetParagraph: 3,
        hint: 'Look at paragraph 3 for the names of the small marine animals.',
        correctEvidenceSentence: 'Tiny crabs, juvenile fish, and baby shrimp hide among the underwater roots...',
      },
      {
        id: 's4-q5',
        questionNumber: 5,
        skill: 'Specific Information',
        questionText: 'What animals find food and nesting spots in the branches above in paragraph 3?',
        options: [
          { key: 'A', text: 'Tigers and bears.' },
          { key: 'B', text: 'Kingfishers and monkeys.' },
          { key: 'C', text: 'Penguins and seals.' },
          { key: 'D', text: 'Owls and wolves.' },
        ],
        correctKey: 'B',
        targetParagraph: 3,
        hint: 'Look at the last sentence of paragraph 3.',
        correctEvidenceSentence: 'In the branches above, kingfishers and monkeys find abundant food and safe nesting spots.',
      },
      {
        id: 's4-q6',
        questionNumber: 6,
        skill: 'Inference',
        questionText: 'What would happen to coastal human villages if mangrove forests were destroyed?',
        options: [
          { key: 'A', text: 'Villages would be more vulnerable to damage from fierce storm waves and flooding.' },
          { key: 'B', text: 'Villages would have more fresh drinking water.' },
          { key: 'C', text: 'Ocean waves would completely disappear.' },
          { key: 'D', text: 'Soil would become much firmer.' },
        ],
        correctKey: 'A',
        targetParagraph: 2,
        hint: 'Hint: Think about what happens when the "protective natural barrier" that absorbs storm waves is gone.',
        correctEvidenceSentence: '...absorbing the heavy force of ocean storm waves and preventing coastal erosion.',
      },
      {
        id: 's4-q7',
        questionNumber: 7,
        skill: 'Inference',
        questionText: 'Why cannot large ocean predators catch young fish hiding in mangrove roots?',
        options: [
          { key: 'A', text: 'Because the tangled stilt roots are too dense for large predators to swim through.' },
          { key: 'B', text: 'Because big fish are afraid of salt water.' },
          { key: 'C', text: 'Because monkeys scare all the predators away.' },
          { key: 'D', text: 'Because roots make the water completely invisible.' },
        ],
        correctKey: 'A',
        targetParagraph: 3,
        hint: 'Hint: Look at how paragraph 2 and 3 describe the roots as "tangled" and serving as safe hiding spots.',
        correctEvidenceSentence: '...hide among the underwater roots where large ocean predators cannot catch them.',
      },
      {
        id: 's4-q8',
        questionNumber: 8,
        skill: 'Inference',
        questionText: 'Why are mangrove trees considered unique compared to normal forest trees?',
        options: [
          { key: 'A', text: 'They are able to survive and thrive in salty and brackish tidal water.' },
          { key: 'B', text: 'They do not have any leaves or branches.' },
          { key: 'C', text: 'They only grow inside deep caves.' },
          { key: 'D', text: 'They grow without needing any sunlight.' },
        ],
        correctKey: 'A',
        targetParagraph: 1,
        hint: 'Hint: Read the second sentence of paragraph 1 about specialized root systems.',
        correctEvidenceSentence: 'Mangrove trees are unique because their specialized root systems can thrive in brackish water...',
      },
      {
        id: 's4-q9',
        questionNumber: 9,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 1, what does the word "thrive" mean in "can thrive in brackish water"?',
        options: [
          { key: 'A', text: 'To dry up and die quickly.' },
          { key: 'B', text: 'To grow strongly, healthily, and successfully.' },
          { key: 'C', text: 'To float away into the ocean.' },
          { key: 'D', text: 'To turn completely yellow.' },
        ],
        correctKey: 'B',
        targetParagraph: 1,
        hint: 'Look at the context. Mangrove trees grow dense green forests in brackish water. Does "thrive" mean die or grow strongly?',
        correctEvidenceSentence: '...specialized root systems can thrive in brackish water...',
      },
      {
        id: 's4-q10',
        questionNumber: 10,
        skill: 'Vocabulary in Context',
        questionText: 'In paragraph 2, what does "barrier" mean in the phrase "protective natural barrier"?',
        options: [
          { key: 'A', text: 'A deep hole in the ground.' },
          { key: 'B', text: 'A structure that shields and protects against danger or force.' },
          { key: 'C', text: 'A bridge for walking across a river.' },
          { key: 'D', text: 'A boat used for catching fish.' },
        ],
        correctKey: 'B',
        targetParagraph: 2,
        hint: 'Look at the words right after: "absorbing the heavy force of ocean storm waves". What kind of object absorbs force to protect?',
        correctEvidenceSentence: 'They act as a protective natural barrier, absorbing the heavy force of ocean storm waves...',
      },
    ],
  },
];

// ==========================================
// 2. PRE-TEST — 20 ITEMS
// Instruction: Read each text carefully and choose the best answer.
// Text 1 — The School Garden
// ==========================================
export const PRE_TEST_PASSAGE: TreatmentSession = {
  category: 'pre-test',
  id: 'PRE-TEST-01',
  title: 'The School Garden (Pre-Test)',
  theme: 'School Garden & Nature',
  focus: 'Pre-Test: 20 Items (Main Idea, Specific Information, Inference, Vocabulary in Context)',
  instruction: 'Read each text carefully and choose the best answer.',
  textType: 'Pre-Test Assessment',
  estimatedMinutes: 10,
  wordCount: 88,
  paragraphs: [
    {
      number: 1,
      text: 'Our school has a small garden behind the library. Students and teachers work together to take care of it. Every Monday, some students water the plants, while others remove weeds. The garden has flowers, vegetables, and several small trees.',
    },
    {
      number: 2,
      text: 'The garden is not only beautiful. Students also learn about plants and nature there. Sometimes, the science teacher asks students to observe how plants grow. The vegetables from the garden are sometimes used in the school cooking activity.',
    },
  ],
  vocabularyList: [
    {
      word: 'weeds',
      paragraph: 1,
      meaning: 'unwanted wild plants growing in a garden that take away nutrients.',
      example: 'Students pull out unwanted weeds to help vegetables grow.',
      indonesianTranslation: 'tanaman liar pengganggu / gulma',
    },
    {
      word: 'observe',
      paragraph: 2,
      meaning: 'to watch something carefully with attention over time.',
      example: 'Students observe how young green plants grow bigger.',
      indonesianTranslation: 'mengamati / memperhatikan dengan seksama',
    },
    {
      word: 'beautiful',
      paragraph: 2,
      meaning: 'pleasing to the senses or attractive to look at.',
      example: 'The school garden has beautiful colorful flowers.',
      indonesianTranslation: 'indah / cantik / menarik dipandang',
    },
    {
      word: 'grow',
      paragraph: 2,
      meaning: 'to become bigger or develop into a mature plant.',
      example: 'Seeds grow into healthy green plants.',
      indonesianTranslation: 'tumbuh / berkembang menjadi besar',
    },
  ],
  questions: [
    // Main Idea (1-4)
    {
      id: 'pre-q1',
      questionNumber: 1,
      skill: 'Main Idea',
      questionText: 'What is the main idea of the text?',
      options: [
        { key: 'A', text: 'The library has many books.' },
        { key: 'B', text: 'Students take care of and learn from the school garden.' },
        { key: 'C', text: 'Students cook vegetables every Monday.' },
        { key: 'D', text: 'The school has many large trees.' },
      ],
      correctKey: 'B',
      targetParagraph: 1,
      hint: 'Think about what the whole passage is mostly about: how students care for and learn from the garden.',
      correctEvidenceSentence: 'Students and teachers work together to take care of it... Students also learn about plants and nature there.',
      reasoning: 'Teks secara keseluruhan menceritakan bagaimana siswa dan guru bekerja sama merawat kebun sekolah serta belajar tentang tanaman dan alam di sana (Pilihan B). Pilihan A, C, dan D bukan ide pokok keseluruhan teks.',
    },
    {
      id: 'pre-q2',
      questionNumber: 2,
      skill: 'Main Idea',
      questionText: 'What is the text mainly about?',
      options: [
        { key: 'A', text: 'A school garden and its activities' },
        { key: 'B', text: 'A science classroom' },
        { key: 'C', text: 'Different kinds of vegetables' },
        { key: 'D', text: "Students' cooking activities" },
      ],
      correctKey: 'A',
      targetParagraph: 1,
      hint: 'Look at what the entire story introduces and describes: the school garden and activities students do there.',
      correctEvidenceSentence: 'Our school has a small garden behind the library... The garden is not only beautiful. Students also learn about plants and nature there.',
      reasoning: 'Teks ini berfokus pada kebun sekolah dan aneka kegiatan positif yang dilakukan di dalamnya (Pilihan A), bukan sekadar ruang kelas, jenis sayuran, atau kegiatan memasak saja.',
    },
    {
      id: 'pre-q3',
      questionNumber: 3,
      skill: 'Main Idea',
      questionText: 'Why is the garden useful for students?',
      options: [
        { key: 'A', text: 'It gives them a place to play football.' },
        { key: 'B', text: 'It helps them learn about plants and nature.' },
        { key: 'C', text: 'It gives them more time to use the library.' },
        { key: 'D', text: 'It makes students stay after school.' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Read the second paragraph to find what benefit students gain from the garden.',
      correctEvidenceSentence: 'Students also learn about plants and nature there.',
      reasoning: 'Paragraf 2 menyatakan dengan jelas bahwa kebun bermanfaat karena membantu siswa belajar tentang tanaman dan alam: "Students also learn about plants and nature there" (Pilihan B).',
    },
    {
      id: 'pre-q4',
      questionNumber: 4,
      skill: 'Main Idea',
      questionText: 'Which sentence best describes the whole text?',
      options: [
        { key: 'A', text: 'The students only water flowers.' },
        { key: 'B', text: 'The school garden is used for learning and school activities.' },
        { key: 'C', text: 'The garden belongs to the science teacher.' },
        { key: 'D', text: 'Students never use the vegetables.' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Choose the option that describes both learning about nature and using garden vegetables in school activities.',
      correctEvidenceSentence: 'Students also learn about plants and nature there. The vegetables from the garden are sometimes used in the school cooking activity.',
      reasoning: 'Kalimat yang paling tepat menggambarkan seluruh teks adalah kebun sekolah dimanfaatkan untuk belajar sains dan berbagai aktivitas sekolah seperti kegiatan memasak (Pilihan B).',
    },
    // Specific Information (5-10)
    {
      id: 'pre-q5',
      questionNumber: 5,
      skill: 'Specific Information',
      questionText: 'Where is the school garden?',
      options: [
        { key: 'A', text: 'Beside the classroom' },
        { key: 'B', text: 'Behind the library' },
        { key: 'C', text: 'Near the school gate' },
        { key: 'D', text: "In front of the teachers' room" },
      ],
      correctKey: 'B',
      targetParagraph: 1,
      hint: 'Look at the first sentence of paragraph 1 to find the location.',
      correctEvidenceSentence: 'Our school has a small garden behind the library.',
      reasoning: 'Di awal teks disebutkan secara spesifik bahwa kebun sekolah terletak persis di belakang perpustakaan: "Our school has a small garden behind the library" (Pilihan B).',
    },
    {
      id: 'pre-q6',
      questionNumber: 6,
      skill: 'Specific Information',
      questionText: 'When do some students water the plants?',
      options: [
        { key: 'A', text: 'Every Monday' },
        { key: 'B', text: 'Every Tuesday' },
        { key: 'C', text: 'Every Friday' },
        { key: 'D', text: 'Every Sunday' },
      ],
      correctKey: 'A',
      targetParagraph: 1,
      hint: 'Look at paragraph 1 for the specific day of the week.',
      correctEvidenceSentence: 'Every Monday, some students water the plants, while others remove weeds.',
      reasoning: 'Pada paragraf 1 kalimat ketiga tertulis dengan jelas bahwa beberapa siswa menyiram tanaman setiap hari Senin: "Every Monday, some students water the plants..." (Pilihan A).',
    },
    {
      id: 'pre-q7',
      questionNumber: 7,
      skill: 'Specific Information',
      questionText: 'What do some students remove from the garden?',
      options: [
        { key: 'A', text: 'Trees' },
        { key: 'B', text: 'Flowers' },
        { key: 'C', text: 'Weeds' },
        { key: 'D', text: 'Vegetables' },
      ],
      correctKey: 'C',
      targetParagraph: 1,
      hint: 'Look at the second part of the third sentence in paragraph 1.',
      correctEvidenceSentence: '...while others remove weeds.',
      reasoning: 'Paragraf 1 menyatakan bahwa sebagian siswa bertugas mencabut gulma atau rumput liar pengganggu agar tanaman dapat tumbuh sehat: "...while others remove weeds" (Pilihan C).',
    },
    {
      id: 'pre-q8',
      questionNumber: 8,
      skill: 'Specific Information',
      questionText: 'What can students observe in the garden?',
      options: [
        { key: 'A', text: 'How animals sleep' },
        { key: 'B', text: 'How plants grow' },
        { key: 'C', text: 'How teachers work' },
        { key: 'D', text: 'How vegetables are cooked' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Look at paragraph 2 to see what the science teacher asks students to observe.',
      correctEvidenceSentence: 'Sometimes, the science teacher asks students to observe how plants grow.',
      reasoning: 'Di paragraf 2 tertulis bahwa guru sains mengajak siswa mengamati bagaimana tanaman bertumbuh: "Sometimes, the science teacher asks students to observe how plants grow" (Pilihan B).',
    },
    {
      id: 'pre-q9',
      questionNumber: 9,
      skill: 'Specific Information',
      questionText: 'What are sometimes used in the school cooking activity?',
      options: [
        { key: 'A', text: 'Flowers' },
        { key: 'B', text: 'Trees' },
        { key: 'C', text: 'Vegetables' },
        { key: 'D', text: 'Leaves' },
      ],
      correctKey: 'C',
      targetParagraph: 2,
      hint: 'Look at the last sentence of paragraph 2.',
      correctEvidenceSentence: 'The vegetables from the garden are sometimes used in the school cooking activity.',
      reasoning: 'Di akhir paragraf 2 disebutkan bahwa sayur-sayuran dari kebun terkadang dimanfaatkan dalam kegiatan memasak di sekolah: "The vegetables from the garden are sometimes used in the school cooking activity" (Pilihan C).',
    },
    {
      id: 'pre-q10',
      questionNumber: 10,
      skill: 'Specific Information',
      questionText: 'Who works together to take care of the garden?',
      options: [
        { key: 'A', text: 'Students and teachers' },
        { key: 'B', text: 'Parents and students' },
        { key: 'C', text: 'Teachers and librarians' },
        { key: 'D', text: 'Students and cooks' },
      ],
      correctKey: 'A',
      targetParagraph: 1,
      hint: 'Look at the second sentence of paragraph 1.',
      correctEvidenceSentence: 'Students and teachers work together to take care of it.',
      reasoning: 'Teks menyatakan secara langsung di kalimat kedua bahwa yang bekerja sama merawat kebun adalah siswa dan guru: "Students and teachers work together to take care of it" (Pilihan A).',
    },
    // Inference (11-16)
    {
      id: 'pre-q11',
      questionNumber: 11,
      skill: 'Inference',
      questionText: 'Why do students probably work in the garden?',
      options: [
        { key: 'A', text: 'They want to avoid studying.' },
        { key: 'B', text: 'They can learn while doing practical activities.' },
        { key: 'C', text: 'They want to make the library bigger.' },
        { key: 'D', text: 'They dislike science lessons.' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Think about why gardening helps students learn about nature and plants through real practice.',
      correctEvidenceSentence: 'Students also learn about plants and nature there.',
      reasoning: 'Dari kegiatan menyiram, mencabut rumput liar, dan mengamati tanaman, kita dapat menyimpulkan bahwa siswa bekerja di kebun agar mereka dapat belajar langsung melalui aktivitas praktik yang nyata (Pilihan B).',
    },
    {
      id: 'pre-q12',
      questionNumber: 12,
      skill: 'Inference',
      questionText: 'What can we infer about the school garden?',
      options: [
        { key: 'A', text: 'It is only for decoration.' },
        { key: 'B', text: 'It has educational value.' },
        { key: 'C', text: 'It is always empty.' },
        { key: 'D', text: 'It is used only by teachers.' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Notice that students observe plants and learn science lessons in the garden.',
      correctEvidenceSentence: 'The garden is not only beautiful. Students also learn about plants and nature there.',
      reasoning: 'Kebun sekolah bukan sekadar hiasan pemandangan, tetapi memiliki nilai edukasi yang nyata (educational value) karena guru memanfaatkannya untuk pembelajaran alam dan sains siswa (Pilihan B).',
    },
    {
      id: 'pre-q13',
      questionNumber: 13,
      skill: 'Inference',
      questionText: 'If students stop taking care of the garden, what will probably happen?',
      options: [
        { key: 'A', text: 'The plants may not grow well.' },
        { key: 'B', text: 'The library will become bigger.' },
        { key: 'C', text: 'The school will close.' },
        { key: 'D', text: 'The cooking activity will stop forever.' },
      ],
      correctKey: 'A',
      targetParagraph: 1,
      hint: 'Plants need water and weeding. What happens if nobody takes care of them?',
      correctEvidenceSentence: 'Every Monday, some students water the plants, while others remove weeds.',
      reasoning: 'Tanaman memerlukan air dan bebas dari gulma liar untuk bertumbuh. Jika siswa berhenti merawatnya, tanaman tersebut kemungkinan tidak akan tumbuh dengan baik (The plants may not grow well) (Pilihan A).',
    },
    {
      id: 'pre-q14',
      questionNumber: 14,
      skill: 'Inference',
      questionText: 'Why might the science teacher ask students to observe plants?',
      options: [
        { key: 'A', text: 'To help students understand plant growth.' },
        { key: 'B', text: 'To make students clean the library.' },
        { key: 'C', text: 'To teach students how to cook.' },
        { key: 'D', text: 'To give students more homework.' },
      ],
      correctKey: 'A',
      targetParagraph: 2,
      hint: 'In a science class, why would a teacher want students to watch plants grow over time?',
      correctEvidenceSentence: 'Sometimes, the science teacher asks students to observe how plants grow.',
      reasoning: 'Tujuan guru sains meminta siswa melakukan pengamatan adalah untuk membantu siswa memahami secara langsung proses bagaimana tanaman tumbuh (To help students understand plant growth) (Pilihan A).',
    },
    {
      id: 'pre-q15',
      questionNumber: 15,
      skill: 'Inference',
      questionText: 'What can we infer from the use of vegetables in cooking activities?',
      options: [
        { key: 'A', text: 'The garden can provide useful food.' },
        { key: 'B', text: 'The school never buys food.' },
        { key: 'C', text: 'Students dislike vegetables.' },
        { key: 'D', text: 'All school food comes from the garden.' },
      ],
      correctKey: 'A',
      targetParagraph: 2,
      hint: 'Cooking with vegetables grown in the garden shows that the harvest is useful and edible.',
      correctEvidenceSentence: 'The vegetables from the garden are sometimes used in the school cooking activity.',
      reasoning: 'Digunakannya sayuran hasil kebun dalam kegiatan memasak sekolah menunjukkan bahwa kebun tersebut mampu menghasilkan bahan makanan yang berguna dan dapat dikonsumsi (The garden can provide useful food) (Pilihan A).',
    },
    {
      id: 'pre-q16',
      questionNumber: 16,
      skill: 'Inference',
      questionText: 'What is most likely true about the students?',
      options: [
        { key: 'A', text: 'They are encouraged to learn through activities.' },
        { key: 'B', text: 'They never study science.' },
        { key: 'C', text: 'They only learn inside classrooms.' },
        { key: 'D', text: 'They do not like working together.' },
      ],
      correctKey: 'A',
      targetParagraph: 2,
      hint: 'Students participate in gardening, observation, and cooking activities.',
      correctEvidenceSentence: 'Students and teachers work together... Students also learn about plants and nature there.',
      reasoning: 'Melalui kegiatan berkebun, mengamati tanaman, dan memasak, terbukti bahwa siswa di sekolah ini didorong untuk belajar aktif melalui berbagai kegiatan langsung (They are encouraged to learn through activities) (Pilihan A).',
    },
    // Vocabulary in Context (17-20)
    {
      id: 'pre-q17',
      questionNumber: 17,
      skill: 'Vocabulary in Context',
      questionText: 'The word “weeds” in paragraph 1 is closest in meaning to...',
      options: [
        { key: 'A', text: 'unwanted plants' },
        { key: 'B', text: 'colorful flowers' },
        { key: 'C', text: 'small trees' },
        { key: 'D', text: 'fresh vegetables' },
      ],
      correctKey: 'A',
      targetParagraph: 1,
      hint: 'Look at what students remove from the soil so crops can grow without competition.',
      correctEvidenceSentence: '...while others remove weeds.',
      reasoning: 'Kata "weeds" dalam paragraf 1 berarti gulma atau rumput liar pengganggu yang tidak diinginkan dan harus dicabut agar tanaman utama bisa tumbuh subur: unwanted plants (Pilihan A).',
    },
    {
      id: 'pre-q18',
      questionNumber: 18,
      skill: 'Vocabulary in Context',
      questionText: 'The word “observe” in paragraph 2 means...',
      options: [
        { key: 'A', text: 'carefully watch' },
        { key: 'B', text: 'quickly remove' },
        { key: 'C', text: 'loudly explain' },
        { key: 'D', text: 'carefully cook' },
      ],
      correctKey: 'A',
      targetParagraph: 2,
      hint: 'Look at the action: observing how plants grow with your eyes over time.',
      correctEvidenceSentence: 'Sometimes, the science teacher asks students to observe how plants grow.',
      reasoning: 'Kata "observe" di paragraf 2 memiliki arti mengamati atau memperhatikan sesuatu dengan sangat cermat dan teliti untuk mempelajari fakta: carefully watch (Pilihan A).',
    },
    {
      id: 'pre-q19',
      questionNumber: 19,
      skill: 'Vocabulary in Context',
      questionText: 'The word “beautiful” is closest in meaning to...',
      options: [
        { key: 'A', text: 'dirty' },
        { key: 'B', text: 'attractive' },
        { key: 'C', text: 'dangerous' },
        { key: 'D', text: 'difficult' },
      ],
      correctKey: 'B',
      targetParagraph: 2,
      hint: 'Flowers and green trees make the garden attractive and pleasing to look at.',
      correctEvidenceSentence: 'The garden is not only beautiful. Students also learn about plants and nature there.',
      reasoning: 'Kata "beautiful" bermakna indah, sedap dipandang, atau menarik secara visual: attractive (Pilihan B).',
    },
    {
      id: 'pre-q20',
      questionNumber: 20,
      skill: 'Vocabulary in Context',
      questionText: 'The word “grow” in “how plants grow” means...',
      options: [
        { key: 'A', text: 'become bigger' },
        { key: 'B', text: 'become smaller' },
        { key: 'C', text: 'move quickly' },
        { key: 'D', text: 'change color' },
      ],
      correctKey: 'A',
      targetParagraph: 2,
      hint: 'As plants develop from young seedlings over time, they become bigger.',
      correctEvidenceSentence: 'Sometimes, the science teacher asks students to observe how plants grow.',
      reasoning: 'Kata "grow" dalam pertumbuhan tanaman berarti berkembang dari benih kecil menjadi bertambah besar ukurannya: become bigger (Pilihan A).',
    },
  ],
};

// ==========================================
// 2. AYO BERLATIH — 10 ITEMS (Sesi 1 Reinstated as Ayo Berlatih)
// Text: The School Garden (Oak Tree Elementary)
// ==========================================
export const AYO_BERLATIH_PASSAGE: TreatmentSession = {
  ...TREATMENT_SESSIONS[0],
  category: 'treatment',
  sessionNumber: 1,
  id: 'AYO-BERLATIH-01',
  title: 'Ayo Berlatih: The School Garden',
  theme: 'Lingkungan Sekolah',
  focus: 'Latihan Membaca: 10 Soal (Main Idea, Specific Information, Inference, Vocabulary)',
  instruction: 'Read each text carefully and choose the best answer.',
  textType: 'Ayo Berlatih (Sesi Latihan)',
  estimatedMinutes: 8,
  questions: TREATMENT_SESSIONS[0].questions.map((q) => {
    let reasoning = q.reasoning || q.hint;
    if (q.id === 's1-q1') {
      reasoning = 'Teks menceritakan siswa kelas lima belajar kerja sama dan merawat tanaman melalui proyek kebun sekolah (Pilihan B).';
    } else if (q.id === 's1-q2') {
      reasoning = 'Paragraf 2 merangkum bagaimana siswa bekerja dalam tim dengan tugas yang berbeda-beda seperti mencabut rumput dan menyiram (Pilihan A).';
    } else if (q.id === 's1-q3') {
      reasoning = 'Paragraf 1 secara spesifik menyebutkan siswa berkumpul setiap Selasa sore di belakang gedung sekolah (Pilihan B).';
    } else if (q.id === 's1-q4') {
      reasoning = 'Paragraf 3 menyatakan sayuran yang pertama kali dipanen adalah lobak merah renyah dan bayam hijau (crisp red radishes and green spinach) (Pilihan B).';
    } else if (q.id === 's1-q5') {
      reasoning = 'Tempat kompos dibuat untuk mengubah daun kering dan kulit buah menjadi tanah yang subur (Pilihan B).';
    } else if (q.id === 's1-q6') {
      reasoning = 'Guru sains memulai proyek ini agar siswa dapat belajar sains melalui pengamatan langsung tanaman nyata (Pilihan B).';
    } else if (q.id === 's1-q7') {
      reasoning = 'Siswa merasa sangat bangga (great pride) bahwa hasil kerja keras mereka dapat dinikmati bersama di kantin sekolah (Pilihan A).';
    } else if (q.id === 's1-q8') {
      reasoning = 'Gulma liar yang berbahaya (harmful weeds) akan merebut air dan nutrisi dari tanaman muda jika tidak dicabut (Pilihan B).';
    } else if (q.id === 's1-q9') {
      reasoning = 'Kata "observation" berarti mengamati dan memperhatikan sesuatu dengan cermat menggunakan mata sendiri: watching and noticing things carefully (Pilihan B).';
    } else if (q.id === 's1-q10') {
      reasoning = 'Kata "harvested" berarti memetik atau mengumpulkan hasil sayuran yang sudah matang dari kebun: gathered and picked ripe vegetables (Pilihan B).';
    }
    return {
      ...q,
      reasoning,
    };
  }),
};

// ==========================================
// 3. POST-TEST — 20 ITEMS (Identical text and questions as Pre-Test for research comparability)
// Text 1 — The School Garden
// ==========================================
export const POST_TEST_PASSAGE: TreatmentSession = {
  category: 'post-test',
  id: 'POST-TEST-01',
  title: 'The School Garden (Post-Test)',
  theme: 'School Garden & Nature',
  focus: 'Post-Test: 20 Items (Main Idea, Specific Information, Inference, Vocabulary in Context)',
  instruction: 'Read each text carefully and choose the best answer.',
  textType: 'Post-Test Assessment',
  estimatedMinutes: 10,
  wordCount: 88,
  paragraphs: PRE_TEST_PASSAGE.paragraphs,
  vocabularyList: PRE_TEST_PASSAGE.vocabularyList,
  questions: PRE_TEST_PASSAGE.questions.map((q) => ({
    ...q,
    id: q.id.replace('pre-', 'post-'),
  })),
};

// Research activity sequence: Pre-Test -> Ayo Berlatih -> Post-Test
export const ALL_RESEARCH_ACTIVITIES: TreatmentSession[] = [
  PRE_TEST_PASSAGE,      // Index 0: Pre-Test (20 items)
  AYO_BERLATIH_PASSAGE,   // Index 1: Ayo Berlatih (10 items)
  POST_TEST_PASSAGE,     // Index 2: Post-Test (20 items)
];

export const GRADE_5_PASSAGES = ALL_RESEARCH_ACTIVITIES;


