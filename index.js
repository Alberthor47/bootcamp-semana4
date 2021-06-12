const BASE_URL = 'https://rickandmortyapi.com/api/character/';
const list = document.getElementById('list');

const observer = document.getElementById('observer')
let counter = 0;
const MaxPage = 5;
let pastData = [];
localStorage.clear();

// PETICION CON XMLHttpRequest

// function getDataXHR() {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', BASE_URL);
//   xhr.send();
//   xhr.responseText = 'json';
//   xhr.onload = () => {
//     console.log(JSON.parse(xhr.response));
//     renderData(JSON.parse(xhr.response));
//   }
// }

// getDataXHR();

// PETICION CON fetch

// fetch(url, {method: 'POST', mode: 'no-cors'})

// function getDataFetch() {
//   return fetch(BASE_URL).then(response => response.json())
// }

// async function loadData() {
//   const data = await getDataFetch();
//   renderData(data);
// }

// loadData();

// PETICION CON axios

function getDataAxios(url) {
  return axios.get(url).then(response => response.data);
}

async function loadData(url) {
  const data = await getDataAxios(url)
  renderData(data)
}

// loadData(BASE_URL);

// LOGICA DE RENDERIZADO

function renderData(data) {
  const next = data.info.next;
  localStorage.setItem("next_req", next);
  // console.log(localStorage.getItem("next_req"));
  console.log(data)

  const characters = data.results;
  let output = characters.map( character => {
      return `
      <li class="flex flex-col items-center p-1 m-3 rounded-lg bg-white text-gray-800">
        <img src="${character.image}" />
        <h2>${character.name}</h2>
        <h3>${character.species}</h3>
      </li>
    `;
  }).join("");

  pastData = pastData.concat(output);
  console.log(pastData)
  list.innerHTML = pastData;
};


// LOGICA DEL INTERCEPTION OBSERVER

const intersectionObserver = new IntersectionObserver( entries => {
  if (entries[0].isIntersecting) {
    if (localStorage.getItem("next_req") && counter < MaxPage) {
      counter++;
      let next_req = localStorage.getItem("next_req");
      console.log(next_req)
      loadData(next_req);
    } else if (counter === MaxPage) {
      alert("Se acabaron los personajes");
      intersectionObserver.unobserve(observe);
    } else {
      loadData(BASE_URL);
    }
    console.log(counter);
  }
}, { rootMargin: "0px 0px 100% 0px" });

intersectionObserver.observe(observer);