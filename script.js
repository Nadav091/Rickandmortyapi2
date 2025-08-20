const pageInput = document.getElementById('pageInput');
const searchBtn = document.getElementById('searchBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resultsDiv = document.getElementById('results');
const pageNow = document.getElementById('pageNow');
const pageTotal = document.getElementById('pageTotal');
const countSpan = document.getElementById('count');

let currentPage = 1;
let totalPages = 1;

function renderSkeletons(amount = 12){
  resultsDiv.innerHTML = '';
  for(let i=0;i<amount;i++){
    const skel = document.createElement('div');
    skel.className = 'skeleton skel-card';
    resultsDiv.appendChild(skel);
  }
}

function statusColor(status){
  switch((status||'').toLowerCase()){
    case 'alive': return 'var(--green)';
    case 'dead': return 'var(--red)';
    default: return 'var(--gray)';
  }
}

function characterCard(ch){
  const tpl = document.getElementById('cardTemplate');
  const card = tpl.content.firstElementChild.cloneNode(true);
  const img = card.querySelector('img');
  const badge = card.querySelector('.status-badge');
  const name = card.querySelector('.name');
  const species = card.querySelector('.species');
  const origin = card.querySelector('.origin');

  img.src = ch.image;
  img.alt = ch.name;
  badge.textContent = ch.status;
  badge.style.borderColor = statusColor(ch.status);
  badge.style.boxShadow = `0 8px 16px ${statusColor(ch.status)}55`;
  name.textContent = ch.name;
  species.textContent = ch.species + (ch.type ? ` • ${ch.type}` : '');
  origin.textContent = `Origem: ${ch.origin?.name ?? '—'}`;

  return card;
}

async function fetchCharacters(page = 1){
  currentPage = page;
  renderSkeletons();

  try{
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    if(!res.ok) throw new Error('Falha na API');
    const data = await res.json();

    totalPages = data.info.pages;
    const count = data.info.count;

    pageNow.textContent = String(currentPage);
    pageTotal.textContent = String(totalPages);
    countSpan.textContent = String(count);

    resultsDiv.innerHTML = '';
    data.results.forEach(ch => resultsDiv.appendChild(characterCard(ch)));
  }catch(err){
    console.error(err);
    resultsDiv.innerHTML = `<p style="color:#ffb4b4">Erro ao buscar personagens. Tente novamente.</p>`;
  }finally{
    pageInput.value = currentPage;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }
}

searchBtn.addEventListener('click', () => {
  const val = Number(pageInput.value);
  if(Number.isFinite(val) && val >= 1 && val <= totalPages){
    fetchCharacters(val);
  }else if(!totalPages || val >= 1){
    // Se ainda não sabemos o total, tentamos assim mesmo
    fetchCharacters(val);
  }
});

pageInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){ searchBtn.click(); }
});

prevBtn.addEventListener('click', () => {
  if(currentPage > 1) fetchCharacters(currentPage - 1);
});

nextBtn.addEventListener('click', () => {
  if(currentPage < totalPages) fetchCharacters(currentPage + 1);
});

// Inicializa
fetchCharacters(1);
