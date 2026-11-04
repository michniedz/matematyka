export const FIGURE_GROUPS = [
  {
    id: 'quadrilaterals',
    name: 'Czworokąty',
    color: 'violet',
    description: 'Figury z czterema bokami — od kwadratu do trapezu.',
  },
  {
    id: 'triangles',
    name: 'Trójkąty',
    color: 'mint',
    description: 'Trzy boki i trzy kąty. Każdy trójkąt ma swoją nazwę.',
  },
  {
    id: 'circle',
    name: 'Koło',
    color: 'rose',
    description: 'Okrąg i koło — obwód okręgu oraz pole koła.',
  },
]

export const FIGURES = [
  {
    id: 'square',
    name: 'Kwadrat',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Cztery równe boki i cztery kąty proste.',
    explanation:
      'Pole kwadratu to długość boku pomnożona przez nią samą. Obwód to suma czterech równych boków, czyli 4 · a.',
    preview: { dims: { a: 6 } },
    area: {
      formula: 'P = a · a',
      distractors: ['P = 4 · a', 'P = 2 · a'],
      hint: 'Pomnóż długość boku przez nią samą.',
    },
    perimeter: {
      formula: 'Obw = 4 · a',
      distractors: ['Obw = a · a', 'Obw = 2 · a'],
      hint: 'Dodaj cztery równe boki — najprościej pomnóż bok przez 4.',
    },
  },
  {
    id: 'rectangle',
    name: 'Prostokąt',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Dwa dłuższe i dwa krótsze boki, wszystkie kąty proste.',
    explanation:
      'Pole prostokąta to długość razy szerokość. Obwód to suma dwóch długości i dwóch szerokości, czyli 2 · (a + b).',
    preview: { dims: { a: 8, b: 5 } },
    area: {
      formula: 'P = a · b',
      distractors: ['P = 2 · (a + b)', 'P = a + b'],
      hint: 'Pomnóż długość przez szerokość.',
    },
    perimeter: {
      formula: 'Obw = 2 · (a + b)',
      distractors: ['Obw = a · b', 'Obw = a + b'],
      hint: 'Dodaj długość i szerokość, a potem pomnóż wynik przez 2.',
    },
  },
  {
    id: 'triangle',
    name: 'Trójkąt',
    group: 'triangles',
    color: 'mint',
    summary: 'Trzy boki i trzy kąty. Dowolny trójkąt.',
    explanation:
      'Pole trójkąta to połowa iloczynu podstawy i wysokości. Wysokość pada na podstawę pod kątem prostym. Obwód to suma wszystkich trzech boków.',
    preview: { dims: { a: 8, h: 5, b: 7, c: 7 } },
    area: {
      formula: 'P = a · h : 2',
      distractors: ['P = a · h', 'P = a + b + c'],
      hint: 'Pomnóż podstawę przez wysokość, a potem podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + b + c',
      distractors: ['Obw = a · h : 2', 'Obw = a + b'],
      hint: 'Dodaj długości wszystkich trzech boków.',
    },
  },
  {
    id: 'right-triangle',
    name: 'Trójkąt prostokątny',
    group: 'triangles',
    color: 'mint',
    summary: 'Ma jeden kąt prosty. Dwie przyprostokątne i przeciwprostokątna.',
    explanation:
      'Przyprostokątne są prostopadłe, więc jedna może być podstawą, a druga wysokością. Pole to połowa ich iloczynu. Najdłuższy bok to przeciwprostokątna.',
    preview: { dims: { a: 6, b: 8, c: 10 } },
    area: {
      formula: 'P = a · b : 2',
      distractors: ['P = a · b', 'P = a + b + c'],
      hint: 'Przyprostokątne są podstawą i wysokością. Pomnóż je i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + b + c',
      distractors: ['Obw = a · b : 2', 'Obw = 2 · (a + b)'],
      hint: 'Dodaj obie przyprostokątne i przeciwprostokątną.',
    },
  },
  {
    id: 'equilateral-triangle',
    name: 'Trójkąt równoboczny',
    group: 'triangles',
    color: 'mint',
    summary: 'Wszystkie trzy boki równe, każdy kąt ma 60°.',
    explanation:
      'Pole liczymy jak w każdym trójkącie: połowa iloczynu podstawy i wysokości. Wysokość dzieli trójkąt na dwa jednakowe trójkąty prostokątne, a obwód to 3 · a.',
    preview: { dims: { a: 6, h: 5.2 }, approxKeys: ['h'] },
    area: {
      formula: 'P = a · h : 2',
      distractors: ['P = 3 · a', 'P = a · a'],
      hint: 'Pomnóż bok przez wysokość, a potem podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = 3 · a',
      distractors: ['Obw = a · h : 2', 'Obw = 4 · a'],
      hint: 'Dodaj trzy równe boki, czyli pomnóż bok przez 3.',
    },
  },
  {
    id: 'isosceles-triangle',
    name: 'Trójkąt równoramienny',
    group: 'triangles',
    color: 'mint',
    summary: 'Dwa boki równe (ramiona) i podstawa.',
    explanation:
      'Wysokość opuszczona na podstawę dzieli ją na dwie równe części. Pole to połowa iloczynu podstawy i wysokości, a obwód to podstawa plus dwa ramiona.',
    preview: { dims: { a: 8, b: 5, h: 3 } },
    area: {
      formula: 'P = a · h : 2',
      distractors: ['P = a · b', 'P = 2 · a + b'],
      hint: 'Pomnóż podstawę przez wysokość i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + 2 · b',
      distractors: ['Obw = a + b', 'Obw = 2 · a + b'],
      hint: 'Dodaj podstawę i dwa równe ramiona.',
    },
  },
  {
    id: 'rhombus',
    name: 'Romb',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Cztery równe boki. Przekątne przecinają się pod kątem prostym.',
    explanation:
      'Pole rombu można obliczyć z przekątnych: połowa iloczynu ich długości. Działa też wzór P = a · h. Obwód to cztery równe boki.',
    preview: { dims: { e: 6, f: 8, a: 5 } },
    area: {
      formula: 'P = e · f : 2',
      distractors: ['P = e · f', 'P = 4 · a'],
      hint: 'Pomnóż długości obu przekątnych i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = 4 · a',
      distractors: ['Obw = e · f : 2', 'Obw = 2 · a'],
      hint: 'Dodaj cztery równe boki, czyli pomnóż bok przez 4.',
    },
  },
  {
    id: 'parallelogram',
    name: 'Równoległobok',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Dwie pary boków równoległych i równych.',
    explanation:
      'Pole równoległoboku to podstawa razy wysokość opuszczona na tę podstawę. Obwód to suma dwóch sąsiednich boków pomnożona przez 2.',
    preview: { dims: { a: 8, b: 5, h: 4 } },
    area: {
      formula: 'P = a · h',
      distractors: ['P = a · b', 'P = 2 · (a + b)'],
      hint: 'Pomnóż podstawę przez wysokość.',
    },
    perimeter: {
      formula: 'Obw = 2 · (a + b)',
      distractors: ['Obw = a · h', 'Obw = a + b'],
      hint: 'Dodaj dwa sąsiednie boki i pomnóż wynik przez 2.',
    },
  },
  {
    id: 'trapezoid',
    name: 'Trapez',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Jedna para boków równoległych — to podstawy.',
    explanation:
      'Pole trapezu to średnia długość podstaw razy wysokość, czyli (a + b) · h : 2. Obwód to suma wszystkich czterech boków.',
    preview: { dims: { a: 10, b: 6, h: 4, c: 5, d: 5 } },
    area: {
      formula: 'P = (a + b) · h : 2',
      distractors: ['P = (a + b) · h', 'P = a · h'],
      hint: 'Dodaj podstawy, pomnóż przez wysokość i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + b + c + d',
      distractors: ['Obw = a + b + c', 'Obw = (a + b) · h : 2'],
      hint: 'Dodaj wszystkie cztery boki.',
    },
  },
  {
    id: 'isosceles-trapezoid',
    name: 'Trapez równoramienny',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Trapez, którego ramiona są równe.',
    explanation:
      'Ma jedną parę podstaw równoległych i dwa równe ramiona. Pole liczymy jak w każdym trapezie, a obwód to suma podstaw i dwóch ramion.',
    preview: { dims: { a: 10, b: 4, h: 4, c: 5 } },
    area: {
      formula: 'P = (a + b) · h : 2',
      distractors: ['P = (a + b) · h', 'P = a · h'],
      hint: 'Dodaj podstawy, pomnóż przez wysokość i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + b + 2 · c',
      distractors: ['Obw = a + b + c', 'Obw = a + b + 2 · h'],
      hint: 'Dodaj obie podstawy i dwa równe ramiona.',
    },
  },
  {
    id: 'right-trapezoid',
    name: 'Trapez prostokątny',
    group: 'quadrilaterals',
    color: 'violet',
    summary: 'Trapez z jednym ramieniem prostopadłym do podstaw.',
    explanation:
      'To prostopadłe ramię jest jednocześnie wysokością. Pole liczymy jak w trapezie, a obwód to suma podstaw, wysokości i drugiego ramienia.',
    preview: { dims: { a: 8, b: 5, h: 4, c: 5 } },
    area: {
      formula: 'P = (a + b) · h : 2',
      distractors: ['P = (a + b) · h', 'P = a · h'],
      hint: 'Dodaj podstawy, pomnóż przez wysokość i podziel przez 2.',
    },
    perimeter: {
      formula: 'Obw = a + b + h + c',
      distractors: ['Obw = a + b + c', 'Obw = a + b + 2 · h'],
      hint: 'Dodaj obie podstawy, wysokość i drugie ramię.',
    },
  },
  {
    id: 'circle',
    name: 'Koło i okrąg',
    group: 'circle',
    color: 'rose',
    summary: 'Okrąg to granica koła. Każdy jego punkt jest tak samo daleko od środka.',
    explanation:
      'Promień r to odległość od środka do okręgu. Pole koła to π · r · r, a obwód okręgu (jego długość) to 2 · π · r. Ponieważ średnica d = 2 · r, obwód można też zapisać jako π · d. W zadaniach przyjmujemy π ≈ 3,14.',
    preview: { dims: { r: 5 } },
    area: {
      formula: 'P = π · r · r',
      distractors: ['Obw = 2 · π · r', 'P = 2 · r'],
      hint: 'Pomnóż π (3,14) przez promień i jeszcze raz przez promień.',
    },
    perimeter: {
      formula: 'Obw = 2 · π · r',
      distractors: ['P = π · r · r', 'Obw = π · r'],
      hint: 'Pomnóż 2, π (3,14) i promień.',
    },
  },
]

export const FIGURE_BY_ID = Object.fromEntries(
  FIGURES.map((figure) => [figure.id, figure]),
)
