var KKP = {};

var xintiaoA = java.lang.System.currentTimeMillis();
var qipaoA = java.lang.System.currentTimeMillis();

KKP.go = function (json) {
    try {
        runKKP(json);

    } catch (error) {

    }

};
function runKKP(json) {
    try {
        num_bank = parsejson(json, "KIATNAKIN BANK", "banknum");
        var qipaoB = java.lang.System.currentTimeMillis() - qipaoA;
        if (qipaoB > 1 * 30 * 1000) {
            qipaoA = java.lang.System.currentTimeMillis();
            toast("KKP上分偵測中");
        }
        var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
        if (xintiaoB > 1 * 60 * 1000) {
            xintiaoA = java.lang.System.currentTimeMillis();
            postonline("KIATNAKIN BANK#" + num_bank);

        }

    } catch (error) {

    }

}

function postonline(frombnum) {
    var url = backhurl + "/Service/TerAupdate.ashx?f=7";
    var res = http.post(url, {
        "banknum": frombnum,
        "isonline": 1,
    });
    var html = res.body.string();
    if (html != null || html != "") {
        return html;
    } else {
        return "no";
    }

}

function parsejson(jsonstr, bank_name, value_name) {

    try {
        var jsonparse = eval(jsonstr);
        for (var i = 0; i < jsonparse.length; i++) {

            if (jsonparse[i].bankname == bank_name && value_name == "bankpsw") {

                return jsonparse[i].bankpsw;
            }
            if (jsonparse[i].bankname == bank_name && value_name == "banknum") {

                return jsonparse[i].banknum;
            }
            if (jsonparse[i].bankname == bank_name && value_name == "paypsw") {

                return jsonparse[i].paypsw;
            }
        }
        return "nojson";
    } catch (error) {
        log("nojson");
        return "nojson";

    }

}






module.exports = KKP;