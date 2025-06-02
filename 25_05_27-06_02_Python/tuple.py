# liste=[0,1,2]

# liste[0] = 100

# print(liste)

my_tuple = (0,1,2,3,4,5,6,7,8,9)
print(my_tuple[0:6:2]) # slicing funktioniert auch hier
print(my_tuple[0])
print(my_tuple[-1])

red = (255,0,0)
person = ("Joshua",31,"Köln")

print(my_tuple)

for attribut in person:
    print(attribut)

## Unterschiede zwischen Listen und Tuple
## []  | ()
## Veränderbar | nicht veränderbar
## langsamer | etwas schneller

my_tuple2 = (1,) ## einzelner wert kann nur mit einem weiteren komma als tuple initalisiert werden
print(my_tuple2)

## Es können hier weitere Tuples hinzugefügt werden, die einzelnen tuples sind aber nicht mehr veränderbar
daten = [("Joshua",31,"Köln"),("Suheib",28,"Frankfurt")] 
print(daten[0]) ## person Joshua als ergebnis 

## Es können hier keine weiteren Listen hinzugefügt werden, die einzelnen Listen sind aber veränderbar
daten2 = (["Joshua",31,"Köln"], ["Suheib",28,"Frankfurt"])
daten2[0][1] = 35

print(daten2)