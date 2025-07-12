def analyze_numbers():
    input_str = input("Geben Sie eine Reihe von ganzen Zahlen ein (durch Leerzeichen getrennt): ")
    
    try:
        numbers_list = [int(num) for num in input_str.split()]
    except ValueError:
        print("\nFehler: Ihre Eingabe enthielt ungültige Zeichen. Bitte nur ganze Zahlen eingeben.")
        return

    if not numbers_list:
        print("\nSie haben keine Zahlen eingegeben.")
        return

    unique_numbers = set(numbers_list)
    
    frequency_map = {}
    for number in numbers_list:
        frequency_map[number] = frequency_map.get(number, 0) + 1
        
    print("\n--- Analyse Ihrer Eingabe ---")
    
    print(f"Gesamtzahl der eingegebenen Werte: {len(numbers_list)}")
    
    print(f"Menge der eindeutigen Zahlen: {unique_numbers}")
    
    print("Häufigkeit jeder Zahl (sortiert):")
    for number, count in sorted(frequency_map.items()):
        print(f"  - Zahl {number}: {count} Mal")

if __name__ == "__main__":
    analyze_numbers()