def ask_question():
    question = "Welche dieser Variablennamen ist in Python nicht erlaubt?"
    options = "A) my_var\tB) _var\tC) 2var\tD) var_2"
    
    print(question)
    print(options)
    print("-" * 20)
    
    user_answer = input("Deine Antwort (A, B, C oder D): ")
    
    correct_answer = "C"
    
    if user_answer.strip().upper() == correct_answer:
        print("\n✅ Richtig! Sehr gut gemacht.")
    else:
        print("\n❌ Das ist leider nicht korrekt.")
        print("Die richtige Antwort ist C, denn Variablennamen in Python dürfen nicht mit einer Ziffer beginnen.")

if __name__ == "__main__":
    ask_question()