export const OPERATIONS = {
  add: {
    id: 'add',
    name: 'Dodawanie',
    sign: '+',
    glyph: '+',
    color: 'violet',
    description:
      'Sprowadź ułamki do wspólnego mianownika, dodaj liczniki i skróć wynik.',
    tipTitle: 'Wspólny mianownik, potem liczniki',
    tip: 'Najpierw wspólny mianownik, potem dodajesz tylko liczniki. Na końcu sprawdź, czy wynik da się skrócić.',
  },
  sub: {
    id: 'sub',
    name: 'Odejmowanie',
    sign: '−',
    glyph: '−',
    color: 'rose',
    description:
      'Znajdź wspólny mianownik, odejmij liczniki i skróć wynik.',
    tipTitle: 'Mianownik zostaje, liczniki się odejmują',
    tip: 'Wspólny mianownik jest taki sam dla obu ułamków. Odejmujesz tylko liczniki, mianownik zostaje bez zmian.',
  },
  mul: {
    id: 'mul',
    name: 'Mnożenie',
    sign: '×',
    glyph: '×',
    color: 'mint',
    description:
      'Skracaj na krzyż, a potem pomnóż licznik przez licznik i mianownik przez mianownik.',
    tipTitle: 'Skracaj na krzyż przed mnożeniem',
    tip: 'Przed mnożeniem szukaj wspólnych dzielników na krzyż. Dzięki temu liczby są mniejsze, a wynik od razu w najprostszej postaci.',
  },
  div: {
    id: 'div',
    name: 'Dzielenie',
    sign: '÷',
    glyph: '÷',
    color: 'amber',
    description:
      'Zamień dzielenie na mnożenie przez odwrotność drugiego ułamka, a potem skracaj.',
    tipTitle: 'Odwróć drugi ułamek i mnóż',
    tip: 'Dzielenie przez ułamek to mnożenie przez jego odwrotność. Odwrotność powstaje przez zamianę licznika z mianownikiem.',
  },
}

export const OPERATION_LIST = [OPERATIONS.add, OPERATIONS.sub, OPERATIONS.mul, OPERATIONS.div]

export const MIXED_MODE = {
  id: 'mixed',
  name: 'Mieszany zestaw',
  description: 'Losowe zadania ze wszystkich czterech działań.',
  tipTitle: 'Cztery działania, jedna zasada',
  tip: 'Przy dodawaniu i odejmowaniu szukaj wspólnego mianownika. Przy mnożeniu i dzieleniu skracaj na krzyż — w dzieleniu najpierw zamień drugi ułamek na odwrotność.',
}

export function getModeMeta(mode) {
  return mode === 'mixed' ? MIXED_MODE : OPERATIONS[mode] ?? OPERATIONS.add
}
