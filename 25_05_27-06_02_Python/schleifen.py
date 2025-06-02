for i in range(10):
    pass # pass macht nichts, ist aber nötig um einen leeren Block zu haben

for i in range(10):
    print(i)


counter = 5
while counter < 10:
    print("Ich bin in der while schleife drin", counter)
    counter += 1 #counter = counter +1
else:
    print("Ich bin endlich raus aus der while Schleife")

for _ in "Hallo Welt":
    print("Ich bin eine Schleife entstanden durch einen String")
else:
    print("Ich hab die Sequenz durch gearbeitet")


for i in range(10):
    if i % 2 == 0: # wenn es eine gerade zahl ist
        print(i)

for i in range(10):
    if i == 5:
        continue ## continue überspringt die aktuelle Iteration
    print(i)

for i in range(10):
    if i == 5:
        break ## break bricht die schleife komplett ab
    print(i)


