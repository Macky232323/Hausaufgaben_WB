alter = input("Wie alt bist du?: ") # String

print("Dein Alter ist: " + alter) # Hier werden zwei Strings addiert

alter2 = 18
# Hier casten wir das int in ein str
print("Dein Alter ist: " + str(alter2))
print(f"Dein Alter ist {alter2}") # Hier kümmert sich Python automatisch um die umwandlung durch den formatted String


print("Apfel","Mango","Zwiebel","Chips", sep="---")
print("Apfel","Mango","Zwiebel","Chips", sep="\n")

print("Apfel", end="Christof ist der beste") 
print("Mango")
print("Zwiebel")
print("Chips")