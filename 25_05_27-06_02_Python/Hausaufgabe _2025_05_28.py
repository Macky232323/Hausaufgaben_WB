# Debug 1
zahl_str = "10" # Variable umbenannt, um Klarheit zu schaffen (war 'zahl')
# Fehler: TypeError (str + int). Behoben: int(zahl_str) für Konvertierung.
ergebnis = int(zahl_str) + 5
print("Debug 1:", ergebnis)

 

# Debug 2
x_debug2 = 3 # Variable umbenannt, um Konflikte zu vermeiden
# Fehler: Fehlende Einrückung. Behoben: print() eingerückt.
if x_debug2 > 0:
    print("Debug 2: x ist positiv")

 

# Debug 3
# Fehler: Fehlender ':' und Einrückung. Behoben: ':' ergänzt, print() eingerückt.
print("Debug 3:")
for i_debug3 in range(5): # Variable i umbenannt
    print(i_debug3)

 

# Debug 4
alter = 18
# Fehler: Zuweisung '=' statt Vergleich '==' in if. Behoben: Zu '==' geändert.
if alter == 18:
    print("Debug 4: Volljährig")

 

# Debug 5
x_debug5 = 4
y_debug5 = 2
# Info: '^' ist bitweises XOR. 4 (100b) ^ 2 (010b) = 6 (110b). Code korrekt.
z_debug5 = x_debug5 ^ y_debug5
print("Debug 5: Ergebnis ist", z_debug5) # Erwartetes Ergebnis: 6

 

# Debug 6
x_debug6 = 10
# Info: Korrektes if-else. 'else' gehört zum inneren 'if'. Für x=10 -> "groß". Code ok.
if x_debug6 > 0:
    if x_debug6 < 5:
        print("Debug 6: klein")
    else: # Gehört zum inneren if
        print("Debug 6: groß")

 

# Debug 7
# Fehler: Endlosschleife. Behoben: Zähler + break nach 3 Iterationen.
print("Debug 7:")
zaehler_debug7 = 0
while True:
    print("Hallo")
    zaehler_debug7 += 1
    if zaehler_debug7 >= 3:
        break

 

# Debug 8
# Fehler: TypeError (str > int), fehlende Einrückung. Behoben: int(eingabe), print() eingerückt.
eingabe_str_debug8 = input("Debug 8: Gib eine Zahl ein: ")
try:
    eingabe_int_debug8 = int(eingabe_str_debug8)
    if eingabe_int_debug8 > 10:
        print("Debug 8: größer als 10")
    else:
        print("Debug 8: kleiner oder gleich 10")
except ValueError:
    print("Debug 8: Ungültige Eingabe. Bitte eine Zahl eingeben.")