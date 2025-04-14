document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const artInput = document.getElementById('art');
    const alterInput = document.getElementById('alter');
    const krankheitInput = document.getElementById('krankheit');
    const gewichtInput = document.getElementById('gewicht');
    const addButton = document.getElementById('add-button');
    const tierTableBody = document.querySelector('#tier-table tbody');

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

    updateTierList();
});