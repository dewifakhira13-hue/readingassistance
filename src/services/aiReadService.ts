import { GoogleGenAI } from '@google/genai';
import { Grade5ReadingPassage, Grade5Question } from '../data/grade5ReadingData';

export interface AIReadRequest {
  action: 'explain_vocabulary' | 'request_hint' | 'check_answer' | 'request_evidence_guide' | 'free_question';
  passage: Grade5ReadingPassage;
  currentQuestion?: Grade5Question;
  selectedOptionKey?: string;
  attemptNumber?: number;
  studentEvidence?: string;
  userMessage?: string;
  targetWord?: string;
}

export interface AIReadResponse {
  message: string;
  hintLevel?: 1 | 2;
  suggestedParagraph?: number;
  evidenceSentence?: string;
  isCorrect?: boolean;
  askForEvidence?: boolean;
  allowRetry?: boolean;
}

export interface WordTranslationResult {
  word: string;
  indonesianTranslation: string;
  partOfSpeech: string;
  pronunciation?: string;
  contextMeaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  synonyms?: string[];
  isSingleWord: boolean;
  warningMessage?: string;
}

const AI_READ_SYSTEM_PROMPT = `You are AI-READ, an AI-assisted English reading activity for Grade 5 elementary school students.
Your primary purpose is to support students while they read an English text and answer reading comprehension questions.

RESEARCH CONTEXT:
The activity is used as part of a structured educational intervention investigating AI-assisted reading activities and elementary students' English reading comprehension.

CORE PRINCIPLE:
You are a reading assistant, not an answer provider.
Your role is to help students understand the text, think about the question, locate evidence, and improve their answers independently.

READING SKILLS:
Focus on:
1. Main idea
2. Specific information
3. Inference
4. Vocabulary in context

ALLOWED SUPPORT:
* Explain the meaning of a difficult word in the context of the passage.
* Give a short example when explaining vocabulary.
* Ask guiding questions.
* Give hints.
* Direct the student back to the relevant paragraph.
* Encourage the student to look for textual evidence.
* Give feedback after the student submits an answer.
* Ask the student to try again after an incorrect answer.
* Encourage students using simple, age-appropriate English.

ANSWER PROTECTION RULE:
Never reveal the correct answer before the student has attempted the question.
If the student has not answered yet:
* Do not state the correct answer.
* Do not identify the correct option.
* Do not eliminate all incorrect options for the student.
* Do not provide a complete answer sentence.

If the student gives an incorrect answer:
* Do not immediately reveal the correct answer.
* Give one short hint.
* Direct the student to the relevant paragraph, sentence, or idea.
* Ask the student to try again.

If the student remains incorrect after a second attempt:
* Give a stronger clue.
* Ask the student to reconsider the evidence in the text.
* Still avoid directly giving the answer unless the activity explicitly reaches the final feedback stage.

EVIDENCE RULE:
Whenever appropriate, ask:
"Which part of the text supports your answer?"
Encourage the student to identify the paragraph or sentence that supports the answer.

VOCABULARY RULE:
When explaining vocabulary:
* Explain the meaning based on the context of the passage.
* Use simple English appropriate for Grade 5 students.
* Do not translate the entire passage.
* Do not provide unnecessary definitions unrelated to the passage.

INFERENCE RULE:
For inference questions, do not give the conclusion directly.
Instead, guide students to combine information from the text.

LANGUAGE:
Use simple, friendly, encouraging English appropriate for Grade 5 elementary students.

FEEDBACK:
Keep feedback short and specific.
Examples:
"Good job! Your answer matches the information in paragraph 2."
"Try again. Look at the second paragraph and find the reason mentioned by the writer."
"Good thinking. Now find the sentence in the text that supports your answer."

DO NOT:
* Complete the activity for the student.
* Answer all questions at once.
* Generate unrelated questions.
* Change the reading passage.
* Rewrite the passage unless specifically instructed.
* Give answers before student attempts.
* Ask for sensitive personal information.
* Request the student's full name, home address, phone number, email address, or other unnecessary personal information.

STUDENT PRIVACY:
Use only a student code for research identification.
Do not request or store unnecessary personally identifiable information.`;

// Pre-indexed Grade 5 Word-by-Word Dictionary
export const GRADE_5_DICTIONARY: Record<string, WordTranslationResult> = {
  canopy: {
    word: 'canopy',
    indonesianTranslation: 'kanopi / atap rimbun dedaunan pohon',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Lapisan paling atas berupa dedaunan lebat dari pohon-pohon tinggi di hutan yang menyerupai atap.',
    exampleSentence: 'Monkeys sleep high up in the green forest canopy.',
    exampleTranslation: 'Monyet-monyet tidur tinggi di atas kanopi hutan yang hijau.',
    isSingleWord: true,
  },
  sturdy: {
    word: 'sturdy',
    indonesianTranslation: 'kokoh / kuat / tidak mudah patah',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Benda yang dibuat sangat kuat dan mampu menahan beban berat dengan aman.',
    exampleSentence: 'The wooden ladder is very sturdy and safe to climb.',
    exampleTranslation: 'Tangga kayu itu sangat kokoh dan aman untuk dipanjat.',
    isSingleWord: true,
  },
  antique: {
    word: 'antique',
    indonesianTranslation: 'antik / kuno bernilai tinggi',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Barang tua yang dibuat dari zaman dulu dan memiliki nilai sejarah atau keunikan.',
    exampleSentence: 'Leo found an antique brass telescope on the desk.',
    exampleTranslation: 'Leo menemukan sebuah teropong kuningan antik di atas meja.',
    isSingleWord: true,
  },
  shelter: {
    word: 'shelter',
    indonesianTranslation: 'tempat berlindung / naungan',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tempat aman yang melindungi manusia atau hewan dari cuaca buruk, angin, atau bahaya.',
    exampleSentence: 'The treehouse was a safe shelter for woodland bird watchers.',
    exampleTranslation: 'Rumah pohon itu adalah tempat berlindung yang aman bagi pengamat burung hutan.',
    isSingleWord: true,
  },
  observation: {
    word: 'observation',
    indonesianTranslation: 'pengamatan / observasi',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kegiatan memperhatikan sesuatu secara teliti dan seksama untuk mempelajari hal tersebut.',
    exampleSentence: 'The children used the telescope for bird observation.',
    exampleTranslation: 'Anak-anak menggunakan teropong untuk pengamatan burung.',
    isSingleWord: true,
  },
  treehouse: {
    word: 'treehouse',
    indonesianTranslation: 'rumah pohon',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bangunan rumah kecil yang dibangun di atas dahan-dahan pohon besar.',
    exampleSentence: 'They climbed the rope ladder into the secret treehouse.',
    exampleTranslation: 'Mereka menaiki tangga tali ke dalam rumah pohon rahasia.',
    isSingleWord: true,
  },
  woods: {
    word: 'woods',
    indonesianTranslation: 'hutan / hutan kecil berpohon rimbun',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kawasan alam terbuka yang dipenuhi pepohonan rimbun.',
    exampleSentence: 'Leo and Maya loved exploring the green woods.',
    exampleTranslation: 'Leo dan Maya suka menjelajahi hutan yang hijau.',
    isSingleWord: true,
  },
  forest: {
    word: 'forest',
    indonesianTranslation: 'hutan belantara',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Wilayah daratan yang sangat luas dan ditumbuhi pepohonan lebat.',
    exampleSentence: 'Wild animals live happily in the deep forest.',
    exampleTranslation: 'Hewan-hewan liar hidup bahagia di dalam hutan lebat.',
    isSingleWord: true,
  },
  branches: {
    word: 'branches',
    indonesianTranslation: 'dahan-dahan / ranting-ranting pohon',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Bagian kayu yang tumbuh menyamping dari batang utama pohon.',
    exampleSentence: 'Birds build their nests on the thick tree branches.',
    exampleTranslation: 'Burung-burung membangun sarang di atas dahan pohon yang tebal.',
    isSingleWord: true,
  },
  telescope: {
    word: 'telescope',
    indonesianTranslation: 'teropong / teleskop',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Alat optik berlensa untuk melihat benda-benda yang letaknya sangat jauh agar tampak dekat.',
    exampleSentence: 'Maya looked through the telescope to see Pine Hill.',
    exampleTranslation: 'Maya melihat lewat teropong untuk melihat Bukit Pinus.',
    isSingleWord: true,
  },
  exploring: {
    word: 'exploring',
    indonesianTranslation: 'menjelajahi / mencari tahu',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Bepergian ke tempat baru untuk mempelajari dan menemukan hal-hal menarik.',
    exampleSentence: 'They spent the afternoon exploring the nature trails.',
    exampleTranslation: 'Mereka menghabiskan sore hari menjelajahi jalur alam.',
    isSingleWord: true,
  },
  hatchlings: {
    word: 'hatchlings',
    indonesianTranslation: 'anak hewan yang baru menetas (bayi penyu)',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Bayi hewan kecil yang baru saja keluar dan memecahkan cangkang telurnya.',
    exampleSentence: 'Tiny turtle hatchlings crawl toward the sea waves.',
    exampleTranslation: 'Bayi penyu yang baru menetas merayap menuju ombak laut.',
    isSingleWord: true,
  },
  horizon: {
    word: 'horizon',
    indonesianTranslation: 'cakrawala / garis batas laut dan langit',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Garis maya di kejauhan tempat permukaan laut atau bumi tampak bertemu dengan langit.',
    exampleSentence: 'The sun dipped below the ocean horizon at sunset.',
    exampleTranslation: 'Matahari tenggelam di bawah cakrawala samudra saat senja.',
    isSingleWord: true,
  },
  endangered: {
    word: 'endangered',
    indonesianTranslation: 'terancam punah',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Hewan atau tumbuhan yang jumlahnya sangat sedikit dan berisiko habis lenyap selamanya jika tidak dilindungi.',
    exampleSentence: 'Sea turtles are endangered animals that need our care.',
    exampleTranslation: 'Penyu laut adalah hewan yang terancam punah dan butuh kepedulian kita.',
    isSingleWord: true,
  },
  conservation: {
    word: 'conservation',
    indonesianTranslation: 'konservasi / pelestarian alam',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Upaya menjaga, memelihara, dan menyelamatkan satwa liar dan lingkungan alam dari kerusakan.',
    exampleSentence: 'Volunteers work hard at the turtle conservation center.',
    exampleTranslation: 'Para relawan bekerja keras di pusat pelestarian penyu.',
    isSingleWord: true,
  },
  volunteers: {
    word: 'volunteers',
    indonesianTranslation: 'sukarelawan / relawan',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Orang-orang yang dengan tulus memberikan bantuan tanpa pamrih untuk menolong orang lain atau lingkungan.',
    exampleSentence: 'The volunteers released hundreds of baby turtles into the sea.',
    exampleTranslation: 'Para sukarelawan melepaskan ratusan bayi penyu ke laut.',
    isSingleWord: true,
  },
  protect: {
    word: 'protect',
    indonesianTranslation: 'melindungi / menjaga dari bahaya',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Menjaga seseorang atau sesuatu agar tetap aman dan tidak terluka atau rusak.',
    exampleSentence: 'We must protect our forests and oceans.',
    exampleTranslation: 'Kita harus melindungi hutan dan samudra kita.',
    isSingleWord: true,
  },
  ocean: {
    word: 'ocean',
    indonesianTranslation: 'samudra / lautan luas',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hamparan air asin yang sangat luas yang menutupi sebagian besar permukaan bumi.',
    exampleSentence: 'Turtles swim across the vast ocean.',
    exampleTranslation: 'Penyu-penyu berenang melintasi samudra yang luas.',
    isSingleWord: true,
  },
  beach: {
    word: 'beach',
    indonesianTranslation: 'pantai / pesisir berpasir',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tepian daratan berpasir yang berbatasan langsung dengan air laut atau danau.',
    exampleSentence: 'The mother turtle laid eggs on the sandy beach.',
    exampleTranslation: 'Induk penyu bertelur di pantai berpasir.',
    isSingleWord: true,
  },
  nest: {
    word: 'nest',
    indonesianTranslation: 'sarang telur',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tempat bertelur yang dibuat oleh burung atau penyu untuk mengerami dan menjaga telurnya.',
    exampleSentence: 'The turtle dug a deep nest in the soft sand.',
    exampleTranslation: 'Penyu itu menggali sarang yang dalam di pasir yang lembut.',
    isSingleWord: true,
  },
  weeds: {
    word: 'weeds',
    indonesianTranslation: 'gulma / rumput liar pengganggu',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Tanaman liar yang tumbuh tidak diinginkan dan menyerap nutrisi dari tanaman kebun.',
    exampleSentence: 'Students remove weeds so vegetables can grow well.',
    exampleTranslation: 'Siswa mencabuti rumput liar agar sayuran bisa tumbuh subur.',
    isSingleWord: true,
  },
  observe: {
    word: 'observe',
    indonesianTranslation: 'mengamati / memperhatikan secara teliti',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Melihat dan memperhatikan sesuatu dengan seksama untuk mempelajari fakta baru.',
    exampleSentence: 'Students observe how young plants grow every week.',
    exampleTranslation: 'Siswa mengamati bagaimana tanaman muda tumbuh setiap minggu.',
    isSingleWord: true,
  },
  beautiful: {
    word: 'beautiful',
    indonesianTranslation: 'indah / cantik / elok',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Menyenangkan dan sedap dipandang mata.',
    exampleSentence: 'The school garden is beautiful and filled with colorful flowers.',
    exampleTranslation: 'Kebun sekolah itu indah dan dipenuhi bunga warna-warni.',
    isSingleWord: true,
  },
  grow: {
    word: 'grow',
    indonesianTranslation: 'tumbuh / berkembang menjadi lebih besar',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Menjadi lebih besar, bertambah tinggi, atau berkembang dari benih.',
    exampleSentence: 'With water and sunlight, small seeds grow into healthy plants.',
    exampleTranslation: 'Dengan air dan sinar matahari, biji kecil tumbuh menjadi tanaman sehat.',
    isSingleWord: true,
  },
  encouraged: {
    word: 'encouraged',
    indonesianTranslation: 'didorong / dianjurkan / didukung',
    partOfSpeech: 'verb (kata kerja bentuk lampau/pasif)',
    contextMeaning: 'Diberikan semangat atau anjuran untuk melakukan kebiasaan baik.',
    exampleSentence: 'Students are encouraged to save water every day.',
    exampleTranslation: 'Para siswa didorong untuk menghemat air setiap hari.',
    isSingleWord: true,
  },
  collected: {
    word: 'collected',
    indonesianTranslation: 'dikumpulkan / ditampung',
    partOfSpeech: 'verb (kata kerja bentuk lampau/pasif)',
    contextMeaning: 'Dikumpulkan dan disimpan bersama dalam satu wadah.',
    exampleSentence: 'Rainwater is collected in large containers at school.',
    exampleTranslation: 'Air hujan ditampung dalam wadah-wadah besar di sekolah.',
    isSingleWord: true,
  },
  resource: {
    word: 'resource',
    indonesianTranslation: 'sumber daya / bahan berguna',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Sesuatu yang bermanfaat dari alam yang sangat dibutuhkan oleh makhluk hidup.',
    exampleSentence: 'Fresh water is an important natural resource for life.',
    exampleTranslation: 'Air bersih adalah sumber daya alam yang penting bagi kehidupan.',
    isSingleWord: true,
  },
  carefully: {
    word: 'carefully',
    indonesianTranslation: 'dengan hati-hati / cermat dan teliti',
    partOfSpeech: 'adverb (kata keterangan)',
    contextMeaning: 'Melakukan sesuatu dengan penuh perhatian agar tidak terjadi pemborosan atau kesalahan.',
    exampleSentence: 'They close the taps carefully after washing their hands.',
    exampleTranslation: 'Mereka menutup keran air dengan cermat setelah mencuci tangan.',
    isSingleWord: true,
  },
  taps: {
    word: 'taps',
    indonesianTranslation: 'keran air',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Alat pengatur aliran air pipa yang bisa dibuka dan ditutup.',
    exampleSentence: 'Make sure all taps are closed tightly after washing.',
    exampleTranslation: 'Pastikan semua keran air tertutup rapat setelah mencuci.',
    isSingleWord: true,
  },
  containers: {
    word: 'containers',
    indonesianTranslation: 'wadah / tempat penampungan besar',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Wadah atau drum penampung cairan seperti air.',
    exampleSentence: 'The school uses large containers to store clean rainwater.',
    exampleTranslation: 'Sekolah menggunakan wadah besar untuk menampung air hujan yang bersih.',
    isSingleWord: true,
  },
  rainwater: {
    word: 'rainwater',
    indonesianTranslation: 'air hujan',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Air alami yang jatuh dari langit saat turun hujan.',
    exampleSentence: 'Collected rainwater is great for watering school garden plants.',
    exampleTranslation: 'Air hujan yang ditampung sangat bagus untuk menyirami tanaman kebun sekolah.',
    isSingleWord: true,
  },
  garden: {
    word: 'garden',
    indonesianTranslation: 'kebun / taman tanaman',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Area tanah tempat menanam bunga, sayuran, dan pohon-pohon kecil.',
    exampleSentence: 'Our school has a green garden behind the library.',
    exampleTranslation: 'Sekolah kita memiliki kebun hijau di belakang perpustakaan.',
    isSingleWord: true,
  },
  library: {
    word: 'library',
    indonesianTranslation: 'perpustakaan',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Ruangan atau gedung tempat menyimpan buku-buku untuk dibaca dan dipelajari.',
    exampleSentence: 'Students read interesting storybooks in the school library.',
    exampleTranslation: 'Siswa membaca buku cerita menarik di perpustakaan sekolah.',
    isSingleWord: true,
  },
  school: {
    word: 'school',
    indonesianTranslation: 'sekolah',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tempat siswa belajar bersama guru dan teman-teman.',
    exampleSentence: 'Children go to school to learn science and English.',
    exampleTranslation: 'Anak-anak pergi ke sekolah untuk belajar sains dan bahasa Inggris.',
    isSingleWord: true,
  },
  student: {
    word: 'student',
    indonesianTranslation: 'murid / siswa / pelajar',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Orang yang sedang menuntut ilmu dan belajar di sekolah.',
    exampleSentence: 'Every student takes care of the green vegetables.',
    exampleTranslation: 'Setiap siswa merawat tanaman sayuran yang hijau.',
    isSingleWord: true,
  },
  teacher: {
    word: 'teacher',
    indonesianTranslation: 'guru / pengajar',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Orang yang membimbing, mendidik, dan mengajar siswa di sekolah.',
    exampleSentence: 'The science teacher shows how seeds germinate.',
    exampleTranslation: 'Guru sains menunjukkan bagaimana biji bertunas.',
    isSingleWord: true,
  },
  water: {
    word: 'water',
    indonesianTranslation: 'air / menyirami air',
    partOfSpeech: 'noun (kata benda) & verb (kata kerja)',
    contextMeaning: 'Cairan penting bagi semua makhluk hidup, atau kegiatan menyiram tanaman.',
    exampleSentence: 'Students water the young tomato plants every morning.',
    exampleTranslation: 'Siswa menyirami tanaman tomat muda setiap pagi.',
    isSingleWord: true,
  },
  plant: {
    word: 'plant',
    indonesianTranslation: 'tanaman / tumbuhan / menanam',
    partOfSpeech: 'noun (kata benda) & verb (kata kerja)',
    contextMeaning: 'Makhluk hidup yang tumbuh di tanah dan membutuhkan air serta cahaya matahari.',
    exampleSentence: 'The young tomato plant has small green leaves.',
    exampleTranslation: 'Tanaman tomat muda itu memiliki daun-daun hijau kecil.',
    isSingleWord: true,
  },
  tree: {
    word: 'tree',
    indonesianTranslation: 'pohon',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tanaman berbatang kayu keras dan tinggi dengan dahan-dahan berdaun.',
    exampleSentence: 'Small fruit trees grow near the garden fence.',
    exampleTranslation: 'Pohon-pohon buah kecil tumbuh di dekat pagar kebun.',
    isSingleWord: true,
  },
  flower: {
    word: 'flower',
    indonesianTranslation: 'bunga',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bagian tanaman yang berwarna-warni dan indah dipandang.',
    exampleSentence: 'Bees visit the colorful flowers in the morning.',
    exampleTranslation: 'Lebah-lebah mengunjungi bunga warna-warni di pagi hari.',
    isSingleWord: true,
  },
  vegetable: {
    word: 'vegetable',
    indonesianTranslation: 'sayuran / sayur-mayur',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bagian tanaman yang sehat dan bisa dimasak untuk dimakan.',
    exampleSentence: 'Spinach and carrots are healthy vegetables.',
    exampleTranslation: 'Bayam dan wortel adalah sayuran yang menyehatkan.',
    isSingleWord: true,
  },
  weed: {
    word: 'weed',
    indonesianTranslation: 'gulma / rumput liar pengganggu',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tanaman liar yang tidak diinginkan dan mengambil makanan tanaman kebun.',
    exampleSentence: 'Remove each harmful weed around the vegetables.',
    exampleTranslation: 'Cabutlah setiap rumput liar pengganggu di sekitar sayuran.',
    isSingleWord: true,
  },
  soil: {
    word: 'soil',
    indonesianTranslation: 'tanah subur untuk menanam',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Lapisan atas bumi tempat tanaman menancapkan akar dan bertumbuh.',
    exampleSentence: 'Rich dark soil helps tomato plants grow fast.',
    exampleTranslation: 'Tanah subur yang gembur membantu tanaman tomat tumbuh cepat.',
    isSingleWord: true,
  },
  leaf: {
    word: 'leaf',
    indonesianTranslation: 'daun (jamak: leaves)',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bagian tanaman yang berwarna hijau dan bertugas membuat makanan lewat sinar matahari.',
    exampleSentence: 'A green leaf absorbs warm sunlight.',
    exampleTranslation: 'Sehelai daun hijau menyerap sinar matahari yang hangat.',
    isSingleWord: true,
  },
  leaves: {
    word: 'leaves',
    indonesianTranslation: 'dedaunan (bentuk jamak dari leaf)',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Dedaunan hijau yang tumbuh di dahan pohon dan tanaman.',
    exampleSentence: 'Dried leaves are collected into the compost bin.',
    exampleTranslation: 'Dedaunan kering dikumpulkan ke dalam kotak kompos.',
    isSingleWord: true,
  },
  seed: {
    word: 'seed',
    indonesianTranslation: 'biji / benih',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bagian kecil dari tanaman yang bisa ditanam untuk menumbuhkan tanaman baru.',
    exampleSentence: 'A tiny seed can grow into a large shady tree.',
    exampleTranslation: 'Benih kecil bisa tumbuh menjadi pohon rindang yang besar.',
    isSingleWord: true,
  },
  learn: {
    word: 'learn',
    indonesianTranslation: 'belajar / mendapatkan pengetahuan',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Memperoleh ilmu, pemahaman, atau keterampilan baru.',
    exampleSentence: 'Students learn about nature through gardening activities.',
    exampleTranslation: 'Siswa belajar tentang alam melalui kegiatan berkebun.',
    isSingleWord: true,
  },
  nature: {
    word: 'nature',
    indonesianTranslation: 'alam semesta / alam sekitar',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Segala hal di dunia alami seperti tumbuhan, hewan, air, dan tanah.',
    exampleSentence: 'We should care for nature and protect our planet.',
    exampleTranslation: 'Kita harus merawat alam dan melindungi bumi kita.',
    isSingleWord: true,
  },
  science: {
    word: 'science',
    indonesianTranslation: 'ilmu pengetahuan alam / sains',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Pelajaran tentang bagaimana alam, hewan, dan benda-benda bekerja.',
    exampleSentence: 'Science class teaches us why plants need sunshine.',
    exampleTranslation: 'Kelas sains mengajarkan kita mengapa tanaman butuh sinar matahari.',
    isSingleWord: true,
  },
  cooking: {
    word: 'cooking',
    indonesianTranslation: 'memasak / kegiatan membuat makanan',
    partOfSpeech: 'noun (kata benda) & verb (kata kerja)',
    contextMeaning: 'Menyiapkan dan mengolah bahan makanan agar siap disantap.',
    exampleSentence: 'Fresh vegetables are used in the school cooking activity.',
    exampleTranslation: 'Sayuran segar digunakan dalam kegiatan memasak di sekolah.',
    isSingleWord: true,
  },
  activity: {
    word: 'activity',
    indonesianTranslation: 'kegiatan / aktivitas',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Sesuatu yang dilakukan oleh seseorang atau kelompok untuk tujuan tertentu.',
    exampleSentence: 'Gardening is a fun outdoor learning activity.',
    exampleTranslation: 'Berkebun adalah kegiatan belajar luar ruangan yang menyenangkan.',
    isSingleWord: true,
  },
  save: {
    word: 'save',
    indonesianTranslation: 'menghemat / menyimpan / menyelamatkan',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Menggunakan sesuatu secara bijak agar tidak terbuang sia-sia.',
    exampleSentence: 'Turning off taps helps us save clean water.',
    exampleTranslation: 'Menutup keran air membantu kita menghemat air bersih.',
    isSingleWord: true,
  },
  tap: {
    word: 'tap',
    indonesianTranslation: 'keran air',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Alat pengatur untuk membuka atau menghentikan aliran air pipa.',
    exampleSentence: 'Always close the tap tightly after washing your hands.',
    exampleTranslation: 'Selalu tutup keran air dengan rapat setelah mencuci tangan.',
    isSingleWord: true,
  },
  clean: {
    word: 'clean',
    indonesianTranslation: 'bersih / membersihkan',
    partOfSpeech: 'adjective (kata sifat) & verb (kata kerja)',
    contextMeaning: 'Bebas dari kotoran, atau tindakan menghilangkan kotoran.',
    exampleSentence: 'Students clean the classroom floor with water.',
    exampleTranslation: 'Siswa membersihkan lantai ruang kelas dengan air.',
    isSingleWord: true,
  },
  wash: {
    word: 'wash',
    indonesianTranslation: 'mencuci / membasuh dengan air',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Membersihkan tangan, pakaian, atau sayuran dengan air mengalir.',
    exampleSentence: 'Students wash freshly picked spinach before cooking.',
    exampleTranslation: 'Siswa mencuci bayam yang baru dipetik sebelum dimasak.',
    isSingleWord: true,
  },
  hand: {
    word: 'hand',
    indonesianTranslation: 'tangan (jamak: hands)',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bagian tubuh yang digunakan untuk memegang dan bekerja.',
    exampleSentence: 'Wash your hands with soap and water.',
    exampleTranslation: 'Cucilah tanganmu dengan sabun dan air.',
    isSingleWord: true,
  },
  classroom: {
    word: 'classroom',
    indonesianTranslation: 'ruang kelas',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Ruangan di sekolah tempat murid belajar bersama guru.',
    exampleSentence: 'Our classroom has colorful science posters on the wall.',
    exampleTranslation: 'Ruang kelas kita memiliki poster-poster sains warna-warni di dinding.',
    isSingleWord: true,
  },
  rain: {
    word: 'rain',
    indonesianTranslation: 'hujan / turun hujan',
    partOfSpeech: 'noun (kata benda) & verb (kata kerja)',
    contextMeaning: 'Tetesan air yang jatuh dari awan di langit.',
    exampleSentence: 'When it rains, containers catch fresh water.',
    exampleTranslation: 'Saat turun hujan, wadah-wadah menampung air segar.',
    isSingleWord: true,
  },
  container: {
    word: 'container',
    indonesianTranslation: 'wadah / tempat penampung',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Benda berongga seperti drum atau tong untuk menyimpan barang/cairan.',
    exampleSentence: 'A large container holds clean rainwater for plants.',
    exampleTranslation: 'Wadah besar menampung air hujan bersih untuk tanaman.',
    isSingleWord: true,
  },
  remind: {
    word: 'remind',
    indonesianTranslation: 'mengingatkan',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Menyampaikan pesan agar seseorang tidak lupa akan suatu hal penting.',
    exampleSentence: 'Teachers remind students to turn off lights and taps.',
    exampleTranslation: 'Guru mengingatkan siswa untuk mematikan lampu dan keran.',
    isSingleWord: true,
  },
  difference: {
    word: 'difference',
    indonesianTranslation: 'perbedaan / pengaruh baik',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Perubahan positif yang terjadi karena tindakan baik yang dilakukan.',
    exampleSentence: 'Small daily habits can make a big difference for nature.',
    exampleTranslation: 'Kebiasaan kecil sehari-hari dapat membawa perubahan besar bagi alam.',
    isSingleWord: true,
  },
  important: {
    word: 'important',
    indonesianTranslation: 'penting / bernilai tinggi',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Sesuatu yang memiliki nilai besar dan patut diperhatikan sungguh-sungguh.',
    exampleSentence: 'Water is very important for all living creatures.',
    exampleTranslation: 'Air sangat penting bagi semua makhluk hidup.',
    isSingleWord: true,
  },
  careful: {
    word: 'careful',
    indonesianTranslation: 'hati-hati / cermat / waspada',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Melakukan sesuatu dengan penuh perhatian agar tidak terjadi bahaya atau pemborosan.',
    exampleSentence: 'Be careful when carrying watering cans.',
    exampleTranslation: 'Hati-hatilah saat membawa ceret penyiram tanaman.',
    isSingleWord: true,
  },
  together: {
    word: 'together',
    indonesianTranslation: 'bersama-sama / serempak',
    partOfSpeech: 'adverb (kata keterangan)',
    contextMeaning: 'Bekerja sama dalam satu kelompok tanpa terpisah-pisah.',
    exampleSentence: 'Students and teachers work together in the garden.',
    exampleTranslation: 'Siswa dan guru bekerja bersama-sama di kebun.',
    isSingleWord: true,
  },
  harvest: {
    word: 'harvest',
    indonesianTranslation: 'memanen / memetik hasil kebun',
    partOfSpeech: 'verb (kata kerja) & noun (kata benda)',
    contextMeaning: 'Mengumpulkan buah atau sayuran yang sudah matang dari kebun.',
    exampleSentence: 'The class was excited to harvest crisp red radishes.',
    exampleTranslation: 'Kelas sangat gembira memanen lobak merah yang renyah.',
    isSingleWord: true,
  },
  spinach: {
    word: 'spinach',
    indonesianTranslation: 'bayam (sayuran hijau bergizi)',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Sayuran berdaun hijau lebar yang kaya akan zat besi dan vitamin.',
    exampleSentence: 'Fresh spinach was shared with the school cafeteria.',
    exampleTranslation: 'Bayam segar dibagikan ke kantin sekolah.',
    isSingleWord: true,
  },
  radish: {
    word: 'radish',
    indonesianTranslation: 'lobak (sayuran umbi renyah)',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tanaman umbi renyah berakar bulat merah yang tumbuh di dalam tanah.',
    exampleSentence: 'Crisp red radishes taste delicious in vegetable soup.',
    exampleTranslation: 'Lobak merah yang renyah terasa lezat di dalam sup sayur.',
    isSingleWord: true,
  },
  tomato: {
    word: 'tomato',
    indonesianTranslation: 'tomat (buah sayur berair merah)',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Tanaman yang menghasilkan buah bulat merah berair dan lezat dimakan.',
    exampleSentence: 'Green watering cans give water to the young tomato plants.',
    exampleTranslation: 'Ceret penyiram hijau memberi air untuk tanaman tomat muda.',
    isSingleWord: true,
  },
  compost: {
    word: 'compost',
    indonesianTranslation: 'kompos / pupuk organik alami',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Pupuk alami kaya nutrisi dari daun kering dan sisa kulit buah yang membusuk.',
    exampleSentence: 'Leaves and fruit peels turn into rich compost for the garden.',
    exampleTranslation: 'Dedaunan dan kulit buah berubah menjadi kompos kaya nutrisi untuk kebun.',
    isSingleWord: true,
  },
  access: {
    word: 'access',
    indonesianTranslation: 'mengakses / menjangkau / membuka jalan masuk',
    partOfSpeech: 'verb (kata kerja) & noun (kata benda)',
    contextMeaning: 'Kemampuan untuk membuka, menggunakan, atau mendapatkan sesuatu.',
    exampleSentence: 'Students can access digital learning materials from home.',
    exampleTranslation: 'Siswa dapat mengakses materi belajar digital dari rumah.',
    isSingleWord: true,
  },
  digital: {
    word: 'digital',
    indonesianTranslation: 'serba digital / berbasis teknologi komputer',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Segala hal yang menggunakan layar gawai, komputer, atau internet.',
    exampleSentence: 'Digital books are easy to carry inside a tablet.',
    exampleTranslation: 'Buku digital mudah dibawa di dalam sebuah tablet.',
    isSingleWord: true,
  },
  device: {
    word: 'device',
    indonesianTranslation: 'perangkat elektronik / gawai',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Alat elektronik seperti ponsel pintar atau tablet untuk belajar.',
    exampleSentence: 'Students use their devices to read science articles.',
    exampleTranslation: 'Siswa menggunakan perangkat gawai mereka untuk membaca artikel sains.',
    isSingleWord: true,
  },
  flexible: {
    word: 'flexible',
    indonesianTranslation: 'fleksibel / leluasa / mudah disesuaikan',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Mudah diubah, diatur, atau dipelajari di mana saja tanpa kaku.',
    exampleSentence: 'Digital learning provides flexible study hours for students.',
    exampleTranslation: 'Pembelajaran digital memberikan jam belajar yang fleksibel bagi siswa.',
    isSingleWord: true,
  },
  mangrove: {
    word: 'mangrove',
    indonesianTranslation: 'hutan bakau / tanaman mangrove pesisir',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Pohon khusus berakar kuat yang tumbuh di tepi pantai bersalinitas/air asin.',
    exampleSentence: 'Mangrove forests protect coastal shores from high storm waves.',
    exampleTranslation: 'Hutan mangrove melindungi garis pantai dari gelombang badai yang tinggi.',
    isSingleWord: true,
  },
  barrier: {
    word: 'barrier',
    indonesianTranslation: 'benteng pelindung / pembatas',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Struktur yang menahan, meredam, atau menghalangi bahaya datang.',
    exampleSentence: 'Dense mangrove roots act as a natural wave barrier.',
    exampleTranslation: 'Akar mangrove yang lebat berfungsi sebagai benteng alami peredam ombak.',
    isSingleWord: true,
  },
  thrive: {
    word: 'thrive',
    indonesianTranslation: 'tumbuh subur dan kuat / berkembang pesat',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Tumbuh dengan sangat sehat, kuat, dan berhasil bertahan hidup.',
    exampleSentence: 'Mangrove trees thrive in brackish saltwater swamps.',
    exampleTranslation: 'Pohon mangrove tumbuh subur di rawa air payau yang asin.',
    isSingleWord: true,
  },
  brackish: {
    word: 'brackish',
    indonesianTranslation: 'payau (campuran air tawar dan air laut)',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Air yang agak asin karena percampuran antara air sungai dan air laut.',
    exampleSentence: 'Crabs swim in the shallow brackish water.',
    exampleTranslation: 'Kepiting-kepiting berenang di air payau yang dangkal.',
    isSingleWord: true,
  },
  swamp: {
    word: 'swamp',
    indonesianTranslation: 'rawa-rawa / lahan basah berlumpur',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Lahan tanah basah yang selalu tergenang air dan dipenuhi pepohonan.',
    exampleSentence: 'Mudskippers hop around in the wet mangrove swamp.',
    exampleTranslation: 'Ikan glodok melompat-lompat di rawa mangrove yang basah.',
    isSingleWord: true,
  },
  roots: {
    word: 'roots',
    indonesianTranslation: 'akar-akar pohon',
    partOfSpeech: 'noun (kata benda jamak)',
    contextMeaning: 'Bagian tanaman di bawah tanah atau air yang menopang pohon dan menyerap air.',
    exampleSentence: 'Stilt roots anchor the mangrove tree in soft coastal mud.',
    exampleTranslation: 'Akar tunjang menopang pohon mangrove di lumpur pantai yang lembut.',
    isSingleWord: true,
  },
  wave: {
    word: 'wave',
    indonesianTranslation: 'ombak / gelombang laut',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Aliran air laut yang bergulung-gulung menuju pantai.',
    exampleSentence: 'Mangroves absorb the heavy force of ocean storm waves.',
    exampleTranslation: 'Mangrove meredam kekuatan hantaman gelombang ombak badai samudra.',
    isSingleWord: true,
  },
  erosion: {
    word: 'erosion',
    indonesianTranslation: 'erosi / pengikisan tanah oleh air dan angin',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kondisi tanah pantai yang terkikis dan hanyut terbawa arus air laut.',
    exampleSentence: 'Planting trees helps stop coastal soil erosion.',
    exampleTranslation: 'Menanam pohon membantu menghentikan erosi tanah di pesisir.',
    isSingleWord: true,
  },
  wildlife: {
    word: 'wildlife',
    indonesianTranslation: 'satwa liar / hewan di alam bebas',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hewan-hewan yang hidup bebas di alam tanpa dipelihara manusia.',
    exampleSentence: 'The mangrove swamp is a safe home for coastal wildlife.',
    exampleTranslation: 'Rawa mangrove adalah rumah aman bagi satwa liar pesisir.',
    isSingleWord: true,
  },
  crab: {
    word: 'crab',
    indonesianTranslation: 'kepiting',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hewan air berkaki sepuluh dengan capit keras yang suka merayap di lumpur.',
    exampleSentence: 'Small fiddler crabs crawl between tree roots.',
    exampleTranslation: 'Kepiting-kepiting kecil merayap di antara akar-akar pohon.',
    isSingleWord: true,
  },
  fish: {
    word: 'fish',
    indonesianTranslation: 'ikan',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hewan bertulang belakang yang hidup di air dan bernapas dengan insang.',
    exampleSentence: 'Young fish find shelter among mangrove roots.',
    exampleTranslation: 'Ikan-ikan muda mencari perlindungan di antara akar mangrove.',
    isSingleWord: true,
  },
  bird: {
    word: 'bird',
    indonesianTranslation: 'burung',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hewan bersayap dan berbulu yang bisa terbang di udara.',
    exampleSentence: 'White storks and shore birds nest in tall trees.',
    exampleTranslation: 'Burung bangau putih dan burung pantai bersarang di pohon tinggi.',
    isSingleWord: true,
  },
  food: {
    word: 'food',
    indonesianTranslation: 'makanan / santapan',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bahan yang dimakan oleh manusia dan hewan untuk memberi tenaga hidup.',
    exampleSentence: 'Vegetables from the school garden provide healthy fresh food.',
    exampleTranslation: 'Sayuran dari kebun sekolah menyediakan makanan segar yang sehat.',
    isSingleWord: true,
  },
  help: {
    word: 'help',
    indonesianTranslation: 'membantu / menolong',
    partOfSpeech: 'verb (kata kerja) & noun (kata benda)',
    contextMeaning: 'Memberikan kemudahan atau tenaga untuk meringankan beban orang lain.',
    exampleSentence: 'Students help each other water the garden plants.',
    exampleTranslation: 'Siswa saling membantu menyirami tanaman kebun.',
    isSingleWord: true,
  },
  work: {
    word: 'work',
    indonesianTranslation: 'bekerja / beraktivitas bersama',
    partOfSpeech: 'verb (kata kerja) & noun (kata benda)',
    contextMeaning: 'Melakukan kegiatan dengan mengerahkan tenaga untuk mencapai tujuan.',
    exampleSentence: 'Students and teachers work together to care for the garden.',
    exampleTranslation: 'Siswa dan guru bekerja bersama-sama merawat kebun.',
    isSingleWord: true,
  },
  share: {
    word: 'share',
    indonesianTranslation: 'berbagi / membagikan',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Memberikan sebagian dari apa yang kita miliki kepada orang lain.',
    exampleSentence: 'The class decided to share fresh spinach with the cafeteria.',
    exampleTranslation: 'Kelas memutuskan untuk berbagi bayam segar dengan kantin.',
    isSingleWord: true,
  },
  cooperation: {
    word: 'cooperation',
    indonesianTranslation: 'kerja sama / gotong royong',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Bekerja bersama-sama secara rukun untuk menyelesaikan suatu pekerjaan.',
    exampleSentence: 'Teamwork and cooperation made the garden project successful.',
    exampleTranslation: 'Kerja tim dan kerja sama membuat proyek kebun berhasil.',
    isSingleWord: true,
  },
  responsibility: {
    word: 'responsibility',
    indonesianTranslation: 'tanggung jawab',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kewajiban untuk merawat, menjaga, dan menyelesaikan tugas dengan baik.',
    exampleSentence: 'Taking care of a garden teaches students responsibility.',
    exampleTranslation: 'Merawat kebun mengajarkan tanggung jawab kepada siswa.',
    isSingleWord: true,
  },
  fresh: {
    word: 'fresh',
    indonesianTranslation: 'segar / baru dipetik',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Kondisi makanan atau sayuran yang masih baru dan belum layu.',
    exampleSentence: 'Fresh spinach and crisp radishes taste very sweet.',
    exampleTranslation: 'Bayam segar dan lobak renyah terasa sangat manis.',
    isSingleWord: true,
  },
  healthy: {
    word: 'healthy',
    indonesianTranslation: 'sehat / menyehatkan',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Bagus untuk tubuh dan bebas dari penyakit.',
    exampleSentence: 'Eating fresh vegetables keeps our body healthy.',
    exampleTranslation: 'Makan sayuran segar menjaga tubuh kita tetap sehat.',
    isSingleWord: true,
  },
  small: {
    word: 'small',
    indonesianTranslation: 'kecil',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Ukurannya tidak besar; mungil.',
    exampleSentence: 'Small seeds grow into healthy green plants.',
    exampleTranslation: 'Biji kecil tumbuh menjadi tanaman hijau yang sehat.',
    isSingleWord: true,
  },
  large: {
    word: 'large',
    indonesianTranslation: 'besar / luas',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Ukurannya melebihi ukuran biasa; berkapasitas banyak.',
    exampleSentence: 'The school uses large containers to catch rainwater.',
    exampleTranslation: 'Sekolah menggunakan wadah besar untuk menampung air hujan.',
    isSingleWord: true,
  },
  behind: {
    word: 'behind',
    indonesianTranslation: 'di belakang',
    partOfSpeech: 'preposition (kata depan)',
    contextMeaning: 'Berada di bagian belakang suatu bangunan atau benda.',
    exampleSentence: 'Our school garden is behind the library.',
    exampleTranslation: 'Kebun sekolah kami berada di belakang perpustakaan.',
    isSingleWord: true,
  },
  encourage: {
    word: 'encourage',
    indonesianTranslation: 'mendorong / menganjurkan / memberi semangat',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Mengajak atau menyemangati seseorang agar melakukan perbuatan baik.',
    exampleSentence: 'Teachers encourage students to save water.',
    exampleTranslation: 'Guru mendorong para siswa untuk menghemat air.',
    isSingleWord: true,
  },
  habit: {
    word: 'habit',
    indonesianTranslation: 'kebiasaan sehari-hari',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Hal yang dilakukan berulang kali secara teratur dalam kehidupan sehari-hari.',
    exampleSentence: 'Turning off the tap is a good water-saving habit.',
    exampleTranslation: 'Mematikan keran adalah kebiasaan hemat air yang baik.',
    isSingleWord: true,
  },
  system: {
    word: 'system',
    indonesianTranslation: 'sistem / susunan perangkat yang bekerja bersama',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kumpulan bagian atau alat yang saling terhubung untuk menjalankan fungsi tertentu.',
    exampleSentence: 'The school uses a rainwater collection system.',
    exampleTranslation: 'Sekolah menggunakan sistem penampungan air hujan.',
    isSingleWord: true,
  },
  outdoor: {
    word: 'outdoor',
    indonesianTranslation: 'luar ruangan / di luar gedung',
    partOfSpeech: 'adjective (kata sifat)',
    contextMeaning: 'Berada di udara terbuka di luar bangunan atau ruang kelas.',
    exampleSentence: 'Students clean outdoor areas with collected water.',
    exampleTranslation: 'Siswa membersihkan area luar ruangan dengan air tampungan.',
    isSingleWord: true,
  },
  waste: {
    word: 'waste',
    indonesianTranslation: 'menyia-nyiakan / membuang-buang percuma',
    partOfSpeech: 'verb (kata kerja) & noun (kata benda)',
    contextMeaning: 'Menggunakan sesuatu secara berlebihan hingga terbuang tanpa manfaat.',
    exampleSentence: 'Do not waste clean water when washing hands.',
    exampleTranslation: 'Jangan buang-buang air bersih secara percuma saat mencuci tangan.',
    isSingleWord: true,
  },
  read: {
    word: 'read',
    indonesianTranslation: 'membaca',
    partOfSpeech: 'verb (kata kerja)',
    contextMeaning: 'Melihat dan memahami kata-kata tertulis dalam teks.',
    exampleSentence: 'Students read the story carefully before answering questions.',
    exampleTranslation: 'Siswa membaca cerita itu dengan cermat sebelum menjawab pertanyaan.',
    isSingleWord: true,
  },
  answer: {
    word: 'answer',
    indonesianTranslation: 'jawaban / menjawab',
    partOfSpeech: 'noun (kata benda) & verb (kata kerja)',
    contextMeaning: 'Tanggapan atau pilihan tepat untuk menjawab pertanyaan.',
    exampleSentence: 'Choose the best answer based on the text.',
    exampleTranslation: 'Pilihlah jawaban terbaik berdasarkan teks bacaan.',
    isSingleWord: true,
  },
  question: {
    word: 'question',
    indonesianTranslation: 'pertanyaan / soal',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kalimat yang diajukan untuk menguji pemahaman atau meminta informasi.',
    exampleSentence: 'Think about the main idea before answering each question.',
    exampleTranslation: 'Pikirkan gagasan utama sebelum menjawab setiap pertanyaan.',
    isSingleWord: true,
  },
  evidence: {
    word: 'evidence',
    indonesianTranslation: 'bukti dalam teks / kalimat pendukung',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Kalimat atau fakta langsung dalam bacaan yang membuktikan kebenaran jawabanmu.',
    exampleSentence: 'Can you find the sentence that supports your answer as evidence?',
    exampleTranslation: 'Dapatkah kamu menemukan kalimat di dalam teks sebagai bukti pendukung jawabanmu?',
    isSingleWord: true,
  },
  inference: {
    word: 'inference',
    indonesianTranslation: 'kesimpulan tersirat / simpulan logis',
    partOfSpeech: 'noun (kata benda)',
    contextMeaning: 'Pemahaman yang disimpulkan dari petunjuk-petunjuk dalam teks meskipun tidak tertulis langsung secara harfiah.',
    exampleSentence: 'Inference questions require students to think deeply about text clues.',
    exampleTranslation: 'Pertanyaan inferensi meminta siswa berpikir mendalam berdasarkan petunjuk bacaan.',
    isSingleWord: true,
  },
};

/**
 * Intelligent morphological helper: finds base root for plurals, progressive, past tense, etc.
 */
export function getWordLemma(word: string): string | null {
  const w = word.toLowerCase().trim();
  if (!w || w.length < 3) return null;

  // 1. Common irregulars
  const irregulars: Record<string, string> = {
    children: 'student',
    leaves: 'leaf',
    built: 'build',
    grew: 'grow',
    grown: 'grow',
    taught: 'teach',
    felt: 'feel',
    took: 'take',
    gave: 'give',
    went: 'go',
    came: 'come',
  };
  if (irregulars[w]) return irregulars[w];

  // 2. Plural -ies (e.g. libraries -> library, activities -> activity)
  if (w.endsWith('ies') && w.length > 4) {
    const root = w.slice(0, -3) + 'y';
    if (GRADE_5_DICTIONARY[root]) return root;
  }

  // 3. Progressive -ing (e.g. watering -> water, cleaning -> clean, observing -> observe)
  if (w.endsWith('ing') && w.length > 5) {
    const root = w.slice(0, -3);
    if (GRADE_5_DICTIONARY[root]) return root;
    if (GRADE_5_DICTIONARY[root + 'e']) return root + 'e';
    // Double consonant (e.g. swimming -> swim, dropping -> drop)
    if (root.length > 3 && root[root.length - 1] === root[root.length - 2]) {
      const singleRoot = root.slice(0, -1);
      if (GRADE_5_DICTIONARY[singleRoot]) return singleRoot;
    }
  }

  // 4. Past tense -ed (e.g. collected -> collect, planted -> plant, encouraged -> encourage)
  if (w.endsWith('ed') && w.length > 4) {
    const root = w.slice(0, -2);
    if (GRADE_5_DICTIONARY[root]) return root;
    const rootWithE = w.slice(0, -1);
    if (GRADE_5_DICTIONARY[rootWithE]) return rootWithE;
    if (w.endsWith('ied')) {
      const yRoot = w.slice(0, -3) + 'y';
      if (GRADE_5_DICTIONARY[yRoot]) return yRoot;
    }
  }

  // 5. Plural -es (e.g. radishes -> radish, tomatoes -> tomato, branches -> branch)
  if (w.endsWith('es') && w.length > 4) {
    const root = w.slice(0, -2);
    if (GRADE_5_DICTIONARY[root]) return root;
  }

  // 6. Plural -s (e.g. plants -> plant, taps -> tap, weeds -> weed, trees -> tree, flowers -> flower)
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
    const root = w.slice(0, -1);
    if (GRADE_5_DICTIONARY[root]) return root;
  }

  return null;
}

/**
 * Provides accurate phonetic guide (IPA + child-friendly phonetic respelling)
 * to help elementary Grade 5 students pronounce English reading words.
 */
export function getWordPronunciation(word: string): string {
  const w = word.toLowerCase().trim().replace(/[^a-z]/g, '');
  if (!w) return '';

  const PRONUNCIATIONS: Record<string, string> = {
    garden: '/ˈɡɑːr.dən/ [GAHR-dn]',
    observe: '/əbˈzɜːrv/ [uhb-ZURV]',
    observes: '/əbˈzɜːrvz/ [uhb-ZURVZ]',
    observing: '/əbˈzɜːr.vɪŋ/ [uhb-ZUR-ving]',
    observation: '/ˌɑːb.zərˈveɪ.ʃən/ [ahb-zur-VAY-shn]',
    beautiful: '/ˈbjuː.tɪ.fəl/ [BYOO-tih-fuhl]',
    grow: '/ɡroʊ/ [GROH]',
    grows: '/ɡroʊz/ [GROHZ]',
    growing: '/ˈɡroʊ.ɪŋ/ [GROH-ing]',
    growth: '/ɡroʊθ/ [GROHTH]',
    weeds: '/wiːdz/ [WEEDZ]',
    weed: '/wiːd/ [WEED]',
    water: '/ˈwɔː.tər/ [WAW-ter]',
    waters: '/ˈwɔː.tərz/ [WAW-terz]',
    watering: '/ˈwɔː.tər.ɪŋ/ [WAW-ter-ing]',
    nature: '/ˈneɪ.tʃər/ [NAY-chur]',
    science: '/ˈsaɪ.əns/ [SY-uhns]',
    vegetable: '/ˈvedʒ.tə.bəl/ [VEJ-tuh-bl]',
    vegetables: '/ˈvedʒ.tə.bəlz/ [VEJ-tuh-blz]',
    teacher: '/ˈtiː.tʃər/ [TEE-chur]',
    teachers: '/ˈtiː.tʃərz/ [TEE-churz]',
    library: '/ˈlaɪ.brer.i/ [LY-brer-ee]',
    cooking: '/ˈkʊk.ɪŋ/ [KUUK-ing]',
    activity: '/ækˈtɪv.ə.ti/ [ak-TIV-uh-tee]',
    activities: '/ækˈtɪv.ə.tiz/ [ak-TIV-uh-teez]',
    student: '/ˈstuː.dənt/ [STOO-duhnt]',
    students: '/ˈstuː.dənts/ [STOO-duhnts]',
    school: '/skuːl/ [SKOOL]',
    save: '/seɪv/ [SAYV]',
    saving: '/ˈseɪ.vɪŋ/ [SAY-ving]',
    saved: '/seɪvd/ [SAYVD]',
    tap: '/tæp/ [TAP]',
    taps: '/tæps/ [TAPS]',
    rain: '/reɪn/ [RAYN]',
    rains: '/reɪnz/ [RAYNZ]',
    rainwater: '/ˈreɪnˌwɔː.tər/ [RAYN-waw-ter]',
    container: '/kənˈteɪ.nər/ [kuhn-TAY-nur]',
    containers: '/kənˈteɪ.nərz/ [kuhn-TAY-nurz]',
    careful: '/ˈker.fəl/ [KAIR-fuhl]',
    carefully: '/ˈker.fəl.i/ [KAIR-fuh-lee]',
    remind: '/rɪˈmaɪnd/ [rih-MYND]',
    reminds: '/rɪˈmaɪndz/ [rih-MYNDZ]',
    difference: '/ˈdɪf.ər.əns/ [DIF-er-uhns]',
    protect: '/prəˈtekt/ [pruh-TEKT]',
    protects: '/prəˈtekts/ [pruh-TEKTS]',
    protecting: '/prəˈtek.tɪŋ/ [pruh-TEK-ting]',
    resource: '/ˈriː.sɔːrs/ [REE-sors]',
    resources: '/ˈriː.sɔːr.sɪz/ [REE-sor-siz]',
    encourage: '/ɪnˈkɜːr.ɪdʒ/ [in-KUR-ij]',
    encouraged: '/ɪnˈkɜːr.ɪdʒd/ [in-KUR-ijd]',
    collect: '/kəˈlekt/ [kuh-LEKT]',
    collected: '/kəˈlek.tɪd/ [kuh-LEK-tid]',
    important: '/ɪmˈpɔːr.tənt/ [im-POR-tnt]',
    clean: '/kliːn/ [KLEEN]',
    cleaning: '/ˈkliː.nɪŋ/ [KLEE-ning]',
    wash: '/wɑːʃ/ [WAWSH]',
    washing: '/ˈwɑː.ʃɪŋ/ [WAW-shing]',
    hand: '/hænd/ [HAND]',
    hands: '/hændz/ [HANDZ]',
    action: '/ˈæk.ʃən/ [AK-shn]',
    actions: '/ˈæk.ʃənz/ [AK-shnz]',
    digital: '/ˈdɪdʒ.ɪ.təl/ [DIJ-ih-tl]',
    device: '/dɪˈvaɪs/ [dih-VYS]',
    devices: '/dɪˈvaɪ.sɪz/ [dih-VY-siz]',
    flexible: '/ˈflek.sə.bəl/ [FLEK-suh-bl]',
    access: '/ˈæk.ses/ [AK-ses]',
    material: '/məˈtɪr.i.əl/ [muh-TEER-ee-uhl]',
    materials: '/məˈtɪr.i.əlz/ [muh-TEER-ee-uhlz]',
    platform: '/ˈplæt.fɔːrm/ [PLAT-form]',
    platforms: '/ˈplæt.fɔːrmz/ [PLAT-formz]',
    mangrove: '/ˈmæŋ.ɡroʊv/ [MANG-grohv]',
    mangroves: '/ˈmæŋ.ɡroʊvz/ [MANG-grohvz]',
    barrier: '/ˈbær.i.ər/ [BAIR-ee-ur]',
    barriers: '/ˈbær.i.ərz/ [BAIR-ee-urz]',
    thrive: '/θraɪv/ [THRYV]',
    thrives: '/θraɪvz/ [THRYVZ]',
    brackish: '/ˈbræk.ɪʃ/ [BRAK-ish]',
    swamp: '/swɑːmp/ [SWAHMP]',
    swamps: '/swɑːmps/ [SWAHMPS]',
    erosion: '/ɪˈroʊ.ʒən/ [ih-ROH-zhn]',
    roots: '/ruːts/ [ROOTS]',
    root: '/ruːt/ [ROOT]',
    wave: '/weɪv/ [WAYV]',
    waves: '/weɪvz/ [WAYVZ]',
    canopy: '/ˈkæn.ə.pi/ [KAN-uh-pee]',
    sturdy: '/ˈstɜːr.di/ [STUR-dee]',
    harvest: '/ˈhɑːr.vəst/ [HAR-vist]',
    harvested: '/ˈhɑːr.və.stɪd/ [HAR-vih-stid]',
    cooperation: '/koʊˌɑː.pəˈreɪ.ʃən/ [koh-ah-puh-RAY-shn]',
    responsibility: '/rɪˌspɑːn.səˈbɪl.ə.ti/ [rih-spahn-suh-BIL-uh-tee]',
    habit: '/ˈhæb.ɪt/ [HAB-it]',
    habits: '/ˈhæb.ɪts/ [HAB-its]',
    system: '/ˈsɪs.təm/ [SIS-tuhm]',
    systems: '/ˈsɪs.təmz/ [SIS-tuhmz]',
    outdoor: '/ˈaʊtˌdɔːr/ [OWT-dor]',
    waste: '/weɪst/ [WAYST]',
    wasted: '/ˈweɪ.stɪd/ [WAY-stid]',
    evidence: '/ˈev.ə.dəns/ [EV-ih-dns]',
    inference: '/ˈɪn.fər.əns/ [IN-fer-ns]',
    question: '/ˈkwes.tʃən/ [KWES-chn]',
    questions: '/ˈkwes.tʃənz/ [KWES-chnz]',
    answer: '/ˈæn.sər/ [AN-sur]',
    answers: '/ˈæn.sərz/ [AN-surz]',
    behind: '/bɪˈhaɪnd/ [bih-HYND]',
    several: '/ˈsev.ər.əl/ [SEV-er-uhl]',
    sometimes: '/ˈsʌm.taɪmz/ [SUHM-tymz]',
    elementary: '/ˌel.əˈmen.tər.i/ [el-uh-MEN-tuh-ree]',
    valley: '/ˈvæl.i/ [VAL-ee]',
    plant: '/plænt/ [PLANT]',
    plants: '/plænts/ [PLANTS]',
    tree: '/triː/ [TREE]',
    trees: '/triːz/ [TREEZ]',
    flower: '/ˈflaʊ.ər/ [FLOW-er]',
    flowers: '/ˈflaʊ.ərz/ [FLOW-erz]',
    soil: '/sɔɪl/ [SOYL]',
    leaf: '/liːf/ [LEEF]',
    leaves: '/liːvz/ [LEEVZ]',
    seed: '/siːd/ [SEED]',
    seeds: '/siːdz/ [SEEDZ]',
    radish: '/ˈræd.ɪʃ/ [RAD-ish]',
    radishes: '/ˈræd.ɪ.ʃɪz/ [RAD-ih-shiz]',
    spinach: '/ˈspɪn.ɪtʃ/ [SPIN-ich]',
    tomato: '/təˈmeɪ.toʊ/ [tuh-MAY-toh]',
    tomatoes: '/təˈmeɪ.toʊz/ [tuh-MAY-tohz]',
    compost: '/ˈkɑːm.poʊst/ [KAHM-pohst]',
    wildlife: '/ˈwaɪld.laɪf/ [WYLD-lyf]',
    crab: '/kræb/ [KRAB]',
    crabs: '/kræbz/ [KRABZ]',
    fish: '/fɪʃ/ [FISH]',
    bird: '/bɜːrd/ [BURD]',
    birds: '/bɜːrdz/ [BURDZ]',
    food: '/fuːd/ [FOOD]',
    help: '/help/ [HELP]',
    helps: '/helps/ [HELPS]',
    work: '/wɜːrk/ [WURK]',
    works: '/wɜːrks/ [WURKS]',
    share: '/ʃer/ [SHAIR]',
    shares: '/ʃerz/ [SHAIRZ]',
    shared: '/ʃerd/ [SHAIRD]',
    fresh: '/freʃ/ [FRESH]',
    healthy: '/ˈhel.θi/ [HEL-thee]',
    small: '/smɔːl/ [SMAWL]',
    large: '/lɑːrdʒ/ [LAHRJ]',
  };

  if (PRONUNCIATIONS[w]) {
    return PRONUNCIATIONS[w];
  }

  // Check base root without suffix
  if (w.endsWith('ing') && PRONUNCIATIONS[w.slice(0, -3)]) {
    return PRONUNCIATIONS[w.slice(0, -3)] + ' + -ing';
  }
  if (w.endsWith('ed') && PRONUNCIATIONS[w.slice(0, -2)]) {
    return PRONUNCIATIONS[w.slice(0, -2)] + ' + -ed';
  }
  if (w.endsWith('s') && PRONUNCIATIONS[w.slice(0, -1)]) {
    return PRONUNCIATIONS[w.slice(0, -1)] + ' + -s';
  }

  // Kid-friendly phonics fallback
  return `/${w}/ [${w.toUpperCase()}]`;
}

/**
 * Translate a single English word to Indonesian for Grade 5 students.
 * Enforces per-kata translation constraint with local dictionary + lemmatizer + server-side AI fallback.
 */
export async function translateWordToIndonesian(
  input: string,
  passageContext?: string
): Promise<WordTranslationResult> {
  const trimmed = input.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);

  // Guardrail: Word-by-word constraint
  if (words.length > 2) {
    return {
      word: trimmed,
      indonesianTranslation: '',
      partOfSpeech: '',
      contextMeaning: '',
      exampleSentence: '',
      exampleTranslation: '',
      isSingleWord: false,
      warningMessage:
        'Kotak ini khusus menerjemahkan per kata (satu kata). Silakan masukkan 1 kata bahasa Inggris yang ingin dipahami artinya!',
    };
  }

  const cleanWord = words[0]?.toLowerCase().replace(/[.,!?;:'"()[\]]/g, '') || '';
  if (!cleanWord) {
    return {
      word: '',
      indonesianTranslation: '',
      partOfSpeech: '',
      contextMeaning: '',
      exampleSentence: '',
      exampleTranslation: '',
      isSingleWord: false,
    };
  }

  // 1. Check local pre-indexed dictionary first
  if (GRADE_5_DICTIONARY[cleanWord]) {
    const entry = GRADE_5_DICTIONARY[cleanWord];
    return {
      ...entry,
      pronunciation: entry.pronunciation || getWordPronunciation(cleanWord),
    };
  }

  // 1b. Check lemmatized / normalized root form
  const lemma = getWordLemma(cleanWord);
  if (lemma && GRADE_5_DICTIONARY[lemma]) {
    const baseEntry = GRADE_5_DICTIONARY[lemma];
    return {
      ...baseEntry,
      word: cleanWord,
      pronunciation: getWordPronunciation(cleanWord),
      contextMeaning: `Bentuk kata dari "${lemma}": ${baseEntry.contextMeaning}`,
    };
  }

  // 2. Call server-side API proxy /api/translate if available
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: cleanWord, context: passageContext }),
    });
    if (res.ok) {
      const data = await res.json();
      if (
        data &&
        data.indonesianTranslation &&
        data.indonesianTranslation !== cleanWord &&
        !data.indonesianTranslation.startsWith('kata "')
      ) {
        const fullData = {
          ...data,
          pronunciation: data.pronunciation || getWordPronunciation(cleanWord),
        };
        // Cache in local dictionary for fast future lookups
        GRADE_5_DICTIONARY[cleanWord] = fullData;
        return fullData;
      }
    }
  } catch (err) {
    // Server route unavailable or fetch error, proceed to public fallback
  }

  // 2b. Free public translation fallback (No API Key required, works directly in browser)
  try {
    const freeRes = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|id`
    );
    if (freeRes.ok) {
      const freeData = (await freeRes.json()) as any;
      const translatedText = freeData?.responseData?.translatedText;
      if (
        translatedText &&
        typeof translatedText === 'string' &&
        translatedText.toLowerCase().trim() !== cleanWord &&
        !translatedText.toLowerCase().includes('is invalid')
      ) {
        const cleanTranslation = translatedText.toLowerCase().trim();
        const autoResult: WordTranslationResult = {
          word: cleanWord,
          indonesianTranslation: cleanTranslation,
          partOfSpeech: 'kosa kata teks bacaan',
          pronunciation: getWordPronunciation(cleanWord),
          contextMeaning: `Arti kata "${cleanWord}" adalah "${cleanTranslation}". Coba baca kembali kalimatnya untuk memahami maksud isi teks secara utuh.`,
          exampleSentence: `Students can understand the word "${cleanWord}" from this sentence.`,
          exampleTranslation: `Siswa dapat memahami arti kata "${cleanWord}" dari kalimat ini.`,
          isSingleWord: true,
        };
        // Cache in dictionary
        GRADE_5_DICTIONARY[cleanWord] = autoResult;
        return autoResult;
      }
    }
  } catch (freeErr) {
    // Continue to smart context fallback
  }

  // 3. Intelligent fallback with kid-friendly context explanation
  return {
    word: cleanWord,
    indonesianTranslation: cleanWord,
    partOfSpeech: 'kosa kata teks bacaan',
    pronunciation: getWordPronunciation(cleanWord),
    contextMeaning: `Kata "${cleanWord}" digunakan dalam teks bacaan bahasa Inggris. Coba baca kembali kalimat di mana kata ini berada untuk memahami maksud penulis berdasarkan petunjuk konteks di sekitarnya.`,
    exampleSentence: `Students can understand "${cleanWord}" from the sentence clues.`,
    exampleTranslation: `Siswa dapat memahami arti "${cleanWord}" dari petunjuk kalimat di sekitarnya.`,
    isSingleWord: true,
  };
}

export async function consultAIRead(req: AIReadRequest): Promise<AIReadResponse> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;

  if (apiKey && (req.action === 'free_question' || req.action === 'explain_vocabulary')) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Passage Title: ${req.passage.title}
Passage Text:
${req.passage.paragraphs.map((p) => `[Paragraph ${p.number}]: ${p.text}`).join('\n\n')}

Current Question: ${req.currentQuestion ? `${req.currentQuestion.questionText} (Skill: ${req.currentQuestion.skill}, Target Paragraph: ${req.currentQuestion.targetParagraph})` : 'Reading phase'}

User Action: ${req.action}
User message / Target: ${req.userMessage || req.targetWord || 'Need assistance'}

Respond as AI-READ following the system prompt rules strictly. Keep it short, kid-friendly (Grade 5), and never give the answer.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: AI_READ_SYSTEM_PROMPT,
          maxOutputTokens: 250,
          temperature: 0.3,
        },
      });

      if (response.text) {
        return {
          message: response.text.trim(),
          suggestedParagraph: req.currentQuestion?.targetParagraph,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to pedagogical rule engine:', err);
    }
  }

  return handlePedagogicalRuleEngine(req);
}

function handlePedagogicalRuleEngine(req: AIReadRequest): AIReadResponse {
  const { action, passage, currentQuestion, selectedOptionKey, attemptNumber = 1, targetWord } = req;

  // 1. Vocabulary explanation in context
  if (action === 'explain_vocabulary' && targetWord) {
    const vocab = passage.vocabularyList.find(
      (v) => v.word.toLowerCase() === targetWord.toLowerCase()
    );
    if (vocab) {
      return {
        message: `In paragraph ${vocab.paragraph}, "${vocab.word}" means: ${vocab.meaning} For example: "${vocab.example}" 🌟`,
        suggestedParagraph: vocab.paragraph,
      };
    }
    return {
      message: `The word "${targetWord}" is used in our story. Look at the sentence around it to see what clues the author gives you!`,
    };
  }

  // 2. Request hint for the current question
  if (action === 'request_hint' && currentQuestion) {
    const hint1Text = currentQuestion.hint1 || currentQuestion.hint;
    const hint2Text = currentQuestion.hint2 || currentQuestion.hint;
    if (attemptNumber <= 1) {
      return {
        message: `Here is a hint for you: ${hint1Text} Look closely at [Paragraph ${currentQuestion.targetParagraph}].`,
        hintLevel: 1,
        suggestedParagraph: currentQuestion.targetParagraph,
      };
    } else {
      return {
        message: `Here is a stronger clue: ${hint2Text} Re-read [Paragraph ${currentQuestion.targetParagraph}] carefully!`,
        hintLevel: 2,
        suggestedParagraph: currentQuestion.targetParagraph,
      };
    }
  }

  // 3. Check answer when student selects/submits an option
  if (action === 'check_answer' && currentQuestion && selectedOptionKey) {
    const isCorrect = selectedOptionKey === currentQuestion.correctKey;
    const hint1Text = currentQuestion.hint1 || currentQuestion.hint;
    const hint2Text = currentQuestion.hint2 || currentQuestion.hint;

    if (isCorrect) {
      return {
        isCorrect: true,
        message: `Good job! Your answer matches the information in paragraph ${currentQuestion.targetParagraph}. 👏`,
        askForEvidence: true,
        evidenceSentence: currentQuestion.correctEvidenceSentence,
        suggestedParagraph: currentQuestion.targetParagraph,
        allowRetry: false,
      };
    } else {
      if (attemptNumber === 1) {
        return {
          isCorrect: false,
          message: `Try again. Look at paragraph ${currentQuestion.targetParagraph} and find the clue mentioned by the writer: "${hint1Text}"`,
          hintLevel: 1,
          suggestedParagraph: currentQuestion.targetParagraph,
          allowRetry: true,
        };
      } else {
        return {
          isCorrect: false,
          message: `Good try! Take another close look at paragraph ${currentQuestion.targetParagraph}. Remember: ${hint2Text} Think about which part supports your answer.`,
          hintLevel: 2,
          suggestedParagraph: currentQuestion.targetParagraph,
          allowRetry: true,
        };
      }
    }
  }

  // 4. Evidence Guide
  if (action === 'request_evidence_guide' && currentQuestion) {
    return {
      message: `Which part of the text supports your answer? Look at paragraph ${currentQuestion.targetParagraph} and find the sentence that proves your choice! 🔎`,
      suggestedParagraph: currentQuestion.targetParagraph,
      evidenceSentence: currentQuestion.correctEvidenceSentence,
    };
  }

  return {
    message: 'Hello! I am AI-READ, your reading assistant. Read the text carefully. I can explain difficult words, give you hints, and help you find evidence!',
  };
}
