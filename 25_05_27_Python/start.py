# Snake Case Schreibweise
first_name = "Alexander" # Variable Namen
last_name = "Manhardt"
money = 1234567 # integer
money = 1_234_567 # integer _ besser lesbar, für Python kein Unterschied
gewicht = 71.7 # float
hat_einen_bart = True #False # boolean

print(first_name, last_name, gewicht)

a = 5 
b = 7

print(a + b) # Addition
print(a - b) # Subtraktion
print(a / b) # Division
print(a * b) # Multiplikation

print(a % b) # modulu Rest der Division

print(2**4) # Potenzierung 2 hoch4
print(a // b) # Ganzzahldivision

print("Hallo " + first_name + " " + last_name) # String Verkettung
print(3* (first_name + " " + last_name + " ")) # String Multiplikation
print(f"Hallo {first_name} {last_name}") # f-String
