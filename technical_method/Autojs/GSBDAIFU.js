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

var GSBDAIFU = {};

//全局 
var firstrequestScreen = true;
var appName = "MyMo";

var orderno_arr_ok = new Array();


// var pwd = "";
// var yhang = "0928287140";
// var je = "11";
// var fuyan = "ccc";

//var json = " [{\"bankname\":\"GOVERNMENT SAVINGS BANK\",\"banknum\":\"020402339327\",\"andriodkey\":\"D861GKS234:vww:vit:0Y7:vxx:wky3\",\"bankpsw\":\"112233\",\"paypsw\":\"112233\",\"isweb\":\"True\",\"Ter_isrevlog\":\"0\",\"note\":\"手銀\",\"stype\":\"通知\",\"status\":\"啟用\"}]";
// var backhurl = "https://158.win-th.vip";//後臺
// var backdeskurl = "https://api.win-th.vip";//前臺
// var backapkname = "TH-Pay";//apk 应用名
//id("layout_mywallet")
//id("layout_profile")


var fbanknum;
var tbanknum;
var tramount;
var bankname;
var orderno;
var tname;
var note;

var pwd_bank_vcb;
var num_bank_vcb;
var isweb;

var xintiaoA = java.lang.System.currentTimeMillis();
var qipaoA = java.lang.System.currentTimeMillis();
var qie_huan_time = java.lang.System.currentTimeMillis();

var mom = false;
//go_SCB(json);
GSBDAIFU.go = function (json, mo) {
    try {
        //mom卡实名有用到，不要删
        mom = mo;
        go_SCB(json);

    } catch (error) {

    }

};


// threads.start(function () {

//     while (true) {
//         try {
//             go_true(json);
//             sleep(5000);


//         } catch (error) {

//         }
//         sleep(5000);

//     }




// })



function go_SCB(json) {
    try {

        //取值
        pwd_bank_vcb = parsejson(json, "GOVERNMENT SAVINGS BANK", "bankpsw");
        num_bank_vcb = parsejson(json, "GOVERNMENT SAVINGS BANK", "banknum");
        isweb = parsejson(json, "GOVERNMENT SAVINGS BANK", "isweb");

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
                    toast("GSB代付偵測中");
                }
                var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
                if (xintiaoB > 1 * 60 * 1000) {
                    xintiaoA = java.lang.System.currentTimeMillis();
                    postonline("GOVERNMENT SAVINGS BANK#" + num_bank_vcb);

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

        if (num_bank_vcb !== "nojson" && num_bank_vcb !== null && num_bank_vcb !== undefined && num_bank_vcb !== '') {
            var tesk = "";

            for (var gg = 0; gg < 1; gg++) {
                tesk = gettesk_daifu(num_bank_vcb);
                //     tesk="{\"fbanknum\":\"020402339327\",\"tbanknum\":\"6440355597\",\"tramount\":\"1\",\"bankname\":\"Krung Thai Bank\",\"orderno\":\"zzx123\",\"tname\":\"วิราวรรณ จันงิ้ว\"}";
                //toast("检查任务" + tesk);

                if (tesk == "no") {
                    id("sleep").findOne(1000);
                } else {
                    //log(tesk);

                    //記錄log到168
                    spost_check_fuyan("GSBtesk", tesk);
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
                    //  isdelitetesk = true;
                    if (isdelitetesk) {

                        //寫時間儅到txt去
                        var cdt = java.lang.System.currentTimeMillis();
                        writepwd(cdt + "", "/sdcard/cdt.txt");


                        //
                        if (!hasorderno(orderno)) {
                            spost_check_fuyan("GSBdaifu", "已开始转账:" + orderno)
                            go_transfer("DFTran", orderno);
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


function go_transfer(tran_type, order_no) {
    try {

        postonline("GOVERNMENT SAVINGS BANK#" + num_bank_vcb);
        home_to_tran(tran_type, order_no);
    }
    catch (error) {


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
function login() {
    try {
        if (id("helloLabel").exists() || id("pinTextView").exists()) {
            var edt_pwd = id("pinTextView").findOne(1000);

            edt_pwd.setText(pwd_bank_vcb);
            sleep(1000);
            wait_sleep(id("shortcutMenuRCV"), 15);
            //  var tv_Login1 = id("btFingerPrint").findOne(1000).bounds();
            //  click(tv_Login1.centerX(), tv_Login1.centerY());
            //   sleep(1000);

        }
    }
    catch (error) {

    }
}
//home_to_tran
function home_to_tran(tran_type, order_no) {
    try {
        spost_check_fuyan("GSBdaifu", "开始呼叫TRUE银行")
        launchApp(appName);
        spost_check_fuyan("GSBdaifu", "结束呼叫TRUE银行")
        sleep(1000);
        login_out();
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
        login_out();
        login();

        //withinTransaction               
        withinTransaction(tran_type, order_no);
    } catch (err) {
        spost_check_fuyan("home_to_tran_ERR##", err.message);
    }

}

function set_pin() {
    try {
        //wait_sleep(id("textview_pin_title_activity"), 10)
        var str = pwd_bank_vcb;//密码           
        //var s = str.substr(0, 1);
        if (id("textview_pin_title_activity").exists()) {
            sleep(1000);
            id("button_" + str.substr(0, 1)).findOne(500).click();
            sleep(100);
            id("button_" + str.substr(1, 1)).findOne(500).click();
            sleep(100);
            id("button_" + str.substr(2, 1)).findOne(500).click();
            sleep(100);
            id("button_" + str.substr(3, 1)).findOne(500).click();
            sleep(100);
            id("button_" + str.substr(4, 1)).findOne(500).click();
            sleep(100);
            id("button_" + str.substr(5, 1)).findOne(500).click();
            id("sleep").findOne(1000);
        }
        //id("sleep").findOne(1000);

    } catch (error) {

    }

}

function login_out() {
    try {
        if (id("md_button_positive").exists()) {
            var bt = id("md_button_positive").findOne(1000);
            //  log(bt);
            bt.click();
            sleep(2000);
        }

    } catch (error) {

    }

}


function withinTransaction(tran_type, order_no) {
    var rs = false;
    try {

        var goline = "0";
        wait_sleep(id("shortcutMenuRCV"), 15);

        if (id("shortcutMenuRCV").exists() || text("Transfer").exists()) {
            goline = "-1";
            //  var bt = text("Transfer").findOne(1000);
            //  bt.click();
        }
        else {
            spost_check_fuyan("GSBDAIFUMobileError", "###" + order_no + "作業失敗，shortcutMenuRCV有誤");
            gettesk_daifu_msg(orderno, "作業失敗，shortcutMenuRCV有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;
        }
        wait_sleep(text("Transfer"), 10);
        if (text("Transfer").exists()) {
            goline = "-2";

            var bt = text("Transfer").findOne(1000).bounds();
            click(bt.centerX(), bt.centerY());

            wait_sleep(id("titleActionBar"), 15);
        }
        else {
            spost_check_fuyan("GSBDAIFUMobileError", "###" + order_no + "作業失敗，Transfer有誤");
            gettesk_daifu_msg(orderno, "作業失敗，Transfer有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;
        }
        if (text("Transfer").exists()) {
            goline = "-2";

            var bt = text("Transfer").findOne(1000).bounds();
            click(bt.centerX(), bt.centerY());

            wait_sleep(id("titleActionBar"), 15);
        }
        //第一次需要輸入密碼，後面如果沒自動登出就不用輸
        spost_check_fuyan("GSBDAIFUMobile", "###" + order_no + "開始選擇銀行");
        if (id("titleActionBar").exists()) {
            goline = "-3";
            var bt = id("recipientMenuBT").className("android.widget.Button").text("Bank Account​").findOne(1000);
            bt.click();


        }
        else {
            gettesk_daifu_msg(orderno, "titleActionBar");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;
        }
        //選擇銀行
        wait_sleep(id("bankListRCV"), 10);
        spost_check_fuyan("GSBDAIFUMobile", "###" + order_no + "選擇銀行");

        var is_scroll = true;
        var time_scroll = 0;

        bankname = GetBackJName();
        sleep(3000);
        if (id("bankListRCV").exists()) {
            var cun = 0;
            try {
                for (let index = 0; index < 3; index++) {
                    if (is_scroll) {

                        time_scroll++;
                        id("bankListRCV").findOne(5000).children().forEach(child => {

                            cun++;
                            var title = child.findOne(id("itemTextView")).text();
                            sleep(1000);

                            
                            if (bankname.toUpperCase() == "KASIKORNBANK") {
                                bankname = "KASIKORN BANK";
                            }
                            if (bankname.toUpperCase() == "THE SIAM COMMERCIAL BANK") {
                                bankname = "SIAM COMMERCIAL BANK";
                            }

                            if (title.toUpperCase() == bankname.toUpperCase()) {
                                is_scroll = false;
                                // try {
                                //     if (!text(title).exists()) {
                                //         scrollForward();
                                //         sleep(2000);
                                //     }
                                //     if (!text(title).exists()) {
                                //         scrollForward();
                                //         sleep(2000);
                                //     }
                                // } catch (error) {

                                // }
                                //取賬號
                                //  click(child.bounds().centerX(), child.bounds().centerY());
                                child.click();
                                sleep(1000);
                                wait_sleep(id("accountET"), 10);

                            }
                        })
                        if (is_scroll) {

                            scrollForward();
                            sleep(3000);

                        }
                        wait_sleep(id("accountET"), 1);

                    }

                }


            }
            catch (err) {
                log(err.message);
            }
        }
        else {
            spost_check_fuyan("GSBDAIFUMobile", "###" + order_no + "作業失敗，選擇銀行有誤");
            gettesk_daifu_msg(orderno, "作業失敗，選擇銀行有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;

        }
        sleep(1000);
        //  输入賬號
        wait_sleep(id("accountET"), 10);
        for (var ss = 0; ss < 5; ss++) {
            if (!id("accountET").exists()) {
                if (id("bankListRCV").exists()) {
                    goline = "-31";
                    // spost_check_fuyan("GSBDAIFUMobile", "###" + order_no  + "進行選擇銀行" );
                    var cun = 0;
                    try {
                        id("bankListRCV").findOne(5000).children().forEach(child => {

                            cun++;
                            var title = child.findOne(id("itemTextView")).text();
                            sleep(1000);
                            title = title.replace("NaN", "")
                            bankname = GetBackJName();
                            if (bankname.toUpperCase() == "KASIKORNBANK") {
                                bankname = "KASIKORN BANK";
                            }
                            if (bankname.toUpperCase() == "THE SIAM COMMERCIAL BANK") {
                                bankname = "SIAM COMMERCIAL BANK";
                            }
                            //  spost_check_fuyan("GSBDAIFUMobile", "###" + order_no  + "###title:"+title.toUpperCase() +"###bankname:"+bankname.toUpperCase());
                            if (title.toUpperCase() == bankname.toUpperCase()) {

                                // if(cun > 7)
                                // {
                                //     swipe(device.width / 2, device.height / 5 * 3, device.width / 2, device.height / 5 * 2, 500);
                                // }
                                try {
                                    if (!text(title).exists()) {
                                        scrollForward();
                                        sleep(2000);
                                    }
                                    if (!text(title).exists()) {
                                        scrollForward();
                                        sleep(2000);
                                    }
                                } catch (error) {

                                }

                                //取賬號
                                //   click(child.bounds().centerX(), child.bounds().centerY()); sleep(10000); scrollForward();


                                child.click();
                                sleep(1000);

                                wait_sleep(id("accountET"), 10);
                                throw Error();
                            }
                        })
                    }
                    catch (error) {

                    }
                }
            }
            if (id("accountET").exists()) {
                break;
            }
        }
        if (id("accountET").exists()) {
            goline = "-4";
            var bt5 = id("accountET").findOne(1000);
            bt5.setText(tbanknum);
            sleep(1000);
            goline = "9";
            
        }
        else {
            gettesk_daifu_msg(orderno, "accountET");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }
        wait_sleep(text("Next"), 5);
        if (!text("Next").exists()) {
            back();
            sleep(1000);
        } 
        
        //   var bnext1 = id("layoutNextBtn").findOne(1000);
        wait_sleep(text("Next"), 5);
        if(text("Next").exists()){
            var bnext1 = text("Next").findOne(1000);
            click(bnext1.bounds().centerX(), bnext1.bounds().centerY());
            //bnext1.click();
        }        
        //输入金額
        wait_sleep(id("amountEditText"), 10);
        goline = "-5";
        if (id("amountEditText").exists()) {
            //   var bt6 = id("amountEditText").findOne(1000);
            //   bt6.setText(tramount);

            var txt_amount = id("amountEditText").findOne(1000);
            txt_amount.focus();

            var sm = "" + tramount;

            try {
                setClip(sm);
                sleep(1000);
                txt_amount = id("amountEditText").findOne(1000);
                txt_amount.paste();
                sleep(2000);
                //back();
            }
            catch (error) {

            }

            goline = "-6";
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，edit_amount有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }
        sleep(1000);
        // back();
        //輸入附言
        wait_sleep(id("noteTextShow"), 10);
        if (id("noteTextShow").exists()) {
            goline = "-7";

            var bnShow = id("noteTextShow").findOne(1000);
            click(bnShow.bounds().centerX(), bnShow.bounds().centerY());
            sleep(1500);
            var bt9 = id("noteEditText").findOne(1000);
            bt9.setText(orderno);
            //sleep(1000);
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，輸入附言有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }        

        sleep(1500);
        if (!text("Slide to Send").exists()) {
            back();
        } 
        //
        
  
        wait_sleep(text("Slide to Send"), 10);        
        if (text("Slide to Send").exists()) {
            goline = "13";

            sleep(500);


            var seekbar = id("seekbar").findOne(1000).bounds();


            //  var wh = seekbar.width();
            for (var kk = 0; kk < 10; kk++) {
                var x = seekbar.left + kk * 100;
                var y = seekbar.centerY();
                var x2 = seekbar.left + (kk + 1) * 100;
                press(x, y, 100);
                swipe(x, y, x2, y, 500);

            }


            // bt8.click();
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，review有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;
        }

        //对比卡号

        wait_sleep(text("Confirm Transaction"), 10);
        if (text("Confirm Transaction").exists()) {
            var tran_account_no = id("textSubtitle").findOne(1000).text();
            if (tran_account_no != tbanknum) {
                var smsg = "收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?";
                spost_check_fuyan("GSBDAIFUMobile_tbanknum", smsg);

                uploadScreen(order_no);
                var confim = confirm("收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?");

                if (!confim) {
                    spost_check_fuyan("GSBDAIFUMobile_tbanknum", smsg + "###NO");
                    var msg;
                    msg = gettesk_daifu_msg(order_no, "收款賬號稱不符:" + tran_account_no + "-" + tbanknum);
                    toast("收款賬號稱不符!");
                    // backpage();
                    // backpage();
                    // backpage();
                    rs = false;
                    return rs;
                }

                spost_check_fuyan("GSBDAIFUMobile_tbanknum", smsg + "###OK");
                return;
            }
            //对比人名
            if (mom) {
                var ntoname = id("nameTV").className("android.widget.TextView").findOne(1000).text();
                ntoname = ntoname.substring(ntoname.indexOf(']') + 1, ntoname.length).trim();
                ntoname = ntoname.replace(/\MR./g, '');
                ntoname = ntoname.replace(/\MS./g, '');
                if (ntoname.toUpperCase() != tname.toUpperCase()) {

                    var smsg = "收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?";
                    spost_check_fuyan("GSBDAIFUMobile_YERRORNAME", smsg);
                    uploadScreen(order_no);
                    var confim = confirm("收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?");

                    if (!confim) {

                        spost_check_fuyan("GSBDAIFUMobile_YERRORNAME", smsg + "###NO");
                        var msg;
                        msg = gettesk_daifu_msg(order_no, "收款人名稱不符:" + ntoname + "-" + tname);
                        toast("收款人名稱不符!");

                        rs = false;
                        return rs;
                    }

                    spost_check_fuyan("GSBDAIFUMobile_YERRORNAME", smsg + "###OK");
                }
            }
            scrollForward();
             sleep(2000);
            wait_sleep(id("doneButton"), 10);
            if (id("doneButton").exists()) {
                goline = "15";
                var bt10 = id("doneButton").findOne(1000);
                bt10.click();
            }
            else {
                gettesk_daifu_msg(orderno, "作業失敗，Confirm有誤");
                uploadScreen(orderno);

                try {
                    play_Mp3("/sdcard//W-PAY/workerror.mp3");
                } catch (error) {

                }

                return;

            }

        }
        else
        {
            gettesk_daifu_msg(orderno, "作業失敗，Confirm33有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;
        }
        try{
            //Confirm
           
            let waittime = 5;
            while(waittime-- > 0){
                if(text("Confirm").exists()){
                    let Confirm = id("Confirm").findOne(1000);
                     click(Confirm.bounds().centerX(), Confirm.bounds().centerY());
                 }
                 if (text("Transaction Successful").exists()) {
                    break;
                 }
            }
        }catch(err){

        }
        //转账成功标识   id("toolbar_title")//点击确认跳转到账单通知的页面   id("btn_chat")
        wait_sleep(text("Transaction Successful"), 15);
        goline = "16";
        if (text("Transaction Successful").exists()) {

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
            gettesk_daifu_msg(orderno, "作業失敗，Successful transfer有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }


        }

        //点击返回到首页   id("toolbar_left_imageview")id("textChat")id("btn_chat")
        wait_sleep(text("Transaction Successful"), 6);
        if (text("Transaction Successful").exists()) {
            wait_sleep(id("doneButton"), 6);
            var bt12 = id("doneButton").findOne(1000);
            bt12.click();
            wait_sleep(text("Transfer"), 6);
        } try {
            spost_check_fuyan("GSBDAIFUMobile", "###" + order_no + "###" + goline);
        } catch (err) {

        }
    } catch (err) {
        gettesk_daifu_msg(orderno, "作業失敗，err有誤");
        uploadScreen(orderno);
        spost_check_fuyan("GSBDAIFUMobile", "###" + order_no + "###" + goline + "###err:" + err.message);
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

        return "nojson";

    }

}

function postonline(frombnum) {
    try {
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

function checkApp() {
    var sflag = false;
    try {
        if (id("helloLabel").exists() || id("pinTextView").exists() || text("Transfer").exists()) {
            sflag = true;
        }
    }
    catch (error) {

    }

    return sflag;
}

//檢查是否需要輸入密碼
function checkPin() {
    var sflag = false;
    try {
        if (text("Enter PIN").exists() || id("to_text_view").exists()) {
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
        dict['BANGKOK BANK'] = 'Bangkok Bank';
        dict['Kasikornbank'] = 'Kasikorn Bank';
        dict['Krung Thai Bank'] = 'Krung Thai Bank';
        dict['TMBThanachart Bank'] = 'TMBThanachart Bank';//

        //帶有""//"的都是沒找到的，不確定的
        dict['The Siam Commercial Bank'] = 'Siam Commercial Bank';//
        dict['CIMB Thai Bank'] = 'CIMB Thai Bank';
        dict['United Overseas Bank'] = 'United Overseas Bank (Thai)';
        dict['Bank of Ayudhya'] = 'Bank of Ayudhya';
        dict['Government Savings Bank'] = 'Government Savings Bank';
        dict['Government Housing Bank'] = 'Government Housing Bank(GHB)';
        dict['Bank for Agriculture and Agricultural Cooperatives'] = 'BAAC';//
        dict['Export-Import Bank of Thailand'] = 'EXIM';//
        dict['Islamic Bank of Thailand'] = 'Islamic Bank of Thailand';
        dict['TISCO Bank'] = 'Tisco Bank';
        dict['KIATNAKIN BANK'] = 'Kiatnakin Phatra Bank';//
        dict['ICBC Bank'] = 'ICBC';//
        dict['Thai Credit Retail Bank'] = 'Thai Credit';//
        dict['LH Bank'] = 'LH Bank';//
        dict['SME Development Bank'] = 'SMBC';//
        dict['Standard Chartered'] = 'Standard Chartered Bank (Thai)';
        dict['Citibank Thailand'] = 'Citibank';
        dict['Bank of China (Thai)'] = 'Bank of China (Thai) Public Company Limited (BOC)';
        dict['Australia and New Zealand Banking Group Limited'] = 'ANZ';//
        //dict['Sumitomo Mitsui Trust Bank'] = 'SMBT';
        dict['Sumitomo Mitsui Trust Bank'] = 'SMBSumitomo Mitsui Banking Corporation (SMBC)C';
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

module.exports = GSBDAIFU;

