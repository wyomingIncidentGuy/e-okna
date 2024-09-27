const formParams = {
    inputPhone: document.querySelectorAll('input[name="phone"]'),
    /**
     * Ваша заявка
     */
    formSendRequest: document.querySelector('#js-form-send-request'),
    /**
     * Вызов замерщика
     */
    formMeasurement: document.querySelector('#js-form-measurement'),
    /**
     * Нестандартное окно
     */
    formCustomWindow: document.querySelector('#js-form-custom-window'),
    /**
     * Оплата Онлайн
     */
    formPay: document.querySelector('#js-form-pay'),
    /**
     * Пригласить замерщика
     */
    inviteRequest: document.querySelector('#js-form-send-request-invite'),
};
Object.assign(Form.prototype, formParams);
new Form();

