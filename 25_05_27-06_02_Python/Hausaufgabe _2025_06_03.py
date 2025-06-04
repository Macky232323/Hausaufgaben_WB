# Debug-Aufgaben im Stil der Vorgabe

# --------------------------------------------------
# Debug 1: Fehlerhafter Aufruf und Syntaxfehler
# --------------------------------------------------
print("\n--- Debug 1 ---")

# Fehlerhafter Code:
# def begrüßung(name):
#   print("Hallo" name) # Fehler 1: Fehlendes Komma oder + zwischen "Hallo" und name
# begrüßung() # Fehler 2: Fehlendes Argument für den Parameter 'name'

# Frage: Warum funktioniert dieser Funktionsaufruf nicht?
# Antwort:
# 1. In print() fehlt ein Komma (oder +) um Strings und Variablen zu verketten/separieren.
# 2. Die Funktion `begrüßung` erwartet ein Argument `name`, das beim Aufruf nicht übergeben wird.

# Korrigierter Code:
def begrüßung_d1(name):
  print("Hallo,", name) # Korrektur 1: Komma hinzugefügt

begrüßung_d1("Azubi") # Korrektur 2: Argument "Azubi" hinzugefügt
# Erwartet: Hallo, Azubi



# --------------------------------------------------
# Debug 2: Reihenfolge von Parametern
# --------------------------------------------------
print("\n--- Debug 2 ---")

# Fehlerhafter Code:
# def addiere_d2_fehler(x, y=0, z): # SyntaxError: non-default argument follows default argument
#   return x + y + z

# Frage: Warum akzeptiert Python diese Funktionsdefinition nicht?
# Antwort: Parameter ohne Standardwert (hier 'z') müssen *vor* Parametern mit Standardwert (hier 'y=0') definiert werden.

# Korrigierter Code:
def addiere_d2(x, z, y=0): # Korrektur: 'z' (ohne Default) vor 'y' (mit Default) verschoben
  return x + y + z

ergebnis_d2_a = addiere_d2(5, 2) # y nimmt den Standardwert 0
ergebnis_d2_b = addiere_d2(5, 2, 1) # y wird mit 1 überschrieben
print(f"Debug 2: addiere_d2(5, 2) = {ergebnis_d2_a}") # Erwartet: 7
print(f"Debug 2: addiere_d2(5, 2, 1) = {ergebnis_d2_b}") # Erwartet: 8



# --------------------------------------------------
# Debug 3: Globale vs. Lokale Variablen
# --------------------------------------------------
print("\n--- Debug 3 ---")

x_d3 = "global" # Globale Variable

def test_d3_lokal():
  x_d3 = "lokal" # Dies erstellt eine *neue lokale* Variable x_d3, die die globale nur innerhalb der Funktion verdeckt.
  # print(f"Debug 3: x_d3 innerhalb test_d3_lokal = {x_d3}") # Wäre "lokal"

test_d3_lokal()
print(f"Debug 3: x_d3 nach test_d3_lokal = {x_d3}") # Erwartet: "global", da die globale Variable nicht geändert wurde.

# Frage: Warum bleibt x beim Wert “global”? Wie könnte man x innerhalb der Funktion global verändern?
# Antwort: Ohne `global` Keyword wird in der Funktion eine lokale Variable erstellt.
#          Mit `global x_d3` kann die globale Variable geändert werden.

# Korrektur, um globale Variable zu ändern:
def test_d3_global():
  global x_d3 # Schlüsselwort, um Zugriff auf die globale Variable zu deklarieren
  x_d3 = "global geändert"

test_d3_global()
print(f"Debug 3: x_d3 nach test_d3_global = {x_d3}") # Erwartet: "global geändert"



# --------------------------------------------------
# Debug 4: Rückgabewert aus `except`-Block
# --------------------------------------------------
print("\n--- Debug 4 ---")

# Fehlerhafter Code:
# def rechne_d4_fehler(a, b):
#   try:
#     return a / b
#   except: # Fängt alle Fehler ab
#     print("Fehler") # Gibt nur Text aus, gibt aber nichts zurück (implizit None)
#
# ergebnis_d4_fehler = rechne_d4_fehler(5, 0)
# print(f"Debug 4: Ergebnis von rechne_d4_fehler(5,0) = {ergebnis_d4_fehler}") # Gibt "Fehler" aus und dann "None"

# Frage: Warum wird nichts zurückgegeben? Wie könnte man das verbessern?
# Antwort: Der `except`-Block gibt nur eine Meldung aus, aber keinen Wert zurück.
#          Eine Funktion ohne explizites `return` im durchlaufenen Pfad gibt `None` zurück.

# Korrigierter Code:
def rechne_d4(a, b):
  try:
    ergebnis = a / b
    return ergebnis
  except ZeroDivisionError: # Spezifischen Fehler abfangen
    print("Debug 4: Fehler - Division durch Null!")
    return None # Expliziten Rückgabewert für den Fehlerfall definieren

ergebnis_d4_ok = rechne_d4(10, 2)
print(f"Debug 4: rechne_d4(10, 2) = {ergebnis_d4_ok}") # Erwartet: 5.0

ergebnis_d4_fehlerfall = rechne_d4(5, 0)
print(f"Debug 4: rechne_d4(5, 0) = {ergebnis_d4_fehlerfall}") # Erwartet: (Fehlermeldung) und dann None



# --------------------------------------------------
# Debug 5: Sinnvolle Fehlerbehandlung und Meldung
# --------------------------------------------------
print("\n--- Debug 5 ---")

# Fehlerhafter Code (bzw. verbesserungswürdig):
# def teile_d5_alt(x, y):
#   if y == 0:
#     raise ZeroDivisionError # Löst Fehler aus, aber ohne spezifische Nachricht
#   return x / y
# try:
#   teile_d5_alt(4, 0)
# except Exception as e: # Fängt sehr allgemein Exception ab
#   print("Fehler", e) # e enthält Standardnachricht oder ist leer

# Frage: Ist die Fehlerbehandlung hier sinnvoll? Was fehlt in der Fehlermeldung?
# Antwort: Grundsätzlich ja. Die Fehlermeldung könnte beim `raise` spezifischer sein.
#          Es ist auch besser, spezifischere Exceptions (ZeroDivisionError) im `except` zu fangen.

# Korrigierter Code:
def teile_d5(x, y):
  if y == 0:
    raise ZeroDivisionError("Division durch Null ist in teile_d5 nicht erlaubt.") # Verbesserte Fehlermeldung
  return x / y

try:
  # print(f"Debug 5: teile_d5(4, 2) = {teile_d5(4, 2)}") # Würde 2.0 ausgeben
  ergebnis_d5 = teile_d5(4, 0)
  print(f"Debug 5: ergebnis_d5 = {ergebnis_d5}") # Diese Zeile wird nicht erreicht
except ZeroDivisionError as e: # Spezifischeres Abfangen
  print(f"Debug 5: Abgefangener Fehler - {e}") # Gibt die benutzerdefinierte Nachricht aus



# --------------------------------------------------
# Debug 6: `finally`-Block ohne `except`
# --------------------------------------------------
print("\n--- Debug 6 ---")

# Fehlerhafter Code (zeigt Verhalten):
# def mache_etwas_d6_fehler():
#   try:
#     x = int("abc") # Löst ValueError aus
#     print("Debug 6: x in try =", x) # Wird nicht erreicht
#   finally:
#     print("Debug 6: Finally-Block wurde ausgeführt.") # Wird immer ausgeführt
#
# # mache_etwas_d6_fehler() # Würde "Finally..." ausgeben und dann mit ValueError abstürzen

# Frage: Was passiert hier und warum wird kein Fehler angezeigt?
# Antwort: Der `finally`-Block wird immer ausgeführt. Da kein `except`-Block den `ValueError` fängt,
#          wird der Fehler *nach* dem `finally`-Block weitergereicht und führt zum Programmabbruch.
#          Die Python-Konsole zeigt den Fehler dann an, aber nicht unser `print`.

# Korrigierter Code (um Fehler zu fangen und anzuzeigen):
def mache_etwas_d6():
  try:
    x_d6 = int("abc") # Löst ValueError aus
    print("Debug 6: x_d6 in try =", x_d6) # Wird nicht erreicht
  except ValueError as e:
    print(f"Debug 6: Fehler im try-Block - {e}") # Fängt den Fehler und gibt Info aus
  finally:
    print("Debug 6: Finally-Block wurde IMMER ausgeführt.")

mache_etwas_d6()



# --------------------------------------------------
# Debug 7: `return` im `finally`-Block
# --------------------------------------------------
print("\n--- Debug 7 ---")

# Code, der das Verhalten zeigt:
def berechne_d7():
  try:
    print("Debug 7: Versuch der Division 10 / 0")
    return 10 / 0 # Löst ZeroDivisionError aus
  except ZeroDivisionError:
    print("Debug 7: Fehler - Division durch Null im except-Block!")
    return "Rückgabe aus except" # Dieser Return wird überschrieben
  finally:
    print("Debug 7: Finally-Block wird ausgeführt.")
    return "Rückgabe aus finally" # Dieser Return "gewinnt" immer

ergebnis_d7 = berechne_d7()
print(f"Debug 7: Endergebnis von berechne_d7() = {ergebnis_d7}")
# Erwartet: Alle print-Ausgaben (Try-Versuch, Except-Fehler, Finally) und dann als Endergebnis "Rückgabe aus finally"

# Frage: Warum wird “Fertig” (bzw. "Rückgabe aus finally") ausgegeben und nicht “Fehler” (bzw. "Rückgabe aus except")?
#        Was ist der Einfluss von finally?
# Antwort: Ein `return` im `finally`-Block überschreibt jeden `return` aus einem `try`- oder `except`-Block.
#          Er unterdrückt auch nicht abgefangene Fehler, wenn der `finally`-Block selbst normal endet.



# --------------------------------------------------
# Debug 8: Folgefehler nach `except` ohne `return`
# --------------------------------------------------
print("\n--- Debug 8 ---")

# Fehlerhafter Code:
# def konvertiere_d8_fehler(zahl_str):
#   try:
#     return int(zahl_str)
#   except ValueError:
#     print(f"Debug 8: Ungültige Eingabe '{zahl_str}'") # Gibt nur aus, gibt aber implizit None zurück
#
# x_d8_fehler = konvertiere_d8_fehler("abc") # x_d8_fehler wird None
# print(f"Debug 8: x_d8_fehler = {x_d8_fehler}")
# # print(x_d8_fehler + 1) # TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'


# Frage: Warum gibt es einen neuen Fehler, obwohl der erste abgefangen wurde?
# Antwort: Der `ValueError` wird abgefangen, aber der `except`-Block gibt keinen Wert zurück (also `None`).
#          Die Variable `x` wird zu `None`. `None + 1` führt dann zu einem `TypeError`.

# Korrigierter Code:
def konvertiere_d8(zahl_str):
  try:
    return int(zahl_str)
  except ValueError:
    print(f"Debug 8: Ungültige Eingabe '{zahl_str}' bei konvertiere_d8.")
    return None # Explizit None (oder einen anderen Fehlerindikator/Defaultwert) zurückgeben

x_d8_a = konvertiere_d8("abc")
print(f"Debug 8: Wert von x_d8_a (nach 'abc') = {x_d8_a}")
if x_d8_a is not None:
  print(f"Debug 8: x_d8_a + 1 = {x_d8_a + 1}")
else:
  print("Debug 8: x_d8_a ist None, keine Addition möglich.")

x_d8_b = konvertiere_d8("123")
print(f"Debug 8: Wert von x_d8_b (nach '123') = {x_d8_b}")
if x_d8_b is not None:
  print(f"Debug 8: x_d8_b + 1 = {x_d8_b + 1}") # Erwartet: 124
else:
  print("Debug 8: x_d8_b ist None, keine Addition möglich.")