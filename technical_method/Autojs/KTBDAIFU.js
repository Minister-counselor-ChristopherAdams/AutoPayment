function randomChar(l) {
    var rn = "";
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < l; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    rn = String(timestamp) + tmp;
    return rn;
}

var KTBDAIFU = {};

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

var appName = "NEXT";
var mom = false;

var orderno_arr_ok = new Array();

// try {

//     //mom卡实名有用到，不要删
//     mom = mo;
//     runKTB(json);

// } catch (error) {

// }

KTBDAIFU.go = function (json,mo) {
    try {
        //mom卡实名有用到，不要删
        mom = mo;
        runKTB(json);

    } catch (error) {

    }

};
function runKTB(json) {
    try {
        num_bank = parsejson(json, "KRUNG THAI BANK", "banknum");
        isweb = parsejson(json, "KRUNG THAI BANK", "isweb");
        pwd_bank = parsejson(json, "KRUNG THAI BANK", "bankpsw");

        if (isweb == "True") {

            if (firstrequestScreen) {
                try {
                    if (!requestScreenCapture()) {
                        toast("请求截图失败");
                        //spost_check_fuyan("BIDVERRORFILE555", "###开始截图失败");
                    }
                    else {
                        firstrequestScreen = false;
                    }
                }
                catch (error) {

                }
            }

            try {
                var qipaoB = java.lang.System.currentTimeMillis() - qipaoA;
                if (qipaoB > 1 * 30 * 1000) {
                    qipaoA = java.lang.System.currentTimeMillis();
                    toast("KTB上分偵測中");
                }
                var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
                if (xintiaoB > 1 * 60 * 1000) {
                    xintiaoA = java.lang.System.currentTimeMillis();
                    postonline("KRUNG THAI BANK#" + num_bank);

                }

            } catch (error) {

            }
            check_close();
            check_OK();
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
                    spost_check_fuyan("kTBtesk", tesk);
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
                    try{
                        spost_check_fuyan("KTBrun", "START####orderno:" + orderno + "###"+java.lang.System.currentTimeMillis());
                    }catch(err){

                    }
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
                        try{
                            spost_check_fuyan("KTBrun", "STARTING####orderno:" + orderno + "###"+java.lang.System.currentTimeMillis());
                        }catch(err){
    
                        }
                        //寫時間儅到txt去
                        var cdt = java.lang.System.currentTimeMillis();
                        writepwd(cdt + "", "/sdcard/cdt.txt");


                        //
                        if (!hasorderno(orderno)) {
                            go_line = "已开始转账";                 
                            go_transfer("DFTran", orderno);
                            spost_check_fuyan("KTBlog", go_line)
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
        postonline("KRUNG THAI BANK#" + num_bank);
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
        check_OK();
        for (var ss = 0; ss < 40; ss++) {
            if (checkApp()) {
                break;
            }
            else {
                sleep(500);
            }
        }
        try{
            spost_check_fuyan("KTBrun", "STARTING2####orderno:" + orderno + "###"+java.lang.System.currentTimeMillis());
        }catch(err){

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
        check_close();
        check_pin();
        check_OK();
        check_OK();
        check_OK();
        //withinTransaction  KRUNG THAI BANK
        try{
            spost_check_fuyan("KTBrun", "STARTING3####orderno:" + orderno + "###"+java.lang.System.currentTimeMillis());
        }catch(err){

        }
        withinTransaction(tran_type, order_no);
    } catch (err) {
        spost_check_fuyan(err.message);
    }

}
function withinTransaction(tran_type, order_no) {
    var rs = false;
    check_OK();
    check_OK();
    try {

        go_line += "withinTransaction";
        check_pin();
        
        wait_sleep(desc("Transfer"), 5);
        go_line += "1";
        if (desc("Transfer").exists()) {
            var bt = desc("Transfer").findOne(1000);
            log(bt);
            bt.click();
            sleep(1000);
            //点击Transfer,如果出现timeout弹窗就点掉，然后会返回Transfer页面。继续点击Transfer才会下一步
            wait_sleep(id("btnPrimary"), 3);
            if(id("btnPrimary").exists()){
                check_OK();
                wait_sleep(desc("Transfer"), 5);
                var bt2 = desc("Transfer").findOne(1000);
                bt2.click();
                sleep(1000);
            }
            //click(bt.bounds().centerX(), bt.bounds().centerY()); if (id("btnPrimary").exists())
        }
        else {
            gettesk_daifu_msg(orderno, "false,toTransfer");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }
        check_OK();
        wait_sleep(text("Enter PIN to proceed"), 5);
        if (text("Enter PIN to proceed").exists()) {
            check_pin();
        }

        wait_sleep(desc("Other"), 5);
        go_line += "2";
        if (desc("Other").exists()) {
            var bt = desc("Other").findOne(1000);
           
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,Other");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }


        wait_sleep(desc("Other"), 5);
        go_line += "3";
        if (desc("Other").exists()) {
            var bt = desc("Other").findOne(1000);
           
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,Other");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }


        // wait_sleep(id("divBankSelect"), 5);
        // go_line += "4";
        // if (id("divBankSelect").exists()) {
        //     var bt = id("divBankSelect").findOne(1000);
       
        //     bt.click();
        //     //click(bt.bounds().centerX(), bt.bounds().centerY());
        // }
        // else {
        //     gettesk_daifu_msg(orderno, "false,divBankSelect");
        //     uploadScreen(orderno);
        //     try {
        //         play_Mp3("/sdcard//W-PAY/workerror.mp3");
        //     } catch (error) {

        //     }
        //     back();
        //     return;
        // }


        wait_sleep(id("divBankSelectInput"), 5);
        go_line += "5";
        if (id("divBankSelectInput").exists()) {
            var bt = id("divBankSelectInput").findOne(1000);
       
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,divBankSelectInput");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }


        wait_sleep(id("clItemContainer"), 5);
        go_line += "6";
        if (id("clItemContainer").exists()) {
            bankname = GetBackJName();
            if (!text(bankname).exists()) {
                scrollForward();
                sleep(2000);
            } 

            var bt = text(bankname).findOne(1000).parent();
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,clItemContainer");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }

        wait_sleep(id("etNote"), 5);
        go_line += "7";
        if (id("etNote").exists()) {
            var bt = id("etNote").findOne(1000);
       
            bt.setText(orderno);
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,etNote");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }

        wait_sleep(id("etAmounts"), 5);
        go_line += "8";
        if (id("etAmounts").exists()) {
            var bt = id("etAmounts").findOne(1000);
       
            bt.setText(tramount);
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,etAmounts");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }

        wait_sleep(id("etAccNumber"), 5);
        go_line += "9";
        if (id("etAccNumber").exists()) {
            var bt = id("etAccNumber").findOne(1000);
       
            bt.setText(tbanknum);
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,etAccNumber");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }
        sleep(1000);
        if(id("etAccNumber").exists()){
            go_line += "-10C";
            //对比卡号text = Confirm Details
            wait_sleep(id("etAccNumber"), 5);
            if (id("etAccNumber").exists()) {
                go_line += "-88";
                var tran_account_no = id("etAccNumber").findOne(1000).text();    
                tran_account_no = tran_account_no.replace(/\-/g, '').trim();
            }
            else{
                go_line += "-99";
            }
            go_line += "-tran_account_no"+tran_account_no;
            if (tran_account_no != tbanknum) {
                go_line += "-10D";
                var smsg = "收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?";
                spost_check_fuyan("KTBDAIFU_tbanknum", smsg);
    
                uploadScreen(order_no);
                var confim = confirm("收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?");
    
                if (!confim) {
                    spost_check_fuyan("KTBDAIFU_tbanknum", smsg + "###NO");
                    var msg;
                    msg = gettesk_daifu_msg(order_no, "收款賬號稱不符:" + tran_account_no + "-" + tbanknum);
                    toast("收款賬號稱不符!");
                    // backpage();
                    // backpage();
                    // backpage();
                    rs = false;
                    return rs;
                }
    
                spost_check_fuyan("KTBDAIFU_tbanknum", smsg + "###OK");
                return;
            }
        }
            
        wait_sleep(id("btnOtherNext"), 5);
        go_line += "-10";
        if (id("btnOtherNext").exists()) {
            go_line += "-10A";
            var bt = id("btnOtherNext").findOne(1000);
       
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,btnOtherNext");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }
        sleep(1000);
        go_line += "-10B";
        wait_sleep(id("btnConfirm"),5)
        if(id("btnConfirm").exists()){
            go_line += "-10E";
            //对比人名
            if (mom) {
                go_line += "-10F";
                if (text("Confirm Details").exists()) {
                    go_line += "-10G";
                    var ntoname = text("Confirm Details").findOne(1000).parent().child(6).text();
                    ntoname = ntoname.replace(/MR./g, '').replace(/MISS/g, '');
                    go_line += "ntoname"+ntoname;
                    log(ntoname);
                    if (ntoname.toUpperCase() != tname.toUpperCase()) {
    
                        var smsg = "收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?";
                        spost_check_fuyan("KTBDAIFU_YERRORNAME", smsg);
                        uploadScreen(order_no);
                        var confim = confirm("收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?");
    
                        if (!confim) {
    
                            spost_check_fuyan("KTBDAIFU_YERRORNAME", smsg + "###NO");
                            var msg;
                            msg = gettesk_daifu_msg(order_no, "收款人名稱不符:" + ntoname + "-" + tname);
                            toast("收款人名稱不符!");
                            //backpage();
                            //backpage();
                            //backpage();
                            rs = false;
                            return rs;
                        }
    
                        spost_check_fuyan("KTBDAIFU_YERRORNAME", smsg + "###OK");
                    }
    
                }
            }
    
        }
        
        wait_sleep(id("btnConfirm"), 10);
        go_line += "-11";
        if (id("btnConfirm").exists()) {
            go_line += "-12";
            var bt = id("btnConfirm").findOne(1000);
       
            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "false,btnConfirm");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            back();
            return;
        }
        go_line = "-13";
        wait_sleep(id("tvTransferStatus").text("Transfer Completed"), 10);
        
        if (id("tvTransferStatus").text("Transfer Completed").exists()) {

            var msg;

            if (tran_type == "BBTran") {

                msg = gettesk_bbtran_msg(orderno, "ok");
            }
            if (tran_type == "XFTran") {

                msg = gettesk_xiafa_msg(orderno, "ok");
            }
            if (tran_type == "DFTran") {

                msg = gettesk_daifu_msg(orderno, "ok");
            }
            try {
                play_Mp3("/sdcard//W-PAY/workok.mp3");
            } catch (error) {
                
            }
            sleep(1000);
            uploadScreen(orderno);

            //var succ_meg = "ok";
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，tvTransferStatus有誤");
            uploadScreen(orderno);
            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {
                
            }


        }

        //点击返回到首页   id("toolbar_left_imageview")id("textChat")id("btn_chat")id = btnDonetext = Done

        wait_sleep(id("btnDone").text("Done"), 10);
        go_line = "17";
        if (id("btnDone").text("Done").exists()) {
            var bt12 = id("btnDone").text("Done").findOne(1000);
            bt12.click();
            go_line = "18";
        } try {
            spost_check_fuyan("TRUEMONEY", "###" + order_no + "###" + go_line);
        } catch (err) {

        }

    } catch (err) {
        spost_check_fuyan("KTBlog", "err###" + order_no + "err###" + err.message);
    }

}

function check_pin() {
    try {
        if (text("Enter PIN to proceed").exists()) {
            sleep(100);
            id("btn" + pwd_bank.substr(0, 1)).findOne(1000).click();
            sleep(100);
            id("btn" + pwd_bank.substr(1, 1)).findOne(1000).click();
            sleep(100);
            id("btn" + pwd_bank.substr(2, 1)).findOne(1000).click();
            sleep(100);
            id("btn" + pwd_bank.substr(3, 1)).findOne(1000).click();
            sleep(100);
            id("btn" + pwd_bank.substr(4, 1)).findOne(1000).click();
            sleep(100);
            id("btn" + pwd_bank.substr(5, 1)).findOne(1000).click();
            id("sleep").findOne(1000);
        }
    } catch (error) {

    }

}


function check_OK() {
    try {
        if (id("btnPrimary").exists()) {
           
           var btn=  id("btnPrimary").findOne(1000);
           btn.click();
           
        }
    } catch (error) {

    }

}

function check_close() {
    try {
        if (id("btnDismiss").exists()) {
           
           var btn=  id("btnDismiss").findOne(1000);
           btn.click();
           
        }
    } catch (error) {

    }

}



function checkApp() {
    var sflag = false;
    try {


        if (id("btn0").exists() || id("btnPrimary").exists() || id("navigation_home").exists() || id("btnDismiss").exists()) {
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

function post_upload_img(tradeNo, img64) {
    try {
        var url = backhurl + "/Service/UploadImg.ashx?t=0";
        var res = http.post(url, {
            "tradeNo": tradeNo,
            "simg": img64
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    } catch (error) {

    }


}

function GetBackJName() {
    var sbname = bankname;
    try {

        var dict = new Array();
        dict['BANGKOK BANK'] = 'BBL';
        dict['Kasikornbank'] = 'KBANK';
        dict['Krung Thai Bank'] = 'KTB';
        dict['TMBThanachart Bank'] = 'ttb';


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
        dict['ICBC Bank'] = 'ICBCT';
        dict['Thai Credit Retail Bank'] = 'TCR';
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

function play_Mp3(mp3_url) {
    try {
        //播放音乐 "/sdcard//W-PAY/workerror.mp3" play_Mp3("/sdcard//W-PAY/workerror.mp3");
        media.playMusic(mp3_url);
        //让音乐播放完
        sleep(media.getMusicDuration());
    } catch (error) {

    }

}

function uploadScreen(tradeNo) {
    try {
        var testtp = "0";
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
                spost_check_fuyan("BIDVERRORFILE", "###tradeNo:" + tradeNo + "###创建失败" + err);
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
                spost_check_fuyan("TCBNEWERROR", "###tradeNo:" + tradeNo + "###uploadimgFile###" + uploadimgFile + "###权限:" + firstrequestScreen + "###截图失败" + err);
            } catch (err) {

            }
        }

        try {
            var content = "";
            testtp += "1";
            var images64 = images.toBase64(images.read(uploadimgFile));
                testtp += "2";
            for (var i = 0; i < 3; i++) {
                //上传qr
                content = post_upload_img(tradeNo, images64);
                if (content.indexOf("上傳成功") > -1) {
                    testtp += "3";
                    break;
                }
                else {
                    testtp += "4";
                }

            }
        } catch (err) {
            try {
                spost_check_fuyan("KTBPIC", "###tradeNo:" + tradeNo + "###testtp###" + testtp);
            } catch (err) {

            }
            try {
                spost_check_fuyan("TCBNEWERROR", "###tradeNo:" + tradeNo + "###content###" + content + "###截图失败" + err);
            } catch (err) {

            }
        }
        try {
            spost_check_fuyan("KTBPIC", "###tradeNo:" + tradeNo + "###testtp###" + testtp);
        } catch (err) {

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

module.exports = KTBDAIFU;




