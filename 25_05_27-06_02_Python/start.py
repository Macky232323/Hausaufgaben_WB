# Snake Case Schreibweise
first_name = "Christof" # String
last_name = "Gaßmann"
money = 10_000_000 # int # _ für uns besser lesbar, für Python keinen Unterschied
weight = 81.4 # float
has_a_mustach = False # True -> boolean

print(0.1+0.1+0.1) ## ergebnis ist hier 0.30000000000000004 -> Die Genauigkeit mit Float zahlen ist nicht 100% gegegeben

print(first_name, last_name)

a = 5
b = 7

print(a + b)
print(a - b)
print(a / b)
print(a * b)

# Modulu
print(7 % 5) # Restwert ist 2

# Potenz, exponenten 2 hoch 4 -> 16 
print(2**4)

# rundet die Float in eine ganzzahl -> 3
print(7//2)

zahl1 = 17
zahl1 += 1 # zahl1 = zahl1 + 1
zahl2 = 17
zahl2 -= 1 # zahl2 = zahl2 - 1

print(zahl1) # 18
print(zahl2) # 16

#String-Konkatenation 
print("Hallo " + first_name) # Hallo Christof
print(3 * "Jan") # JanJanJan

# input_result = input("Wie heißt du ? ")

# print("Hallo " + input_result)


#Python braucht korrekte Einrückungen
if True:
    print("Hallo aus dem True block")


print("Ich bin raus aus dem If Block")