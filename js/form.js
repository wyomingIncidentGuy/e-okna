class Form {
    constructor() {
        $(this.inputPhone).mask('+7 (999) 999-99-99');

        this.addEvent();
    }

    addEvent() {
        $(document).on('submit', `form`, async (event) => {
            event.preventDefault();

            const formSelector = `#${event.target.id}`;

            const actionName = event.target.id.split('-').pop();

            let serializeData = await this.serializeObject(event.target);
            let fields = Object.keys(serializeData).filter(key => !key.startsWith('CAPTCHA_'));
            let fieldsValues = Object.keys(serializeData)
                .filter(key => !key.startsWith('CAPTCHA_'))
                .map(key => serializeData[key]);

            let data = {
                action: `${actionName}Access`,
                fields: fields,
                fieldsValues: {
                    ...fieldsValues
                }
            }

            let checkError = await this.checkError(event.target, serializeData, fields);

            let submit = event.target.querySelectorAll('[type="submit"]');

            if (checkError) {
                submit.forEach((key) => {
                    key.disabled = true;
                });

                if (Object.keys(data).length > 0) {
                    if (actionName === 'pay') {
                        await this.qrPay({
                            data: data,
                            form: formSelector,
                            fields: fields,
                            submit: submit
                        });
                    } else {
                        await this.sendForm(`${actionName}Access`, {
                            data: data,
                            form: formSelector,
                            fields: fields,
                            submit: submit
                        });
                    }
                }
            }
        });

        this.forms = document.querySelectorAll(`form`);

        let formsIDs = [];
        let clearButtons = [];

        this.forms.forEach((form) => {
            formsIDs.push(form.id);
        });

        formsIDs.forEach((id) => {
            let buttons = this.getFormClearButton(`#${id}`);

            if (Array.isArray(buttons)) {
                clearButtons.push(...buttons);
            } else if (buttons) {
                clearButtons.push(buttons);
            }
        });

        clearButtons.forEach((button) => {
            if (button instanceof HTMLElement) {
                button.addEventListener('click', (event) => {
                    let inputName = event.target.dataset.inputName;
                    let formSelector = `#${event.target.id}`;

                    let form = document.querySelector(formSelector);
                    if (form) {
                        let input = form.querySelector('input[name="' + inputName + '"]');
                        if (input) {
                            input.value = '';
                        }
                    }
                });
            }
        });
    }

    async checkError(form, data, fields = []) {
        let result = true;
        fields.forEach((name) => {
            if (!data[name]) {
                form.querySelector('[name="' + name + '"]').classList.add('error');
                result = false;
            } else {
                form.querySelector('[name="' + name + '"]').classList.remove('error');
            }
        })
        return await result;
    }

    async serializeObject(form) {
        let result = {};
        let formData = new FormData(form);
        formData.forEach(function (value, name) {
            result[name] = value;

        })
        return await result;
    }

    clearForm(form, nameFields = []) {
        let formFields = form.querySelectorAll('textarea, input');
        formFields.forEach((formField) => {
            if (nameFields.indexOf(formField.name) !== -1) {
                formField.value = '';
            }
        })
    }

    errorForm(form, condition, message = '') {

        let messageWrappers = form.querySelector('.message-error');
        if (condition === 'show') {
            messageWrappers.innerHTML = message;
            form.style.display = 'block'
        }
        if (condition === 'hide') {
            messageWrappers.innerHTML = '';
            form.style.display = 'none'
        }
    }


    getErrorFormSelector(form) {
        return document.querySelector(`${form}-message-error`);
    }

    getFormSelector(form) {
        return document.querySelector(`${form}`);
    }

    getFormClearButton(formID) {
        let form = this.getFormSelector(formID);

        return form.querySelectorAll('.js-input-clear');
    }

    async qrPay(data) {
        return await BX.ajax.runComponentAction('impulsit:qr_pay', 'generateQr', {
            mode: 'class',
            data: data
        }).then((response) => {
            if (response.status !== undefined) {
                if (response.status === 'success') {
                    let filePath = response.data.qrFilePath;
                    let payload  = response.data.payload;

                    document.getElementById('qrImg').src = filePath;
                    document.getElementById('qrImgMobile').src = filePath;
                    document.getElementById('qrHref').href = payload

                    $(data.form).addClass("show-sending");

                    data.submit.forEach((key, value) => {
                        key.disabled = false;
                    });

                    let errorFormSelector = this.getErrorFormSelector(data.form);
                    let formSelector = this.getFormSelector(data.form);

                    this.errorForm(errorFormSelector, 'hide');
                    this.clearForm(formSelector, data.fields);

                    return {
                        result: "success",
                    };
                } else {
                    data.submit.forEach((key, value) => {
                        key.disabled = false;
                    });
                    if (typeof response.message != 'object') {
                        let errorFormSelector = this.getErrorFormSelector(data.form);

                        this.errorForm(errorFormSelector, 'show', response.message);
                    }

                    return {
                        result: "error",
                        message: 'Что то пошло не так, попробуйте отправить еще раз.'
                    };
                }
            }
        });
    }

    async sendForm(action, data) {
        return await BX.ajax.runComponentAction('impulsit:form_aggregator', 'formsAccess', {
            mode: 'class',
            data: data
        }).then((response) => {
            $(data.form).find('.custom__CAPTCHA').removeClass('error-v2');
            $(data.form).find('input').parents('.modal-form__group').removeClass('error-v2');
            $(data.form).find('textarea').parents('.modal-form__group').removeClass('error-v2');

            if (typeof response.message === 'object') {
                if (response.message.CAPTCHA) {
                    $(data.form).find('.custom__CAPTCHA').addClass('error-v2');
                }
                if (response.message.input) {
                    for (var key in response.message.input) {
                        $(data.form).find('input[name="' + key + '"]').parents('.modal-form__group')
                            .addClass('error-v2');
                        $(data.form).find('input[name="' + key + '"]').parents('.modal-form__group')
                            .find('.modal-form__error-text').text(response.message.input[key]);
                    }
                }
                if (response.message.textarea) {
                    for (var key in response.message.textarea) {
                        $(data.form).find('textarea[name="' + key + '"]').parents('.modal-form__group')
                            .addClass('error-v2');
                        $(data.form).find('textarea[name="' + key + '"]').parents('.modal-form__group')
                            .find('.modal-form__error-text').text(response.message.textarea[key]);
                    }
                }
            }

            if (response.status !== undefined) {
                if (response.status === 'success') {
                    $.fancybox.close();

                    data.submit.forEach((key, value) => {
                        key.disabled = false;
                    });

                    let errorFormSelector = this.getErrorFormSelector(data.form);
                    let formSelector = this.getFormSelector(data.form);

                    if (action !== 'calculatorAccess') {
                        this.errorForm(errorFormSelector, 'hide');
                        this.clearForm(formSelector, data.fields);
                    }

                    return {
                        result: "success",
                    };

                    // ym(91373559, 'reachGoal', 'request');
                } else {
                    data.submit.forEach((key, value) => {
                        key.disabled = false;
                    });
                    if (typeof response.message != 'object') {
                        let errorFormSelector = this.getErrorFormSelector(data.form);

                        this.errorForm(errorFormSelector, 'show', response.message);
                    }

                    return {
                        result: "error",
                        message: 'Что то пошло не так, попробуйте отправить еще раз.'
                    };
                }
            }
        });
    }
}