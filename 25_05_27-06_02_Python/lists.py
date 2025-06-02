####### SLicing und indexing
# my_list = ["Apfel","Birne","Mango","Zwiebel","Chips","Waschmaschinentabs","Küchenrolle"]
# print(my_list[2]) #hol das zweite element aus der list
# print(my_list[1:11:2]) # slicing startwert:endwert:sprungwert
# print(my_list[::2]) # jedes zweite element aus der list
# print(my_list[:3:]) # jedes element von anfang bis exklusive das dritte(index)
# print(my_list[2:]) # jedes element von ab index 2 

# print(my_list[-1]) # das letzte Element aus der Liste
# print(my_list[-2]) # das vorletzte Element aus der Liste

###### append, insert, index und delete befehle
# zahlen = [1,2]
# zahlen.append(3)

# print(zahlen)
# zahlen.insert(0,0) # füge an index 0 die Zahl 0 hinzu
# zahlen.insert(2,200) # füge an index 2 die Zahl 200 hinzu -> alle anderen Zahlen verschieben sich um einen index

# print(zahlen)

# print(zahlen.index(200)) 

# print(my_list.index("Chips"))

# zahlen.pop() # entfernt das letzte element aus der liste
# print(zahlen)

# zahlen.remove(200) # löscht die Zahl 200 aus der Liste
# print(zahlen)

# del(zahlen[1])
# print(zahlen)

##### len und sort,reverse und sorted

# print(len(my_list))
# leer = []
# print(len(leer))

# zahlen = [5,1,3,2,19,7,0]
# zahlen.sort(reverse=True) # descending sortierung (absteigend)
# print(zahlen)
# zahlen.sort() # ascending sortierung (aufsteigend)
# print(zahlen)

# names = ["Senda", "Alex", "Marcel", "Zsuzsa", "Mete","Suheib"]
# names.sort() # Sortiert alphabetisch
# print(names)
# names.reverse() # dreht die Liste um, in unserem Fall sortiert absteigend
# print(names)

# zahlen2 = [5,3,4,1,17,2]
# sortierte_liste=sorted(zahlen2)
# # zahlen2.sort() #Hier verändern wir tatsächlich die originale Liste
# print(sortierte_liste)
# print(zahlen2)

#### iteration über Listen mit schleifen

# farben = ["rot","grün","blau","gelb","violett","dunkelrot"]
# for farbe in farben:
#     print("Deine aktuelle Farbe ist:", farbe)

# for i in range(len(farben)):
#     print(f"Deine {i+1}. Farbe ist: {farben[i]}")

##### Initialisierung einer Liste mit einer for schleife
# zahlen= []

# for i in range(10):
#     zahlen.append(i)

# print(zahlen)
# viele_zahlen = list(range(50))
# print(viele_zahlen)

# quadrate = []
# for i in range(10):
#     quadrate.append(i*i)
# print(quadrate)

# farben = ["rot","grün","blau","gelb","violett","dunkelrot"]


# print("rot"  in farben) ## True
# print("Apfel" not in farben) ## True
# print("pink" in farben) ## False

# ###### List comprehension

# quadrate2 = [i * i for i in range(10)]
# print(quadrate2)

# ## ohne List Comrephension
# gerade = []
# for i in range(100):
#     if i % 2 == 0:
#         gerade.append(i)
# print(gerade)

# ## Mit List comprehension 
# gerade2 = [i for i in range(100) if i % 2 == 0]
# print(gerade2)

##### Kopieren und klonen von Listen

# zahl1 = 5
# zahl2 = zahl1 

# print(zahl1 == zahl2) ## True
# zahl2 = 10
# print(zahl1 == zahl2) ## False

# liste1 = [1,2,3]
# liste2 = liste1

# print(liste1 == liste2) ## True
# liste2.append(4)
# print(liste1 == liste2) ## True
# print(liste1)
# print(liste2)

# liste1 = [1,2,3]
# ## 3 Varianten echte Kopien von einer Liste
# # liste2 = liste1.copy()
# # liste2 = list(liste1)
# liste2 = liste1[:] # slicing

# print(liste2 == liste1) ## True
# liste2.append(4)
# print(liste2 == liste1) ## False


matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(len(matrix))
print(matrix[1][1])

for zeile in matrix:
    print(zeile)

for zeile in matrix:
    for wert in zeile:
        print(wert)