$(window).on('load', function () {
    /*----------------------------------------------------- */
    /* * */
    /*----------------------------------------------------- */
    $('body').on('click', '[show-more]', function() {
        $(this).closest('.blog-v2__list').addClass('show-item-all');
        $(this).addClass('hide');
    })

    var worksSwiper = new Swiper(".slider--works .swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            1161: {
                slidesPerView: 'auto',
                spaceBetween: 20,
            },
            768: {
                centeredSlides: false,
                slidesPerView: 2,
                spaceBetween: 20,
            },
            0: {
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 20,
            }
        },
        on: {
            reachEnd: () => {
                document.querySelector('.slider--works').classList.add('is-end');
            },
            fromEdge: () => {
                document.querySelector('.slider--works').classList.remove('is-end');
            }
          },
    });

    var servicesSwiper = new Swiper(".services .swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            1161: {
                slidesPerView: 'auto',
                spaceBetween: 20,
            },
            768: {
                centeredSlides: false,
                slidesPerView: 2,
                spaceBetween: 20,
            },
            0: {
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 20,
            }
        },
        on: {
            reachEnd: () => {
                document.querySelector('.services.slider').classList.add('is-end');
            },
            fromEdge: () => {
                document.querySelector('.services.slider').classList.remove('is-end');
            }
          },
    });

    var manufacturersSwiper = new Swiper(".manufacturers .swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            1161: {
                slidesPerView: 'auto',
                spaceBetween: 20,
            },
            768: {
                centeredSlides: false,
                slidesPerView: 2,
                spaceBetween: 20,
            },
            0: {
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 20,
            }
        },
        on: {
            reachEnd: () => {
                document.querySelector('.manufacturers.slider').classList.add('is-end');
            },
            fromEdge: () => {
                document.querySelector('.manufacturers.slider').classList.remove('is-end');
            }
          },
    });

    var reviewsSwiper = new Swiper(".reviews .swiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            1161: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 2,
            },
            320: {
                centeredSlides: true,
                slidesPerView: "auto",
                spaceBetween: 10,
            }
        },
    });

    var blogSwiper = new Swiper(".blog-v3 .swiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            1161: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 2,
            },
            320: {
                centeredSlides: true,
                slidesPerView: "auto",
                spaceBetween: 10,
            }
        },
    });

    const initMap = () => {
        const map = document.querySelector('.banner-v1--map');

        if (!map) {
            return;
        }

        const zoomControl = new ymaps.control.ZoomControl({
            options: {
                float: 'none',
                position: {
                    right: '15px',
                    top: '100px',
                },
            },
        });

        const geolocationControl = new ymaps.control.GeolocationControl({
            options: {
                float: 'none',
                position: {
                    right: '15px',
                    top: '15px',
                },
            },
        });

        const myMap = new ymaps.Map('mapInit', {
            center: [54.188718, 45.176806],
            zoom: 16,
            controls: [zoomControl, geolocationControl],
        }, {});


        const myPlacemark = new ymaps.GeoObject({
            geometry: {
                type: 'Point',
                coordinates: [54.188718, 45.176806],
            },
        });

        const iconImageHref = window.location.origin + '/local/templates/eokna/assets/img/map-icon.svg';

        myPlacemark.options.set({
            iconLayout: 'default#image',
            iconImageHref: iconImageHref,
            iconImageSize: [56, 56],
            iconOffset: [-16, -16],
          });

        myMap.geoObjects.add(myPlacemark);
    };
    ymaps.ready(initMap);

    const initGallery = () => {
        const galleryWrapper = document.querySelector('.gallery__wrapper');

        if (!galleryWrapper) {
            return;
        }

        lightGallery(galleryWrapper, {
            speed: 500,
        });
    };

    initGallery();
}(jQuery));