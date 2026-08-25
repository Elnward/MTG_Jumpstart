# MTG Jumpstart Cube Library

Mobile Sortierhilfe für einen **Magic: The Gathering Jumpstart Cube**: QR-Code scannen, Halfdeck auswählen und die Kartenliste zum Zurücksortieren verwenden.

## Direkt öffnen

- Bibliothek: `https://elnward.github.io/MTG_Jumpstart/`
- Build Guide: `https://elnward.github.io/MTG_Jumpstart/build-guide.html`
- QR-/Proxy-Karte: `https://elnward.github.io/MTG_Jumpstart/proxy.html`

## Enthalten

- 51 **Magic: The Gathering | Marvel Super Heroes Jumpstart** Halfdecks
- Gruppierung in **Rot → Blau → Weiß → Schwarz → Grün → Mehrfarbig**
- echte Mana-Symbole aus dem lokalen Mana-Font
- Suche auf der Übersichtsseite
- Detailansicht nach **Kreaturen, Hexereien, Spontanzaubern, Verzauberungen, Artefakten, Planeswalkern, Schlachten, Sonstigem und Ländern**
- Button **„← Zur Übersicht“**
- **Build Guide** für eigene Jumpstart-Halfdecks
- druckbare QR-Proxy-Karte unter `proxy.html`
- JSON-basierte Datenhaltung für spätere eigene Decks

Die Marvel-Halfdecks haben jeweils 20 Karten. Basic-Land-Artworks bzw. Collector-Number-Varianten werden in der Bibliothek nach Kartenname zusammengefasst, weil das beim Zurücksortieren übersichtlicher ist.

## Eigenes Jumpstart-Halfdeck hinzufügen

Eigene Decks kommen in `data/custom.json`. Im Feld `_template` liegt eine Vorlage. Kopiere sie in das Array `decks` und passe die Werte an:

```json
{
  "id": "mein-eigenes-deck",
  "name": "Mein eigenes Deck",
  "group": "R",
  "colors": ["R"],
  "description": "Kurze Beschreibung der Spielidee.",
  "cards": [
    { "name": "Lightning Bolt", "qty": 1, "type": "Instant" }
  ],
  "lands": [
    { "name": "Mountain", "qty": 7, "type": "Land" }
  ]
}
```

### Felder

- `id`: eindeutige URL-ID; Kleinbuchstaben, Zahlen und Bindestriche
- `name`: sichtbarer Themenname
- `group`: Abschnitt in der Übersicht: `R`, `U`, `W`, `B`, `G` oder `M`
- `colors`: tatsächliche Farbsymbole des Halfdecks; z. B. `["W", "U"]`
- `description`: kurzer Erklärungssatz zur Spielidee
- `cards`: Nichtländer mit `name`, `qty` und optional `type`
- `lands`: Länder; `type` ist `Land`
- mögliche Typen: `Creature`, `Sorcery`, `Instant`, `Enchantment`, `Artifact`, `Planeswalker`, `Battle`, `Other`, `Land`

Ein Jumpstart-Halfdeck sollte über `cards` + `lands` insgesamt **20 Karten** ergeben.

## Weitere Sets als eigene JSON-Datei

Die Website kann mehrere Bibliotheksdateien zusammenführen. Neue Sammlungen können als weitere JSON-Datei unter `data/` angelegt und anschließend in `data/library.json` unter `sources` ergänzt werden.

## Datenquellen

- Marvel Super Heroes Jumpstart Booster Themes: `https://magic.wizards.com/en/news/announcements/marvel-super-heroes-jumpstart-booster-themes`
- Jumpstart-Grundidee: `https://magic.wizards.com/en/news/announcements/introducing-jumpstart-new-way-play-magic-2020-02-20`
- Jumpstart-Design: `https://magic.wizards.com/en/news/card-preview/behind-scenes-designing-jumpstart-2020-06-17`
- Kartentypen: Scryfall Oracle Cards bulk data
