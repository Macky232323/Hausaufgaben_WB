document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const artInput = document.getElementById('art');
    const alterInput = document.getElementById('alter');
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
                        <td>${tier.art}</td>
                        <td>${tier.alter}</td>
                    `;
                    tierTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Fehler beim Laden der Tierliste:', error);
            });
    }

    addButton.addEventListener('click', () => {
        const neuesTier = {
            name: nameInput.value,
            art: artInput.value,
            alter: parseInt(alterInput.value)
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
                updateTierList();
            })
            .catch(error => {
                console.error('Fehler beim Hinzufügen des Tiers:', error);
            });
    });

    // Enter-Taste zum Hinzufügen
    [nameInput, artInput, alterInput].forEach(input => {
        input.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                addButton.click();
            }
        });
    });

    updateTierList(); // Tierliste beim Laden der Seite anzeigen
});