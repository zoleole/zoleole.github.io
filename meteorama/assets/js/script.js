const mainElement = document.getElementById("gameCards");
const modalElement = document.querySelector('.modal');
const resetButton = document.querySelector('.reset');
const gamesScore = document.querySelector('.games-score');
const attemptsScore = document.querySelector('.attempts-score');
const accuracyScore = document.querySelector('.accuracy-score');
const shuffleButton = document.querySelector('.shuffle-button');
const closeButton = document.querySelector('.close');
const matchesScore = document.querySelector('.matches-score');
const bodyElement = document.querySelector('body');

let firstCardClicked, secondCardClicked, firstCardClasses, secondCardClasses, maxMatches, matches, gamesPlayed, attempts, accuracy;

// Todas las nubes disponibles
const allClouds = ['altocumulus', 'altostratus', 'cirrocumulus', 'cirrostratus', 'cirrus', 'cumulonimbus', 'cumulus', 'kelvin-helmholtz', 'lenticular', 'contrail', 'mammatus', 'nimbostratus', 'stratocumulus', 'stratus'];

let cardDeck = [];

// Información educativa sobre cada tipo de nube
const cloudInfo = {
  'altocumulus': {
    name: 'Altocúmulos',
    description: 'Nubes medias blancas o grises en parches o capas. Indican cambio de tiempo.',
    altitude: 'Altura: 2,000-6,000 m'
  },
  'altostratus': {
    name: 'Altoestratos',
    description: 'Capa gris o azulada que cubre todo el cielo. Preceden lluvia o nieve.',
    altitude: 'Altura: 2,000-6,000 m'
  },
  'cirrocumulus': {
    name: 'Cirrocúmulos',
    description: 'Nubes altas en ondulaciones o parches blancos. Cielo empedrado.',
    altitude: 'Altura: 5,000-13,000 m'
  },
  'cirrostratus': {
    name: 'Cirroestratos',
    description: 'Velo transparente que cubre el cielo. Producen halos alrededor del sol.',
    altitude: 'Altura: 5,000-13,000 m'
  },
  'cirrus': {
    name: 'Cirros',
    description: 'Nubes altas y delgadas en filamentos blancos. Indican buen tiempo.',
    altitude: 'Altura: 5,000-13,000 m'
  },
  'cumulonimbus': {
    name: 'Cumulonimbos',
    description: 'Nubes de tormenta masivas. Producen lluvia intensa, rayos y tornados.',
    altitude: 'Altura: 500-16,000 m'
  },
  'cumulus': {
    name: 'Cúmulos',
    description: 'Nubes blancas esponjosas de buen tiempo. Tienen base plana.',
    altitude: 'Altura: 500-2,000 m'
  },
  'kelvin-helmholtz': {
    name: 'Kelvin-Helmholtz',
    description: 'Nubes onduladas que parecen olas. Formadas por turbulencia atmosférica.',
    altitude: 'Altura: Variable'
  },
  'lenticular': {
    name: 'Lenticulares',
    description: 'Nubes con forma de lente o platillo. Se forman cerca de montañas.',
    altitude: 'Altura: Variable'
  },
  'contrail': {
    name: 'Estelas de Condensación',
    description: 'Nubes lineales formadas por aviones. Cristales de hielo de los motores.',
    altitude: 'Altura: 8,000-12,000 m'
  },
  'mammatus': {
    name: 'Mammatus',
    description: 'Bolsas colgantes bajo nubes de tormenta. Parecen burbujas.',
    altitude: 'Altura: Variable'
  },
  'nimbostratus': {
    name: 'Nimbostratos',
    description: 'Nubes grises oscuras que producen lluvia o nieve continua.',
    altitude: 'Altura: 2,000-3,000 m'
  },
  'stratocumulus': {
    name: 'Estratocúmulos',
    description: 'Nubes bajas grises o blancas en parches o capas. Muy comunes.',
    altitude: 'Altura: 500-2,000 m'
  },
  'stratus': {
    name: 'Estratos',
    description: 'Capa de nubes bajas grises y uniformes. Pueden producir llovizna.',
    altitude: 'Altura: 0-2,000 m'
  }
};

// Función para seleccionar 9 nubes aleatorias
function selectRandomClouds() {
  const shuffled = [...allClouds].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 9);
  // Crear pares duplicados
  cardDeck = [...selected, ...selected];
  console.log('Nubes seleccionadas para este juego:', selected);
}

accuracy = 0;
attempts = 0;
maxMatches = 9;
matches = 0;
gamesPlayed = 0;

mainElement.addEventListener('click', handleClick);
shuffleButton.addEventListener('click', shuffleCards);
resetButton.addEventListener('click', shuffleCards);
closeButton.addEventListener('click', dismissModal);

function handleClick(event) {
  const clickedTarget = event.target;

  if (clickedTarget.className.indexOf("card-back") === -1) {
    return;
  }

  clickedTarget.classList.add("hidden");

  if (!firstCardClicked) {
    firstCardClicked = clickedTarget;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else {
    secondCardClicked = clickedTarget;
    secondCardClasses = secondCardClicked.previousElementSibling.className;
    mainElement.removeEventListener('click', handleClick);
    if (firstCardClasses === secondCardClasses) {
      attempts += 1;
      attemptsScore.textContent = attempts;
      mainElement.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
      matches += 1;
      matchesScore.textContent = matches;
      accuracy = ((matches / attempts) * 100).toFixed(2);
      accuracyScore.textContent = accuracy+'%';
      
      // Mostrar información educativa sobre la nube
      showCloudInfo(secondCardClasses);
      
      if (matches === maxMatches) {
        modalElement.classList.remove("hidden");
        gamesPlayed += 1;
        gamesScore.textContent = gamesPlayed;
      }
    } else {
      attempts += 1;
      attemptsScore.textContent = attempts;
      accuracy = ((matches / attempts) * 100).toFixed(2);
      accuracyScore.textContent = accuracy+'%';
      setTimeout(function () {
        firstCardClicked.classList.remove("hidden");
        secondCardClicked.classList.remove("hidden");
        mainElement.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1500);
    }
  }
}

function showCloudInfo(cardClasses) {
  // Extraer el nombre de la clase de nube
  const cloudType = cardClasses.split(' ').find(cls => cloudInfo[cls]);
  
  if (cloudType && cloudInfo[cloudType]) {
    const info = cloudInfo[cloudType];
    const notification = document.createElement('div');
    notification.className = 'cloud-info-notification';
    notification.innerHTML = `
      <h4>${info.name}</h4>
      <p>${info.description}</p>
      <p class="altitude">${info.altitude}</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
}

function dismissModal () {
  modalElement.classList.add("hidden");
  matchesScore.textContent = 0;
  attemptsScore.textContent = 0;
  accuracyScore.textContent = '0.00%';
  resetCards();

}

function resetCards () {
  mainElement.innerHTML = '';
  // Seleccionar nuevas nubes aleatorias cada vez
  selectRandomClouds();
  const newCardDeck = cardDeck.sort(function() { return 0.5-Math.random() });
  for (let i = 0; i < newCardDeck.length; i++) {
    const newCardItem = document.createElement('div');
    newCardItem.classList.add("card-item", "col-2");
    const newCardFront = document.createElement('div');
    newCardFront.className = "card-front";
    newCardFront.classList.add(newCardDeck[i]);
    const newCardBack = document.createElement('div');
    newCardBack.classList.add("card-back");
    newCardItem.append(newCardFront, newCardBack);
    mainElement.appendChild(newCardItem);
  }
}

function shuffleCards () {
  matches = 0;
  matchesScore.textContent = matches;
  attempts = 0;
  attemptsScore.textContent = attempts;
  accuracy = "0.00";
  accuracyScore.textContent = accuracy + '%';
  const cardsHidden = document.querySelectorAll('.hidden');
  for (let i = 0; i < cardsHidden.length; i++) {
    cardsHidden[i].classList.remove("hidden");
  }
  modalElement.classList.add("hidden");
  resetCards();
}
