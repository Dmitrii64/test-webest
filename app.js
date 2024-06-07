
let productCards = document.querySelectorAll('.product-card');

getQuantity()

productCards.forEach(card => {
  let productId = card.getAttribute('id');
  let decrementButton = card.querySelector('.counter__decrease');
  let incrementButton = card.querySelector('.counter__increase');
  let quantity = card.querySelector('.counter__input');
  let showButton = card.querySelector('.product-card__add-to-cart');

  counterOperation(decrementButton, incrementButton, quantity, productId);
  setQuantity(productId, quantity);

  showButton.addEventListener('click', () => {
    const request = new XMLHttpRequest();
    request.open("GET", "");
    request.onload = () => {
      if (request.status === 200) {
        const data = request.response;
        const cardHTML = getHTMLActiveCard(productId, data);
        showPopup(cardHTML, quantity);
      } else {
        console.error("Произошла ошибка");
      }
    };
    request.send()
  })
})

function counterOperation(decrementButton, incrementButton, input, id) {
  decrementButton.addEventListener('click', () => {
    if (input.value > 1) {
      input.value--;
      window.localStorage.setItem(`${id}`, input.value)
    }
  })

  incrementButton.addEventListener('click', () => {
    input.value++
    window.localStorage.setItem(`${id}`, input.value)
  })
}

function getHTMLActiveCard(id, str) {
  const index = str.indexOf(`<article id="${id}`)
  const subStr = str.slice(index);
  const index2 = subStr.indexOf("</article>");
  const cardHTML = subStr.slice(0, index2) + "</article>";
  return cardHTML
}

function showPopup(card, quantity) {
  const popUp = document.querySelector('.popup');
  popUp.querySelector('.popup__wrapper').innerHTML = card;
  popUp.classList.remove('hidden');

  let description = popUp.querySelector('.product-card__description');
  description.removeAttribute('hidden');

  let decrementButton = popUp.querySelector('.counter__decrease');
  let incrementButton = popUp.querySelector('.counter__increase');
  let input = popUp.querySelector('.counter__input');
  let productId = popUp.querySelector('.product-card').getAttribute('id');
  input.value = quantity.value
  counterOperation(decrementButton, incrementButton, input, productId);
  counterOperation(decrementButton, incrementButton, quantity, productId);
  input.addEventListener('input', () => {
    quantity.value = input.value
  })
  setQuantity(productId, input);

  let addtoCartButton = popUp.querySelector('.product-card__add-to-cart');
  addtoCartButton.innerHTML = "Добавить в корзину";
  addtoCartButton.addEventListener('click', () => {
    input.value = 1;
    quantity.value = 1;
    window.localStorage.setItem(`${productId}`, 1)
  })

  let closeButton = popUp.querySelector('.popup__close');
  closeButton.addEventListener('click', () => {
    popUp.classList.add('hidden');
  })
}

function getQuantity() {
  for (let i = 0; i < localStorage.length; i++) {
    let cardId = localStorage.key(i);
    let cardQuantity = localStorage.getItem(localStorage.key(i));
    let card = document.querySelector(`#${cardId}`);
    card.querySelector('.counter__input').value = cardQuantity;
  }
}

function setQuantity(id, input) {
  input.addEventListener('input', () => {
    window.localStorage.setItem(`${id}`, input.value)
  })
}