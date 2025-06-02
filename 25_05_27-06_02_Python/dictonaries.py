person = {
    "name":"Christof",
    "alter": 29,
    "schulfächer": ["Mathe","Physik"]
}

person["alter"] = 35
print(person["alter"])
print(person["schulfächer"])
print(person.get("alter"))