// Custom scripts
// Мобильное меню бургер
function burgerMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  const body = document.querySelector('body');
  const nav = document.querySelector('.js-nav');

  if (!burger || !menu || !body || !nav) {
    console.error('Один или несколько элементов не найдены.');
    return; // Прерываем выполнение функции, если не все элементы найдены.
  }

  burger.addEventListener('click', () => {
    if (!menu.classList.contains('active')) {
      menu.classList.add('active');
      burger.classList.add('active-burger');
      nav.classList.add('active-burger');
      body.classList.add('locked');
    } else {
      menu.classList.remove('active');
      burger.classList.remove('active-burger');
      nav.classList.remove('active-burger');
      body.classList.remove('locked');
    }
  });

  const menuItems = document.querySelectorAll('.menu__item');

  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      menu.classList.remove('active');
      burger.classList.remove('active-burger');
      nav.classList.remove('active-burger');
      body.classList.remove('locked');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 991.98) {
      menu.classList.remove('active');
      burger.classList.remove('active-burger');
      nav.classList.remove('active-burger');
      body.classList.remove('locked');
    }
  });
}

burgerMenu()

function fixedMenu() {
  let test = $('#test');
  let nav = $('.js-nav');
  let scrollTop = $(window).scrollTop();
  let heightNav = nav.height();
  let headerHeight = $('.header').height(); // Замените '.header' на селектор вашего хедера
  let navHeight= $('.js-nav').height();

  if (scrollTop > heightNav) {
    nav.addClass('fixed__nav');
    test.addClass('white');
    document.documentElement.style.setProperty('--navHeight', `${navHeight}px`);
    $('.header').css('height', headerHeight + 'px'); // Задаем высоту хедера инлайново
  } else {
    nav.removeClass('fixed__nav');
    test.removeClass('white');
    document.documentElement.style.setProperty('--navHeight', `0px`);
    $('.header').css('height', 'auto'); // Возвращаем изначальную высоту хедера
  }
}


fixedMenu();
$(window).on('scroll', fixedMenu);

$(document).ready(function () {
  $('.js-scroll').on('click', function (event) {
    event.preventDefault();
    let anchor = $(this).attr('href');
    $('html, body').stop().animate({
      scrollTop: $(anchor).offset().top - 100
    }, 400);
  });
});


// Модальное окно
function bindModal(trigger, modal, close) {
  trigger = document.querySelector(trigger),
    modal = document.querySelector(modal),
    close = document.querySelector(close)

  const body = document.body

  trigger.addEventListener('click', e => {
    e.preventDefault()
    modal.style.display = 'flex'
    body.classList.add('locked')
  });
  close.addEventListener('click', () => {
    modal.style.display = 'none'
    body.classList.remove('locked')
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
      body.classList.remove('locked')
    }
  })
}

// ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
// ВТОРОЙ аргумент - класс самого модального окна.
// ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
// bindModal('.modal__btn', '.modal__wrapper', '.modal__close');
// bindModal('.menu__item-btn', '.modal__wrapper', '.modal__close');
// bindModal('.navbar__btn-link', '.modal__wrapper', '.modal__close');
// bindModal('.hero__info-link', '.modal__wrapper', '.modal__close');
// bindModal('.about__btn-link', '.modal__wrapper', '.modal__close');
// bindModal('.offer__order-link', '.modal__wrapper', '.modal__close');

function consultationBtn() {
  const container = document.querySelector('.consultation')
  const fixedBtnMobile = document.querySelector('.consultation__info--mobile')
  const fixedBtnDesctop = document.querySelector('.consultation__info--desktop')
  const closeBtn = document.querySelector('.consultation__btn')

  if (!container) {

  }

  container.addEventListener('click', function () {
    if (event.target === container) {
      fixedBtnMobile.classList.toggle('active')
    } else {
      fixedBtnMobile.classList.remove('active')
    }
  })

  container.addEventListener('click', function () {
    if (event.target === container) {
      fixedBtnDesctop.classList.toggle('active')
    } else {
      fixedBtnDesctop.classList.remove('active')
    }

    closeBtn.addEventListener('click', function () {
      fixedBtnMobile.classList.remove('active'),
        fixedBtnDesctop.classList.remove('active')
    })
  })

}

// Виджет
//consultationBtn();

function offerWhat() {
  let slides = document.querySelectorAll('.offer .offer__what:not(.offer__what--reverse) .offer__what-img');
  const btnPrew = document.querySelector('.offer .offer__what:not(.offer__what--reverse) .offer__what-arrow--prew');
  const btnNext = document.querySelector('.offer .offer__what:not(.offer__what--reverse) .offer__what-arrow--next');
  const slidesCount = slides.length - 1;

  btnPrew.addEventListener('click', function () {
    let indexPrew = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index > 0) {
          slides[index].classList.remove('active');
          indexPrew = index - 1;
        } else {
          indexPrew = false;
        }
      }
    });
    if (indexPrew !== false) {
      slides[indexPrew].classList.add('active');
    }
    if (indexPrew === false || indexPrew == 0) {
      btnPrew.classList.add('disable');
      btnNext.classList.remove('disable');
    } else if (indexPrew < slidesCount) {
      btnNext.classList.remove('disable');
    } else {
      btnPrew.classList.remove('disable');
    }
  });

  btnNext.addEventListener('click', function () {
    let indexNext = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index !== (slides.length - 1)) {
          slides[index].classList.remove('active');
          indexNext = index + 1;
        } else {
          indexNext = false;
        }
      }
    });
    if (indexNext !== false) {
      slides[indexNext].classList.add('active');
    }
    if (indexNext === false || indexNext == slidesCount) {
      btnNext.classList.add('disable');
      btnPrew.classList.remove('disable');
    } else if (indexNext > 0) {
      btnPrew.classList.remove('disable');
    } else {
      btnNext.classList.remove('disable');
    }
  });

  slides.forEach(function (slide) {
    let indexPrew = false
    slide.addEventListener('click', function (event) {
      slides.forEach(function (slide, index) {
        if (slide.classList.contains('active')) {
          indexPrew = index;
          slide.classList.remove('active');
        }
      });
      if (event.target.dataset.index == slidesCount) {
        btnNext.classList.add('disable');
        btnPrew.classList.remove('disable');
      } else if (event.target.dataset.index == 0) {
        btnPrew.classList.add('disable');
        btnNext.classList.remove('disable');
      } else {
        btnNext.classList.remove('disable');
        btnPrew.classList.remove('disable');
      }
      event.target.classList.add('active');
    });
  });
}

if (document.querySelector('.offer__what')) {
  offerWhat();
}

function offerWhatReverse() {
  const slides = document.querySelectorAll('.offer__what--reverse .offer__what-img');
  const btnPrew = document.querySelector('.offer__what--reverse .offer__what-arrow--prew');
  const btnNext = document.querySelector('.offer__what--reverse .offer__what-arrow--next');
  const slidesCount = slides.length - 1;

  btnPrew.addEventListener('click', function () {
    let indexPrew = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index > 0) {
          slides[index].classList.remove('active');
          indexPrew = index - 1;
        } else {
          indexPrew = false;
        }
      }
    });
    if (indexPrew !== false) {
      slides[indexPrew].classList.add('active');
    }
    if (indexPrew === false || indexPrew == 0) {
      btnPrew.classList.add('disable');
      btnNext.classList.remove('disable');
    } else if (indexPrew < slidesCount) {
      btnNext.classList.remove('disable');
    } else {
      btnPrew.classList.remove('disable');
    }
  });

  btnNext.addEventListener('click', function () {
    let indexNext = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index !== (slides.length - 1)) {
          slides[index].classList.remove('active');
          indexNext = index + 1;
        } else {
          indexNext = false;
        }
      }
    });
    if (indexNext !== false) {
      slides[indexNext].classList.add('active');
    }
    if (indexNext === false || indexNext == slidesCount) {
      btnNext.classList.add('disable');
      btnPrew.classList.remove('disable');
    } else if (indexNext > 0) {
      btnPrew.classList.remove('disable');
    } else {
      btnNext.classList.remove('disable');
    }
  });

  slides.forEach(function (slide) {
    let indexPrew = false
    slide.addEventListener('click', function (event) {
      slides.forEach(function (slide, index) {
        if (slide.classList.contains('active')) {
          indexPrew = index;
          slide.classList.remove('active');
        }
      });
      if (event.target.dataset.index == slidesCount) {
        btnNext.classList.add('disable');
        btnPrew.classList.remove('disable');
      } else if (event.target.dataset.index == 0) {
        btnPrew.classList.add('disable');
        btnNext.classList.remove('disable');
      } else {
        btnNext.classList.remove('disable');
        btnPrew.classList.remove('disable');
      }
      event.target.classList.add('active');
    });
  });
}

if (document.querySelector('.offer__what--reverse')) {
  offerWhatReverse();
}

function Blog() {
  const slides = document.querySelectorAll('#blog .offer__what-img');
  const btnPrew = document.querySelector('#blog .offer__what-arrow--prew');
  const btnNext = document.querySelector('#blog .offer__what-arrow--next');
  const slidesCount = slides.length - 1;

  btnPrew.addEventListener('click', function () {
    let indexPrew = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index > 0) {
          slides[index].classList.remove('active');
          indexPrew = index - 1;
        } else {
          indexPrew = false;
        }
      }
    });
    if (indexPrew !== false) {
      slides[indexPrew].classList.add('active');
    }
    if (indexPrew === false || indexPrew == 0) {
      btnPrew.classList.add('disable');
      btnNext.classList.remove('disable');
    } else if (indexPrew < slidesCount) {
      btnNext.classList.remove('disable');
    } else {
      btnPrew.classList.remove('disable');
    }
  });

  btnNext.addEventListener('click', function () {
    let indexNext = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index !== (slides.length - 1)) {
          slides[index].classList.remove('active');
          indexNext = index + 1;
        } else {
          indexNext = false;
        }
      }
    });
    if (indexNext !== false) {
      slides[indexNext].classList.add('active');
    }
    if (indexNext === false || indexNext == slidesCount) {
      btnNext.classList.add('disable');
      btnPrew.classList.remove('disable');
    } else if (indexNext > 0) {
      btnPrew.classList.remove('disable');
    } else {
      btnNext.classList.remove('disable');
    }
  });

  slides.forEach(function (slide) {
    let indexPrew = false
    slide.addEventListener('click', function (event) {
      slides.forEach(function (slide, index) {
        if (slide.classList.contains('active') && event.target.classList[0] != 'blog__link') {
          indexPrew = index;
          slide.classList.remove('active');
        }
      });
      if (event.target.dataset.index == slidesCount) {
        btnNext.classList.add('disable');
        btnPrew.classList.remove('disable');
      } else if (event.target.dataset.index == 0) {
        btnPrew.classList.add('disable');
        btnNext.classList.remove('disable');
      } else {
        btnNext.classList.remove('disable');
        btnPrew.classList.remove('disable');
      }
      event.target.classList.add('active');
    });
  });
}

if (document.querySelector('#blog')) {
  Blog();
}

function Promotions() {
  const slides = document.querySelectorAll('.offer__stock-body');
  const btnPrew = document.querySelector('.offer__stock-arrow--prew');
  const btnNext = document.querySelector('.offer__stock-arrow--next');
  const slidesCount = slides.length - 1;

  btnPrew.addEventListener('click', function () {
    let indexPrew = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index > 0) {
          slides[index].classList.remove('active');
          indexPrew = index - 1;
        } else {
          indexPrew = false;
        }
      }
    });
    if (indexPrew !== false) {
      slides[indexPrew].classList.add('active');
    }
    if (indexPrew === false || indexPrew == 0) {
      btnPrew.classList.add('disable');
      btnNext.classList.remove('disable');
    } else if (indexPrew < slidesCount) {
      btnNext.classList.remove('disable');
    } else {
      btnPrew.classList.remove('disable');
    }
  });

  btnNext.addEventListener('click', function () {
    let indexNext = false
    slides.forEach(function (slide, index) {
      if (slide.classList.contains('active')) {
        if (index !== (slides.length - 1)) {
          slides[index].classList.remove('active');
          indexNext = index + 1;
        } else {
          indexNext = false;
        }
      }
    });
    if (indexNext !== false) {
      slides[indexNext].classList.add('active');
    }
    if (indexNext === false || indexNext == slidesCount) {
      btnNext.classList.add('disable');
      btnPrew.classList.remove('disable');
    } else if (indexNext > 0) {
      btnPrew.classList.remove('disable');
    } else {
      btnNext.classList.remove('disable');
    }
  });

  slides.forEach(function (slide) {
    let indexPrew = false
    slide.addEventListener('click', function (event) {
      slides.forEach(function (slide, index) {
        if (slide.classList.contains('active')) {
          indexPrew = index;
          slide.classList.remove('active');
        }
      });
      if (event.target.dataset.index == slidesCount) {
        btnNext.classList.add('disable');
        btnPrew.classList.remove('disable');
      } else if (event.target.dataset.index == 0) {
        btnPrew.classList.add('disable');
        btnNext.classList.remove('disable');
      } else {
        btnNext.classList.remove('disable');
        btnPrew.classList.remove('disable');
      }
      event.target.classList.add('active');
    });
  });
}

if (document.querySelector('#offer_stocks')) {
  Promotions();
}

function aboutPage() {
  const container = document.querySelector('.about')

  if (!container) {
    return null
  }

  if (window.matchMedia("(max-width: 768px)").matches) {
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: "auto",
      allowTouchMove: true,
      simulateTouch: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }
}

aboutPage();

function selectMobile_2_1() {
  document.querySelectorAll('input[name="sash_4_1"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-1').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-1').classList.toggle('active');
    })
  })
  document.querySelector('.calc__sash-selected-mobile-value-2-1').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-1').classList.toggle('active')
  })
}

function selectMobile_2_2_1() {
  document.querySelectorAll('input[name="leftSash_4_2"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-2-1').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-2-1').classList.toggle('active');
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-2-1').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-2-1').classList.toggle('active')
  })
}

function selectMobile_2_2_2() {
  document.querySelectorAll('input[name="rightSash_4_2"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-2-2').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-2-2').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-2-2').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-2-2').classList.toggle('active')
  })
}

function selectMobile_2_3_1() {
  document.querySelectorAll('input[name="leftSash_4_3"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-3-1').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-3-1').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-3-1').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-3-1').classList.toggle('active')
  })
}

function selectMobile_2_3_2() {
  document.querySelectorAll('input[name="centerSash_4_3"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-3-2').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-3-2').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-3-2').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-3-2').classList.toggle('active')
  })
}

function selectMobile_2_3_3() {
  document.querySelectorAll('input[name="rightSash_4_3"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-3-3').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-3-3').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-3-3').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-3-3').classList.toggle('active')
  })
}

function selectMobile_2_4_1() {
  document.querySelectorAll('input[name="door_4_4"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-4-1').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-4-1').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-4-1').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-4-1').classList.toggle('active')
  })
}

function selectMobile_2_4_2() {
  document.querySelectorAll('input[name="leftSash_4_4"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-4-2').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-4-2').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-4-2').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-4-2').classList.toggle('active')
  })
}

function selectMobile_2_4_3() {
  document.querySelectorAll('input[name="rightSash_4_4"]').forEach(function (input) {
    input.addEventListener('click', function () {
      document.querySelector('.calc__sash-selected-mobile-value-2-4-3').innerHTML = this.value
      document.querySelector('.calc__sash-selected-mobile-value-2-4-3').classList.toggle('active')
    })
  })

  document.querySelector('.calc__sash-selected-mobile-value-2-4-3').addEventListener('click', function (event) {
    document.querySelector('.calc__sash-selected-mobile-value-2-4-3').classList.toggle('active')
  })
}

if (screen.width <= 767) {
  selectMobile_2_1();
  selectMobile_2_2_1();
  selectMobile_2_2_2();
  selectMobile_2_3_1();
  selectMobile_2_3_2();
  selectMobile_2_3_3();
  selectMobile_2_4_1();
  selectMobile_2_4_2();
  selectMobile_2_4_3();
}

document.addEventListener("DOMContentLoaded", () => {
  const jsFormCalc = document.getElementById('js-form-calc')
  if (jsFormCalc) {
    const calcButtonNext = jsFormCalc.querySelector('.calc__footer').querySelector('.calc__buttons')
        .querySelector('button.calc__button-next');

    const handler = () => {
      // _tmr.push({ type: 'reachGoal', id: 3405125, goal: 'calculator'});
      calcButtonNext.removeEventListener('click', handler);
    }

    if (calcButtonNext) {
      calcButtonNext.addEventListener('click', handler);
    }

    const jsFormCalcResult = document.getElementById('js-form-calc-result');
    if (jsFormCalcResult) {
      const jsFormCalcResultSend = jsFormCalcResult.querySelector('button.calculation__button');
      if (jsFormCalcResultSend) {
        const resultHandler = () => {
          // _tmr.push({ type: 'reachGoal', id: 3405125, goal: 'phone_calculator'});
        }

        jsFormCalcResultSend.addEventListener('click', resultHandler);
      }
    }
  }
});