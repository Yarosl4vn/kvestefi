// ==========================================================================
// ДАННЫЕ И СПРАВОЧНИКИ ПЛАТФОРМЫ КВЕСТЕФИ (г. Мытищи, ReadySquad)
// ==========================================================================

export const SUBJECTS = [
  { id: 'math', name: 'Математика', icon: '📐', color: '#6366F1', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'rus', name: 'Русский язык', icon: '📖', color: '#EC4899', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'phys', name: 'Физика', icon: '⚡', color: '#F59E0B', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'info', name: 'Информатика', icon: '💻', color: '#06B6D4', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'hist', name: 'История', icon: '🏛️', color: '#8B5CF6', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'bio', name: 'Биология', icon: '🌿', color: '#10B981', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'chem', name: 'Химия', icon: '🧪', color: '#14B8A6', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'social', name: 'Обществознание', icon: '⚖️', color: '#F97316', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'geo', name: 'География', icon: '🌍', color: '#3B82F6', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'eng', name: 'Английский язык', icon: '🇬🇧', color: '#EF4444', exams: ['ОГЭ', 'ЕГЭ'] },
  { id: 'lit', name: 'Литература', icon: '📜', color: '#D946EF', exams: ['ОГЭ', 'ЕГЭ'] }
];

export const SCHOOLS = [
  { code: 'KVDEV', name: 'ReadySquad Platform & Support' },
  { code: '201026', name: 'МБОУ «СОШ № 29» г. Мытищи' },
  { code: 'SCH01', name: 'МБОУ «Гимназия № 1»' },
  { code: 'SCH02', name: 'МБОУ «Лицей № 2»' },
  { code: 'SCH03', name: 'МБОУ «СОШ № 3 им. Б. А. Феофанова»' },
  { code: 'SCH04', name: 'МБОУ «СОШ № 4»' },
  { code: 'SCH05', name: 'МБОУ «СОШ № 5»' },
  { code: 'SCH06', name: 'МБОУ «СОШ № 6»' },
  { code: 'SCH07', name: 'МБОУ «СОШ № 7»' },
  { code: 'SCH08', name: 'МБОУ «СОШ № 8»' },
  { code: 'SCH09', name: 'МБОУ «СОШ № 9»' },
  { code: 'SCH10', name: 'МБОУ «СОШ № 10 им. А. К. Астрахова»' },
  { code: 'SCH11', name: 'МБОУ «СОШ № 12»' },
  { code: 'SCH12', name: 'МБОУ «Школа для обучающихся с ОВЗ»' },
  { code: 'SCH13', name: 'МБОУ «СОШ № 14»' },
  { code: 'SCH14', name: 'МБОУ «Лицей № 15»' },
  { code: 'SCH15', name: 'МБОУ «Гимназия № 16»' },
  { code: 'SCH16', name: 'МБОУ «Гимназия № 17»' },
  { code: 'SCH17', name: 'МБОУ «СОШ № 19»' },
  { code: 'SCH18', name: 'МБОУ «СОШ № 22»' },
  { code: 'SCH19', name: 'МБОУ «Лицей № 23»' },
  { code: 'SCH20', name: 'МБОУ «СОШ № 24»' },
  { code: 'SCH21', name: 'МБОУ «СОШ № 25»' },
  { code: 'SCH22', name: 'МБОУ «СОШ № 26»' },
  { code: 'SCH23', name: 'МБОУ «СОШ № 27»' },
  { code: 'SCH24', name: 'МБОУ «СОШ № 28»' },
  { code: 'SCH25', name: 'МБОУ «СОШ № 29»' },
  { code: 'SCH26', name: 'МБОУ «СОШ № 30»' },
  { code: 'SCH27', name: 'МБОУ «СОШ № 31»' },
  { code: 'SCH28', name: 'МБОУ «СОШ № 32 им. В. В. Волошиной»' },
  { code: 'SCH29', name: 'МБОУ «СОШ № 33»' },
  { code: 'SCH30', name: 'МБОУ «СОШ № 34»' },
  { code: 'SCH31', name: 'МБОУ «СОШ № 35»' },
  { code: 'SCH32', name: 'МБОУ «Марфинская СОШ»' },
  { code: 'SCH33', name: 'МБОУ «Белорастовская ООШ»' },
  { code: 'SCH34', name: 'МБОУ «Погорельская СОШ»' },
  { code: 'SCH35', name: 'МБОУ «Пироговская СОШ»' },
  { code: 'SCH36', name: 'МБОУ «Федоскинская СОШ»' },
  { code: 'SCH37', name: 'МБОУ «Новосельцевская СОШ»' },
  { code: 'SCH38', name: 'МБОУ «Останкинская СОШ»' },
  { code: 'SCH39', name: 'МБОУ «Школа № 39»' }
];

export const COMPETITIONS = [
  {
    id: 1,
    title: 'Интеллектуальный Олимп Мытищ 2026',
    desc: 'Главный общегородской межшкольный турнир по естественно-научным и гуманитарным дисциплинам.',
    badge: '🏆',
    subject: 'all',
    rounds: 3,
    round1_open: true,
    round2_open: true,
    round3_open: false,
    tasksPerRound: 10,
    prizeGold: 'Кубок Победителя + Золотая медаль + 10,000 очков школе',
    prizeSilver: 'Серебряная медаль + Диплом II степени + 7,000 очков',
    prizeBronze: 'Бронзовая медаль + Диплом III степени + 5,000 очков'
  },
  {
    id: 2,
    title: 'Битва Знатоков Яузы',
    desc: 'Соревнование по математике, логике и информатике среди старшеклассников г. Мытищи.',
    badge: '⚡',
    subject: 'math',
    rounds: 3,
    round1_open: true,
    round2_open: false,
    round3_open: false,
    tasksPerRound: 8,
    prizeGold: 'Кубок Мытищинского ИТ-Кластера + 8,000 очков',
    prizeSilver: 'Диплом финалиста + 5,000 очков',
    prizeBronze: 'Диплом призёра + 3,000 очков'
  },
  {
    id: 3,
    title: 'Кубок Грамотеев Подмосковья',
    desc: 'Олимпиада по русскому языку и литературе. Комплексный лингвистический анализ.',
    badge: '📚',
    subject: 'rus',
    rounds: 3,
    round1_open: true,
    round2_open: true,
    round3_open: false,
    tasksPerRound: 10,
    prizeGold: 'Золотое Перо Мытищ + 8,000 очков',
    prizeSilver: 'Серебряное Перо + 5,000 очков',
    prizeBronze: 'Бронзовое Перо + 3,000 очков'
  },
  {
    id: 4,
    title: 'Лига Естествоиспытателей',
    desc: 'Комплексный турнир по физике, химии и биологии.',
    badge: '🔬',
    subject: 'phys',
    rounds: 3,
    round1_open: true,
    round2_open: false,
    round3_open: false,
    tasksPerRound: 10,
    prizeGold: 'Кубок Архимеда + 8,000 очков',
    prizeSilver: 'Диплом II степени + 5,000 очков',
    prizeBronze: 'Диплом III степени + 3,000 очков'
  },
  {
    id: 5,
    title: 'Исторический Форпост',
    desc: 'Интеллектуальная дуэль по истории России и обществознанию.',
    badge: '🛡️',
    subject: 'hist',
    rounds: 3,
    round1_open: true,
    round2_open: false,
    round3_open: false,
    tasksPerRound: 10,
    prizeGold: 'Орден Мудрости + 7,500 очков',
    prizeSilver: 'Медаль Знатока Истории + 5,000 очков',
    prizeBronze: 'Диплом призёра + 3,000 очков'
  }
];

export const BADGES = [
  { id: 'first_quest', icon: '🎯', name: 'Первый шаг', desc: 'Успешно решён первый квест' },
  { id: 'streak_3', icon: '🔥', name: 'Огненная серия', desc: '3 дня занятий подряд' },
  { id: 'math_master', icon: '📐', name: 'Мастер формул', desc: 'Решено 50 задач по математике' },
  { id: 'rus_expert', icon: '📖', name: 'Знаток родной речи', desc: 'Решено 50 заданий по русскому языку' },
  { id: 'duel_winner', icon: '⚔️', name: 'Непобедимый дуэлянт', desc: 'Победа в 5 дружеских забегах' },
  { id: 'top_school', icon: '🏫', name: 'Гордость школы', desc: 'Попадание в топ-3 своей школы' },
  { id: 'kvest_veteran', icon: '🎖️', name: 'Ветеран Квестефи', desc: 'Достигнуть 1000-го уровня в Квестефи' },
  { id: 'olympiad_champ', icon: '👑', name: 'Чемпион Мытищ', desc: '1-е место в межшкольном турнире' }
];

// Уровневая система 1..2000
export const LEVELING = {
  MAX: 2000,
  STEPS: [0, 100, 250, 450, 700, 1000, 1500, 2200, 3000, 4000, 5000],

  level(score) {
    if (score <= 0) return 1;
    if (score < 5000) {
      let lvl = 1;
      while (lvl < 10 && score >= this.STEPS[lvl]) lvl++;
      return lvl;
    }
    const lvl = 10 + Math.floor((score - 4000) / 150);
    return Math.min(Math.max(lvl, 1), this.MAX);
  },

  startScore(level) {
    if (level <= 10) return this.STEPS[Math.min(Math.max(level - 1, 0), 9)];
    return 4000 + (level - 10) * 150;
  },

  nextScore(level) {
    if (level < 10) return this.STEPS[Math.min(Math.max(level, 0), 10)];
    return 4000 + (level - 9) * 150;
  },

  title(level) {
    if (level === 1) return 'Новичок';
    if (level === 2) return 'Ученик';
    if (level === 3) return 'Практик';
    if (level === 4) return 'Знаток';
    if (level === 5) return 'Отличник';
    if (level === 6) return 'Эрудит';
    if (level === 7) return 'Эксперт';
    if (level === 8) return 'Мастер';
    if (level === 9) return 'Гроссмейстер';
    if (level >= 10 && level < 25) return 'Магистр Квестефи';
    if (level >= 25 && level < 50) return 'Академик Знаний';
    if (level >= 50 && level < 100) return 'Профессор Наук';
    if (level >= 100 && level < 250) return 'Титан Мышления';
    if (level >= 250 && level < 500) return 'Архитектор Будущего';
    if (level >= 500 && level < 1000) return 'Гранд-Магистр Олимпа';
    if (level >= 1000 && level < 1500) return 'Ветеран Квестефи';
    if (level >= 1500 && level < 2000) return 'Повелитель Знаний';
    return 'Абсолютная Легенда ReadySquad';
  }
};
