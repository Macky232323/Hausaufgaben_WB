# Debug 1
liste1_debug1 = [4, 5, 6]
liste2_debug1 = liste1_debug1
liste2_debug1.append(7)
print("Debug 1:")
print("Liste1:", liste1_debug1) # Erwartet: [4, 5, 6, 7]



liste1_original = [4,5,6]
liste2_kopiert = liste1_original.copy()
liste2_kopiert.append(7)
print("Liste1 Original (nach Kopie-Test):", liste1_original) # Erwartet: [4, 5, 6]
print("Liste2 Kopiert:", liste2_kopiert) # Erwartet: [4, 5, 6, 7]

 

# Debug 2
werte_debug2 = [2, 4, 6, 8]
ergebnis_debug2 = [x / 2 for x in werte_debug2 if x < 5]
print("Debug 2: Ergebnis =", ergebnis_debug2) # Erwartet: [1.0, 2.0]
# F: Was bewirkt `if x < 5`? A: Filtert Elemente, nur die < 5 werden verarbeitet.

 

# Debug 3
farben_alt_debug3 = ["rot", "grün", "blau"]
farben_neu_ref_debug3 = farben_alt_debug3
farben_alt_debug3 = ["gelb", "lila"] # `farben_alt_debug3` zeigt jetzt auf neue Liste.
print("Debug 3: farben_neu_ref =", farben_neu_ref_debug3) # Erwartet: ['rot', 'grün', 'blau']

 

# Debug 4
person_debug4 = ("Max", 28, "Berlin")
# person_debug4[2] = "Hamburg" # Verursacht TypeError
# Tupel sind immutable (unveränderlich).
# Neues Tupel erstellen: `person_neu = (person[0], person[1], "Hamburg")`.
person_neu_debug4 = (person_debug4[0], person_debug4[1], "Hamburg")
print("Debug 4: person_neu =", person_neu_debug4)

 

# Debug 5
daten_debug5 = ("Ali", [100, 200])
daten_debug5[1][0] = 300 # Ändert Element IN der Liste, die Teil des Tupels ist.
print("Debug 5: daten =", daten_debug5) # Erwartet: ('Ali', [300, 200])
# Tupel ist immutable, aber es enthält eine mutable Liste. Die Liste selbst kann geändert werden.

 

# Debug 6
info_debug6 = {"stadt": "Köln", "einwohner": 1000000}
# print(info_debug6["fläche"]) # Verursacht KeyError
# Schlüssel "fläche" nicht im Dictionary.
# Mit `.get("schlüssel", default_wert)`, z.B. `info_debug6.get("fläche", "N/A")`.
flaeche_debug6 = info_debug6.get("fläche", "nicht vorhanden")
print("Debug 6: Fläche =", flaeche_debug6)

 

# Debug 7
def schreibe_debug7(text_param):
    text_upper_debug7 = text_param.upper()
    return text_upper_debug7 # Muss den Wert explizit zurückgeben.
nachricht_debug7 = schreibe_debug7("hallo")
print("Debug 7: Nachricht =", nachricht_debug7) # Erwartet: HALLO
# Funktion gab nichts explizit zurück (kein `return wert`).
# return text.upper()` hinzufügen.

 

# Debug 8
def addiere_debug8(x, y):
    print("Debug 8: Innerhalb addiere:", x + y) # Nur Ausgabe, kein return
    # return x + y # So wäre es korrekt für Weiterverwendung
summe_ref_debug8 = addiere_debug8(3, 4) # summe_ref_debug8 ist None
print("Debug 8: summe_ref =", summe_ref_debug8)
# Funktion `addiere_debug8` gibt `None` zurück, da kein `return wert`.
def addiere_korrigiert_debug8(x,y):
    return x + y
summe_wert_debug8 = addiere_korrigiert_debug8(3,4)
print("Debug 8: Summe (korrigiert) =", summe_wert_debug8) # Erwartet: 7

 

# Debug 9
x_global_debug9 = "global"
def test_debug9():
    x_lokal_debug9 = "lokal" # Neue lokale Variable, verdeckt globale Variable nur hier.
    print("Debug 9: Innerhalb test():", x_lokal_debug9)
test_debug9()
print("Debug 9: Außerhalb test():", x_global_debug9) # Erwartet: global
# Zuweisung in Funktion erstellt lokale Variable, globale `x` unverändert. (Für Änderung: `global x_global_debug9` in Funktion nutzen).

 

# Debug 10
# def info_falsch_debug10(name="Gast", stadt): print(name, "aus", stadt) # SyntaxError
# Parameter ohne Standardwert (`stadt`) darf nicht auf Parameter mit Standardwert (`name`) folgen.
# Standardwert-Parameter ans Ende: `def info_korrekt(stadt, name="Gast")`.
def info_korrekt_debug10(stadt, name="Gast"):
    print("Debug 10:", name, "aus", stadt)
info_korrekt_debug10("Berlin", "Ali")
info_korrekt_debug10("München")