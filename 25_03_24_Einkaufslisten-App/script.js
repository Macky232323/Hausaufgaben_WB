// Variablen für alle relevanten DOM-Elemente
const artikelInput = document.getElementById("artikel");
const anzahlInput = document.getElementById("anzahl");
const preisInput = document.getElementById("preis");
const kategorieInput = document.getElementById("kategorie");
const addButton = document.getElementById("add-button");
const einkaufsliste = document.getElementById("einkaufsliste");
const gesamtpreisAnzeige = document.getElementById("gesamtpreis");
const leerenButton = document.getElementById("leeren-button");
const budgetInput = document.getElementById("budget");
const budgetUebrigAnzeige = document.getElementById("budget-uebrig");
const darkModeButton = document.getElementById("toggle-dark-mode");
const sortAlphabetischButton = document.getElementById("sort-alphabetisch");
const sortPreisButton = document.getElementById("sort-preis");

// Array zum Speichern der Artikeldaten
let einkaufslisteDaten // Initialisierung des Arrays!
// Variable für den Gesamtpreis
let gesamtpreis = 0;
// Variable für das Budget
let budget = 0;
// Zustand für Dark Mode
let darkMode = false;

// Funktion zum Abrufen des Emojis basierend auf der Kategorie
function getKategorieEmoji(kategorie) {
    switch (kategorie) {
        case "Obst":
            return "🍎";
        case "Gemüse":
            return "🥦";
        case "Drogerie":
            return "🧼";
        case "Sonstiges":
            return "🛒";
        default:
            return "🛒";
    }
}

// Funktion zur Validierung der Eingabefelder
function validateInput() {
    let isValid = true;

    if (artikelInput.value.trim() === "") {
        artikelInput.classList.add("error");
        isValid = false;
    } else {
        artikelInput.classList.remove("error");
    }

    if (anzahlInput.value.trim() === "" || isNaN(anzahlInput.value)) {
        anzahlInput.classList.add("error");
        isValid = false;
    } else {
        anzahlInput.classList.remove("error");
    }

    if (preisInput.value.trim() === "" || isNaN(preisInput.value)) {
        preisInput.classList.add("error");
        isValid = false;
    } else {
        preisInput.classList.remove("error");
    }

    return isValid;
}

// Funktion zum Aktualisieren des Gesamtpreises
function gesamtpreisAktualisieren() {
    gesamtpreis = 0;
    const listItems = einkaufsliste.querySelectorAll("li");

    listItems.forEach(item => {
        const checkbox = item.querySelector("input[type='checkbox']");
        if (checkbox.checked) {
            const preisText = item.textContent.match(/Gesamt: (\d+\.\d+) €/);
            if (preisText && preisText[1]) {
                gesamtpreis += parseFloat(preisText[1]);
            }
        }
    });

    // Korrekte Berechnung des Gesamtpreises basierend auf einkaufslisteDaten
    gesamtpreis = einkaufslisteDaten.reduce((sum, item) => {
        return sum + (item.checked ? item.gesamtArtikelPreis : 0);
    }, 0);

    gesamtpreisAnzeige.textContent = gesamtpreis.toFixed(2);
    aktualisiereBudgetAnzeige();
}

// Funktion zum Aktualisieren der Budgetanzeige
function aktualisiereBudgetAnzeige() {
    budget = parseFloat(budgetInput.value) || 0;
    const budgetUebrig = budget - gesamtpreis;
    budgetUebrigAnzeige.textContent = `Budget übrig: ${budgetUebrig.toFixed(2)} €`;

    if (budgetUebrig < 0) {
        budgetUebrigAnzeige.style.color = "red";
    } else {
        budgetUebrigAnzeige.style.color = "green";
    }
}

// Funktion zum Umschalten des Dark Mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
}

// Funktion zum Entfernen eines Artikels
function entferneArtikel(li, index) {
    if (li) {
        einkaufslisteDaten.splice(index, 1);
        li.remove();
        gesamtpreisAktualisieren();
        aktualisiereBudgetAnzeige();
    }
}

// Funktion zum Bearbeiten eines Eintrags
function bearbeiteEintrag(li, index) {
    if (li) {
        const item = einkaufslisteDaten[index];

        const inputAnzahl = document.createElement("input");
        inputAnzahl.type = "number";
        inputAnzahl.value = item.anzahl;

        const inputArtikel = document.createElement("input");
        inputArtikel.type = "text";
        inputArtikel.value = item.artikel;

        const inputPreis = document.createElement("input");
        inputPreis.type = "number";
        inputPreis.value = item.preis;

        li.innerHTML = "";
        li.appendChild(inputAnzahl);
        li.appendChild(inputArtikel);
        li.appendChild(inputPreis);

        const speichernButton = document.createElement("button");
        speichernButton.textContent = "Speichern";
        li.appendChild(speichernButton);

        const abbrechenButton = document.createElement("button");
        abbrechenButton.textContent = "Abbrechen";
        li.appendChild(abbrechenButton);

        speichernButton.addEventListener("click", () => {
            const neueAnzahl = parseFloat(inputAnzahl.value);
            const neuerArtikel = inputArtikel.value.trim();
            const neuerPreis = parseFloat(inputPreis.value);

            if (neuerArtikel && !isNaN(neueAnzahl) && !isNaN(neuerPreis)) {
                item.anzahl = neueAnzahl;
                item.artikel = neuerArtikel;
                item.preis = neuerPreis;
                item.gesamtArtikelPreis = neueAnzahl * neuerPreis;

                updateEintrag(index);
                gesamtpreisAktualisieren();
                aktualisiereBudgetAnzeige();
            } else {
                alert("Ungültige Eingabe!");
            }
        });

        abbrechenButton.addEventListener("click", () => {
            updateEintrag(index); // Stelle den ursprünglichen Eintrag wieder her
        });
    }
}

// Funktion zum Aktualisieren eines Eintrags in der Liste
function updateEintrag(index) {
    const li = einkaufsliste.querySelector(`[data-index="${index}"]`);
    if (li) {
        const item = einkaufslisteDaten[index];
        const kategorieEmoji = getKategorieEmoji(item.kategorie);
        li.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span class="kategorie-emoji">${kategorieEmoji}</span> ${item.anzahl} x ${item.artikel}: ${item.preis.toFixed(2)} € (Gesamt: ${item.gesamtArtikelPreis.toFixed(2)} €)
            <button class="entfernen-button">Entfernen</button>
            <button class="bearbeiten-button">Bearbeiten</button>
            <span class="tooltip-container">
                <span class="tooltip-text">${item.hinzugefuegtAm}</span>
            </span>
        `;

        // Event-Listener für die neu erstellten Elemente zuweisen
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            item.checked = checkbox.checked;
            gesamtpreisAktualisieren();
        });

        const entfernenButton = li.querySelector(".entfernen-button");
        entfernenButton.addEventListener("click", () => {
            entferneArtikel(li, index);
        });

        const bearbeitenButton = li.querySelector(".bearbeiten-button");
        bearbeitenButton.addEventListener("click", () => {
            bearbeiteEintrag(li, index);
        });
    }
}

// Funktion zum Hinzufügen eines neuen Artikels zur Einkaufsliste
function artikelHinzufuegen() {
    if (validateInput()) {
        const artikel = artikelInput.value.trim();
        const anzahl = parseInt(anzahlInput.value);
        const preis = parseFloat(preisInput.value);
        const kategorie = kategorieInput.value;
        const kategorieEmoji = getKategorieEmoji(kategorie);
        const gesamtArtikelPreis = anzahl * preis;
        const hinzugefuegtAm = new Date().toLocaleString();

        const neuesItem = {
            artikel: artikel,
            anzahl: anzahl,
            preis: preis,
            kategorie: kategorie,
            gesamtArtikelPreis: gesamtArtikelPreis,
            hinzugefuegtAm: hinzugefuegtAm,
            checked: true // Standardmäßig ausgewählt
        };

        einkaufslisteDaten.push(neuesItem);

        const li = document.createElement("li");
        li.setAttribute("data-index", einkaufslisteDaten.length - 1);
        li.innerHTML = `
            <input type="checkbox" checked>
            <span class="kategorie-emoji">${kategorieEmoji}</span> ${anzahl} x ${artikel}: ${preis.toFixed(2)} € (Gesamt: ${gesamtArtikelPreis.toFixed(2)} €)
            <button class="entfernen-button">Entfernen</button>
            <button class="bearbeiten-button">Bearbeiten</button>
            <span class="tooltip-container">
                <span class="tooltip-text">${hinzugefuegtAm}</span>
            </span>
        `;

        einkaufsliste.appendChild(li);

        // Event-Listener für die neu erstellten Elemente zuweisen
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            neuesItem.checked = checkbox.checked;
            gesamtpreisAktualisieren();
        });

        const entfernenButton = li.querySelector(".entfernen-button");
        entfernenButton.addEventListener("click", () => {
            entferneArtikel(li, einkaufslisteDaten.length - 1);
        });

        const bearbeitenButton = li.querySelector(".bearbeiten-button");
        bearbeitenButton.addEventListener("click", () => {
            bearbeiteEintrag(li, einkaufslisteDaten.length - 1);
        });

        // Eingabefelder zurücksetzen
        artikelInput.value = "";
        anzahlInput.value = "";
        preisInput.value = "";

        // Gesamtpreis und Budget aktualisieren
        gesamtpreisAktualisieren();
        aktualisiereBudgetAnzeige();
    } else {
        alert("Bitte füllen Sie alle Felder korrekt aus.");
    }
}

// Event-Listener für den "Hinzufügen"-Button
addButton.addEventListener("click", artikelHinzufuegen);

// Event-Listener zum Leeren der Liste
leerenButton.addEventListener("click", () => {
    einkaufslisteDaten
    einkaufsliste.innerHTML = "";
    gesamtpreis = 0;
    gesamtpreisAnzeige.textContent = "0.00";
    budgetInput.value = "";
    aktualisiereBudgetAnzeige();
});

// Event-Listener für das Budget-Input-Feld
budgetInput.addEventListener("change", aktualisiereBudgetAnzeige);

// Event-Listener für den Dark Mode Button
darkModeButton.addEventListener("click", toggleDarkMode);

// Event-Listener für alphabetische Sortierung
sortAlphabetischButton.addEventListener("click", () => {
    einkaufslisteDaten.sort((a, b) => a.artikel.localeCompare(b.artikel));
    einkaufsliste.innerHTML = ""; // Liste leeren
    einkaufslisteDaten.forEach((item, index) => {
        const li = document.createElement("li");
        li.setAttribute("data-index", index);
        const kategorieEmoji = getKategorieEmoji(item.kategorie);
        li.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span class="kategorie-emoji">${kategorieEmoji}</span> ${item.anzahl} x ${item.artikel}: ${item.preis.toFixed(2)} € (Gesamt: ${item.gesamtArtikelPreis.toFixed(2)} €)
            <button class="entfernen-button">Entfernen</button>
            <button class="bearbeiten-button">Bearbeiten</button>
            <span class="tooltip-container">
                <span class="tooltip-text">${item.hinzugefuegtAm}</span>
            </span>
        `;
        einkaufsliste.appendChild(li);

        // Event-Listener für die neu erstellten Elemente zuweisen (innerhalb der Schleife!)
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            item.checked = checkbox.checked;
            gesamtpreisAktualisieren();
        });

        const entfernenButton = li.querySelector(".entfernen-button");
        entfernenButton.addEventListener("click", () => {
            entferneArtikel(li, index);
        });

        const bearbeitenButton = li.querySelector(".bearbeiten-button");
        bearbeitenButton.addEventListener("click", () => {
            bearbeiteEintrag(li, index);
        });
    });
});

// Event-Listener für Preis-Sortierung
sortPreisButton.addEventListener("click", () => {
    einkaufslisteDaten.sort((a, b) => a.gesamtArtikelPreis - b.gesamtArtikelPreis);
    einkaufsliste.innerHTML = ""; // Liste leeren
    einkaufslisteDaten.forEach((item, index) => {
        const li = document.createElement("li");
        li.setAttribute("data-index", index);
        const kategorieEmoji = getKategorieEmoji(item.kategorie);
        li.innerHTML = `
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span class="kategorie-emoji">${kategorieEmoji}</span> ${item.anzahl} x ${item.artikel}: ${item.preis.toFixed(2)} € (Gesamt: ${item.gesamtArtikelPreis.toFixed(2)} €)
            <button class="entfernen-button">Entfernen</button>
            <button class="bearbeiten-button">Bearbeiten</button>
            <span class="tooltip-container">
                <span class="tooltip-text">${item.hinzugefuegtAm}</span>
            </span>
        `;
        einkaufsliste.appendChild(li);

        // Event-Listener für die neu erstellten Elemente zuweisen (innerhalb der Schleife!)
        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            item.checked = checkbox.checked;
            gesamtpreisAktualisieren();
        });

        const entfernenButton = li.querySelector(".entfernen-button");
        entfernenButton.addEventListener("click", () => {
            entferneArtikel(li, index);
        });

        const bearbeitenButton = li.querySelector(".bearbeiten-button");
        bearbeitenButton.addEventListener("click", () => {
            bearbeiteEintrag(li, index);
        });
    });
});

// Initialisierung
gesamtpreisAktualisieren();
aktualisiereBudgetAnzeige();