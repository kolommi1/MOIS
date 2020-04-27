let API_Calls = {

    async call(method, url, dtoIn, headers) {
        let body;
        if (dtoIn) {
            body = JSON.stringify(dtoIn);
        }

        let response = await fetch(url, {
            method: method,
            body: body,
            credentials: 'include', //same-origin
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    },

    getUri: function (useCase) {
        return (
            "http://localhost:5000/" + useCase
        );
    },

    async getPaymentsByUser(accountNumber, dtoIn) {
        let commandUri = this.getUri("paymentListByAccountNumber/" + accountNumber);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async getPaymentsByCategory(categoryIds, dtoIn) {
        let commandUri = this.getUri("paymentListByCategoryID/" + categoryIds);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async userAuthenticate(mail, password) {
        let commandUri = this.getUri("auth/login");
        return await API_Calls.call("post", commandUri, {mail, password});
    },

    async facebookLogin(fbResponse) {
        let commandUri = this.getUri("auth/fbLogin");
        return await API_Calls.call("post", commandUri, fbResponse);
    },

    async getCurrentUser() {
        let commandUri = this.getUri("auth/currentUser");
        return await API_Calls.call("post", commandUri);
    },

    async getPaymentsByDateByUser(from, to, accountNumber, dtoIn) {
        let commandUri = this.getUri("paymentListByDateUser/" + from + "/" + to + "/" + accountNumber);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async getPaymentsByDateByCategoryByUser(from, to, accountNumber, categoryIds, dtoIn) {
        let commandUri = this.getUri("paymentListByDateUserCategory/" + from + "/" + to + "/" + accountNumber + "/" + categoryIds);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async postPayment(payment) {
        let commandUri = this.getUri("paymentItem");
        return await API_Calls.call("post", commandUri, payment);
    },

    async updatePayment(payment) {
        let commandUri = this.getUri("paymentItem");
        return await API_Calls.call("put", commandUri, payment);
    },
};

export default API_Calls;
