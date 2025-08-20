const pageInput = document.getElementById("pageInput")
const searchBtn = document.getElementById("searchBtn")
const resultsDiv = document.getElementById("results")

async function fetchCharacters(page){
    resultsDiv.innerHTML = "<p>Carregando..</p>"

    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character`)
        const data = await response.json()
        // console.log(data)
    } catch (error) {
          resultsDiv.innerHTML = "<p>Erro ao buscar personagens!</p>"
    }
}


fetchCharacters(1)