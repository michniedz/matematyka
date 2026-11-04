export const LINE_MODES = [
  {
    id: 'mixed',
    name: 'Wszystko mieszane',
    glyph: '🎲',
    color: 'rose',
    description:
      'Losowo proste, odcinki, kąty α i β, przecięcia prostych oraz kąty w figurach.',
  },
  {
    id: 'basics',
    name: 'Proste i odcinki',
    glyph: '—',
    color: 'violet',
    description:
      'Prosta, półprosta, odcinek, proste prostopadłe i równoległe. Rozpoznawaj oznaczenia.',
  },
  {
    id: 'alpha-beta',
    name: 'Kąty α i β',
    glyph: 'α',
    color: 'rose',
    description:
      'Co oznaczają greckie litery przy kątach? Kąty przyległe, wierzchołkowe i wewnętrzne.',
  },
  {
    id: 'intersections',
    name: 'Przecięcia prostych',
    glyph: '✕',
    color: 'mint',
    description:
      'Dwie proste lub odcinki przecinają się. Mając jeden kąt, oblicz pozostałe.',
  },
  {
    id: 'polygons',
    name: 'Kąty w figurach',
    glyph: '△',
    color: 'amber',
    description:
      'Suma kątów w trójkącie i czworokącie. Znajdź brakujący kąt.',
  },
]

export const BASIC_TASKS = [
  {
    id: 'line',
    diagram: 'line',
    title: 'Prosta',
    prompt: 'Co przedstawia rysunek?',
    answer: 'prosta',
    distractors: ['odcinek', 'półprosta'],
    hint: 'Zwróć uwagę, czy linia ma początek i koniec.',
    explanation:
      'Prosta nie ma początku ani końca — przedłuża się w obie strony.',
  },
  {
    id: 'segment',
    diagram: 'segment',
    title: 'Odcinek',
    prompt: 'Co przedstawia rysunek?',
    answer: 'odcinek',
    distractors: ['prosta', 'półprosta'],
    hint: 'Policz końce zaznaczone na rysunku.',
    explanation:
      'Odcinek ma dwa końce. To fragment prostej między tymi punktami.',
  },
  {
    id: 'ray',
    diagram: 'ray',
    title: 'Półprosta',
    prompt: 'Co przedstawia rysunek?',
    answer: 'półprosta',
    distractors: ['prosta', 'odcinek'],
    hint: 'Jedna strona ma początek, a druga biegnie dalej bez końca.',
    explanation:
      'Półprosta ma początek, ale nie ma końca — biegnie w jedną stronę.',
  },
  {
    id: 'perpendicular',
    diagram: 'perpendicular',
    title: 'Proste prostopadłe',
    prompt: 'Jak nazywamy te proste?',
    answer: 'proste prostopadłe',
    distractors: ['proste równoległe', 'proste przecinające się pod kątem ostrym'],
    hint: 'Popatrz na kąt w miejscu przecięcia.',
    explanation:
      'Proste prostopadłe przecinają się pod kątem prostym, czyli 90°.',
  },
  {
    id: 'parallel',
    diagram: 'parallel',
    title: 'Proste równoległe',
    prompt: 'Jak nazywamy te proste?',
    answer: 'proste równoległe',
    distractors: ['proste prostopadłe', 'proste przecinające się'],
    hint: 'Czy te proste kiedykolwiek się przetną?',
    explanation:
      'Proste równoległe nie przecinają się — zachowują tę samą odległość.',
  },
  {
    id: 'crossing-segments',
    diagram: 'crossing-segments',
    title: 'Punkt przecięcia',
    prompt: 'Co powstaje w miejscu przecięcia dwóch odcinków?',
    answer: 'punkt przecięcia',
    distractors: ['kąt prosty', 'prosta równoległa'],
    hint: 'To jedno miejsce, w którym odcinki się spotykają.',
    explanation:
      'Dwa odcinki mogą się przecinać. Miejsce, w którym się spotykają, to punkt przecięcia.',
  },
]

export const ALPHA_BETA_TASKS = [
  {
    id: 'alpha-meaning',
    figure: { type: 'angle', label: 'α' },
    title: 'Oznaczenie kąta',
    prompt: 'Co oznacza kąt α na rysunku?',
    answer: 'miarę kąta przy wierzchołku O',
    distractors: ['długość ramienia kąta', 'odległość między ramionami'],
    hint: 'α to grecka litera, którą oznaczamy kąty.',
    explanation:
      'α to grecka litera używana do oznaczania miary kąta. Wierzchołek to punkt O, a ramiona to półproste wychodzące z O.',
  },
  {
    id: 'adjacent',
    figure: { type: 'adjacent-angles' },
    title: 'Kąty przyległe',
    prompt: 'Kąty α i β na rysunku to kąty...',
    answer: 'przyległe',
    distractors: ['wierzchołkowe', 'proste'],
    hint: 'Mają wspólne ramię i razem tworzą linię prostą.',
    explanation:
      'Kąty przyległe mają wspólne ramię i razem tworzą kąt półpełny, czyli 180°.',
  },
  {
    id: 'vertical',
    figure: {
      type: 'crossing-lines',
      givenAngle: 40,
      labels: { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ' },
    },
    title: 'Kąty wierzchołkowe',
    prompt: 'Kąty α i γ leżą naprzeciw siebie. Jak się nazywają?',
    answer: 'wierzchołkowe',
    distractors: ['przyległe', 'ostre'],
    hint: 'Powstają przy przecięciu dwóch prostych, naprzeciw siebie.',
    explanation:
      'Kąty wierzchołkowe powstają przy przecięciu dwóch prostych. Leżą naprzeciw siebie i mają równe miary.',
  },
  {
    id: 'triangle',
    figure: { type: 'triangle-angles', labels: ['α', 'β', 'γ'] },
    title: 'Kąty w trójkącie',
    prompt: 'Kąty α, β i γ w trójkącie to...',
    answer: 'kąty wewnętrzne trójkąta',
    distractors: ['kąty wierzchołkowe', 'kąty przyległe'],
    hint: 'Leżą wewnątrz figury, przy jej wierzchołkach.',
    explanation:
      'Kąty wewnętrzne trójkąta leżą przy jego wierzchołkach. Ich suma zawsze wynosi 180°.',
  },
  {
    id: 'quadrilateral',
    figure: { type: 'quadrilateral-angles', labels: ['α', 'β', 'γ', 'δ'] },
    title: 'Kąty w czworokącie',
    prompt: 'Kąty α, β, γ i δ w czworokącie to...',
    answer: 'kąty wewnętrzne czworokąta',
    distractors: ['kąty wierzchołkowe', 'kąty przyległe'],
    hint: 'Leżą wewnątrz czworokąta, przy jego czterech wierzchołkach.',
    explanation:
      'Kąty wewnętrzne czworokąta leżą przy jego wierzchołkach. Ich suma zawsze wynosi 360°.',
  },
]

export const TRIANGLE_ANGLE_SETS = [
  [60, 60, 60],
  [90, 45, 45],
  [50, 70, 60],
  [80, 65, 35],
  [100, 40, 40],
  [35, 75, 70],
  [120, 30, 30],
  [55, 85, 40],
]

export const QUADRILATERAL_ANGLE_SETS = [
  [90, 90, 90, 90],
  [100, 80, 100, 80],
  [70, 110, 70, 110],
  [120, 60, 120, 60],
  [85, 95, 105, 75],
  [110, 70, 100, 80],
  [130, 50, 90, 90],
]

export const GIVEN_ANGLES = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75]

export const LINE_DEFINITIONS = [
  {
    title: 'Prosta',
    diagram: 'line',
    text: 'Nie ma początku ani końca. Przedłuża się w obie strony.',
  },
  {
    title: 'Półprosta',
    diagram: 'ray',
    text: 'Ma początek, ale nie ma końca. Biegnie w jedną stronę.',
  },
  {
    title: 'Odcinek',
    diagram: 'segment',
    text: 'Ma dwa końce. To fragment prostej między tymi punktami.',
  },
  {
    title: 'Proste prostopadłe',
    diagram: 'perpendicular',
    text: 'Przecinają się pod kątem prostym, czyli 90°.',
  },
  {
    title: 'Proste równoległe',
    diagram: 'parallel',
    text: 'Nie przecinają się. Cały czas zachowują tę samą odległość.',
  },
  {
    title: 'Punkt przecięcia',
    diagram: 'crossing-segments',
    text: 'Miejsce, w którym przecinają się odcinki lub proste.',
  },
]

export const ANGLE_FACTS = [
  {
    title: 'Kąty α i β',
    figure: { type: 'adjacent-angles' },
    text: 'α i β to greckie litery, którymi oznaczamy kąty. Kąty przyległe mają wspólne ramię i razem dają 180°.',
  },
  {
    title: 'Kąty wierzchołkowe',
    figure: {
      type: 'crossing-lines',
      givenAngle: 40,
      labels: { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ' },
    },
    text: 'Przy przecięciu dwóch prostych kąty leżące naprzeciw siebie są równe. To kąty wierzchołkowe.',
  },
  {
    title: 'Kąty w trójkącie',
    figure: { type: 'triangle-angles', labels: ['α', 'β', 'γ'] },
    text: 'Suma kątów wewnętrznych trójkąta wynosi zawsze 180°.',
  },
  {
    title: 'Kąty w czworokącie',
    figure: { type: 'quadrilateral-angles', labels: ['α', 'β', 'γ', 'δ'] },
    text: 'Suma kątów wewnętrznych czworokąta wynosi zawsze 360°.',
  },
]
