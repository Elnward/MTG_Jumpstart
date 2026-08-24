# MTG Jumpstart Cube Library

Mobile Sortierhilfe für einen **Magic: The Gathering Jumpstart Cube**: QR-Code scannen, Halfdeck auswählen und die Kartenliste zum Zurücksortieren verwenden.

## Enthalten

- 51 **Magic: The Gathering | Marvel Super Heroes Jumpstart** Halfdecks
- Gruppierung in **Rot → Blau → Weiß → Schwarz → Grün → Mehrfarbig**
- Farbsymbole direkt an den Decknamen
- Suche auf der Übersichtsseite
- Detailansicht mit **Karten** und **Ländern**
- Button **„← Zur Übersicht“**
- druckbare QR-Proxy-Karte unter `proxy.html`
- JSON-basierte Datenhaltung für spätere eigene Decks

Die Marvel-Halfdecks haben jeweils 20 Karten. Basic-Land-Artworks bzw. Collector-Number-Varianten werden in der Bibliothek nach Kartenname zusammengefasst, weil das beim Zurücksortieren übersichtlicher ist.

## GitHub Pages aktivieren

Das Repository ist für statisches Hosting vorbereitet. Einmalig auf GitHub:

1. `Settings` → `Pages`
2. Unter **Build and deployment**: `Deploy from a branch`
3. Branch: `main`
4. Ordner: `/(root)`
5. `Save`

Danach ist die Bibliothek unter dieser Adresse erreichbar:

`https://elnward.github.io/MTG_Jumpstart/`

Der QR-Code in `assets/qr-library.svg` und die druckbare `proxy.html` zeigen bereits auf diese Adresse.

## Eigenes Jumpstart-Halfdeck hinzufügen

Eigene Decks kommen in:

`data/custom.json`

Im Feld `_template` liegt eine Vorlage. Kopiere sie in das Array `decks` und passe die Werte an:

```json
{
  "id": "mein-eigenes-deck",
  "name": "Mein eigenes Deck",
  "group": "R",
  "colors": ["R"],
  "description": "Kurze Beschreibung der Spielidee.",
  "cards": [
    { "name": "Lightning Bolt", "qty": 1 }
  ],
  "lands": [
    { "name": "Mountain", "qty": 7 }
  ]
}
```

### Felder

- `id`: eindeutige URL-ID; Kleinbuchstaben, Zahlen und Bindestriche
- `name`: sichtbarer Themenname
- `group`: Abschnitt in der Übersicht: `R`, `U`, `W`, `B`, `G` oder `M`
- `colors`: tatsächliche Farbsymbole des Halfdecks; z. B. `["W", "U"]`
- `description`: kurzer Erklärungssatz zur Spielidee
- `cards`: Nichtländer als `{ "name", "qty" }`
- `lands`: Länder als `{ "name", "qty" }`

Ein Jumpstart-Halfdeck sollte über `cards` + `lands` insgesamt **20 Karten** ergeben.

## Weitere Sets als eigene JSON-Datei

Die Website kann mehrere Bibliotheksdateien zusammenführen. Neue Sammlungen können als weitere JSON-Datei unter `data/` angelegt und anschließend in `data/library.json` unter `sources` ergänzt werden.

## Dateistruktur

```text
.
├── index.html
├── proxy.html
├── app.js
├── styles.css
├── .nojekyll
├── assets/
│   └── qr-library.svg
└── data/
    ├── library.json
    ├── custom.json
    ├── deck-library.schema.json
    ├── marvel-r.json
    ├── marvel-u.json
    ├── marvel-w.json
    ├── marvel-b.json
    ├── marvel-g.json
    └── marvel-m.json
```

Die Marvel-Dateien sind nach dem Abschnitt der Übersichtsseite aufgeteilt. `data/library.json` bestimmt sowohl die Reihenfolge als auch welche JSON-Dateien geladen werden.

## Datenquelle

Marvel Super Heroes Jumpstart Booster Themes:
`https://magic.wizards.com/en/news/announcements/marvel-super-heroes-jumpstart-booster-themes`
