# Debug 1:
a_debug1 = [1, 2, 3]
b_debug1 = a_debug1
b_debug1[0] = 99
print("Debug 1:")
print("a =", a_debug1)
print("b =", b_debug1)
# F: a[0] ändert sich mit b[0], da b nur Referenz auf a ist.
# V: Flache Kopie erstellen: c_debug1 = a_debug1[:] oder a_debug1.copy().
c_debug1 = a_debug1[:]
c_debug1[0] = 777 
print("a nach Kopie-Test =", a_debug1)
print("c (Kopie von a) =", c_debug1)

 

# Debug 2:
farben_debug2 = ["rot", "gruen", "blau"]
# print(farben_debug2[3]) # Verursacht Fehler
# A: IndexError: Index 3 ist out of bounds (max. 2).
# L: Gültigen Index nutzen, z.B. farben_debug2[2] (letztes Element).
print("Debug 2: Letztes Element:", farben_debug2[2])

 

# Debug 3:
zahlen_debug3 = [1, 2, 3, 4]
doppelt_debug3 = [x + x for x in zahlen_debug3 if x % 2]
print("Debug 3: doppelt =", doppelt_debug3) # Erwartet: [2, 6]
# A: 'if x % 2' filtert: True für ungerade (x % 2 == 1), False für gerade (x % 2 == 0). Nur ungerade werden verdoppelt.

 

# Debug 4:
tupel_debug4 = (1, 2, 3)
# tupel_debug4[1] = 5 # Verursacht Fehler
# A: TypeError: Tupel sind immutable (unveränderlich). Elementzuweisung 'tupel[1] = 5' ist nicht erlaubt.
print("Debug 4: TypeError bei tupel_debug4[1] = 5, da Tupel immutable.")

 

# Debug 5:
daten_debug5 = ("Ali", [10, 20])
daten_debug5[1].append(30) # Verändert die Liste im Tupel
print("Debug 5: daten =", daten_debug5) # Erwartet: ('Ali', [10, 20, 30])
# A: Tupel-Referenzen sind fix. Element daten_debug5[1] ist aber eine mutable Liste, diese WIRD verändert.

 

# Debug 6:
farben_debug6 = {"rot": "#FF0000", "gruen": "#00FF00", "blau": "#0000FF"}
print("Debug 6 - Nur Schlüssel:")
for eintrag_debug6 in farben_debug6:
    print(eintrag_debug6)
# A: Standarditeration über Dict gibt Schlüssel. Für Schlüssel & Wert: `for k, v in dict.items():`.
print("Debug 6 - Schlüssel und Werte:")
for schluessel, wert in farben_debug6.items():
    print(f"{schluessel} = {wert}")