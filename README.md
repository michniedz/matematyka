# Matma krok po kroku

Interaktywna aplikacja do nauki matematyki w szkole podstawowej. Uczeń wybiera
temat, rozwiązuje losowe zadania, a aplikacja prowadzi go przez rozwiązanie
krok po kroku — z podpowiedziami, komunikatami o błędach i możliwością
odsłonięcia rozwiązania.

Dostępne tematy:

- **Ułamki zwykłe** — dodawanie i odejmowanie (wspólny mianownik), mnożenie
  (skracanie na krzyż) oraz dzielenie (odwrotność i skracanie).
- **Kolejność działań** — wyrażenia z nawiasami, ułamkami zwykłymi, liczbami
  całkowitymi i liczbami dziesiętnymi. Uczeń najpierw wybiera, które działanie
  ma pierwszeństwo, a potem liczy je krok po kroku.
- **Figury i kąty** — pola i obwody kwadratu, prostokąta, trójkątów, rombu,
  równoległoboku, trapezów oraz koła i okręgu. Osobna sekcja wyjaśnia rodzaje
  kątów: ostry, prosty, rozwarty, półpełny, wklęsły i pełny.
- **Proste i kąty** — prosta, półprosta i odcinek, proste prostopadłe
  i równoległe, kąty α i β, przecięcia prostych oraz sumy kątów w trójkątach
  i czworokątach.

Każdy krok jest sprawdzany osobno. Po dwóch błędnych próbach pojawia się
podpowiedź, a w razie potrzeby można odsłonić pełne rozwiązanie. Postęp zadania
widać na osi czasu, a ukończone zadania liczy licznik w nagłówku.

## Uruchomienie

Wymagany Node.js w wersji zgodnej z Vite 8 (Node 20.19+ lub 22.12+).

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem wypisanym przez Vite (domyślnie
`http://localhost:5173`).

Pozostałe polecenia:

```bash
npm run build    # produkcyjna kompilacja do katalogu dist/
npm run preview  # podgląd zbudowanej wersji
npm run lint     # sprawdzenie kodu przez oxlint
```

## Publikacja na GitHub Pages

Projekt jest przygotowany do automatycznej publikacji na GitHub Pages.
Workflow `.github/workflows/deploy.yml` buduje aplikację po każdym pushu do
gałęzi `main` i publikuje katalog `dist`.

1. W repozytorium na GitHubie wejdź w **Settings → Pages**.
2. W sekcji **Build and deployment** ustaw **Source** na **GitHub Actions**.
3. Wypchnij zmiany do gałęzi `main`.
4. Po zakończeniu workflow aplikacja będzie dostępna pod adresem
   `https://michniedz.github.io/matematyka/`.

Konfiguracja Vite automatycznie ustawia bazę na nazwę repozytorium, więc
publikacja będzie działać także po zmianie nazwy repozytorium.

## Struktura projektu

```
src/
  App.jsx                       # układ strony, przełączanie ekranów, licznik zadań
  index.css                     # zmienne motywu (jasny/ciemny) i style globalne
  App.css                       # style nagłówka, przycisków i stopki
  main.jsx                      # punkt wejścia React
  lib/
    math.js                     # gcd, lcm, simplify, isEquivalent
    useTheme.js                 # motyw zapisywany w localStorage
  styles/
    learning.css                # wspólne style nauki, kart, kroków i tematów
  components/
    Fraction.jsx                # zapis ułamka
    FractionBar.jsx             # pasek ilustrujący ułamek
    FractionInput.jsx           # pola licznika i mianownika
    MixedInput.jsx              # pola całości, licznika i mianownika
    MixedNumber.jsx             # zapis liczby mieszanej
    NumberInput.jsx             # pole liczby całkowitej lub dziesiętnej
    StepCard.jsx                # pojedynczy krok: wpis, wybór, błędy, podpowiedź
    ExerciseLayout.jsx          # wspólny układ zadania, postęp i oś czasu
  features/
    topics/
      topics.js                 # rejestr tematów widocznych na stronie głównej
      TopicsHome.jsx            # wybór tematu
    fractions/
      generator.js              # losowanie zadań i danych pomocniczych
      steps.jsx                 # kroki, walidacja, podpowiedzi, wizualizacje
      operations.js             # metadane działań (nazwy, opisy, kolory, wskazówki)
      FractionsHome.jsx         # ekran startowy tematu
      FractionsExercise.jsx     # ekran zadania i podsumowanie
    order/
      values.js                 # dokładne liczby wymierne i formatowanie dziesiętne
      expression.js             # drzewo wyrażenia, priorytety, redukcja działań
      generator.js              # losowanie wyrażeń i pilnowanie poprawności
      steps.jsx                 # wybór kolejności i kroki obliczeń
      Expression.jsx            # renderowanie wyrażenia z podświetleniem działania
      OrderHome.jsx             # ekran startowy tematu i zasady
      OrderExercise.jsx         # ekran zadania i podsumowanie
      order.css                 # style wyrażeń i kart tematu
    geometry/
      figures.js                # dane figur: wzory, opisy, przykłady
      angles.js                 # rodzaje kątów, miary i wyjaśnienia
      values.js                 # formatowanie liczb i zamiana na ułamki
      generator.js              # losowanie zadań o polu, obwodzie i kątach
      steps.jsx                 # wybór wzoru, obliczenia i rozpoznawanie kątów
      Figure.jsx                # rysunki figur z oznaczeniami
      AngleFigure.jsx           # rysunki kątów (także wklęsłych i pełnych)
      GeometryHome.jsx          # ekran startowy, wzory i ściągawka z kątów
      GeometryExercise.jsx      # ekran zadania i podsumowanie
      geometry.css              # style rysunków, kart i zadań geometrycznych
    lines/
      lines.js                  # tryby, definicje, zestawy kątów i przykłady
      generator.js              # losowanie zadań o prostych, kątach i figurach
      steps.jsx                 # kroki, walidacja, podpowiedzi i wizualizacje
      LineFigure.jsx            # rysunki prostych, odcinków, przecięć i kątów
      LinesHome.jsx             # ekran startowy i ściągawka z pojęć
      LinesExercise.jsx         # ekran zadania i podsumowanie
      lines.css                 # style rysunków, kart i zadań o prostych
```

## Jak to działa

### Ułamki zwykłe

1. `generateTask(mode)` losuje dział i dwa ułamki właściwe. Generator pilnuje,
   żeby wynik był dodatni, możliwy do zapisania w rozsądnej postaci, a w
   mnożeniu i dzieleniu — żeby dało się skrócić na krzyż.
2. `buildSteps(task)` tworzy listę kroków. Każdy krok ma polecenie, oczekiwaną
   odpowiedź, funkcję sprawdzającą, podpowiedź oraz opcjonalną wizualizację.
   Wszystkie kroki pokazują całe działanie. Przy dodawaniu i odejmowaniu po
   wspólnym mianowniku uczeń uzupełnia liczniki obu ułamków w jednym kroku,
   a dopiero potem wpisuje wynik. Przy mnożeniu i dzieleniu po skracaniu na
   krzyż uzupełnia liczby powstałe ze skrócenia, a wynik wpisuje w kolejnym
   kroku.
3. `StepCard` przyjmuje odpowiedź, wyświetla komunikat i po poprawnym wyniku
   pozwala przejść dalej. Wpisy trafiają do osi czasu w panelu bocznym.
4. Po ostatnim kroku pojawia się karta podsumowania z wynikiem i przyciskiem
   do kolejnego losowego zadania.

### Kolejność działań

Wyrażenie jest drzewem (`expression.js`), a każda liczba to dokładny ułamek
`{ n, d }` z informacją, jak ją pokazać (`int`, `frac`, `dec`). Dzięki temu ten
sam silnik obsługuje ułamki zwykłe i liczby dziesiętne bez zaokrągleń.

1. `generateTask(mode)` losuje kształt wyrażenia (2–3 działania, z nawiasami
   lub bez) i dobiera liczby do wybranego trybu. Odrzuca zadania z dzieleniem
   przez zero, wynikami niedodatnimi, zbyt dużymi mianownikami i „pustymi”
   działaniami typu `× 1`.
2. Generator przechodzi rozwiązanie tak samo jak uczeń: znajduje działania
   gotowe do wykonania, wybiera to o najwyższym priorytecie (najpierw nawiasy,
   potem mnożenie i dzielenie, na końcu dodawanie i odejmowanie, w obrębie
   poziomu od lewej do prawej) i zastępuje je wynikiem.
3. `buildSteps(task)` zamienia ten przebieg na kroki. Gdy zmienia się poziom
   priorytetu, pojawia się krok wyboru („co wykonujemy teraz?”), a potem krok
   obliczenia wybranego działania. Wyrażenie na ekranie zmniejsza się aż do
   jednej liczby. Gdy wynikiem działania jest liczba całkowita, uczeń wpisuje
   ją w jednym polu zamiast w liczniku i mianowniku. Gdy wynik jest ułamkiem
   niewłaściwym, uczeń od razu zapisuje go jako liczbę mieszaną — w polu
   całości oraz w polach licznika i mianownika (np. `13/4` → `3 i 1/4`). Jeśli
   wynik da się skrócić, krok obliczenia prosi najpierw o zapisanie go dokładnie
   tak, jak wyszedł z działania (np. `2 × 3/4 = 6/4`), a dopiero następny krok
   każe go skrócić i — gdy to konieczne — wyciągnąć całości (`6/4 = 1 i 1/2`).
   Przy dzieleniu ułamków krok obliczenia jest rozbity: najpierw odwrotność,
   potem skracanie na krzyż (największy wspólny dzielnik), a dopiero na końcu
   wynik mnożenia. Odwrotność i liczby po skracaniu zostają zapisane jako
   ułamki niewłaściwe, żeby łatwo było mnożyć.
4. W kroku skracania odpowiedzi ułamkowe muszą być w najprostszej postaci;
   liczby dziesiętne można wpisać z przecinkiem lub kropką. Wynik mieszany jest
   sprawdzany od razu w kroku obliczenia lub skracania, więc nie ma osobnego
   kroku na wyciąganie całości na końcu zadania.

Tryby w temacie „Kolejność działań”:

- **Wszystko mieszane** — losowo ułamki zwykłe albo liczby dziesiętne,
- **Ułamki i całości** — nawiasy, ułamki zwykłe i liczby całkowite,
- **Liczby dziesiętne** — działania z przecinkami i liczbami całkowitymi.

### Figury i kąty

Dane figur i kątów są oddzielone od logiki zadań:

- `figures.js` przechowuje nazwę, opis, wzory na pole i obwód oraz przykładowe
  wymiary każdej figury,
- `angles.js` przechowuje miarę, zakres i wyjaśnienie każdego rodzaju kąta,
- `generator.js` losuje wymiary i tworzy listę obliczeń prowadzących do wyniku,
- `Figure.jsx` i `AngleFigure.jsx` rysują figury w SVG na podstawie danych.

Zadanie geometryczne składa się z trzech do siedmiu kroków:

1. **Wybór wzoru** — uczeń wybiera właściwy wzór spośród trzech propozycji.
2. **Podstawienie danych** — uczeń wpisuje wymiary w miejsce liter we wzorze.
3. **Kolejność działań** — gdy do wykonania jest więcej niż jedno działanie,
   uczeń wybiera, co ma pierwszeństwo: nawias, mnożenie i dzielenie czy
   dodawanie i odejmowanie.
4. **Obliczenia** — kolejne działania prowadzą do pola lub obwodu; np. przy
   trójkącie najpierw mnożymy podstawę przez wysokość, a potem dzielimy przez 2.
5. **Wynik** — odpowiedź jest sprawdzana razem z jednostką (`cm` lub `cm²`).

Zadania z kątami pokazują rysunek kąta i pytają najpierw o jego rodzaj, a potem
o pasujący opis miary. W trybie mieszanym losowo pojawiają się pola, obwody
i kąty.

Tryby w temacie „Figury i kąty”:

- **Wszystko mieszane** — pola, obwody i kąty,
- **Pola figur** — tylko obliczanie pola,
- **Obwody figur** — tylko obliczanie obwodu,
- **Kąty** — rozpoznawanie rodzaju kąta i jego miary.

### Proste i kąty

Temat „Proste i kąty” skupia się na pojęciach z geometrii, które nie są
obliczaniem pola ani obwodu:

- `lines.js` przechowuje definicje prostych, odcinków, prostopadłych,
  równoległych, kątów α i β oraz zestawy miar kątów w figurach,
- `LineFigure.jsx` rysuje proste, odcinki, przecięcia i kąty w SVG,
- `generator.js` losuje zadania z czterech trybów: podstawy, kąty α i β,
  przecięcia prostych oraz kąty w figurach.

Zadania mają od jednego do pięciu kroków. Uczeń rozpoznaje pojęcie, wybiera
związek między kątami, a następnie oblicza miary. Przy przecięciu prostych
korzysta z tego, że kąty przyległe dają 180°, a wierzchołkowe są równe. Przy
trójkątach i czworokątach odpowiednio sumuje znane kąty i odejmuje je od 180°
lub 360°.

Tryby w temacie „Proste i kąty”:

- **Wszystko mieszane** — losowo wszystkie rodzaje zadań,
- **Proste i odcinki** — rozpoznawanie prostych, półprostych, odcinków,
  prostopadłych i równoległych,
- **Kąty α i β** — znaczenie oznaczeń, kąty przyległe, wierzchołkowe i kąty
  wewnętrzne figur,
- **Przecięcia prostych** — obliczanie pozostałych kątów, gdy znany jest jeden,
- **Kąty w figurach** — brakujący kąt w trójkącie lub czworokącie.

## Rozbudowa

- **Nowy temat (np. procenty)**:
  1. utwórz katalog `src/features/<temat>` z własnym generatorem, krokami i
     ekranami (wzorem `features/order` lub `features/geometry`),
  2. dodaj pozycję w `src/features/topics/topics.js` — karta pojawi się na
     stronie głównej automatycznie,
  3. dopisz gałąź w `App.jsx`, która otwiera ekran tematu i uruchamia zadania.

  Wspólne komponenty (`StepCard`, `ExerciseLayout`, `Fraction`,
  `NumberInput`) można wykorzystać bez zmian — obsługują już wpisywanie liczb,
  ułamków, liczb dziesiętnych oraz wybór odpowiedzi.
- **Nowa figura lub kąt** — dopisz dane w `features/geometry/figures.js` albo
  `angles.js` i dodaj rysunek w `Figure.jsx` lub `AngleFigure.jsx`. Generator
  i strona ze wzorami same pokażą nowy element.
- **Nowe działanie w ułamkach** — dodaj wpis w `operations.js` (m.in. `id`,
  `name`, `sign`, `glyph`, `color`, `tipTitle`), obsłuż je w `generateTask`
  oraz dodaj gałąź w `buildSteps`.
- **Nowy kształt wyrażenia** — dopisz funkcję w tablicy `SHAPES` w
  `features/order/generator.js`. Generator sam sprawdzi, czy zadanie jest
  poprawne i czy nadaje się do pokazania.
- **Zmiana poziomu trudności** — zakresy liczb i ułamków znajdują się w
  tablicach `FRACTION_POOL`, `DECIMAL_POOL` oraz w funkcjach `randomInt`
  i `acceptedValue` w `features/order/generator.js`. W ułamkach analogiczne
  miejsca to `DENOMINATORS` i funkcje `generateAddSub`, `generateMul`,
  `generateDiv`.
- **Nowy krok w rozwiązaniu** — dopisz go w `steps.jsx` danego tematu;
  interfejs sam wyliczy liczbę kroków, postęp i oś czasu.

## Technologie

React 19, Vite 8 i czysty CSS (bez bibliotek UI). Stan aplikacji jest trzymany
lokalnie w komponencie — projekt nie wymaga backendu ani konta użytkownika.
Motyw (jasny/ciemny) jest zapamiętywany w `localStorage`, a licznik ukończonych
zadań działa tylko w obrębie sesji.
