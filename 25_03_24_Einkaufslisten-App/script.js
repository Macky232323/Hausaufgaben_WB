const addButton = document.getElementById("addButton");
const artikelInput = document.getElementById("artikel");
const anzahlInput = document.getElementById("anzahl");
const preisInput = document.getElementById("preis");
const kategorieInput = document.getElementById("kategorie");
const liste = document.getElementById("liste");
const gesamt = document.getElementById("gesamt");
const toggleDarkModeButton = document.getElementById("toggleDarkMode");
const budgetInput = document.getElementById("budget");
const budgetFeedback = document.getElementById("budgetFeedback");

let gesamtPreis = 0;
let budget = 0;

budgetInput.addEventListener("change", () => {
    budget = Number(budgetInput.value);
    updateBudgetFeedback();
});

addButton.addEventListener("click", addArtikel);

function addArtikel() {
    const artikel = artikelInput.value.trim();
    const anzahl = anzahlInput.value.trim();
    const preis = preisInput.value.trim();
    const kategorie = kategorieInput.value;

    // Eingabevalidierung
    if (!artikel) {
        artikelInput.classList.add("error");
        return;
    } else {
        artikelInput.classList.remove("error");
    }

    if (!anzahl || isNaN(anzahl) || Number(anzahl) <= 0) {
        anzahlInput.classList.add("error");
        return;
    } else {
        anzahlInput.classList.remove("error");
    }

    if (!preis || isNaN(preis) || Number(preis) <= 0) {
        preisInput.classList.add("error");
        return;
    } else {
        preisInput.classList.remove("error");
    }

    // Emoji für die Kategorie auswählen
    let kategorieEmoji = "";
    switch (kategorie) {
        case "Obst":
            kategorieEmoji = "🍏";
            break;
        case "Gemüse":
            kategorieEmoji = "🥕";
            break;
        case "Drogerie":
            kategorieEmoji = "🧼";
            break;
        case "Sonstiges":
            kategorieEmoji = "🛒";
            break;
    }

    const itemPreis = Number(preis) * Number(anzahl);

    // Dopplung prüfen
    let existingItem = null;
    document.querySelectorAll("#liste li").forEach(li => {
        const textContent = li.textContent.split("------")[0].trim();
        const existingArtikel = textContent.split("x ")[1].split(":")[0];
        const existingPreis = textContent.split("€ p.P.")[0].split(": ")[1];
        if (existingArtikel === artikel && Number(existingPreis) === Number(preis)) {
            existingItem = li;
        }
    });

    if (existingItem) {
        // Anzahl des bestehenden Artikels erhöhen
        const existingAnzahl = Number(existingItem.textContent.split("x ")[0].split(" ")[1]);
        const newAnzahl = existingAnzahl + Number(anzahl);
        existingItem.textContent = `${kategorieEmoji} ${newAnzahl} x ${artikel}: ${preis}€ p.P. ------ ${newAnzahl * preis}€`;
    } else {
        // Neues Element erstellen und in die Liste einfügen
        const new_li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true; // Standardmäßig aktiviert

        const itemText = document.createElement("span");
        itemText.textContent = `${kategorieEmoji} ${anzahl} x ${artikel}: ${preis}€ p.P. ------ ${itemPreis}€`;

        new_li.appendChild(checkbox);
        new_li.appendChild(itemText);

        // Checkbox Event Listener
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                itemText.classList.remove("checked");
            } else {
                itemText.classList.add("checked");
            }
            updatePreis();
        });

        // Füge einen Löschen Button hinzu
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", () => {
            const preisText = new_li.textContent.split("------")[1];
            const preisToRemove = Number(preisText.replace("€", ""));
            liste.removeChild(new_li);
            gesamtPreis -= preisToRemove;
            updatePreis();
            updateBudgetFeedback();
        });
        new_li.appendChild(deleteButton);

        liste.appendChild(new_li);
    }

    // Inputfelder leeren
    artikelInput.value = "";
    anzahlInput.value = "";
    preisInput.value = "";
    kategorieInput.value = "Obst"; // Standardwert zurücksetzen

    // Gesamtpreis aktualisieren
    gesamtPreis += itemPreis;
    updatePreis();
    updateBudgetFeedback();
}

function updatePreis() {
    gesamtPreis = 0;
    document.querySelectorAll("#liste li").forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox.checked) {
            const preisText = li.textContent.split("------")[1];
            gesamtPreis += Number(preisText.replace("€", ""));
        }
    });
    gesamt.textContent = `Gesamt: ${gesamtPreis.toFixed(2)}€`;
}

function updateBudgetFeedback() {
    const verbleibendesBudget = budget - gesamtPreis;
    if (verbleibendesBudget < 0) {
        budgetFeedback.textContent = `Budget überschritten um ${Math.abs(verbleibendesBudget).toFixed(2)}€!`;
        budgetFeedback.style.color = "red";
    } else if (verbleibendesBudget < budget * 0.2) {
        budgetFeedback.textContent = `Noch ${verbleibendesBudget.toFixed(2)}€ vom Budget übrig. Vorsicht!`;
        budgetFeedback.style.color = "orange";
    } else {
        budgetFeedback.textContent = `Noch ${verbleibendesBudget.toFixed(2)}€ vom Budget übrig.`;
        budgetFeedback.style.color = "green";
    }
}

// Funktion zum Leeren der gesamten Liste
function clearList() {
    liste.innerHTML = "";
    gesamtPreis = 0;
    updatePreis();
    updateBudgetFeedback();
}

// Button zum Leeren der Liste hinzufügen
const clearButton = document.createElement("button");
clearButton.textContent = "Liste leeren";
clearButton.addEventListener("click", clearList);
document.body.appendChild(clearButton);

// Dark Mode Funktionalität
toggleDarkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Funktionalität mit Enter-Taste
artikelInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

anzahlInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

preisInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});