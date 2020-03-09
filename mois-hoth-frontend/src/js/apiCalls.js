let API_Calls = {

    async call(method, url, dtoIn, headers) {
        let body;
        if(dtoIn){
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

    getUri: function(useCase) {
        return (
            "http://localhost:5000/" + useCase
        );
    },

    async getAllPayments(dtoIn) {
        let commandUri = this.getUri("paymentList");
        return await API_Calls.call("get", commandUri, dtoIn);
    }

};

export default API_Calls;
