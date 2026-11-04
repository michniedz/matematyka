export const ANGLES = [
  {
    id: 'acute',
    name: 'Kąt ostry',
    short: 'ostry',
    measure: 50,
    range: '0° < α < 90°',
    example: 'np. 50°',
    description:
      'Kąt ostry jest mniejszy od kąta prostego. Jego miara jest większa od 0° i mniejsza od 90°.',
    descriptionOption: 'miara jest większa od 0° i mniejsza od 90°',
    hint: 'Kąt ostry jest mniejszy od kąta prostego, czyli ma mniej niż 90°.',
    success: 'Dobrze! Kąt ostry ma miarę mniejszą od 90°.',
    retry:
      'To nie jest kąt ostry. Sprawdź, czy ramiona otwierają się mniej niż w kącie prostym.',
    measureSuccess: 'Tak! Kąt ostry ma miarę większą od 0° i mniejszą od 90°.',
    measureRetry: 'Nie tym razem. Kąt ostry jest mniejszy od kąta prostego.',
  },
  {
    id: 'right',
    name: 'Kąt prosty',
    short: 'prosty',
    measure: 90,
    range: 'α = 90°',
    example: 'np. 90°',
    description:
      'Kąt prosty ma ramiona prostopadłe. Jego miara wynosi dokładnie 90°.',
    descriptionOption: 'miara wynosi dokładnie 90°',
    hint: 'Kąt prosty ma ramiona prostopadłe i dokładnie 90°.',
    success: 'Dobrze! Kąt prosty ma dokładnie 90°.',
    retry:
      'To nie jest kąt prosty. Kąt prosty ma ramiona prostopadłe i miarę 90°.',
    measureSuccess: 'Tak! Kąt prosty ma dokładnie 90°.',
    measureRetry: 'Nie tym razem. Kąt prosty ma miarę równą 90°.',
  },
  {
    id: 'obtuse',
    name: 'Kąt rozwarty',
    short: 'rozwarty',
    measure: 130,
    range: '90° < α < 180°',
    example: 'np. 130°',
    description:
      'Kąt rozwarty jest większy od kąta prostego, ale mniejszy od półpełnego. Ma więcej niż 90° i mniej niż 180°.',
    descriptionOption: 'miara jest większa od 90° i mniejsza od 180°',
    hint: 'Kąt rozwarty jest większy od kąta prostego, ale mniejszy od półpełnego.',
    success: 'Dobrze! Kąt rozwarty ma więcej niż 90° i mniej niż 180°.',
    retry:
      'To nie jest kąt rozwarty. Kąt rozwarty jest większy od prostego, ale mniejszy od półpełnego.',
    measureSuccess:
      'Tak! Kąt rozwarty ma miarę większą od 90° i mniejszą od 180°.',
    measureRetry:
      'Nie tym razem. Kąt rozwarty jest większy od kąta prostego i mniejszy od półpełnego.',
  },
  {
    id: 'straight',
    name: 'Kąt półpełny',
    short: 'półpełny',
    measure: 180,
    range: 'α = 180°',
    example: 'np. 180°',
    description:
      'Kąt półpełny ma ramiona tworzące prostą. Jego miara wynosi dokładnie 180°.',
    descriptionOption: 'miara wynosi dokładnie 180°',
    hint: 'Kąt półpełny ma ramiona tworzące jedną prostą i miarę 180°.',
    success: 'Dobrze! Kąt półpełny ma dokładnie 180°.',
    retry:
      'To nie jest kąt półpełny. Kąt półpełny ma ramiona tworzące prostą i miarę 180°.',
    measureSuccess: 'Tak! Kąt półpełny ma dokładnie 180°.',
    measureRetry: 'Nie tym razem. Kąt półpełny ma miarę równą 180°.',
  },
  {
    id: 'reflex',
    name: 'Kąt wklęsły',
    short: 'wklęsły',
    measure: 250,
    range: '180° < α < 360°',
    example: 'np. 250°',
    description:
      'Kąt wklęsły jest większy od półpełnego, ale mniejszy od pełnego. Ma więcej niż 180° i mniej niż 360°.',
    descriptionOption: 'miara jest większa od 180° i mniejsza od 360°',
    hint: 'Kąt wklęsły jest większy od półpełnego, ale mniejszy od pełnego.',
    success: 'Dobrze! Kąt wklęsły ma więcej niż 180° i mniej niż 360°.',
    retry:
      'To nie jest kąt wklęsły. Kąt wklęsły jest większy od półpełnego, ale mniejszy od pełnego.',
    measureSuccess:
      'Tak! Kąt wklęsły ma miarę większą od 180° i mniejszą od 360°.',
    measureRetry:
      'Nie tym razem. Kąt wklęsły jest większy od półpełnego i mniejszy od pełnego.',
  },
  {
    id: 'full',
    name: 'Kąt pełny',
    short: 'pełny',
    measure: 360,
    range: 'α = 360°',
    example: 'np. 360°',
    description:
      'Kąt pełny powstaje po pełnym obrocie. Jego ramiona pokrywają się, a miara wynosi 360°.',
    descriptionOption: 'miara wynosi dokładnie 360°',
    hint: 'Kąt pełny to pełny obrót — ramiona pokrywają się, a miara to 360°.',
    success: 'Dobrze! Kąt pełny ma dokładnie 360°.',
    retry:
      'To nie jest kąt pełny. Kąt pełny to pełny obrót i miara 360°.',
    measureSuccess: 'Tak! Kąt pełny ma dokładnie 360°.',
    measureRetry: 'Nie tym razem. Kąt pełny ma miarę równą 360°.',
  },
]

export const ANGLE_BY_ID = Object.fromEntries(
  ANGLES.map((angle) => [angle.id, angle]),
)
