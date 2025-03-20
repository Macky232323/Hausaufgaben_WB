let name = prompt("Wie heißt du, tapferer Held?");
alert("Freut mich, dich kennenzulernen, " + name + "!");

let alter = prompt("Wie alt bist du?");
if (alter >= 18) {
    alert("Du bist alt genug, um in den Kampf zu ziehen!");
    let waffe = prompt("Wählst du das Schwert oder Magie?");
    if (waffe.toLowerCase() === "Schwert") {
        alert("Du schwingst dein Schwert und kämpfst tapfer!");
        // Pfad des Schwertkämpfers
        let ritterlichkeit = prompt("Ein Drache versperrt deinen Weg! Greifst du ihn an oder versuchst du, ihn zu besänftigen?");
        if (ritterlichkeit.toLowerCase() === "angreifen") {
            alert("Mit einem heldenhaften Satz stürzt du dich in den Kampf!");
            let staerke = prompt("Der Drache ist mächtig! Setzt du auf Stärke oder Geschicklichkeit?");
            if (staerke.toLowerCase() === "stärke") {
                alert("Deine Muskeln triumphieren, der Drache ist besiegt!");
            } else {
                alert("Deine flinken Bewegungen verwirren den Drachen, er zieht sich zurück!");
            }
        } else {
            alert("Du sprichst mit dem Drachen und erfährst, dass er nur seinen Schatz bewacht. Du teilst ihn mit ihm und er lässt dich passieren.");
        }
    } else {
        alert("Du wirkst einen mächtigen Zauber!");
        // Pfad des Magiers
        let weisheit = prompt("Ein Rätsel stellt sich dir in den Weg! Wählst du Weisheit oder Intuition?");
        if (weisheit.toLowerCase() === "weisheit") {
            alert("Du studierst die alten Schriften und entschlüsselst das Rätsel!");
            let zauber = prompt("Ein finsterer Zauber liegt über dem Land! Welchen Zauber wählst du: Licht oder Schatten?");
            if (zauber.toLowerCase() === "licht") {
                alert("Der Zauber des Lichts vertreibt die Dunkelheit!");
            } else {
                alert("Du nutzt die Schatten, um die finstere Macht zu schwächen!");
            }
        } else {
            alert("Du folgst deinem Instinkt und findest den verborgenen Pfad!");
        }
    }
    // Gemeinsamer Pfad
    let pfad = prompt("Du stehst an einer Weggabelung. Wählst du den sicheren Pfad oder den gefährlichen Dschungel?");
    if (pfad.toLowerCase() === "sicherer pfad") {
        alert("Der sichere Pfad führt dich durch friedliche Dörfer. Du erhältst nützliche Ausrüstung!");
    } else {
        alert("Im Dschungel erwarten dich gefährliche Kreaturen und wertvolle Schätze!");
    }
    let freundschaft = prompt("Ein Zwerg bietet dir seine Hilfe an. Nimmst du sie an?");
    if (freundschaft.toLowerCase() === "ja") {
        alert("Der Zwerg ist ein treuer Gefährte!");
    } else {
        alert("Du setzt deinen Weg alleine fort.");
    }
    let mut = prompt("Du stehst vor der Burg des bösen Zauberers! Stürmst du sie oder suchst du einen geheimen Eingang?");
    if (mut.toLowerCase() === "stürmen") {
        alert("Mit einem lauten Schlachtruf greifst du die Burg an!");
    } else {
        alert("Du findest einen versteckten Tunnel, der in die Burg führt!");
    }
    let zauberer = prompt("Der Zauberer erwartet dich! Fordere ihn zum Duell oder zur List heraus?");
    if (zauberer.toLowerCase() === "duell") {
        alert("Ein epischer Kampf beginnt!");
    } else {
        alert("Du überlistet den Zauberer mit einem cleveren Trick!");
    }
    alert("Du besiegst den Zauberer und befreist die wunderschöne Prinzessin!");
    alert("Du und die Prinzessin leben glücklich bis ans Ende eurer Tage!");

} else {
    alert("Du bist noch zu jung. Trainiere weiter und kehre später zurück!");
}