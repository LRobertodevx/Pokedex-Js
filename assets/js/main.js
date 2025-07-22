const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let lastScrollPosition = 0; 

function convertPokemonToLi(pokemon) {
    const li = document.createElement('li');
    li.classList.add('pokemon', pokemon.type);
    li.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    `;
    li.addEventListener('click', () => showDetails(pokemon.number));
    
    const divCard = document.createElement('div');
    divCard.classList.add('pokemon-card');
    divCard.appendChild(li);

    return divCard;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.map(convertPokemonToLi).forEach(li => pokemonList.appendChild(li));
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;
    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

function hideDetails() {
    listView.classList.remove('hidden');
    detailView.classList.add('hidden');
    detailView.innerHTML = '';

     // RESTAURA A POSIÇÃO DA ROLAGEM
    window.scrollTo(0, lastScrollPosition); 
}

function showDetails(pokemonId) {
    // SALVA A POSIÇÃO DA ROLAGEM ANTES DE MUDAR DE TELA
    lastScrollPosition = window.scrollY; 
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.innerHTML = '<h1>Carregando...</h1>';

    pokeApi.getPokemonById(pokemonId).then((pokeDetail) => {
        const pokemonDetailHtml = `
            <div class="content-card ${pokeDetail.type}">
                <div class="upper-icons">
                    <a href="#" id="backButton">
                        <i class="bi bi-arrow-left-short" style="font-size: 2rem; color: #fff;"></i>
                    </a>
                    <i class="bi bi-heart" style="font-size: 1.3rem"></i>
                </div>
                <div class="poke-details-name">${pokeDetail.name}</div>
                <div class="poke-details-number">#${pokeDetail.number}</div>
                <ol class="poke-details-types">
                    ${pokeDetail.types.map((type) => `<li class="poke-detail-type ${type}">${type}</li>`).join("")}
                </ol>
                <img class="poke-img" src="${pokeDetail.photo}" alt="${pokeDetail.name}">
                <div class="content-card-details">
                    <div class="header-card">
                        <ul>
                            <a href="#"><li>About</li></a>
                            <a href="#"><li>Base Stats</li></a>
                            <a href="#"><li>Evolution</li></a>
                            <a href="#"><li>Moves</li></a>
                        </ul>
                    </div>
                    <div class="poke-details">
                        <div class="poke-details-line"><p>Species:</p><p>${pokeDetail.species}</p></div>
                        <div class="poke-details-line"><p>Weight:</p><p>${pokeDetail.weight}</p></div>
                        <div class="poke-details-line"><p>Height:</p><p>${pokeDetail.height}</p></div>
                        <div class="poke-details-line"><p>Abilities:</p><p>${pokeDetail.ability}</p></div>
                    </div>
                </div>
            </div>`;
        
        detailView.innerHTML = pokemonDetailHtml;

        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', (event) => {
                event.preventDefault(); 
                hideDetails();
            });
        }
    }).catch((error) => {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
        detailView.innerHTML = `
            <h1>Ops! Pokémon não encontrado.</h1>
            <button id="backButtonError">Voltar</button>
        `;
        document.getElementById('backButtonError').addEventListener('click', hideDetails);
    });
}