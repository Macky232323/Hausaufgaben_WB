const namen = ["wütend", "fröhlich", "frustriert", "amüsiert", "sauer", "beeindruckt", "verstört", "traurig", "unterhalten"];
const newItemInput = document.getElementById("newItem");
const addButton = document.getElementById("addButton");
const sortAscButton = document.getElementById("sortAsc");
const sortByLengthButton = document.getElementById("sortByLength");
const removeLastButton = document.getElementById("removeLast");
const listDiv = document.getElementById("list");

function updateList() {
    listDiv.innerHTML = "";
    namen.forEach((name, index) => {
        const listItem = document.createElement("div");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("list-item-button");
        deleteButton.addEventListener("click", () => {
            namen.splice(index, 1);
            updateList();
        });
        listItem.appendChild(deleteButton);
        listItem.append(" " + name);
        listDiv.appendChild(listItem);              
    });
}

addButton.addEventListener("click", () => {
    if (newItemInput.value) {
        namen.push(newItemInput.value);
        newItemInput.value = "";
        updateList();
    }
});

sortAscButton.addEventListener("click", () => {
    namen.sort();
    updateList();
});

sortByLengthButton.addEventListener("click", () => {
    namen.sort((a, b) => a.length - b.length);
    updateList();
});

removeLastButton.addEventListener("click", () => {
    namen.pop();
    updateList();
    alert("Neeeeeeeeiiiiiiiiin")
    alert("OK. Dann doch.")
    alert("Benutz doch einfach die kleinen Buttons.")
});

updateList();