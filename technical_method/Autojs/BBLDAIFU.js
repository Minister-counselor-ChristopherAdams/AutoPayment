
var BBLDAIFU = {};

var xintiaoA = java.lang.System.currentTimeMillis();
var qipaoA = java.lang.System.currentTimeMillis();

var num_bank;
var isweb;
var pwd_bank;

var firstrequestScreen = true;

var fbanknum;
var tbanknum;
var tramount;
var bankname;
var orderno;
var tname;

var go_line;

var appName = "BualuangM";
var mom = false;

var orderno_arr_ok = new Array();

// try {

//     //mom卡实名有用到，不要删
//     mom = mo;
//     runKTB(json);

// } catch (error) {

// }

BBLDAIFU.go = function (json, mo) {
    try {
        //mom卡实名有用到，不要删
        mom = mo;
        runBBL(json);

    } catch (error) {

    }

};
function runBBL(json) {
    try {
        num_bank = parsejson(json, "BANGKOK BANK", "banknum");
        isweb = parsejson(json, "BANGKOK BANK", "isweb");
        pwd_bank = parsejson(json, "BANGKOK BANK", "bankpsw");

        if (isweb == "True") {

            // if (firstrequestScreen) {
            //     try {
            //         if (!requestScreenCapture()) {
            //             toast("请求截图失败");
            //             //spost_check_fuyan("BIDVERRORFILE555", "###开始截图失败");
            //         }
            //         else {
            //             firstrequestScreen = false;
            //         }
            //     }
            //     catch (error) {

            //     }
            // }

            try {
                var qipaoB = java.lang.System.currentTimeMillis() - qipaoA;
                if (qipaoB > 1 * 30 * 1000) {
                    qipaoA = java.lang.System.currentTimeMillis();
                    toast("BBL上分偵測中");
                }
                var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
                if (xintiaoB > 1 * 60 * 1000) {
                    xintiaoA = java.lang.System.currentTimeMillis();
                    postonline("BANGKOK BANK#" + num_bank);

                }

            } catch (error) {

            }
            go_daifu();


        }

    } catch (error) {

    }

}

function go_daifu() {
    try {

        if (num_bank !== "nojson" && num_bank !== null && num_bank !== undefined && num_bank !== '') {
            var tesk = "";

            for (var gg = 0; gg < 1; gg++) {
                tesk = gettesk_daifu(num_bank);

                //toast("检查任务" + tesk);

                if (tesk == "no") {
                    id("sleep").findOne(1000);
                } else {
                    //log(tesk);

                    //記錄log到168
                    spost_check_fuyan("BBLtesk", tesk);
                    var objtesk = eval('(' + tesk + ')');
                    fbanknum = "";
                    tbanknum = "";
                    tramount = "";
                    bankname = "";
                    orderno = "";
                    tname = "";
                    for (var key in objtesk) {

                        if (key == "fbanknum") {
                            fbanknum = objtesk[key];
                        }
                        if (key == "tbanknum") {
                            tbanknum = objtesk[key];
                        }
                        if (key == "tramount") {
                            tramount = objtesk[key];
                        }
                        if (key == "bankname") {
                            bankname = objtesk[key];
                        }
                        if (key == "orderno") {
                            orderno = objtesk[key];
                        }
                        if (key == "tname") {
                            tname = objtesk[key];
                        }


                    }
                    if (orderno == "") {
                        continue;
                    }
                    // log(device.getMacAddress())

                    // spost_check_fuyan("BIDVDAIFUMSG", fbanknum + "###" + tbanknum + "###" + tramount + "###" + bankname + "###" + orderno + "###" + tname);
                    //刪除任務  轉賬結束！
                    var isdelitetesk = false;
                    var msg = "";
                    // log(msg);
                    for (var gg = 0; gg < 5; g++) {

                        //修改訂單狀態為處理中 如果返回"開始轉賬"
                        msg = gettesk_daifu_msg(orderno, "tran");
                        if (msg.indexOf("開始轉賬") != -1) {
                            break;
                        }

                    }
                    if (msg.indexOf("開始轉賬") != -1) {
                        isdelitetesk = true;
                    }
                    else {
                        log("orderno11:" + orderno);
                        log("msg:" + msg);
                    }
                    if (isdelitetesk) {

                        //寫時間儅到txt去
                        var cdt = java.lang.System.currentTimeMillis();
                        writepwd(cdt + "", "/sdcard/cdt.txt");


                        //
                        if (!hasorderno(orderno)) {
                            go_line = "已开始转账";
                            go_transfer("DFTran", orderno);
                            spost_check_fuyan("BBLlog", go_line)
                        } else {
                            toast("已傳成功，單號重複，請檢查明細");

                            //回報狀態給後臺
                            msg = gettesk_daifu_msg(orderno, "ok單號重複，請檢查明細");

                        }



                    } else {

                        toast("isdelitetesk");
                    }



                }
            }

        }

    } catch (error) {

    }
}

//代付单
function gettesk_daifu(fbanknum) {
    try {
        var url = backhurl + "/Service/wtdevent.ashx?f=5";
        var res = http.post(url, {
            "frombnum": fbanknum
        });
        var html = res.body.string();
        if (html.indexOf("fbanknum") != -1) {
            return html;
        } else {
            return "no";
        }


    } catch (error) {

    }
    return "no";

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

function writepwd(textpwd, url) {
    try {
        //文件路径
        var path = url;
        //要写入的文件内容
        var text = textpwd;
        //以写入模式打开文件
        var file = open(path, "w");
        //写入文件
        file.write(text);
        //关闭文件
        file.close();
    } catch (error) {

    }

}

function go_transfer(tran_type, order_no) {
    try {
        go_line += "go_transfer";
        postonline("BANGKOK BANK#" + num_bank);
        home_to_tran(tran_type, order_no);
    }
    catch (error) {


    }
}


function home_to_tran(tran_type, order_no) {
    try {

        go_line += "home_to_tran1";
        launchApp(appName);
        go_line += "2";

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
        //withinTransaction  KRUNG THAI BANK
        withinTransaction(tran_type, order_no);
    } catch (err) {
        spost_check_fuyan(err.message);
    }

}
function withinTransaction(tran_type, order_no) {
    try {
        //wait_sleep(id("btnCta1").text("Back to home"), 5);
        timedout();
        //进入首页且点击转账页面id("quick_link_transfer")
        wait_sleep(id("quick_link_transfer"), 15);
        if (id("quick_link_transfer").exists()) {
            var bt1 = id("quick_link_transfer").findOne(1000);
            bt1.click();
        }
        //输入登录密码pwd_bank id("number2")id("number0")
        sleep(1000);
        wait_sleep(id("number2"), 6);
        if (id("number2").exists()) {
            var btbb = id("number2").findOne(1000);
            btbb.click();
            btbb.click();
        }
        sleep(1000);
        wait_sleep(id("number0"), 6);
        if (id("number0").exists()) {
            var btbb0 = id("number0").findOne(1000);
            btbb0.click();
            btbb0.click();
        }
        sleep(1000);
        wait_sleep(id("number2"), 6);
        if (id("number2").exists()) {
            var btbb1 = id("number2").findOne(1000);
            btbb1.click();
            btbb1.click();
        }
        // sleep(1000);
        // wait_sleep(id("pinContainer"), 6);
        // vib_pin_check();

        //输入登录密码页面跳转时间长，所以等5秒
        //sleep(5000);
        //点击选择银行
        sleep(3000);
        wait_sleep(id("menuTitle").text("Other accounts"), 6);
        if (id("menuTitle").text("Other accounts").exists()) {
            var bt2 = id("menuTitle").text("Other accounts").findOne(1000);
            click(bt2.bounds().centerX(), bt2.bounds().centerY());
            click(bt2.bounds().centerX(), bt2.bounds().centerY());
        }
        sleep(1000);
        //选取银行id("toolbar_title")longClickable(false)
        wait_sleep(id("bankCode"), 4);
        if (id("bankCode").exists()) {
            bankname = GetBackJName();
            if (!text(bankname).exists()) {
                scrollForward();
                sleep(2000);
            } 

            var bt3 = id("bankCode").text(bankname).findOne(1000).parent();
            bt3.click();
            //click(bt3.bounds().centerX(), bt3.bounds().centerY());

        }else {
            gettesk_daifu_msg(orderno, "作業失敗,bankname有誤");
            //uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {
                
            }
            return;

        }
        sleep(2000);
        //点击id("toExternalAccountItem")id("accountNumber")
        wait_sleep(id("accountNumber").text("Account no."), 5);
        if (id("accountNumber").text("Account no.").exists()) {
            var bt4 = id("accountNumber").text("Account no.").findOne(1000);
            bt4.click();
            bt4.click();
        }
        sleep(3000);
        //进行卡号输入id("baseAmountInputField")
        wait_sleep(id("accountNumber"), 5);
        if (id("accountNumber").exists()) {
            var bt5 = id("accountNumber").findOne(1000);
            bt5.setText(tbanknum);
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗,accountNumber有誤");
            //uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {
                
            }
            return;

        }
        
        //id("rlCardView")id("bottom_sheet_positive_button")
        //点击金额输入id("baseAmountInputField")id("edtNotes")id("bankName")
        sleep(1000);
        wait_sleep(id("bankName"), 5);
        if (id("bankName").exists()) {
            var bthh4 = id("bankName").findOne(1000);
            click(bthh4.bounds().centerX(), bthh4.bounds().centerY());
        }
        sleep(2000);
        wait_sleep(id("bottom_sheet_positive_button"), 5);
        if (id("bottom_sheet_positive_button").exists()) {
            var bthh5 = id("bottom_sheet_positive_button").findOne(1000);
            bthh5.click();
        }
        sleep(2000);
        //点击金额输入id("txtCustomRightTextView")className("android.widget.EditText")
        wait_sleep(id("txtCustomRightTextView"), 5);
        if (id("txtCustomRightTextView").exists()) {
            var bt6 = id("txtCustomRightTextView").findOne(1000);
            click(bt6.bounds().centerX(), bt6.bounds().centerY());
        }
        sleep(2000);
        wait_sleep(id("edtCustomRightInputEditText"), 5);
        if (id("edtCustomRightInputEditText").exists()) {
            var bt7 = id("edtCustomRightInputEditText").findOne(1000);
            bt7.setText(tramount);
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗,edtCustomRightInputEditText有誤");
            //uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {
                
            }
            return;

        }
        sleep(1000);
        wait_sleep(id("bankName"), 5);
        if (id("bankName").exists()) {
            var bthh6 = id("bankName").findOne(1000);
            click(bthh6.bounds().centerX(), bthh6.bounds().centerY());
        }
       
        wait_sleep(id("bottom_sheet_positive_button"), 5);
        if (id("bottom_sheet_positive_button").exists()) {
            var bthh7 = id("bottom_sheet_positive_button").findOne(1000);
            bthh7.click();
        }

      
        //点击附言框进行输入id("edtNotes")
        wait_sleep(id("edtNotes").text("Enter note 😊"), 10);
        if (id("edtNotes").text("Enter note 😊").exists()) {
            var bt8 = id("edtNotes").text("Enter note 😊").findOne(1000);
            bt8.click();
            sleep(1000);
            bt8.click();
        }
        wait_sleep(id("edtNotes"), 10);
        if (id("edtNotes").exists()) {
            var bt9 = id("edtNotes").findOne(1000);
            bt9.setText(order_no);
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗,edtNotes有誤");
            //uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {
                
            }
            return;

        }
        
        sleep(3000);
        //id("btnNext")银行金额附言确认按钮  到下一页id("btnTransfer")
        wait_sleep(id("btnNext"), 5);
        if (id("btnNext").exists()) {
            var bt10 = id("btnNext").findOne(1000);
            bt10.click();
        }
        //卡号text("With bank")id("accountNumber")id("toolbar_title")
        
        wait_sleep(text("Please check transaction details"), 10);
        if (text("Please check transaction details").exists()) {
            var tran_account_no = text("Please check transaction details").findOne(1000).parent().child(7).text();
            tran_account_no = tran_account_no.replace(/\-/g, '').trim();
            if (tran_account_no != tbanknum) {
                var smsg = "收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?";
                spost_check_fuyan("BBLDAIFU_tbanknum", smsg);

                //uploadScreen(order_no);
                var confim = confirm("收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?");

                if (!confim) {
                    spost_check_fuyan("BBLDAIFU_tbanknum", smsg + "###NO");
                    var msg;
                    msg = gettesk_daifu_msg(order_no, "收款賬號稱不符:" + tran_account_no + "-" + tbanknum);
                    toast("收款賬號稱不符!");
                    // backpage();
                    // backpage();
                    // backpage();
                    rs = false;
                    return rs;
                }

                spost_check_fuyan("BBLDAIFU_tbanknum", smsg + "###OK");
                return;
            }

            //对比人名id("accountName")
            if (mom) {
                if (text("Please check transaction details").exists()) {
                    var ntoname = text("Please check transaction details").findOne(1000).parent().child(6).text();
                    ntoname = ntoname.replace(/MR./g, '').replace(/MISS/g, '');
                    log(ntoname);
                    if (ntoname.toUpperCase() != tname.toUpperCase()) {

                        var smsg = "收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?";
                        spost_check_fuyan("BBLDAIFU_YERRORNAME", smsg);
                        //uploadScreen(order_no);
                        var confim = confirm("收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?");

                        if (!confim) {

                            spost_check_fuyan("BBLDAIFU_YERRORNAME", smsg + "###NO");
                            var msg;
                            msg = gettesk_daifu_msg(order_no, "收款人名稱不符:" + ntoname + "-" + tname);
                            toast("收款人名稱不符!");
                            //backpage();
                            //backpage();
                            //backpage();
                            rs = false;
                            return rs;
                        }

                        spost_check_fuyan("BBLDAIFU_YERRORNAME", smsg + "###OK");
                    }

                }
            }

        }



        //确认对比转账界面id("btnTransfer")id("lblTitleSuccess")
        wait_sleep(id("btnTransfer"), 8);
        if (id("btnTransfer").exists()) {
            var bt11 = id("btnTransfer").findOne(1000);
            bt11.click();
        }
        sleep(3000);
        //转账成功标识id("btnGoToAccounts")
        sleep(3000);
        //跳出这个页面表示出款成功text("Transaction successful")
        sleep(2000);
        wait_sleep(text("Transaction successful"), 6);
        if (text("Transaction successful").exists()) {
            //uploadScreen(order_no);
            var msg;

            if (tran_type == "BBTran") {

                msg = gettesk_bbtran_msg(order_no, "ok");
            }
            if (tran_type == "XFTran") {

                msg = gettesk_xiafa_msg(order_no, "ok");
            }
            if (tran_type == "DFTran") {

                msg = gettesk_daifu_msg(order_no, "ok");
            }
            try {
                play_Mp3("/sdcard//W-PAY/workok.mp3");
            } catch (error) {
                
            }
            sleep(1000);
            //uploadScreen(orderno);

        }
        else {
            gettesk_daifu_msg(order_no, "步骤已结束，无Successful返回 请检查明细");
        }
        sleep(1000);
        //点击返回到银行卡页面id("btnGoToAccounts")id("land_menu_item1")
        wait_sleep(id("btnGoToAccounts"), 5);
        if (id("btnGoToAccounts").exists()) {
            var bt13 = id("btnGoToAccounts").findOne(1000);
            bt13.click();
        }
        sleep(3000);
        //点击返回到银行转账首页id("land_menu_item1")
        wait_sleep(id("land_menu_item1"), 5);
        if (id("land_menu_item1").exists()) {
            var bt14 = id("land_menu_item1").findOne(1000);
            bt14.click();
        }
        //id("txtTitle")text("Session timed out")   id("btnCta1")text("Back to home")
        //wait_sleep(id("btnCta1").text("Back to home"), 5);
        timedout();
      
    } catch (error) {

    }

}

function vib_pin_check() {
    try {

        var str = pwd_bank;
        //var s = str.substr(0, 1);
        if (id("pinContainer").exists()) {
            sleep(100);
            id("pinContainer").setText(str.substr(0, 1));
            sleep(100);
            id("pinContainer").setText(str.substr(1, 1));
            sleep(100);
            id("pinContainer").setText(str.substr(2, 1));
            sleep(100);
            id("pinContainer").setText(str.substr(3, 1));
            sleep(1000);
            id("pinContainer").setText(str.substr(4, 1));
            sleep(1000);
            id("pinContainer").setText(str.substr(5, 1));
            sleep(1000);
        }

    } catch (error) {

    }
}


function check_OK() {
    try {
        if (id("btnPrimary").exists()) {

            var btn = id("btnPrimary").findOne(1000);
            btn.click();

        }
    } catch (error) {

    }

}

function check_close() {
    try {
        if (id("btnDismiss").exists()) {

            var btn = id("btnDismiss").findOne(1000);
            btn.click();

        }
    } catch (error) {

    }

}



function checkApp() {
    var sflag = false;
    try {


        if (id("quick_link_transfer").exists() || id("btnPrimary").exists() || id("navigation_home").exists() || id("btnDismiss").exists()
            || id("btnCta1").exists() || text("Back to home").exists()) {
            sflag = true;
        }
    }
    catch (error) {

    }

    return sflag;
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

function wait_sleep(wait_name, sleep_time) {
    try {
        for (let index = 0; index < sleep_time; index++) {
            if (wait_name.exists()) {
                break;
            }
            else {
                wait_name.findOne(1000);
            }
        }

    } catch (error) {
        log("log2");
        log(error);
    }

}

function gettesk_daifu_msg(orderno, mesg) {
    try {

        try {
            if (mesg == "ok") {

                if (!hasorderno(orderno)) {
                    orderno_arr_ok.push(orderno);//记录ok的單號
                }


            }
        } catch (error) {

        }
        var url = backhurl + "/Service/wtdevent.ashx?f=7";
        var res = http.post(url, {
            "orderno": orderno,
            "mesg": mesg
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

function hasorderno(stimeno) {
    var isflag = false;
    try {
        for (var ss = 0; ss < orderno_arr_ok.length; ss++) {
            if (orderno_arr_ok[ss] == stimeno) {
                isflag = true;
                break;
            };
        };

    } catch (error) {

    }

    return isflag;
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

function GetBackJName() {
    var sbname = bankname;
    try {

        var dict = new Array();
        dict['BANGKOK BANK'] = 'BBL';
        dict['Kasikornbank'] = 'KBANK';
        dict['Krung Thai Bank'] = 'KTB';
        dict['TMBThanachart Bank'] = 'TTB';


        dict['The Siam Commercial Bank'] = 'SCB';
        dict['CIMB Thai Bank'] = 'CIMBT';
        dict['United Overseas Bank'] = 'UOBT';
        dict['Bank of Ayudhya'] = 'BAY';
        dict['Government Savings Bank'] = 'GSB';
        dict['Government Housing Bank'] = 'GHB';
        dict['Bank for Agriculture and Agricultural Cooperatives'] = 'BAAC';
        dict['Export-Import Bank of Thailand'] = 'EXIM';//
        dict['Islamic Bank of Thailand'] = 'ISBT';
        dict['TISCO Bank'] = 'TISCO';
        dict['KIATNAKIN BANK'] = 'KKP';
        dict['ICBC Bank'] = 'ICBC';
        dict['Thai Credit Retail Bank'] = 'TCRB';
        dict['LH Bank'] = 'LHB';
        dict['SME Development Bank'] = 'SMBC';
        dict['Standard Chartered'] = 'SCBT';
        dict['Citibank Thailand'] = 'CITI';
        dict['Bank of China (Thai)'] = 'BOC';
        dict['Australia and New Zealand Banking Group Limited'] = 'ANZ';
        //dict['Sumitomo Mitsui Trust Bank'] = 'SMBT';
        dict['Sumitomo Mitsui Trust Bank'] = 'SMBC';
        for (var key in dict) {

            var oname = key;
            var nname = dict[key];
            if (oname.toUpperCase() == bankname.toUpperCase()) {
                sbname = nname;
                break;
            }
        }

    }
    catch (error) {

    }

    return sbname;
}

function uploadScreen(tradeNo) {
    try {
        if (firstrequestScreen) {
            try {
                if (!requestScreenCapture()) {
                    toast("请求截图失败");
                    //spost_check_fuyan("BIDVERRORFILE555", "转账中###tradeNo:"+tradeNo);
                }
                else {
                    firstrequestScreen = false;
                }
            }
            catch (error) {
                //spost_check_fuyan("BIDVERRORFILE", "###tradeNo:"+tradeNo+"###截图失败"+error);
            }
        }
        var dirName = "";
        dirName = "/sdcard/uploadimg/";
        if (!files.exists(dirName)) {      //判断文件夹是否存在
            try {
                files.create(dirName);        //如果不存在、则创建一个新的文件夹
            } catch (err) {
                spost_check_fuyan("BBLERRORFILE", "###tradeNo:" + tradeNo + "###创建失败" + err);
            }
        }
        var roundnum = randomChar(10);
        var uploadimgFile = dirName + roundnum + ".png";
        //截图

        try {
            wait_sleep(id("sleep"), 2);
            captureScreen(uploadimgFile);
            wait_sleep(id("sleep"), 2);
        } catch (err) {
            try {
                spost_check_fuyan("BBLNEWERROR", "###tradeNo:" + tradeNo + "###uploadimgFile###" + uploadimgFile + "###权限:" + firstrequestScreen + "###截图失败" + err);
            } catch (err) {

            }
        }

        try {
            var content = "";
            var images64 = images.toBase64(images.read(uploadimgFile));
            for (var i = 0; i < 3; i++) {
                //上传qr
                content = post_upload_img(tradeNo, images64);
                if (content.indexOf("上傳成功") > -1) {

                    break;
                }
                else {

                }

            }
        } catch (err) {
            try {
                spost_check_fuyan("TCBNEWERROR", "###tradeNo:" + tradeNo + "###content###" + content + "###截图失败" + err);
            } catch (err) {

            }
        }



        if (files.exists(uploadimgFile)) {    //如果目标文件已经存在
            try {
                files.remove(uploadimgFile);    //则删除旧文件
                //spost_check_fuyan("BIDVERRORFILE222", "###tradeNo:"+tradeNo+"###成功刪除圖片");
            } catch (err) {
                //spost_check_fuyan("BIDVERRORFILE111", "###tradeNo:"+tradeNo+"###截图失败"+err);
            }
        }


    } catch (error) {
        //spost_check_fuyan("BIDVERRORFILE111", "###tradeNo:"+tradeNo+"###截图失败"+error);
    }
}

function timedout(){
    if (id("btnCta1").text("Back to home").exists()) {
        var bt20 = id("btnCta1").text("Back to home").findOne(1000);
        bt20.click();
    }
}
function play_Mp3(mp3_url) {
    try {
        //播放音乐 "/sdcard//W-PAY/workerror.mp3" play_Mp3("/sdcard//W-PAY/workerror.mp3");
        media.playMusic(mp3_url);
        //让音乐播放完
        sleep(media.getMusicDuration());
    } catch (error) {

    }

}

module.exports = BBLDAIFU;




