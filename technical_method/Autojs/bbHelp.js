var bbHelp = {};
var backctr = "https://158.ole787.vip";//後臺
var backshatr = "https://api.ole787.vip";//前臺
var backapkname = "HAOLI-PAY";//apk 应用名



bbHelp.gethURL = function () {

    return backctr;
};
bbHelp.getdURL = function () {

    return backshatr;
};
bbHelp.getApkName = function () {

    return backapkname ;
};

bbHelp.postonline = function (frombnum) {

    var url =backctr+ "/Service/TerAupdate.ashx?f=7";
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
};


//傳圖片
bbHelp.post_qr_img = function post_qr_img(pnum, img64) {
    var url = backctr+"/Service/TerAupdate.ashx?f=8";
    var res = http.post(url, {
        "banknum": pnum,
        "qrcode": img64
    });
    var html = res.body.string();
    if (html != null || html != "") {
        return html;
    } else {
        return "no";
    }

}


bbHelp.getBlance = function (banknumInfo, bblanceInfo) {

    //獲取機器碼作為key
    var sms = "";
    //log(aid);
    var url = backctr+"/Service/TerAupdate.ashx?f=5";

    var banknum = banknumInfo;
    var bblance = bblanceInfo;
    var res = http.post(url, {
        "banknum": banknum,
        "bblance": bblance,
    });

    //返回驗證碼，如果是空就是上傳信息不對
    var html = res.body.string();
    if (html != null || html != "") {
        sms = html;
        return sms;
    } else {
        return;
    }
}

bbHelp.post_callback = function (pnum, kfno, pname, amount, orderdt, payno) {
    var url = backshatr+"/Service/hdorder.ashx?t=0";
    var res = http.post(url, {
        "paybanknum": pnum,
        "kfNo": kfno,
        "payeename": pname,
        "amount": amount,
        "orderdt": orderdt,
        "payno": payno


    });
    var html = res.body.string();
    if (html != null || html != "") {
        return html;
    } else {
        return "no";
    }

}


bbHelp.gettesk = function (fbanknum) {
    var url = backctr+"/Service/getTersInfo.ashx?t=3";
    var res = http.post(url, {
        "frombnum": fbanknum
    });
    var html = res.body.string();
    if (html.indexOf("fbanknum") != -1) {
        return html;
    } else {
        return "no";
    }

}

bbHelp.postSc = function (frombnum, mesg) {
    var url = backctr+"/Service/BtbAupdate.ashx?f=3";
    var res = http.post(url, {
        "frombnum": frombnum,
        "mesg": mesg
    });
    var html = res.body.string();
    if (html != null || html != "") {
        return html;
    } else {
        return "no";
    }

}

bbHelp.wait_sleep = function (wait_name, sleep_time) {
    try {

        //var vait_content = id("tvDate").findOne(1000);
        for (let index = 0; index < sleep_time; index++) {
            if (wait_name.exists()) {
                break;
            }
            else {
                wait_name.findOne(1000);
            }
        }

    } catch (error) {

    }

}




module.exports = bbHelp;


