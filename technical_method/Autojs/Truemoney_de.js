var TRUEMONEY = {};



var xintiaoA = java.lang.System.currentTimeMillis();
var qipaoA = java.lang.System.currentTimeMillis();

var pwd_bank;
var num_bank;
var isweb;
var stype;

var appName = "TrueMoney";

var smsdictold = new Array();
var smsdictnew = new Array();
var first_get = false;

TRUEMONEY.go = function (json) {
    try {
        runKTB(json);

    } catch (error) {

    }

};
// while (true) {

//     runKTB(json);
//     sleep(5000);
// }
// var json = " [{\"bankname\":\"TRUEMONEY\",\"banknum\":\"140000985038307\",\"andriodkey\":\"D861GKS234:vww:vit:0Y7:vxx:wky3\",\"bankpsw\":\"123456\",\"paypsw\":\"123456\",\"isweb\":\"False\",\"Ter_isrevlog\":\"0\",\"note\":\"\",\"stype\":\"通知\",\"status\":\"啟用\"}]";
// var backhurl = "https://158.win-th.vip";//後臺
// var backdeskurl = "https://api.win-th.vip";//前臺
// var backapkname = "TH-Pay";//apk 应用名
//runKTB(json);
function runKTB(json) {
    try {
        pwd_bank = parsejson(json, "TRUEMONEY", "bankpsw");
        num_bank = parsejson(json, "TRUEMONEY", "banknum");
        isweb = parsejson(json, "TRUEMONEY", "isweb");
        stype = gettoparsejson(json, "TRUEMONEY", "stype");
        if (isweb == "False") {
            var qipaoB = java.lang.System.currentTimeMillis() - qipaoA;
            if (qipaoB > 1 * 30 * 1000) {
                qipaoA = java.lang.System.currentTimeMillis();
                toast("TRUEMONEY上分偵測中");

            }
            var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
            if (xintiaoB > 1 * 60 * 1000) {
                xintiaoA = java.lang.System.currentTimeMillis();
                postonline("TRUEMONEY#" + num_bank);

            }       
            if (stype == "明細") {
                check_amount();
            }

           
            // get_amounts();
        }



    } catch (error) {

    }

}


function check_amount() {
    try {
        launchApp(appName);
        sleep(1000);
        for (var ss = 0; ss < 20; ss++) {
            if (checkApp()) {
                break;
            }
            else {
                sleep(500);
            }
        }

        if (!checkApp()) {

            try {
                关闭应用(appName);
                launchApp(appName);
                sleep(2000);

                for (var ss = 0; ss < 10; ss++) {
                    if (checkApp()) {
                        break;
                    }
                    else {
                        sleep(500);
                    }
                }
            }
            catch (err) {
                log("log15");
                log(err);
            }

        }
        check_udt_msg();
        //check_btnAnswer();
        wait_sleep(id("pinEditText"),3);
    
        check_pin();
        sleep(2000);
        wait_sleep(id("layout_history"),3);
        sleep(1000);
        check_layout_history();
        swipe(device.width / 2, device.height / 5 * 2, device.width / 2, device.height / 5 * 3, 500);
        // swipe(device.width / 2, device.height / 5 * 2, device.width / 2, device.height / 5 * 3, 500);
        //btnAnswer
        get_zalo_detail();
        addTimenoToOld();

    } catch (error) {

    }
}
function check_udt_msg(){
    wait_sleep(id("btnCancel"), 2);
    if(id("btnCancel").text("Cancel").exists()){
        var btn = id("btnCancel").findOne(1000);
        btn.click();
    }
}
function 关闭应用(packageName) {
    try {

        var name = getPackageName(packageName);
        if (!name) {
            if (getAppName(packageName)) {
                name = packageName;
            } else {
                return false;
            }
        }
        app.openAppSetting(name);
        sleep(2000);

        let is_sure = textMatches(/(.*結束執行.*|.*強制停止.*)/).findOne(5000);

        sleep(1000);
        //toast ("查找结束按钮");
        if (textMatches(/(.*結束執行.*|.*強制停止.*)/).exists()) {
            textMatches(/(.*結束執行.*|.*強制停止.*)/).findOne(5000).click();

            sleep(2000);
            wait_sleep(textMatches(/(.*确.*|.*定.*)/), 5)
            if (!textMatches(/(.*确.*|.*定.*)/).exists()) {
                var log3 = textMatches(/(.*結束執行.*|.*強制停止.*)/).findOnce(2).click();
                spost_check_fuyan("bidvfunny", "log1" + log3);
            }
            if (textMatches(/(.*确.*|.*定.*)/).exists()) {
                textMatches(/(.*确.*|.*定.*)/).findOne(5000).click();
            }
            // log(app.getAppName(name) + "应用已被关闭");
            // toast(app.getAppName(name) + "应用已被关闭");
            sleep(1000);
            back();
        } else {
            //log(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
            //toast(app.getAppName(name) + "应用不能被正常关闭或不在后台运行");
            sleep(1000);
            back();
        }

    } catch (err) {
        //log(err.message);
    }

}
function checkApp() {
    ////layout_history  
    //            //tv_recycler_top_right
    //            //tv_balance_value
    //            //history_item_recycler
    //            //tv_amount
    //            //Transaction ID  parent().child(1);
    //             //id("btnAnswer")
    var sflag = false;
    try {
        //text("Please update application")
        if (text("Please update application").exists() || id("pinEditText").exists() || id("layout_history").exists() || id("tv_balance_value").exists() || id("btnAnswer").exists()) {
            sflag = true;
        }
       // spost_check_fuyan("TM_test", sflag);
    }
    catch (error) {

    }

    return sflag;
}

function goto_amount() {
    try {
        var buttom = id("layout_history").findOne(500);
        buttom.click();


        wait_name = id("tv_recycler_top_right");
        wait_sleep(wait_name, 10);

        buttom = id("tv_recycler_top_right").findOne(500);
        buttom.click();
    } catch (error) {

    }
}

function check_pin() {
    try {
        if (id("pinEditText").exists()) {
            var btn = id("pinEditText").findOne(1000);
            btn.setText(pwd_bank);
            sleep(2000);
        }
    } catch (error) {

    }

}

function check_layout_history() {
    try {
        if (id("layout_history").exists()) {
            var buttom = id("layout_history").findOne(500);
            buttom.click();


            wait_name = id("tv_recycler_top_right");
            wait_sleep(wait_name, 10);

            buttom = id("tv_recycler_top_right").findOne(500);
            buttom.click();

            sleep(1000);
        }
    } catch (error) {

    }

}
//check_btnAnswer
function check_btnAnswer() {
    try {
        if (id("btnAnswer").exists()) {
            var btn = id("btnAnswer").findOne(1000);
            btn.click();
            sleep(2000);

        }
    } catch (error) {

    }

}

// function  get_amounts() {
//     try {
//            //layout_history  
//            //tv_recycler_top_right
//            //tv_balance_value
//            //history_item_recycler
//            //tv_amount
//            //Transaction ID  parent().child(1);
//             //id("btnAnswer")




//     } catch (error) {

//     }

// }

var new_blance_zalo;//最新
function get_amounts() {
    try {

        //id("txtTitle").text("Cá nhân")
        var wait_name = id("layout_history");
        wait_sleep(wait_name, 10);

        if (id("layout_history").exists()) {

        } else {
            关闭应用(appName);
            sleep(5000);
            launchApp(appName);
            wait_sleep(id("sleep"), 10);

        }


        var buttom = id("layout_history").findOne(500);
        buttom.click();


        wait_name = id("tv_recycler_top_right");
        wait_sleep(wait_name, 10);

        buttom = id("tv_recycler_top_right").findOne(500);
        buttom.click();


        //id("tvBalanceValue")


        var zalo_amounts;
        wait_name = id("tv_balance_value");
        wait_sleep(wait_name, 5);

        if (id("tv_balance_value").exists()) {
            var textstr = id("tv_balance_value").findOne(1000);
            zalo_amounts = textstr.text();


            zalo_amounts = zalo_amounts.replace(/\s*/g, '');
            zalo_amounts = zalo_amounts.replace(/\./g, '').replace(/đ/g, '').replace(/,/g, '');
            if (new_blance_zalo == "" || new_blance_zalo == null || new_blance_zalo == undefined) {
                new_blance_zalo = zalo_amounts;
                //  getBlance("TRUEMONEY#" + num_bank_zalo, new_blance_zalo);
                get_zalo_detail();
                //toast("ZALO餘額有更新");
            }
            if (new_blance_zalo != zalo_amounts) {
                new_blance_zalo = zalo_amounts;
                getBlance("TRUEMONEY#" + num_bank_zalo, new_blance_zalo);
                get_zalo_detail();

            }




        }

        return new_blance_zalo;


    } catch (err) {

        return new_blance_zalo;
    }

    //id = smallLabel  text = Cá Nhân
}

var i = 1;
function get_zalo_detail() {
    try {
        // go_zalo_home();
        //

        wait_name = id("history_item_recycler");
        wait_sleep(wait_name, 8);

        if (id("history_item_recycler").exists()) {
            //014  text("Receive money from  ชินวัฒน์ ตาม***")
            for (var index = 0; index < 6; index++) {
                var detail_click = id("history_item_recycler").findOnce(index);
                var tmkey = detail_click.child(0).text() + detail_click.child(1).text() + detail_click.child(4).text();
                smsdictnew.push(tmkey);//记录最新的20条短信
                if (!hasTimeno(tmkey) && first_get) {

                    if (detail_click.child(0).text().indexOf("Receive money") > -1) {
                        detail_click.click();
                        sleep(1000)
                        zalo_get_callback();
                        back();
                        sleep(1000);
                    }
                }

            }
            if (!first_get) {
                first_get = true;
            }
        }














    } catch (err) {
        //log(err.message);
    }
}

function wait_sleep(wait_name, sleep_time) {
    try {
        for (let index = 0; index < sleep_time; index++) {
            if (wait_name.exists()) {
                break;
            }
            else {
                wait_name.findOne(1000);
                //log(wait_name + index);
            }
        }

    } catch (error) {

    }

}

function zalo_get_callback() {
    try {
        var fuyan_content = "";
        var name_content = "";
        var date_content = "";
        //            //tv_amount
        //            //Transaction ID  parent().child(1);
        // wait_name = depth(3).indexInParent("0").className("android.view.ViewGroup");
        //wait_name = id("tv_amount");
     
        try {
            for (let index = 0; index < 15; index++) {
                if (id("tv_amount").exists() || text("Amount").exists()) {
                    break;
                }
                else {
                    sleep(1000)
                    //log(wait_name + index);
                }
            }
    
        } catch (error) {
    
        }

        var zalo_callback_amounts = "";

        if (id("tv_amount").exists()) {
            zalo_callback_amounts = id("tv_amount").findOne(1000).text();
            if(zalo_callback_amounts == ""){
                zalo_callback_amounts = id("tv_amount").findOne(1000).text();
            }
            date_content = text("Transaction date").findOne(1000).parent().child(1).text();
             
            var date_arr = date_content.split(" ");
            date_content = date_arr[2]+"-"+EndateToZh(date_arr[1])+"-"+date_arr[0]+" "+date_arr[3];
        } else if (text("Amount").exists()) {
            //return;
            date_content = text("Transaction Date").findOne(1000).parent().child(1).text();
            zalo_callback_amounts = text("Amount").findOne(1000).parent().child(1).text();
            var date_arr = date_content.replace(" ","/").split("/");

            var date = new Date();
            var year = date.getFullYear();
           year = year.toString().substring(0,2);
           date_content = year+date_arr[2]+"-"+date_arr[1]+"-"+date_arr[0]+" "+date_arr[3];
        }
        //desc("TrueMoney")
        // wait_sleep(text("Transfer method"), 5);
        // if(!(desc("TrueMoney")&& text("TrueMoney Wallet").exists())){
        //     var var_zalo_no ="";
        //     try{
        //         zalo_callback_amounts = text("Amount").findOne(1000).parent().child(1).text();
        //         var_zalo_no = text("Transaction ID").findOne(1000).parent().child(1).text();
               
        //     }catch{

        //     }
        //     spost_check_fuyan("TM_yh", "yh_amounts::" + zalo_callback_amounts + "var_zalo_no::" + var_zalo_no);
        //     return;
        // }

        zalo_callback_amounts = zalo_callback_amounts.replace(/\s*/g, '');
        zalo_callback_amounts = zalo_callback_amounts.replace(/đ/g, '').replace(/\-/g, '').replace(/\+/g, '');

        var var_zalo_no = text("Transaction ID").findOne(1000).parent().child(1).text();

        // log("TRUEMONEdddd", "var_zalo_no" + var_zalo_no + "zalo_callback_amounts" + zalo_callback_amounts);

        // var zalo_callback_fuyan = depth(3).indexInParent("0").className("android.widget.TextView").findOne(2000).parent().child(2).text();
        // var zalo_callback_name = depth(3).indexInParent("0").className("android.widget.TextView").findOne(2000).parent().child(7).child(1).text();

        // var zalo_callback_date = depth(3).indexInParent("0").className("android.widget.TextView").findOne(2000).parent().child(6).child(1).text();
        // zalo_callback_date = parse_zalo_callback_date(zalo_callback_date);

        spost_check_fuyan("TRUEMONEdddd", "zalo_callback_amounts::" + zalo_callback_amounts + "var_zalo_no::" + var_zalo_no+"date:"+date_content);

        //回调

        threads.start(function () {
            //回调
            for (var k = 0; k < 3; k++) {
                var callbackhtml = post_callback("TRUEMONEY" + "#" + num_bank, fuyan_content, name_content, zalo_callback_amounts, date_content, var_zalo_no);
                spost_check_fuyan("TRUEMONEdddd", "傳到tm方法post_callback" + callbackhtml);
                log("回調返回信息:" + callbackhtml);
                if (callbackhtml == "回調成功") {
                    break;
                }
                else if (callbackhtml == "不存在該訂單，請人工回調") {
                    break;
                }
                else if (callbackhtml == "已存在回調銀行單號") {
                    break;
                }
                else if (callbackhtml == "不存在該訂單，請人工回調1") {
                    break;
                }



            }
        });

    } catch (err) {
        log(err.message);
    }

}

function spost_check_fuyan(bankname, logmesg) {
    try {
        var url = backdeskurl + "/Service/hdorder.ashx?t=1";
        var res = http.post(url, {
            "bankname": bankname,
            "logmesg": logmesg,
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "no";
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
            if (jsonparse[i].bankname == bank_name && value_name == "stype") {

                return jsonparse[i].stype;
            }
            if (jsonparse[i].bankname == bank_name && value_name == "status") {

                return jsonparse[i].status;
            }
            if (jsonparse[i].bankname == bank_name && value_name == "isweb") {

                return jsonparse[i].isweb;
            }
            if (jsonparse[i].bankname == bank_name && value_name == "note") {

                return jsonparse[i].note;
            }
        }
        return "nojson";
    } catch (error) {
        log("nojson");
        return "nojson";

    }

}

function hasTimeno(stimeno) {
    var isflag = false;
    try {
        for (var ss = 0; ss < smsdictold.length; ss++) {
            if (smsdictold[ss] == stimeno) {
                isflag = true;
                break;
            };
        };

    } catch (error) {

    }

    return isflag;
}
function addTimenoToOld() {
    try {
        smsdictold.splice(0, smsdictold.length);//清空数组

        //上一次读过的20条
        for (var ss = 0; ss < smsdictnew.length; ss++) {
            smsdictold.push(smsdictnew[ss]);
        }
    }
    catch (error) {

    }
}

function deleteTimenoToOld(stimeno) {

    try {
        if (hasTimeno(stimeno)) {
            var sindex = -1
            for (var ss = 0; ss < smsdictold.length; ss++) {
                if (smsdictold[ss] == stimeno) {
                    sindex = ss;
                    break;
                };
            };
            if (sindex > -1) {
                smsdictold.splice(sindex, 1);
            }
        }
    }
    catch (error) {

    }
}

function go_send_otp(body, time_sno) {
    try {
        threads.start(function () {
            var msg_body = body;

            for (var k = 0; k < 3; k++) {

                var callbackhtml = send_otp(getjsonphone, msg_body, time_sno);



                if (callbackhtml == "ok") {
                    break;
                }
                sleep(1000);
            }
        });



    } catch (err) {

    }
}


function send_otp(mphone, msg, time_sno) {
    try {
        var url = backhurl + "/Service/TerAupdate.ashx?f=19";
        var res = http.post(url, {
            "mphone": mphone,
            "msg": msg,
            "bankno": time_sno
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (err) {


        return "";
    }
}

function EndateToZh(month){
    var m=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec"); 
    var m2=new Array("01","02","03","04","05","06","07","08","09","10","11","12"); 
    if(m.indexOf(month) >-1){

        return m2[m.indexOf(month)];
    }else{
        return -1;
    }
   
}

module.exports = TRUEMONEY;