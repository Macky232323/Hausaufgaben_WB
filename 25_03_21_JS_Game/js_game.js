let name;
let alter;
let waffe;
let ritterlichkeit;
let staerke;
let weisheit;
let zauber;
let pfad;
let freundschaft;
let mut;
let zauberer;

const output = document.getElementById("output");
const input = document.getElementById("input");
const sendButton = document.getElementById("send");

function showImage(imageSrc) {
    document.body.style.backgroundImage = `url('${imageSrc}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';
}

function display(text) {
    output.value += text + "\n";
    output.scrollTop = output.scrollHeight; // Scroll to bottom
}

function askName() {
    showImage("start.png"); // Show start image
    display("Wie heißt du, tapferer Held?");
    sendButton.onclick = handleName;
}

function handleName() {
    name = input.value;
    display("Freut mich, dich kennenzulernen, " + name + "!");
    input.value = "";
    askAge();
}

function askAge() {
    display("Wie alt bist du?");
    sendButton.onclick = handleAge;
}

function handleAge() {
    alter = input.value;
    input.value = "";
    if (alter >= 18) {
        display("Du bist alt genug, um in den Kampf zu ziehen!");
        askWeapon();
    } else {
        display("Du bist noch zu jung. Trainiere weiter und kehre später zurück!");
    }
}

function askWeapon() {
    display("Wählst du das Schwert oder Magie?");
    sendButton.onclick = handleWeapon;
}

function handleWeapon() {
    waffe = input.value;
    input.value = "";
    if (waffe.toLowerCase() === "schwert") {
        display("Du schwingst dein Schwert und kämpfst tapfer!");
        showImage("sword.png");
        askKnight();
    } else {
        display("Du wirkst einen mächtigen Zauber!");
        showImage("magic.png");
        askWisdom();
    }
}

// Pfad des Schwertkämpfers
function askKnight() {
    display("Ein Drache versperrt deinen Weg! Greifst du ihn an oder versuchst du, ihn zu besänftigen?");
    sendButton.onclick = handleKnight;
}

function handleKnight() {
    ritterlichkeit = input.value;
    input.value = "";
    if (ritterlichkeit.toLowerCase() === "angreifen") {
        display("Mit einem heldenhaften Satz stürzt du dich in den Kampf!");
        askStrength();
    } else {
        display("Du sprichst mit dem Drachen und erfährst, dass er nur seinen Schatz bewacht. Du teilst ihn mit ihm und er lässt dich passieren.");
        showImage("dragon_peace.png");
        askPath();
    }
}

function askStrength() {
    display("Der Drache ist mächtig! Setzt du auf Stärke oder Geschicklichkeit?");
    sendButton.onclick = handleStrength;
}

function handleStrength() {
    staerke = input.value;
    input.value = "";
    if (staerke.toLowerCase() === "stärke") {
        display("Deine Muskeln triumphieren, der Drache ist besiegt!");
        showImage("dragon_defeated.png");
    } else {
        display("Deine flinken Bewegungen verwirren den Drachen, er zieht sich zurück!");
        showImage("dragon_flees.png");
    }
    askPath();
}

// Pfad des Magiers
function askWisdom() {
    display("Ein Rätsel stellt sich dir in den Weg! Wählst du Weisheit oder Intuition?");
    sendButton.onclick = handleWisdom;
}

function handleWisdom() {
    weisheit = input.value;
    input.value = "";
    if (weisheit.toLowerCase() === "weisheit") {
        display("Du studierst die alten Schriften und entschlüsselst das Rätsel!");
        showImage("scrolls.png");
        askMagic();
    } else {
        display("Du folgst deinem Instinkt und findest den verborgenen Pfad!");
        showImage("path.png");
        askPath();
    }
}

function askMagic() {
    display("Ein finsterer Zauber liegt über dem Land! Welchen Zauber wählst du: Licht oder Schatten?");
    sendButton.onclick = handleMagic;
}

function handleMagic() {
    zauber = input.value;
    input.value = "";
    if (zauber.toLowerCase() === "licht") {
        display("Der Zauber des Lichts vertreibt die Dunkelheit!");
        showImage("light_spell.png");
    } else {
        display("Du nutzt die Schatten, um die finstere Macht zu schwächen!");
        showImage("shadow_spell.png");
    }
    askPath();
}

// Gemeinsamer Pfad
function askPath() {
    display("Du stehst an einer Weggabelung. Wählst du den sicheren Pfad oder den gefährlichen Dschungel?");
    sendButton.onclick = handlePath;
}

function handlePath() {
    pfad = input.value;
    input.value = "";
    if (pfad.toLowerCase() === "sicherer pfad") {
        display("Der sichere Pfad führt dich durch friedliche Dörfer. Du erhältst nützliche Ausrüstung!");
        showImage("village.png");
    } else {
        display("Im Dschungel erwarten dich gefährliche Kreaturen und wertvolle Schätze!");
        showImage("jungle.png");
    }
    askFriendship();
}

function askFriendship() {
    display("Ein Zwerg bietet dir seine Hilfe an. Nimmst du sie an?");
    sendButton.onclick = handleFriendship;
}

function handleFriendship() {
    freundschaft = input.value;
    input.value = "";
    if (freundschaft.toLowerCase() === "ja") {
        display("Der Zwerg ist ein treuer Gefährte!");
        showImage("dwarf_friend.png");
    } else {
        display("Du setzt deinen Weg alleine fort.");
        showImage("lonely_path.png");
    }
    askCourage();
}

function askCourage() {
    display("Du stehst vor der Burg des bösen Zauberers! Stürmst du sie oder suchst du einen geheimen Eingang?");
    sendButton.onclick = handleCourage;
}

function handleCourage() {
    mut = input.value;
    input.value = "";
    if (mut.toLowerCase() === "stürmen") {
        display("Mit einem lauten Schlachtruf greifst du die Burg an!");
        showImage("castle_attack.png");
    } else {
        display("Du findest einen versteckten Tunnel, der in die Burg führt!");
        showImage("secret_tunnel.png");
    }
    askWizard();
}

function askWizard() {
    display("Der Zauberer erwartet dich! Fordere ihn zum Duell oder zur List heraus?");
    sendButton.onclick = handleWizard;
}

function handleWizard() {
    zauberer = input.value;
    input.value = "";
    if (zauberer.toLowerCase() === "duell") {
        display("Ein epischer Kampf beginnt!");
        showImage("wizard_duel.png");
    } else {
        display("Du überlistet den Zauberer mit einem cleveren Trick!");
        showImage("wizard_trick.png");
    }
    display("Du besiegst den Zauberer und befreist die wunderschöne Prinzessin!");
    showImage("princess_rescue.png");
    display("Du und die Prinzessin leben glücklich bis ans Ende eurer Tage!");
    showImage("happy_ending.png");
}

// Start the game when the page loads
window.onload = askName;

// Allow sending input with Enter key
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendButton.click();
    }
});