const table = document.getElementById('mediaFromGallery')
var deleteOneItem = document.getElementById('deleteOneItem')
var insertItem = document.getElementById('insertItem')
var updateItem = document.getElementById('updateItem')
var removeFilters = document.getElementById('removeFilters')
var idFormUpdate = document.getElementById("getIdForUpdateForm")
var idFormDelete = document.getElementById("getIdForDeleteForm")
var listOfYears = document.getElementById("interactiveYears")
var searchInput = document.getElementById("searchInput")
var closeButton = document.getElementById("close-button")
var inputElement

document.addEventListener('DOMContentLoaded', function (){
    reloadingTable()
    updateYearList()

    document.getElementById("popUpForm").style.display = "none"
    document.getElementById("getIdForUpdateDiv").style.display = "none"
    document.getElementById("updateDiv").style.display = "none"
    document.getElementById("getIdForDeleteDiv").style.display = "none"
})

//SEARCH
searchInput.addEventListener('keyup', function (){
    fetch('http://localhost:3000/api/photos')
        .then(response => response.json())
        .then(data => {
            while (table.rows.length > 1) {
                table.deleteRow(1)
            }
            data.data.forEach(photo => {
                if(photo.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
                const row = table.insertRow();

                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                const cell3 = row.insertCell();
                const cell4 = row.insertCell();
                const cell5 = row.insertCell();
                const cell6 = row.insertCell();

                cell1.textContent = photo.id;
                cell2.innerHTML = '<img src="' + photo.poster + '" alt="' + photo.name + '">';
                cell3.textContent = photo.name;
                cell4.textContent = photo.year;
                cell5.textContent = photo.genre;
                cell6.textContent = photo.description;
                }

            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})

//FILTERS
removeFilters.addEventListener('click', function (){
    reloadingTable()
    updateYearList()
})

//UPDATE
updateItem.addEventListener('click', function (){
    document.getElementById("getIdForUpdateDiv").style.display = "block"
})
idFormUpdate.addEventListener('submit', function (event){
    event.preventDefault()
    inputElement = document.getElementById('inputUpdateById')
    document.getElementById("getIdForUpdateDiv").style.display = "none"

    fetch('http://localhost:3000/api/photos/' + inputElement.value)
        .then(response => response.json())
        .then(data => {
            document.getElementById("updateDiv").style.display = "block"

            const itemData = data.data
            document.getElementById('posterForUpdate').value = itemData.poster;
            document.getElementById('nameForUpdate').value = itemData.name;
            document.getElementById('yearForUpdate').value = itemData.year;
            document.getElementById('genreForUpdate').value = itemData.genre;
            document.getElementById('descrpForUpdate').value = itemData.description;
            
            document.getElementById("updateForm").addEventListener('submit', function (event){
                event.preventDefault()

                var name = document.getElementById('nameForUpdate').value
                var year = document.getElementById('yearForUpdate').value
                var genre = document.getElementById('genreForUpdate').value
                var poster = document.getElementById('posterForUpdate').value
                var description = document.getElementById('descrpForUpdate').value

                document.getElementById("updateDiv").style.display = "none"

                fetch('http://localhost:3000/api/photos/' + inputElement.value, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name, year: year, genre: genre, poster: poster, description: description }),
                })
                    .then(response => response.json())
                    .then(function(){
                        reloadingTable()
                        updateYearList()
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})

//POST
insertItem.addEventListener('click', function (){
    document.getElementById("popUpForm").style.display = "block"
})
closeButton.addEventListener('click', function (){
    document.getElementById("popUpForm").style.display = "none"
})
document.getElementById("popUpForm").addEventListener('submit', function (event){
    event.preventDefault()
    inputElement = document.getElementById('name')
    var name = inputElement.value
    inputElement = document.getElementById('year')
    var year = inputElement.value
    inputElement = document.getElementById('genre')
    var genre = inputElement.value
    inputElement = document.getElementById('poster')
    var poster = inputElement.value
    inputElement = document.getElementById('description')
    var description = inputElement.value
    document.getElementById("popUpForm").style.display = "none"

    fetch('http://localhost:3000/api/photos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, year: year, genre: genre, poster: poster, description: description }),
    })
        .then(response => response.json())
        .then(function(){
            reloadingTable()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})


//DELETE
deleteOneItem.addEventListener('click', function (){
    document.getElementById("getIdForDeleteDiv").style.display = "block"
})
idFormDelete.addEventListener('submit', function (event){
    event.preventDefault()
    inputElement = document.getElementById('inputDeleteById')
    document.getElementById("getIdForDeleteDiv").style.display = "none"

    fetch('http://localhost:3000/api/photos/' + inputElement.value, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(function() {
            reloadingTable()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})


//INSERT ALL DATA IN TABLE/GET
function reloadingTable() {
    fetch('http://localhost:3000/api/photos')
    .then(response => response.json())
    .then(data => {
        while (table.rows.length > 1) {
            table.deleteRow(1)
        }
        data.data.forEach(photo => {
            const row = table.insertRow();

            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();
            const cell4 = row.insertCell();
            const cell5 = row.insertCell();
            const cell6 = row.insertCell();

            cell1.textContent = photo.id;

            const img = document.createElement('img');
            img.src = photo.poster;
            img.alt = photo.name;
            cell2.appendChild(img);

            cell3.textContent = photo.name;
            cell4.textContent = photo.year;
            cell5.textContent = photo.genre;
            cell6.textContent = photo.description;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//YEARS LIST
async function updateYearList() {
    fetch('http://localhost:3000/api/photos')
        .then(response => response.json())
        .then(data => {
            allYears = [];
            data.data.forEach(photo => {
                if (!allYears.includes(photo.year)) {
                    allYears.push(photo.year);
                }
            });
            listOfYears.innerHTML = ""; 
            allYears.forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.text = year;
                option.addEventListener('click', function () {
                    allYears.forEach(otherYear => {
                        const otherOption = listOfYears.querySelector(`option[value="${otherYear}"]`);
                        if (otherOption) {
                            otherOption.classList.remove('selected');
                        }
                    });
                    option.classList.add('selected');

                    fetch('http://localhost:3000/api/photos')
                    .then(response => response.json())
                    .then(data => {
                        while (table.rows.length > 1) {
                            table.deleteRow(1);
                        }
                        data.data.forEach(photo => {
                            if (photo.year == year) {
                                const row = table.insertRow();

                                const cell1 = row.insertCell();
                                const cell2 = row.insertCell();
                                const cell3 = row.insertCell();
                                const cell4 = row.insertCell();
                                const cell5 = row.insertCell();
                                const cell6 = row.insertCell();
    
                                cell1.textContent = photo.id;
                                cell2.innerHTML = '<img src="' + photo.poster + '" alt="' + photo.name + '">';
                                cell3.textContent = photo.name;
                                cell4.textContent = photo.year;
                                cell5.textContent = photo.genre;
                                cell6.textContent = photo.description;
                            }
                        });
                    })
                });
                listOfYears.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



