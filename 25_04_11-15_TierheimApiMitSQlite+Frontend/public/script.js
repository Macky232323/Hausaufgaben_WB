document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const artInput = document.getElementById('art');
    const alterInput = document.getElementById('alter');
    const krankheitInput = document.getElementById('krankheit');
    const gewichtInput = document.getElementById('gewicht');
    const addButton = document.getElementById('add-button');
    const tierTableBody = document.querySelector('#tier-table tbody');
    const headers = document.querySelectorAll('#tier-table th'); // Tabellenüberschriften

    let sortDirection = {}; // Objekt, um die Sortierrichtung für jede Spalte zu speichern
    let lastSortedHeader = null; // Variable, um den zuletzt sortierten Header zu verfolgen

    function updateTierList() {
        fetch('http://localhost:3000/tiere')
            .then(response => response.json())
            .then(data => {
                tierTableBody.innerHTML = '';
                data.forEach(tier => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${tier.id}</td>
                        <td>${tier.name}</td>
                        <td>${tier.tierart}</td>
                        <td>${tier.age}</td>      
                        <td>${tier.krankheit}</td>
                        <td>${tier.gewicht} kg</td>
                        <td><button class="delete-button" data-id="${tier.id}">X</button></td>
                    `;
                    tierTableBody.appendChild(row);
                });

                const deleteButtons = document.querySelectorAll('.delete-button');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const id = button.dataset.id;
                        deleteTier(id);
                    });
                });

                // Sortierfunktion zu den Tabellenüberschriften hinzufügen
                headers.forEach((header, index) => {
                    header.addEventListener('click', () => {
                        sortTable(index, header.textContent);
                    });
                    header.setAttribute('title', 'Sortieren'); // Tooltip hinzufügen
                });
            })
            .catch(error => {
                console.error('Fehler beim Laden der Tierliste:', error);
            });
    }

    function deleteTier(id) {
        fetch(`http://localhost:3000/tiere/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    updateTierList();
                } else {
                    console.error('Fehler beim Löschen des Tiers:', response.status);
                }
            })
            .catch(error => {
                console.error('Fehler beim Löschen des Tiers:', error);
            });
    }

    addButton.addEventListener('click', () => {
        let gewichtValue = gewichtInput.value.replace(',', '.');
        if (isNaN(parseFloat(gewichtValue))) {
            alert("Ungültige Eingabe für Gewicht. Bitte eine Zahl mit Punkt oder Komma eingeben.");
            return;
        }

        const neuesTier = {
            tierart: artInput.value,
            name: nameInput.value,
            krankheit: krankheitInput.value,
            age: parseInt(alterInput.value),
            gewicht: parseFloat(gewichtValue)
        };

        fetch('http://localhost:3000/tiere', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(neuesTier)
        })
            .then(response => response.json())
            .then(() => {
                nameInput.value = '';
                artInput.value = '';
                alterInput.value = '';
                krankheitInput.value = '';
                gewichtInput.value = '';
                updateTierList();
            })
            .catch(error => {
                console.error('Fehler beim Hinzufügen des Tiers:', error);
            });
    });

    [nameInput, artInput, alterInput, krankheitInput, gewichtInput].forEach(input => {
        input.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                addButton.click();
            }
        });
    });

    function sortTable(columnIndex, columnHeader) {
        const table = document.getElementById('tier-table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        // Richtung für diese Spalte umschalten
        sortDirection[columnHeader] = sortDirection[columnHeader] === 'asc' ? 'desc' : 'asc';
        const direction = sortDirection[columnHeader];

        const sortedRows = rows.sort((a, b) => {
            let aValue = a.cells[columnIndex].textContent.trim();
            let bValue = b.cells[columnIndex].textContent.trim();

            // Zahlenvergleich, falls möglich
            if (!isNaN(aValue) && !isNaN(bValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
                return (aValue - bValue) * (direction === 'asc' ? 1 : -1);
            }

            return aValue.localeCompare(bValue) * (direction === 'asc' ? 1 : -1);
        });

        // Tabelle aktualisieren
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));

        // Hervorhebung des sortierten Headers
        if (lastSortedHeader && lastSortedHeader !== table.rows[0].cells[columnIndex]) {
            lastSortedHeader.classList.remove('sorted-header');
        }
        lastSortedHeader = table.rows[0].cells[columnIndex];
        lastSortedHeader.classList.add('sorted-header');
    }

    updateTierList();
});