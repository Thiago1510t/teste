const slides =
  [...document.querySelectorAll(".slide")];

const dots =
  [...document.querySelectorAll(".dot")];

const contador =
  document.querySelector("#contadorAtual");


let atual = 0;

let bloqueado = false;

let scrollAcumulado = 0;

let touchInicioX = 0;
let touchInicioY = 0;


const LIMITE_SCROLL = 60;

const TEMPO_TRANSICAO = 1000;


/* =========================================================
   ATUALIZA CARDS
========================================================= */

function atualizarSlides() {

  slides.forEach((slide, index) => {

    slide.classList.remove(
      "is-active",
      "is-prev",
      "is-next",
      "is-before",
      "is-after"
    );


    const distancia =
      index - atual;


    /* CENTRAL */

    if (distancia === 0) {

      slide.classList.add(
        "is-active"
      );

    }


    /* ESQUERDA */

    else if (distancia === -1) {

      slide.classList.add(
        "is-prev"
      );

    }


    /* DIREITA */

    else if (distancia === 1) {

      slide.classList.add(
        "is-next"
      );

    }


    /* MUITO À ESQUERDA */

    else if (distancia < -1) {

      slide.classList.add(
        "is-before"
      );

    }


    /* MUITO À DIREITA */

    else {

      slide.classList.add(
        "is-after"
      );

    }

  });


  /* =======================================================
     DOTS
  ======================================================= */

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === atual
    );

  });


  /* =======================================================
     CONTADOR
  ======================================================= */

  if (contador) {

    contador.textContent =
      String(atual + 1)
      .padStart(2, "0");

  }


  /* =======================================================
     VÍDEOS
  ======================================================= */

  slides.forEach((slide, index) => {

    const video =
      slide.querySelector("video");


    if (!video) {
      return;
    }


    /*
       Deixa central + vizinhos tocando.

       Assim quando um entra no centro
       não existe piscada preta.
    */

    if (
      Math.abs(index - atual) <= 1
    ) {

      video.play()
        .catch(() => {});

    }

  });

}


/* =========================================================
   PRÓXIMO
========================================================= */

function proximo() {

  if (
    bloqueado ||
    atual >= slides.length - 1
  ) {
    return;
  }


  bloqueado = true;


  /*
     Aqui NÃO escondemos nada.

     Apenas mudamos quem é o central.

     Como todos possuem a mesma distância,
     eles se deslocam como uma esteira.
  */

  atual++;

  atualizarSlides();


  setTimeout(() => {

    bloqueado = false;

  }, TEMPO_TRANSICAO);

}


/* =========================================================
   ANTERIOR
========================================================= */

function anterior() {

  if (
    bloqueado ||
    atual <= 0
  ) {
    return;
  }


  bloqueado = true;


  atual--;

  atualizarSlides();


  setTimeout(() => {

    bloqueado = false;

  }, TEMPO_TRANSICAO);

}


/* =========================================================
   MOUSE
========================================================= */

window.addEventListener(
  "wheel",

  function(event) {

    event.preventDefault();


    if (bloqueado) {
      return;
    }


    const movimento =

      Math.abs(event.deltaX) >
      Math.abs(event.deltaY)

      ? event.deltaX
      : event.deltaY;


    scrollAcumulado +=
      movimento;


    if (
      scrollAcumulado >
      LIMITE_SCROLL
    ) {

      scrollAcumulado = 0;

      proximo();

    }


    else if (
      scrollAcumulado <
      -LIMITE_SCROLL
    ) {

      scrollAcumulado = 0;

      anterior();

    }

  },

  {
    passive: false
  }
);


/* =========================================================
   TECLADO
========================================================= */

window.addEventListener(
  "keydown",

  function(event) {

    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {

      proximo();

    }


    else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {

      anterior();

    }

  }
);


/* =========================================================
   DOTS
========================================================= */

dots.forEach((dot, index) => {

  dot.addEventListener(
    "click",

    function() {

      if (
        bloqueado ||
        index === atual
      ) {
        return;
      }


      bloqueado = true;


      atual = index;

      atualizarSlides();


      setTimeout(() => {

        bloqueado = false;

      }, TEMPO_TRANSICAO);

    }

  );

});


/* =========================================================
   TOUCH
========================================================= */

window.addEventListener(
  "touchstart",

  function(event) {

    touchInicioX =
      event.touches[0]
      .clientX;

    touchInicioY =
      event.touches[0]
      .clientY;

  },

  {
    passive: true
  }
);


window.addEventListener(
  "touchend",

  function(event) {

    const fimX =
      event.changedTouches[0]
      .clientX;

    const fimY =
      event.changedTouches[0]
      .clientY;


    const diferencaX =
      touchInicioX - fimX;

    const diferencaY =
      touchInicioY - fimY;


    /* HORIZONTAL */

    if (
      Math.abs(diferencaX) >
      Math.abs(diferencaY)
    ) {

      if (
        Math.abs(diferencaX) < 45
      ) {
        return;
      }


      if (diferencaX > 0) {

        proximo();

      }

      else {

        anterior();

      }

    }


    /* VERTICAL */

    else {

      if (
        Math.abs(diferencaY) < 55
      ) {
        return;
      }


      if (diferencaY > 0) {

        proximo();

      }

      else {

        anterior();

      }

    }

  },

  {
    passive: true
  }
);


/* =========================================================
   INICIAR
========================================================= */

atualizarSlides();