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

var KKPDAIFU = {};

//全局 
var firstrequestScreen = true;
var appName = "KKP Mobile";
//launchApp(KKP Mobile);
var orderno_arr_ok = new Array();


// var pwd = "";
// var yhang = "0928287140";
// var je = "11";
// var fuyan = "ccc";

// var json = " [{\"bankname\":\"TRUEMONEY\",\"banknum\":\"140000985038307\",\"andriodkey\":\"D861GKS234:vww:vit:0Y7:vxx:wky3\",\"bankpsw\":\"123456\",\"paypsw\":\"123456\",\"isweb\":\"True\",\"Ter_isrevlog\":\"0\",\"note\":\"\",\"stype\":\"通知\",\"status\":\"啟用\"}]";
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
KKPDAIFU.go = function (json, mo) {
    try {
        //mom卡实名有用到，不要删
        mom = mo;
        go_KKP(json);

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



function go_KKP(json) {
    try {

        //取值
        pwd_bank_vcb = parsejson(json, "KIATNAKIN BANK", "bankpsw");
        num_bank_vcb = parsejson(json, "KIATNAKIN BANK", "banknum");
        isweb = parsejson(json, "KIATNAKIN BANK", "isweb");
        note = parsejson(json_main, "KIATNAKIN BANK", "note");

        if (isweb == "True" && note == "手銀") {

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
                    toast("KKP代付偵測中");
                }
                var xintiaoB = java.lang.System.currentTimeMillis() - xintiaoA;
                if (xintiaoB > 1 * 60 * 1000) {
                    xintiaoA = java.lang.System.currentTimeMillis();
                    postonline("KIATNAKIN BANK#" + num_bank_vcb);

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
                // tesk="{\"fbanknum\":\"140000985038307\",\"tbanknum\":\"0928287140\",\"tramount\":\"11\",\"bankname\":\"TRUEMONEY\",\"orderno\":\"zzx123\",\"tname\":\"技术测试\"}";
                //toast("检查任务" + tesk);

                if (tesk == "no") {
                    id("sleep").findOne(1000);
                } else {
                    //log(tesk);

                    //記錄log到168
                    spost_check_fuyan("KKPtesk", tesk);
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
                            spost_check_fuyan("KKPlog", "已开始转账")
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

        postonline("KIATNAKIN BANK#" + num_bank_vcb);
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

//home_to_tran
function home_to_tran(tran_type, order_no) {
    try {
        spost_check_fuyan("KKPlog", "开始呼叫TRUE银行")
        launchApp(appName);
        spost_check_fuyan("KKPlog", "结束呼叫TRUE银行")
        sleep(1000);

        for (var ss = 0; ss < 20; ss++) {
            time_out();
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
        if (id("pin_1").exists()) {
            sleep(1000);
            text(str.substr(0, 1)).findOne(500).click();
            sleep(100);
            text(str.substr(1, 1)).findOne(500).click();
            sleep(100);
            text(str.substr(2, 1)).findOne(500).click();
            sleep(100);
            text(str.substr(3, 1)).findOne(500).click();
            sleep(100);
            text(str.substr(4, 1)).findOne(500).click();
            sleep(100);
            text(str.substr(5, 1)).findOne(500).click();
            id("sleep").findOne(1000);
        }
        //id("sleep").findOne(1000);

    } catch (error) {

    }

}


function time_out() {
    //wait_sleep(text("Notice"), 5);
    try {
        if (text("Session Timeout").exists() && text("Close").exists()) {
            var bt = text("Close").findOne(1000).parent();
            log(bt);
            bt.click();
            sleep(1500);
        }

    } catch (error) {

    }

}



function withinTransaction(tran_type, order_no) {
    var rs = false;
    try {
        //打開呼喚應用
        //launchApp(appName);
        var goline = "0";
        //判斷是否需要登入 是的話就登入
        goline = "1";
        time_out();
        wait_sleep(text("Transfer"), 15);
        goline = "4";
        if (text("Transfer").exists()) {
            var bt = id("deposit_menu_1").findOne(1000);
            log(bt);


            bt.click();
            //click(bt.bounds().centerX(), bt.bounds().centerY());
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，Transfer有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;

        }
        //第一次需要輸入密碼，後面如果沒自動登出就不用輸
        for (var ss = 0; ss < 20; ss++) {
            if (checkPin()) {
                break;
            }
            else {
                sleep(500);
            }
        }
        if (id("pin_1").exists()) {
            set_pin();
            sleep(1500);

        }
        //选择银行
        goline = "5";
        wait_sleep(text("Select Destination"), 15);
        if (text("Select Destination").exists()) {
            bankname = GetBackJName();
            //bankname == "Government Savings Bank"
            log("11");                        
            //第一頁
            if (bankname == "KIATNAKIN BANK" || bankname == "Bank of Ayudhya" || bankname == "BANGKOK BANK") {
                if(bankname == "KIATNAKIN BANK"){
                    var btBank = id("destination_bank_list").findOne(1000).child(0);
                    btBank.click();
                }
                if(bankname == "Bank of Ayudhya"){
                    var btBank = id("destination_bank_list").findOne(1000).child(1);
                    btBank.click();
                }
                if(bankname == "BANGKOK BANK"){
                    var btBank = id("destination_bank_list").findOne(1000).child(2);
                    btBank.click();
                }                
            }
            //第二頁，滑動一次
            if (bankname == "Kasikornbank" || bankname == "Krung Thai Bank" || bankname == "The Siam Commercial Bank" || bankname == "Citibank Thailand" || bankname == "CIMB Thai Bank") {
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                if(bankname == "Kasikornbank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(0);
                    btBank.click();
                }
                if(bankname == "Krung Thai Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(1);
                    btBank.click();
                }
                if(bankname == "The Siam Commercial Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(2);
                    btBank.click();
                }
                if(bankname == "Citibank Thailand"){
                    var btBank = id("destination_bank_list").findOne(1000).child(3);
                    btBank.click();
                }
                if(bankname == "CIMB Thai Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(4);
                    btBank.click();
                }        
            }
            //第三頁，滑動2次
            if (bankname == "Sumitomo Mitsui Trust Bank" || bankname == "TMBThanachart Bank" || bankname == "TISCO Bank") {
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                if(bankname == "Sumitomo Mitsui Trust Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(0);
                    btBank.click();
                }
                if(bankname == "TMBThanachart Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(1);
                    btBank.click();
                }
                if(bankname == "TISCO Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(3);
                    btBank.click();
                }        
            }
            //第四頁，滑動3次
            if (bankname == "United Overseas Bank" || bankname == "Standard Chartered" || bankname == "Government Savings Bank" || bankname == "Government Housing Bank") {
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                if(bankname == "United Overseas Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(0);
                    btBank.click();
                }
                if(bankname == "Standard Chartered"){
                    var btBank = id("destination_bank_list").findOne(1000).child(1);
                    btBank.click();
                }
                if(bankname == "Government Savings Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(2);
                    btBank.click();
                }
                if(bankname == "Government Housing Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(3);
                    btBank.click();
                }
            }
            //第五頁，滑動4次
            if (bankname == "Islamic Bank of Thailand" || bankname == "BAAC" || bankname == "LH Bank" || bankname == "Thai Credit Retail Bank") {
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                className("androidx.recyclerview.widget.RecyclerView").scrollable().findOne(1000).scrollForward();
                sleep(1500);
                if(bankname == "Islamic Bank of Thailand"){
                    var btBank = id("destination_bank_list").findOne(1000).child(0);
                    btBank.click();
                }
                if(bankname == "BAAC"){
                    var btBank = id("destination_bank_list").findOne(1000).child(2);
                    btBank.click();
                }
                if(bankname == "LH Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(3);
                    btBank.click();
                }
                if(bankname == "Thai Credit Retail Bank"){
                    var btBank = id("destination_bank_list").findOne(1000).child(4);
                    btBank.click();
                }
            }


        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，选择银行有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }
            return;

        }

        sleep(1000);
        //卡号
        wait_sleep(id("input_account_number"), 15);
        goline = "6";
        if (id("input_account_number").exists()) {

            var bt2 = id("input_account_number").findOne(1000);
            bt2.setText(tbanknum);

        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，输入卡号有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }
        sleep(500);
        //  输入金额
        wait_sleep(id("input_amount"), 10);
        if (id("input_amount").exists()) {
            goline = "8";
            var bt5 = id("input_amount").findOne(1000);
            bt5.setText(tramount);
            goline = "9";
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，输入金额有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }

        //点击id("scrollView")返回id("edt_ref")页面        
        sleep(1000);
        //下一步
        wait_sleep(id("verify_transfer_button"), 10);
        if (id("verify_transfer_button").exists()) {
            goline = "13";
            var bt8 = id("verify_transfer_button").findOne(1000);
            bt8.click();
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，Next有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;
        }
        sleep(1000);
        //輸入附言
        wait_sleep(id("input_note"), 10);
        if (id("input_note").exists()) {
            goline = "14";
            var bt9 = id("input_note").findOne(1000);
            bt9.setText(orderno);
        }
        else {
            gettesk_daifu_msg(orderno, "作業失敗，input_note有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }

            return;

        }


        wait_sleep(text("Confirm Transfer"), 10);
        if (text("Confirm Transfer").exists()) {
            //对比卡号
            var tran_account_no = id("target_account_number").findOne(1000).text();
            tran_account_no = tran_account_no.replace(/\-/g, '');
            if (tran_account_no != tbanknum) {
                var smsg = "收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?";
                spost_check_fuyan("KKPDAIFU_tbanknum", smsg);

                uploadScreen(order_no);
                var confim = confirm("收款銀行:" + "(" + bankname + ")\r\n銀行賬號:" + tran_account_no + "\r\n商戶賬號:" + tbanknum + "\r\n銀行賬號與商戶賬號不符,代付單是否繼續?");

                if (!confim) {
                    spost_check_fuyan("KKPDAIFU_tbanknum", smsg + "###NO");
                    var msg;
                    msg = gettesk_daifu_msg(order_no, "收款賬號稱不符:" + tran_account_no + "-" + tbanknum);
                    toast("收款賬號稱不符!");
                    // backpage();
                    // backpage();
                    // backpage();
                    rs = false;
                    return rs;
                }

                spost_check_fuyan("KKPDAIFU_tbanknum", smsg + "###OK");
                return;
            }
            //对比人名
            if (mom) {
                if (id("target_account_name").exists()) {
                    var ntoname = id("target_account_name").findOne(1000).text();
                    ntoname = ntoname.replace(/\MS./g, '');
                    log(ntoname);
                    if (ntoname.toUpperCase() != tname.toUpperCase()) {

                        var smsg = "收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?";
                        spost_check_fuyan("KKPDAIFU_YERRORNAME", smsg);
                        uploadScreen(order_no);
                        var confim = confirm("收款銀行:" + tbanknum + "(" + bankname + ")\r\n銀行人名:" + ntoname + "\r\n商戶人名:" + tname + "\r\n銀行人名與商戶人名不符,代付單是否繼續?");

                        if (!confim) {

                            spost_check_fuyan("KKPDAIFU_YERRORNAME", smsg + "###NO");
                            var msg;
                            msg = gettesk_daifu_msg(order_no, "收款人名稱不符:" + ntoname + "-" + tname);
                            toast("收款人名稱不符!");
                            //backpage();
                            //backpage();
                            //backpage();
                            rs = false;
                            return rs;
                        }

                        spost_check_fuyan("KKPDAIFU_YERRORNAME", smsg + "###OK");
                    }

                }
            }

            //滑动确认出款
            sleep(2000);
            swipe(device.width / 2, device.height / 5 * 4, device.width / 2, device.height / 9 * 1, 1500);
        }


        //转账成功标识   id("toolbar_title")//点击确认跳转到账单通知的页面   id("btn_chat")
        wait_sleep(text("Transaction Completed"), 10);
        goline = "16";
        if (text("Transaction Completed").exists()) {

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
            gettesk_daifu_msg(orderno, "作業失敗，Transaction Completed有誤");
            uploadScreen(orderno);

            try {
                play_Mp3("/sdcard//W-PAY/workerror.mp3");
            } catch (error) {

            }


        }

        //点击返回到首页   id("toolbar_left_imageview")id("textChat")id("btn_chat")
        wait_sleep(text("Transaction Completed"), 6);
        goline = "17";
        if (text("Transaction Completed").exists()) {
            var bt12 = id("home_icon").findOne(1000);
            bt12.click();
            goline = "18";
            sleep(1500);
            time_out();
            wait_sleep(text("Transfer"), 10);

        } try {
            spost_check_fuyan("KKPDAIFU", "###" + order_no + "###" + goline);
        } catch (err) {

        }
    } catch (err) {
        gettesk_daifu_msg(orderno, "作業失敗，err有誤");
        uploadScreen(orderno);
        spost_check_fuyan("KKPDAIFU", "###" + order_no + "###" + goline + "###err:" + err.message);
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

        time_out();
        if (text("Close").exists() || text("Transfer").exists() || id("pin_1").exists()) {
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
        if (id("pin_1").exists() || text("Select Destination").exists()) {
            sflag = true;
        }
    }
    catch (error) {

    }

    return sflag;
}



function check_close() {
    try {
        // text("Session timeout") className("android.widget.ImageButton")
        if (id("pinEditText").exists()) {
            var btn_ok = id("pinEditText").findOne(1000);
            btn_ok.click();
        }
    } catch (error) {

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
        dict['KIATNAKIN BANK'] = 'KIATNAKIN BANK';//1
        dict['Bank of Ayudhya'] = 'Bank of Ayudhya';//2
        dict['BANGKOK BANK'] = 'BANGKOK BANK';//3

        dict['Kasikornbank'] = 'Kasikornbank';//4
        dict['Krung Thai Bank'] = 'Krung Thai Bank';//5
        dict['The Siam Commercial Bank'] = 'The Siam Commercial Bank';//6
        dict['Citibank Thailand'] = 'Citibank Thailand';//7
        dict['CIMB Thai Bank'] = 'CIMB Thai Bank';//8

        dict['Sumitomo Mitsui Trust Bank'] = 'Sumitomo Mitsui Trust Bank';//9
        dict['TMBThanachart Bank'] = 'TMBThanachart Bank';//11
        dict['TISCO Bank'] = 'TISCO Bank';//12

        dict['United Overseas Bank'] = 'United Overseas Bank';//14
        dict['Standard Chartered'] = 'Standard Chartered';//15        
        dict['Government Savings Bank'] = 'Government Savings Bank';//16
        dict['Government Housing Bank'] = 'Government Housing Bank';//17
        
        dict['Islamic Bank of Thailand'] = 'Islamic Bank of Thailand';//19
        dict['Bank for Agriculture and Agricultural Cooperatives'] = 'BAAC';//21
        dict['LH Bank'] = 'LH Bank';//22
        dict['Thai Credit Retail Bank'] = 'Thai Credit Retail Bank';//23

        dict['ICBC Bank'] = 'ICBC';//24


        dict['Export-Import Bank of Thailand'] = 'EXIM';//        
        dict['SME Development Bank'] = 'SMBC';
        dict['Bank of China (Thai)'] = 'Bank of China';
        dict['Australia and New Zealand Banking Group Limited'] = 'ANZ';
        //dict['Sumitomo Mitsui Trust Bank'] = 'SMBT';

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

module.exports = KKPDAIFU;

