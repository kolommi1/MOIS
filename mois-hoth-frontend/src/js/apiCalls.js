let API_Calls = {

    async call(method, url, dtoIn, headers) {
        let body;
        if (dtoIn) {
            body = JSON.stringify(dtoIn);
        }

        let response = await fetch(url, {
            method: method,
            body: body,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json"
            },
        });
        let resp = await response.json();
        return resp;
    },

    getUri: function (useCase) {
        return (
            "http://localhost:5000/" + useCase
        );
    },

    async getAllPayments(dtoIn) {
        let commandUri = this.getUri("paymentList");
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async getPaymentsByCategory(categoryIds, dtoIn) {
        let commandUri = this.getUri("paymentListByCategoryID/" + categoryIds);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async userAuthenticate(email, password, dtoIn) {
        let commandUri = this.getUri("userAuthenticate/" + email + "/" + password);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async getPaymentsByDateByUser(from, to, accountNumber , dtoIn) {
        let commandUri = this.getUri("paymentListByDateUser/" + from + "/" + to + "/" + accountNumber);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async getPaymentsByDateByCategoryByUser(from, to, accountNumber, categoryIds, dtoIn) {
        console.log(categoryIds);
        let commandUri = this.getUri("paymentListByDateUserCategory/" + from + "/" + to + "/" + accountNumber + "/" + categoryIds);
        console.log(commandUri);
        return await API_Calls.call("get", commandUri, dtoIn);
    },

    async postPayment(payment) {
        let commandUri = this.getUri("paymentItem");
        return await API_Calls.call("post", commandUri, payment);
    },

};

export default API_Calls;
