# Aufgabe 1
# Fehler: 'for' ist ein Keyword. Behoben: Umbenannt zu 'meine_zahl'.
meine_zahl = 7
print(meine_zahl)



# Aufgabe 2
name = "Ada"
if name == "Ada":
    # Fehler: Fehlende Einrückung. Behoben: print() eingerückt.
    print("Hello,", name)



# Aufgabe 3
price_str  = "19.99"
quantity = 3
# Fehler: 'price_str' ist String, Multiplikation wiederholt ihn. Behoben: 'price_str' zu float konvertiert.
total = float(price_str) * quantity
print("Total:", total)