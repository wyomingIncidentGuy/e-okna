class Calculator {
    constructor({imagesDefaultPath}) {
        this.order = {};
        this.orders = {};
        this.contacts = [];
        this.imagesDefaultPath = imagesDefaultPath
        this.init();
    }

    init() {
        this.addEvent();
        this.showAdditionalAccessories();
        this.sendCalculator();
        this.initDeliveryOptions();
        this.initAddNewProduct();
        this.addRightSashDoor();
        this.initVariantsProductImg();
        this.checkWindowDimensions();
    }

    addEvent() {
        this.buttonNext.addEventListener('click', (event) => {
            event.preventDefault();
            const step = this.getActiveStep();
            const stepNumber = step.dataset.step;

            const handlers = {
                '1': () => {
                    this.updateOrder('typeOfRoom', this.getInputValue(step, 'typeOfRoom'));
                    this.setActiveStepNext(step);
                },
                '2': () => {
                    this.updateOrder('numberOfFlaps', this.getInputDataValue(step, 'numberOfFlaps'));
                    this.setActiveStepNext(step);
                },
                '3': () => {
                    const windowSize = this.getWindowSize(step);
                    if (windowSize) {
                        this.updateOrder('windowSize', windowSize);
                        this.setActiveStepNext(step);
                    }
                },
                '4-1': () => this.handleProductStep(step, 'sash', 'step_4_1'),
                '4-2': () => this.handleProductStep(step, ['leftSash', 'rightSash'], 'step_4_2'),
                '4-3': () => this.handleProductStep(step, ['leftSash', 'centerSash', 'rightSash'], 'step_4_3'),
                '4-4': () => this.handleDoorStep(step, 'step_4_4'),
                '5': () => this.handleComplectsStep(step),
                '6': () => this.handleParametersStep(step),
                '7': () => {
                    this.buttonPrew.disabled = false;
                    this.setActiveStepNext(step);
                },
                '8': () => this.handleFinalStep(step),
            };

            if (handlers[stepNumber]) {
                handlers[stepNumber]();
            } else {
                console.log('buttonNext end');
            }
        });

        this.buttonPrew.addEventListener('click', (event) => {
            event.preventDefault();
            const step = this.getActiveStep();
            this.buttonPrew.disabled = step.dataset.stepPrew === '7';
            if (step.dataset.stepPrew === '8') {
                this.buttonNext.style.display = '';
            }
            this.setActiveStepPrew(step);
        });
    }

    updateOrder(key, value) {
        this.order[key] = value;
    }

    getInputValue(step, name) {
        return step.querySelector(`input[name="${name}"]:checked`).value;
    }

    getInputDataValue(step, name) {
        return step.querySelector(`input[name="${name}"]:checked`).dataset.value;
    }

    getInputDataName(step, name) {
        return step.querySelector(`input[name="${name}"]:checked`).dataset.name;
    }

    handleProductStep(step, types, imgId) {
        const products = Array.isArray(types) ? types : [types];
        const stepData = step.dataset.step.replace(/-/g, '_');
        this.order['product'] = products.map(type => ({
            step: step.dataset.step,
            type: type,
            name: this.getInputDataName(step, `${type}_${stepData}`),
            value: this.getInputValue(step, `${type}_${stepData}`),
            grid: this.getInputValueOrDefault(step, `${type}Grid_${stepData}`, 'false'),
            castle: this.getInputValueOrDefault(step, `${type}Castle_${stepData}`, 'false'),
        }));
        this.order['windowImg'] = step.querySelector(`#${imgId}`).src;
        this.setActiveStepNext(step);
    }

    handleDoorStep(step, imgId) {
        this.handleProductStep(step, ['door', 'leftSash'], imgId);
        if (this.calculator.querySelector('#js-right-sash-4-4').dataset.active === 'true') {
            this.order['product'].push({
                step: '4-4',
                type: 'rightSash',
                name: this.getInputDataName(step, 'rightSash_4_4'),
                value: this.getInputValue(step, 'rightSash_4_4'),
                grid: this.getInputValueOrDefault(step, 'rightSashGrid_4_4', 'false'),
                castle: this.getInputValueOrDefault(step, 'rightSashCastle_4_4', 'false'),
            });
        }
        this.setActiveStepNext(step);
    }

    handleComplectsStep(step) {
        this.order['complects'] = this.getCheckedValues(step, ['windowsill', 'slopes', 'lowTide']);
        this.setActiveStepNext(step);
    }

    handleParametersStep(step) {
        this.order['parameters'] = this.getCheckedValues(step, [
            'soundInsulation', 'heatSaving', 'sunProtection', 'microVentilation',
            'antiBurglary', 'lightTransmission', 'lamination', 'multiPackage', 'designWindows'
        ]);
        if (Object.keys(this.order).length > 0) {
            this.orders[Object.keys(this.orders).length] = this.order;
            this.order = {};
            this.calculator.querySelector('#js-order-6').innerHTML = this.renderProductCard(this.orders, 6);
            this.addCounterProduct();
            this.addEventRemoveProduct();
        }
        this.buttonPrew.disabled = true;
        this.setActiveStepNext(step);
    }

    handleFinalStep(step) {
        const delivery = this.getInputValue(step, 'delivery');
        const montage = this.getInputValue(step, 'montage');
        const address = step.querySelector('input[name="address"]');
        if (delivery === 'Другое' && address.value === '') {
            this.addError([address]);
        } else {
            this.removeError([address]);
            this.contacts['delivery'] = delivery === 'Другое' ? address.value : delivery;
            this.contacts['montage'] = montage;
            this.calculator.querySelector('#js-order-9').innerHTML = this.renderProductCard(this.orders);
            this.addCounterProduct();
            this.calculator.querySelector('#js-delivery-9').innerHTML = this.contacts['delivery'];
            this.calculator.querySelector('#js-montage-9').innerHTML = this.contacts['montage'];
            this.buttonNext.style.display = 'none';
            this.setActiveStepNext(step);
        }
    }

    getCheckedValues(step, names) {
        return names.reduce((acc, name) => {
            const element = step.querySelector(`input[name="${name}"]:checked`);
            if (element) {
                acc[name] = element.value;
            }
            return acc;
        }, {});
    }

    getInputValueOrDefault(step, name, defaultValue) {
        const element = step.querySelector(`input[name="${name}"]:checked`);
        return element ? element.value : defaultValue;
    }

    showAdditionalAccessories() {
        const toggleAccessories = (inputName, accessoriesId) => {
            this.calculator.querySelectorAll(`input[name="${inputName}"]`).forEach((input) => {
                input.addEventListener('change', (event) => {
                    const accessoriesElement = this.calculator.querySelector(`#${accessoriesId}`);
                    const isFixed = event.target.value === 'Глухая';
                    accessoriesElement.style.display = isFixed ? 'none' : 'block';
                    accessoriesElement.dataset.active = isFixed ? 'false' : 'true';
                    accessoriesElement.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                        checkbox.checked = false;
                    });
                });
            });
        };

        const accessoriesMapping = [
            {inputName: 'sash_4_1', accessoriesId: 'accessoriesSash_4_1'},
            {inputName: 'leftSash_4_2', accessoriesId: 'accessoriesleftSash_4_2'},
            {inputName: 'rightSash_4_2', accessoriesId: 'accessoriesRightSash_4_2'},
            {inputName: 'leftSash_4_3', accessoriesId: 'accessoriesLeftSash_4_3'},
            {inputName: 'centerSash_4_3', accessoriesId: 'accessoriesCenterSash_4_3'},
            {inputName: 'rightSash_4_3', accessoriesId: 'accessoriesRightSash_4_3'},
            {inputName: 'leftSash_4_4', accessoriesId: 'accessoriesLeftSash_4_4'},
            {inputName: 'rightSash_4_4', accessoriesId: 'accessoriesRightSash_4_4'},
        ];

        accessoriesMapping.forEach(({inputName, accessoriesId}) => {
            toggleAccessories(inputName, accessoriesId);
        });
    }

    async serializeObject(form) {
        let result = {};
        let formData = new FormData(form);
        formData.forEach(function (value, name) {
            result[name] = value;

        })
        return await result;
    }

    sendCalculator() {
        const form = this.calculator.querySelector('#js-form-calc-result');
        const submitButton = this.calculator.querySelector('#js-form-calc-result-send');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const phoneInput = form.querySelector('input[name="phone"]');

            if (this.isPhoneEmpty(phoneInput)) {
                this.addError([phoneInput]);
                return;
            }

            this.removeError([phoneInput]);
            submitButton.disabled = true;

            const formSelector = `#${event.target.id}`;

            const actionName = 'calculatorAccess';

            const formData = this.getFormData(phoneInput);

            let data = {
                action: actionName,
                fields: formData.fields,
                fieldsValues: formData.fieldsValues
            }

            let submit = event.target.querySelectorAll('[type="submit"]');

            const formAggregator = new Form();

            await formAggregator.sendForm(actionName, {
                data: data,
                form: formSelector,
                fields: formData.fields,
                submit: submit
            }).then((response) => {
                $('#js-form-calc-resultw').find('.custom__CAPTCHA').removeClass('error-v2');

                if (response.message) {
                    if (response.message.CAPTCHA) {
                        $('#js-form-calc-result').find('.custom__CAPTCHA').addClass('error-v2');
                    }
                }

                let message = document.querySelector('#calculator-result-modal').querySelector('.calculator-message');

                if (response.result === 'success') {
                    message.innerHTML = 'Ваша заявка принята, наш менеджер свяжется с вами в ближайшее время.'
                    $.fancybox.open({
                        src: '#calculator-result-modal',
                        type: 'inline'
                    });
                    setTimeout(function () {
                        $.fancybox.close();
                    }, 2000);

                    $('#js-form-calc-result-send').attr('disabled', 'disabled');
                    // ym(91373559, 'reachGoal', 'calc');
                } else {
                    this.calculator.querySelector('#js-form-calc-result-send').disabled = false;
                    message.innerHTML = response.message;
                    $.fancybox.open({
                        src: '#calculator-result-modal',
                        type: 'inline'
                    });
                }
            });
        });
    }

    isPhoneEmpty(phoneInput) {
        return phoneInput.value.trim() === '';
    }

    getFormData(phoneInput) {
        return {
            action: 'calculatorAccess',
            fields: [
                'PHONE', // String
                'DELIVERY', // String
                'MONTAGE', // String
                'ROOM_TYPE', // String
                'FLAPS_NUMBER', // String
                'WINDOW_SIZE', // String
                'PRODUCT_NAME', // String
                'PRODUCT_VALUE', // String
                'PRODUCT_GRID', // Boolean
                'PRODUCT_LOCK', // Boolean
                'WINDOW_IMAGE', // String
                'PACKAGES', // Array
                'PARAMETERS' // Array
            ],
            fieldsValues: [
                phoneInput.value.trim(),
                this.contacts['delivery'],
                this.contacts['montage'],
                this.orders[0]['typeOfRoom'],
                this.orders[0]['numberOfFlaps'],
                this.orders[0]['windowSize'].width + 'mm x ' + this.orders[0]['windowSize'].height + "mm",
                this.orders[0]['product'][0].name,
                this.orders[0]['product'][0].value,
                this.orders[0]['product'][0].grid,
                this.orders[0]['product'][0].castle,
                this.orders[0].windowImg,
                this.orders[0].complects,
                this.orders[0].parameters,
            ]
        };
    }

    initDeliveryOptions() {
        this.calculator.querySelector('div[data-step="8"]').querySelectorAll('input').forEach((input) => {
            input.addEventListener('change', (event) => {
                event.preventDefault();
                let address = this.calculator.querySelector('#js-delivery-option').querySelector('input[name="address"]');
                if (event.target.value === 'Другое' || event.target.name === 'address') {
                    address.disabled = false;
                } else {
                    address.disabled = true;
                }
            });
        })
    }

    initAddNewProduct() {
        this.calculator.querySelector('#js-add-button-new-product').addEventListener('click', (event) => {
            this.calculator.querySelector('.active-step').classList.remove('active-step');
            this.calculator.querySelector('div[data-step="1"]').classList.add('active-step');
            this.calculator.querySelector('#js-form-calc-result-send').disabled = false;
            this.buttonPrew.disabled = false;
        })
    }

    renderProductCard(data = {}, step = 0) {
        console.log(data);
        const createAccessoryList = (products) => {
            return products.map(product => {
                let accessories = product.name + ': ';
                if (product.castle && product.castle !== 'false') accessories += product.castle + ', ';
                if (product.grid && product.grid !== 'false') accessories += product.grid + ', ';
                return accessories + '<br>';
            }).join('');
        };

        const createListFromObject = (items) => Object.values(items).join(', ');

        const createRemoveButton = (key) => {
            return step === 6 ? `
                <li class="wiew-options__item">
                    <button class="calc__button-remove js-product-remove" data-remove-id="${key}">Удалить конструкцию</button>
                </li>
            ` : '';
        };

        return Object.entries(data).map(([key, item]) => {
            const accessories = createAccessoryList(item.product);
            const complects = createListFromObject(item.complects);
            const parameters = createListFromObject(item.parameters);
            const removeButton = createRemoveButton(key);

            return `
                <div class="wiew-container" data-product-id="${key}">
                    <div class="wiew-options">
                        <div class="wiew-options__info">
                            <div class="wiew-options__ordering">
                                <ul class="wiew-options__list">
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text">Параметры изделия:</p>
                                    </li>
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Конструкций:</p>
                                        <div class="wiew-options__item-regulator js-counter-product-container">
                                            <div class="wiew-options__item-regulator-minus js-counter-product-minus">-</div>
                                            <div class="wiew-options__item-regulator-count js-counter-product-count" data-count="${item.count || 1}" data-id="${key}">
                                                ${item.count || 1}
                                            </div>
                                            <div class="wiew-options__item-regulator-plus js-counter-product-plus">+</div>
                                        </div>
                                    </li>
                                    ${removeButton}
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Створки:</p>
                                        <p class="wiew-options__text">${item.numberOfFlaps}</p>
                                    </li>
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Размеры окна, мм:</p>
                                        <p class="wiew-options__text">
                                            ${item.windowSize.noSize ? item.windowSize.noSize : `${item.windowSize.height}.mm x ${item.windowSize.width}.mm`}
                                        </p>
                                    </li>
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Аксессуары:</p>
                                        <p class="wiew-options__text">${accessories}</p>
                                    </li>
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Комплектующие:</p>
                                        <p class="wiew-options__text">${complects}</p>
                                    </li>
                                    <li class="wiew-options__item">
                                        <p class="wiew-options__text-grey">Дополнительные параметры:</p>
                                        <p class="wiew-options__text">${parameters}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="wiew-options__img">
                            <img src="${item.windowImg}" alt="${item.numberOfFlaps}">
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    addCounterProduct() {
        const updateCounter = (counter, increment) => {
            let count = Number(counter.dataset.count) + increment;
            if (count < 1) return;

            counter.innerHTML = count;
            counter.dataset.count = count;
            this.orders[counter.dataset.id]['count'] = count;
        };

        this.calculator.querySelectorAll('.js-counter-product-container').forEach(container => {
            container.addEventListener('click', (event) => {
                const element = event.target;
                const counter = container.querySelector('.js-counter-product-count');

                if (element.classList.contains('js-counter-product-minus')) {
                    updateCounter(counter, -1);
                } else if (element.classList.contains('js-counter-product-plus')) {
                    updateCounter(counter, 1);
                }
            });
        });
    }

    addEventRemoveProduct() {
        this.calculator.querySelectorAll('.js-product-remove').forEach((container) => {
            container.addEventListener('click', (event) => {
                let element = event.target;
                let idProduct = element.getAttribute('data-remove-id');
                this.calculator.querySelector(`div[data-product-id="${idProduct}"]`).remove();
                delete this.orders[idProduct];

                this.overwriteOrders();

                if (!Object.keys(this.orders).length) {
                    let step = this.getActiveStep();
                    step.dataset.stepPrew = 1;
                    this.setActiveStepPrew(step);
                } else {
                    this.calculator.querySelector('#js-order-6').innerHTML = this.renderProductCard(this.orders, 6);
                    this.addCounterProduct();
                    this.addEventRemoveProduct();
                }
            });
        });
    }

    overwriteOrders() {
        let orders = Object.values(this.orders);

        for (let key in this.orders) delete this.orders[key];

        for (let order of orders) {
            this.orders[Object.keys(this.orders).length] = order;
        }
    }

    addRightSashDoor() {
        this.calculator.querySelector('#js-add-button-right-sash-4-4').addEventListener('click', () => {
            let rightSash = this.calculator.querySelector('#js-right-sash-4-4');
            if (rightSash.dataset.active === 'false') {
                rightSash.style.display = 'block';
                rightSash.dataset.active = 'true';
            }
        });
        this.calculator.querySelector('#js-delete-button-right-sash-4-4').addEventListener('click', () => {
            let rightSash = this.calculator.querySelector('#js-right-sash-4-4');
            if (rightSash.dataset.active === 'true') {
                rightSash.style.display = 'none';
                rightSash.dataset.active = 'false';
            }
        })
    }

    initVariantsProductImg() {
        const setImageSrc = (img, key, mapping) => {
            img.src = mapping[key] || '';
        };

        const getSelectedValue = (name) => {
            const selected = this.calculator.querySelector(`input[name="${name}"]:checked`);
            return selected ? selected.value : '';
        };

        this.calculator.querySelector('div[data-step="4-1"]').addEventListener('click', () => {
            const img = this.calculator.querySelector('#step_4_1');
            const sash = getSelectedValue('sash_4_1');
            const mapping = {
                'Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-1.png`,
                'Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2.png`,
                'Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3.png`
            };
            setImageSrc(img, sash, mapping);
        });

        this.calculator.querySelector('div[data-step="4-2"]').addEventListener('click', () => {
            const img = this.calculator.querySelector('#step_4_2');
            const leftSash = getSelectedValue('leftSash_4_2');
            const rightSash = getSelectedValue('rightSash_4_2');
            const mapping = {
                'Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-1-1.png`,
                'Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-1-2.png`,
                'Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-1-3.png`,
                'Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-2-1.png`,
                'Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-2-2.png`,
                'Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-2-3.png`,
                'Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-3-1.png`,
                'Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-3-2.png`,
                'Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-2-3-3.png`
            };
            setImageSrc(img, `${leftSash}-${rightSash}`, mapping);
        });

        this.calculator.querySelector('div[data-step="4-3"]').addEventListener('click', () => {
            const img = this.calculator.querySelector('#step_4_3');
            const leftSash = getSelectedValue('leftSash_4_3');
            const centerSash = getSelectedValue('centerSash_4_3');
            const rightSash = getSelectedValue('rightSash_4_3');
            const mapping = {
                'Глухая-Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-1-1.png`,
                'Глухая-Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-1-2.png`,
                'Глухая-Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-1-3.png`,
                'Глухая-Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-2-1.png`,
                'Глухая-Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-3-1.png`,
                'Глухая-Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-2-2.png`,
                'Глухая-Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-2-3.png`,
                'Глухая-Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-3-2.png`,
                'Глухая-Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-1-3-3.png`,
                'Поворотная-Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-1-1.png`,
                'Поворотная-Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-2-1.png`,
                'Поворотная-Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-1-2.png`,
                'Поворотная-Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-1-3.png`,
                'Поворотная-Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-2-2.png`,
                'Поворотная-Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-2-3.png`,
                'Поворотная-Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-3-1.png`,
                'Поворотная-Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-3-2.png`,
                'Поворотная-Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-2-3-3.png`,
                'Поворотно-откидная-Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-1-1.png`,
                'Поворотно-откидная-Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-2-1.png`,
                'Поворотно-откидная-Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-3-1.png`,
                'Поворотно-откидная-Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-1-2.png`,
                'Поворотно-откидная-Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-1-3.png`,
                'Поворотно-откидная-Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-2-2.png`,
                'Поворотно-откидная-Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-2-3.png`,
                'Поворотно-откидная-Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-3-2.png`,
                'Поворотно-откидная-Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-3-3-3-3.png`
            };
            setImageSrc(img, `${leftSash}-${centerSash}-${rightSash}`, mapping);
        });

        this.calculator.querySelector('div[data-step="4-4"]').addEventListener('click', () => {
            const img = this.calculator.querySelector('#step_4_4');
            const door = getSelectedValue('door_4_4');
            const leftSash = getSelectedValue('leftSash_4_4');
            let rightSash = {value: 'undefined'};
            if (this.calculator.querySelector('#js-right-sash-4-4').dataset.active === 'true') {
                rightSash = getSelectedValue('rightSash_4_4');
            }
            const mapping = {
                'Поворотная-Глухая-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-1.png`,
                'Поворотная-Поворотная-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-2.png`,
                'Поворотная-Поворотно-откидная-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-3.png`,
                'Поворотно-откидная-Глухая-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-1.png`,
                'Поворотно-откидная-Поворотная-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-2.png`,
                'Поворотно-откидная-Поворотно-откидная-undefined': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-3.png`,
                'Поворотная-Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-1-1.png`,
                'Поворотная-Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-1-2.png`,
                'Поворотная-Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-1-3.png`,
                'Поворотная-Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-2-1.png`,
                'Поворотная-Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-2-2.png`,
                'Поворотная-Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-2-3.png`,
                'Поворотная-Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-3-1.png`,
                'Поворотная-Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-3-2.png`,
                'Поворотная-Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-1-3-3.png`,
                'Поворотно-откидная-Глухая-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-1-1.png`,
                'Поворотно-откидная-Глухая-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-1-2.png`,
                'Поворотно-откидная-Глухая-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-1-3.png`,
                'Поворотно-откидная-Поворотная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-2-1.png`,
                'Поворотно-откидная-Поворотная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-2-2.png`,
                'Поворотно-откидная-Поворотная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-2-3.png`,
                'Поворотно-откидная-Поворотно-откидная-Глухая': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-3-1.png`,
                'Поворотно-откидная-Поворотно-откидная-Поворотная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-3-2.png`,
                'Поворотно-откидная-Поворотно-откидная-Поворотно-откидная': `${this.imagesDefaultPath}/assets/img/calc/step-4-4-2-3-3.png`
            };
            setImageSrc(img, `${door}-${leftSash}-${rightSash.value}`, mapping);
        });
    }

    checkWindowDimensions() {
        let windowDimensionsNone = this.calculator.querySelector('input[name="windowDimensionsNone"]');
        let windowHeight = this.calculator.querySelector('input[name="windowHeight"]');
        let windowWidth = this.calculator.querySelector('input[name="windowWidth"]');
        windowDimensionsNone.addEventListener('click', function (event) {
            if (event.target.checked === true) {
                windowHeight.value = '';
                windowHeight.disabled = true;
                windowWidth.value = '';
                windowWidth.disabled = true;
            } else {
                windowHeight.disabled = false;
                windowWidth.disabled = false;
            }
        });
    }

    getWindowSize(step) {
        const inputs = {
            none: step.querySelector('input[name="windowDimensionsNone"]'),
            height: step.querySelector('input[name="windowHeight"]'),
            width: step.querySelector('input[name="windowWidth"]')
        };

        const allEmpty = inputs.height.value === '' && inputs.width.value === '';
        const noneChecked = inputs.none.checked;

        const addError = (fields) => this.addError(fields);
        const removeError = (fields) => this.removeError(fields);

        if (allEmpty && !noneChecked) {
            addError([inputs.height, inputs.width, inputs.none]);
            return false;
        }

        if (inputs.height.value === '' && !noneChecked) {
            addError([inputs.height]);
            removeError([inputs.width, inputs.none]);
            return false;
        }

        if (inputs.width.value === '' && !noneChecked) {
            addError([inputs.width]);
            removeError([inputs.height, inputs.none]);
            return false;
        }

        if (noneChecked) {
            removeError(Object.values(inputs));
            inputs.height.value = '';
            inputs.width.value = '';
            return {noSize: inputs.none.value};
        }

        removeError(Object.values(inputs));
        return {
            height: inputs.height.value,
            width: inputs.width.value
        };
    }

    addError(input = []) {
        input.forEach(function (value) {
            value.classList.add('error-cal');
        })
    }

    removeError(input = []) {
        input.forEach(function (value) {
            value.classList.remove('error-cal');
        })
    }

    getActiveStep() {
        return this.calculator.querySelector('.active-step');
    }

    setActiveStepPrew(step) {
        step.classList.remove('active-step');
        if (step.dataset.stepPrew !== 'false') {
            this.calculator.querySelector('div[data-step="' + step.dataset.stepPrew + '"]').classList.add('active-step');
        }
        this.scrollCalculator();
    }

    setActiveStepNext(step) {
        step.classList.remove('active-step');
        if (step.dataset.stepNext === "variants") {
            let variants = this.calculator.querySelector('input[name="numberOfFlaps"]:checked').value;
            this.calculator.querySelector('div[data-step="' + variants + '"]').classList.add('active-step');
        } else if (step.dataset.stepNext !== 'false') {
            this.calculator.querySelector('div[data-step="' + step.dataset.stepNext + '"]').classList.add('active-step');
        }
        this.scrollCalculator();
    }

    scrollCalculator() {
        $('html, body').stop().animate({
            scrollTop: $('#calc').offset().top - 60
        }, 200);
    }
}