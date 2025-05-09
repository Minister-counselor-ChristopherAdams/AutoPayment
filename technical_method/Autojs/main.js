"ui";

// threads.start(function () {
//     try {
//         // 开启前台服务
//         $settings.setEnabled('foreground_service', true);
//     } catch (error) {

//     }

// })
threads.start(function () {
    try {


        /** 前台服务保活 */
        let KeepAliveService = {
            /** 开启 */
            start: function (idStr, nameStr) {
                try {
                    idStr = idStr || "";
                    let channel_id = idStr + ".foreground";
                    let channel_name = nameStr + " 前台服务通知";
                    let content_title = nameStr + " 正在运行中";
                    let content_text = "请勿手动移除该通知";
                    let ticker = nameStr + "已启动";
                    let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
                    let notification;
                    let icon = context.getResources().getIdentifier("ic_3d_rotation_black_48dp", "drawable", context.getPackageName());
                    if (device.sdkInt >= 26) {
                        let channel = new android.app.NotificationChannel(channel_id, channel_name, android.app.NotificationManager.IMPORTANCE_DEFAULT);
                        channel.enableLights(true);
                        channel.setLightColor(0xff0000);
                        channel.setShowBadge(false);
                        manager.createNotificationChannel(channel);
                        notification = new android.app.Notification.Builder(context, channel_id).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).setOngoing(true).build();
                    } else {
                        notification = new android.app.Notification.Builder(context).setContentTitle(content_title).setContentText(content_text).setWhen(new Date().getTime()).setSmallIcon(icon).setTicker(ticker).build();
                    }
                    manager.notify(1, notification);
                } catch (error) {
                    console.warn("前台保活服务启动失败:" + error);
                    console.warn("保活服务启动失败,不影响辅助的正常运行,继续挂机即可.");
                }
            },
            /** 停止 */
            stop: function () {
                let manager = context.getSystemService(android.app.Service.NOTIFICATION_SERVICE);
                manager.cancelAll();
            },
        };
        KeepAliveService.start("test", "keep online service");

        // 开启前台服务
        // $settings.setEnabled('foreground_service', true);
        // try{
        //   var qtfw =  $settings.isEnabled('foreground_service');
        //   spost_check_fuyan("foreground_service", "服務:"+qtfw);
        // }catch(e){

        // }
    } catch (error) {
        // try{
        //     spost_check_fuyan("foreground_service", "錯誤###");
        //     spost_check_fuyan("foreground_service", error);
        // }catch(error2){

        // }
    }

})

threads.start(function () {
    //跑电池优化的代码
    try {
        if (!$power_manager.isIgnoringBatteryOptimizations()) {
            toastLog("未开启忽略电池优化，请求中...");
            $power_manager.requestIgnoreBatteryOptimizations();
        }
    } catch (error) {
    }
});

//threads.start(requestScreenCapture);

var bbHelp = require('bbHelp.js');
var backhurl = bbHelp.gethURL();  //後臺
var backdeskurl = bbHelp.getdURL();//前臺
var backapkname = bbHelp.getApkName();//apk名

var shiming_open = false;

var clickrequest = true;
var qr_imgFile = "/sdcard/qrcode.png";

var 背景颜色 = "#dddddd";
var 字号 = "12";
var 字体颜色 = "#dd000000";

var checklogin = false;
var checkphone = false;

var getjsonphone;
var getmomojsonphone;
var json = "";
var json_main = "";
var loginjson = "";
var jsonid;
var sms_old;
var sms_vtpaytk = [];
var sms_vtpayqu = [];
var sms_gsb_otparr = new Array();
var sms_bay_otparr = new Array();
var sms_kb_otparr = new Array();
var sms_ttb_otparr = new Array();
var pwd_url = "/sdcard/pwd_auto.txt";
var momo_amount_url = "/sdcard/momo_amount.txt";
var log_url = "/sdcard/log_auto.txt";
var wait_name;
var istpgo = false;
var newVerCode = "";
var newVerName = "";
var momonlsname = "";
var check_main_zalo_mingxi = false;

var islog1 = false;
var islog2 = false;
var smsdictold = new Array();
var smsdictnew = new Array();
var notify_arr = new Array();

var first_go_json_main = true;
var first_go_momo_nls = true;
var first_require = true;
var first_go_winpay = true;

var first_go_zalo_xuanFuCuan = true;

var sms_tpb_old = [];
var check_tpb_time = java.lang.System.currentTimeMillis();



var check_getjson_time = java.lang.System.currentTimeMillis();

var vtpay_sms = "";
var vtpay_sms1 = "";
var vtpay_sms2 = "";
var check_momo_time = java.lang.System.currentTimeMillis();
var momodic = [];
checkDeleteLogFile();
var scheck_momo_reload_time = java.lang.System.currentTimeMillis();
var scheck_mb_reload_time = java.lang.System.currentTimeMillis();

var check_online_getjson_time = java.lang.System.currentTimeMillis();
var first_go_online = true;

//启用按键监听
//events.observeKey();

//监听音量下键弹起
/* events.onKeyDown("volume_down", function (event) {
    checklogin = false;
    momodic.splice(0, momodic.length);//清空数组

    spost_check_fuyan("smsclose2", "getjsonphone:" + getjsonphone + "###backapkname:" + backapkname + "###" + checklogin);

}); */

console.setGlobalLogConfig({
    "file": "/sdcard/autojs-log.txt"
});

//文件選擇
importClass(android.content.Intent);
importClass(android.graphics.BitmapFactory);
importClass(android.provider.MediaStore);
importClass(android.webkit.MimeTypeMap);
let imgRequestCode = 1;



//触发监听事件
//events.observeNotification();
events.on("notification", function (n) {
    try {
        var noti_open = true;
        if (noti_open) {
            var stitle = n.getPackageName();
            //  log(stitle);
            var smsbody = n.getText();
            //    log("通知文本: " + info.getTexts());


            var noti_time_no = n.when;
            var getTitle = n.getTitle();

            log("stitle" + stitle);
            log("smsbody" + smsbody);
            // spost_check_fuyan("zolo信息","信息主體"+smsbody);

            //  log(smsbody);
            //包名
            if (stitle.indexOf("th.co.truemoney.wallet") != -1) {

                let stype = gettoparsejson(json_main, "TRUEMONEY", "stype");
                if (stype == "通知") {
                    spost_check_fuyan("truemoney_noti", "smsbody：###" + smsbody + "###" + stitle);
                    if (smsbody.indexOf("received") != -1) {
                        //防止刪除通知失敗或重跳
                        let repeat_index = -1;
                        try {
                            repeat_index = notify_arr.indexOf(smsbody);
                        } catch (err) {

                        }

                        if (repeat_index > -1 && repeat_index < 3) {
                            try {
                                spost_check_fuyan("truemoney_new_repeat", "smsbody：###" + smsbody + "###" + stitle);

                            } catch (err) {

                            }
                        } else {
                            go_Tmoney_callback(smsbody, noti_time_no);
                        }

                    }
                }

            }

            //gsb_noti
            try {
                if (stitle.indexOf("com.mobilife.gsb.mymo") > -1) {
                    if (smsbody.indexOf("Deposit") != -1 && smsbody.indexOf("received") != -1) {
                        spost_check_fuyan("gsb_noti", "smsbody：###" + smsbody + "###" + stitle);
                        let stype = gettoparsejson(json_main, "GOVERNMENT SAVINGS BANK", "stype");
                        if (stype == "通知") {
                            go_send_otp("Title:" + "gsb通知" + "\nContent:" + smsbody, noti_time_no);
                            go_gsb_callback_noti(smsbody, noti_time_no);
                        }

                        //   go_tpb_callback_sms(smsbody, noti_time_no);
                    }

                    try {
                        n.delete();
                    } catch (error) {

                    }
                }
            } catch (error) {

            }

            try {
                if (notify_arr.length > 15) {
                    notify_arr = notify_arr.slice(0, 5);
                }
                // if(smsbody.indexOf(".00") != -1 ||smsbody.indexOf(".99") != -1 ||smsbody.indexOf(".98") != -1 || smsbody.indexOf("THB") !=-1){
                //    spost_check_fuyan("truemoney_new_noti", "smsbody：###" + smsbody + "###" + stitle);
                // }
            } catch (error) {

            }




            try {
                n.delete();
            } catch (error) {
                try {
                    spost_check_fuyan("truemoney_new_noti_delete_err", "smsbody：###" + smsbody + "###" + stitle);
                    spost_check_fuyan("truemoney_new_noti_delete_err", "err###" + error);
                } catch (err) {

                }
            }


        }


    }
    catch (error) {
        //confirm("WINPAY已關閉或者通知有誤");
    }


});
ui.statusBarColor(背景颜色);
界面1();
function 界面1() {
    ui.layout(
        <ScrollView id="bg" bg="{{背景颜色}}">
            <frame>
                <horizontal padding="10 10 10">
                    <button id="lg" style="Widget.AppCompat.Button.Colored" w="120" marginLeft="10" text="登錄" />
                    <button id="bd" w="120" marginRight="10%" text="綁定" />
                    <button id="momoxh" w="120" marginRight="10%" text="TM下回" />
                </horizontal>

                <vertical padding="10 10 10">

                    <text size="{{字号*5}}sp" paddingTop="60" paddingLeft="40" color="{{字体颜色}}">登錄賬戶</text>
                    <text id="t1" size="{{字号*2}}sp" color="{{字体颜色}}" marginTop="50" paddingLeft="35" />
                    <input id="ID" w="*" marginRight="10" marginLeft="10" singleLine="true" hint="電話" textColorHint="{{字体颜色}}" />
                    <button id="Login" style="Widget.AppCompat.Button.Colored" h="{{字号*10}}px" size="{{字号*2}}sp" marginTop="20" marginRight="10" marginLeft="10">登錄</button>
                    <button id="Nls" style="Widget.AppCompat.Button.Colored" h="{{字号*10}}px" size="{{字号*2}}sp" marginTop="20" marginRight="10" marginLeft="10">nls下載</button>
                    <button id="btnImg" style="Widget.AppCompat.Button.Colored" h="{{字号*10}}px" size="{{字号*2}}sp" marginTop="20" marginRight="10" marginLeft="10">选择qr图片</button>

                    <checkbox id="nameCheckBox" checked="false" text="是否開啓代付實名"></checkbox>


                </vertical>
            </frame>
        </ScrollView>
    )
    ui.ID.setText(readpwd(pwd_url));



    ui.ID.on("touch", () => {
        ui.t1.setText("電話")
        ui.ID.setHint("")

    })


    ui.nameCheckBox.on("click", () => {

        shiming_open = ui.nameCheckBox.checked;
    })


    ui.bg.on("touch", () => {

        if (ui.ID.getText() == "") {
            ui.t1.setText("")
            ui.ID.setHint("電話")
        }

    })

    ui.Login.on("click", () => {

        if (ui.ID.getText() == "") {
            ui.t1.setText("")
            ui.ID.setHint("電話")
        }
    })

    ui.Login.on("click", () => {
        if (ui.ID.getText() != "") {


            writepwd(ui.ID.getText(), pwd_url);
            toast("正在登录");
            threads.start(function () {
                try {
                    getServerVer();
                } catch (error) {
                    toast("獲取版本信息有誤");
                }
                try {
                    //語音包
                    get_Mp3();
                    // GetMomoNlsName();
                } catch (error) {

                }
                try {
                    var thisVer = getVerCode();
                    if (thisVer != newVerCode) {
                        if (confirm("發現新版本,是否更新?")) {
                            toast("下載最新apk版本");
                            downloadApk();
                            try {
                                back();
                                sleep(1000);
                            }
                            catch (error) {

                            }
                            return;
                        }
                    }
                } catch (error) {
                    toast("比較版本信息有誤");
                }



                getjsonphone = ui.ID.getText();
                var islogin = clockPhone(ui.ID.getText(), "login");

                if (islogin.indexOf("880025251325") != -1) {
                    spost_check_fuyan("checkbanknum880025251325", "json:" + json);
                }

                if (islogin.indexOf("無效IP") != -1) {
                    toast("正在登录:" + islogin);
                }
                if (islogin.indexOf("[]") != -1) {
                    toast("正在登录:未啟用或未綁定資料為空");
                }


                json = islogin;
                jsonid = eval(islogin);

                var num_jsonid = jsonid.length;

                var logaid = jsonid[0].andriodkey;



                var aidcheck = check_mac();
                var msg_toast_all = "請檢查是否為固定MAC\n\r本機mac地址為\n\r" + aidcheck + "\n\r";
                for (let index = 0; index < jsonid.length; index++) {
                    var all_logaid = jsonid[index].andriodkey;
                    if (all_logaid.indexOf(":") != -1) {
                        all_logaid = decode(all_logaid);
                    }
                    //msg_toast="本機mac地址為"+aidcheck;
                    if (all_logaid !== aidcheck) {
                        msg_toast = jsonid[index].bankname + jsonid[index].banknum + "的mac為\n\r" + all_logaid + "\n\r";
                        msg_toast_all += msg_toast;

                        //加總到下面checkphone報 和記錄log
                        checkphone = true;
                    }


                }
                // log("aidcheck:" + aidcheck);
                if (islogin == "ok") {

                    log(json);

                    try {
                        remove_apk();
                    } catch (error) {

                    }

                    checklogin = true;
                    toast("登錄綁定成功!");
                }
                else if (checkphone) {
                    //記錄mac不同
                    toast(msg_toast_all);
                    log(msg_toast_all);
                    spost_check_fuyan("checkphone" + getjsonphone, "json:" + json + "本機mac地址為" + aidcheck);
                }
                else {
                    if (logaid.indexOf(":") != -1) {
                        logaid = decode(logaid);
                    }

                    // log("logaid:" + logaid);
                    if (logaid == aidcheck) {
                        checklogin = true;
                        log(json_main + "#1");
                        toast("登錄成功!");
                    } else {
                        dialogs.alert("输入的電話與綁定的機器碼不符，请重试", "", () => { })
                    }

                }
            })

        } else {
            ui.ID.setError("请输入電話")
        }
    });

    ui.Nls.on("click", () => {
        toast("開始下載");
        threads.start(function () {

            downloadNlsApk();
        })
    });

    ui.btnImg.on("click", () => {

        threads.start(function () {
            getjsonphone = ui.ID.getText();
            var image_json = clockPhone(getjsonphone, "getbank");
            image_json = eval(image_json);


            var options = [];

            for (let index = 0; index < image_json.length; index++) {

                options.push(image_json[index].bankname + "##" + image_json[index].banknum);
            }
            var image_i = dialogs.select("请选择一个选项", options);
            if (image_i >= 0) {
                toast("您选择的是\n\r" + options[image_i]);
            } else {
                toast("您取消了选择");
            }
            var image_op = options[image_i];

            var qr_num = image_op.substring(image_op.indexOf("##") + 2, image_op.length).trim();

            var qr_bankname = image_op.substring(0, image_op.indexOf("##")).trim();

            let fileType = "image/*";
            let requestCode = imgRequestCode;
            var intent = new Intent();
            intent.setType(fileType);
            intent.setAction(Intent.ACTION_GET_CONTENT);
            activity.startActivityForResult(intent, requestCode);
            try {
                activity.getEventEmitter().once("activity_result", (requestCode, resultCode, data) => {
                    if (resultCode != -1) {
                        toast("没有选择文件!");
                        return false;
                    } else {
                        toast("已選文件!");
                        var uri = data.getData();
                        //log("uri: %s", uri.toString());
                        let filepath = URIUtils_uriToFile(uri);
                        log(filepath);

                        update_qr(filepath, qr_bankname, qr_num);
                        // try{
                        //     activity.removeListener("activity_result", ()=>{});
                        //     spost_check_fuyan("qrlog3", "###"+requestCode+"###"+resultCode+"###");
                        // }catch(error){
                        //     spost_check_fuyan("qrlog2", "###"+requestCode+"###"+resultCode+"###");
                        // }

                        // var cr = context.getContentResolver();
                        // log("图片");
                        //  var bitmap = BitmapFactory.decodeStream(cr.openInputStream(uri));
                        //  log("bitmap: %s", bitmap);

                        // var sjson = clockPhone(getjsonphone, "login");
                        // ui.parentView.removeAllViews();
                        // var childView = ui.inflate(<img></img>, ui.parentView);
                        // ui.parentView.addView(childView);
                        // childView.setImageBitmap(bitmap);
                    }

                });

            } catch (error) {

            }

        })


    });

    ui.bd.click(function () {
        界面2();
    });
    ui.momoxh.click(function () {
        界面3();
    });
}

function 界面2() {
    ui.layout(
        <ScrollView id="bg" bg="{{背景颜色}}">
            <frame>
                <horizontal padding="10 10 10">
                    <button id="lg" w="110" marginLeft="5" text="登錄" />
                    <button id="bd" style="Widget.AppCompat.Button.Colored" w="110" marginRight="5" text="綁定" />
                    <button id="momoxh" w="110" marginRight="5" text="TM下回" />
                </horizontal>

                <vertical padding="10 10 10">

                    <text size="{{字号*5}}sp" paddingTop="60" paddingLeft="40" color="{{字体颜色}}">綁定車輛</text>
                    <text id="t1" size="{{字号*2}}sp" color="{{字体颜色}}" marginTop="50" paddingLeft="35" />
                    <input id="ID" w="*" marginRight="30" marginLeft="30" singleLine="true" hint="請輸入車輛編號" textColorHint="{{字体颜色}}" />



                    <button id="Login" style="Widget.AppCompat.Button.Colored" h="{{字号*11}}px" size="{{字号*2}}sp" marginTop="20" marginRight="30" marginLeft="30">車輛綁定</button>


                </vertical>
            </frame>
        </ScrollView>
    )



    ui.ID.on("touch", () => {
        ui.t1.setText("請輸入車輛編號")
        ui.ID.setHint("")

    })

    ui.bg.on("touch", () => {

        if (ui.ID.getText() == "") {
            ui.t1.setText("")
            ui.ID.setHint("請輸入車輛編號")
        }

    })

    ui.Login.on("click", () => {

        if (ui.ID.getText() == "") {
            ui.t1.setText("")
            ui.ID.setHint("請輸入車輛編號")
        }
    })

    ui.Login.on("click", () => {
        if (ui.ID.getText() != "") {
            toast("正在綁定");
            threads.start(function () {
                var isclock = clockPhone(ui.ID.getText(), "clock");
                if (isclock == "ok") {
                    //log("islogin"+islogin);

                    toast("綁定成功!請前往登陸界面登陸");
                }
                else if (isclock.indexOf("已綁定過") != -1) {
                    toast("已綁定過，請前往登陸界面登陸");
                }
                else {
                    toast(isclock);

                }
            })
            界面1();

        } else {
            ui.ID.setError("请输入電話")
        }
    });
    ui.lg.click(function () {
        界面1();
    });
    ui.momoxh.click(function () {
        界面3();
    });
}



function 界面3() {
    ui.layout(
        <ScrollView id="bg" bg="{{背景颜色}}">
            <frame>

                <horizontal padding="10 10 10">
                    <button id="lg" w="110" marginLeft="5" text="登錄" />
                    <button id="bd" w="110" marginLeft="5" text="綁定" />
                    <button id="momoxh" style="Widget.AppCompat.Button.Colored" w="110" marginRight="5" text="TM下回" />

                </horizontal>


                <vertical padding="10 10 10">

                    <text size="{{字号*3}}sp" paddingTop="60" paddingLeft="40" color="{{字体颜色}}">TM下回設定</text>
                    <text id="t1" size="{{字号*2}}sp" color="{{字体颜色}}" marginTop="50" paddingLeft="35" />
                    <input id="Amount" w="*" marginRight="30" marginLeft="30" singleLine="true" hint="下回金額" textColorHint="{{字体颜色}}" />
                    <text id="t2" size="{{字号*2}}sp" color="{{字体颜色}}" marginTop="10" paddingLeft="35" />
                    <input id="BetNum" w="*" marginRight="30" marginLeft="30" singleLine="true" hint="下回次數" textColorHint="{{字体颜色}}" />



                    <button id="Start" style="Widget.AppCompat.Button.Colored" h="{{字号*10}}px" size="{{字号*2}}sp" marginTop="20" marginRight="30" marginLeft="30">開始</button>


                </vertical>
            </frame>
        </ScrollView>
    )
    ui.lg.click(function () {
        界面1();
    });
    ui.bd.click(function () {
        界面2();
    });

    // ui.PhoneNum.setText(readpwd(pwd_url));
    var id_read = readpwd(momo_amount_url);
    id_read = id_read.replace(/\,/g, '');
    if (id_read.indexOf(",") == -1) {
        id_read = format(id_read);
    }

    ui.Amount.setText(id_read);
    ui.Amount.on("click", () => {
        var amount_text = ui.Amount.getText();
        if (amount_text != "") {
            amount_text = amount_text.replace(/\,/g, '');
            if (amount_text.indexOf(",") == -1) {
                amount_text = format(amount_text);
                ui.Amount.setText(amount_text);
            }
        }

    })



    ui.Amount.on("touch", () => {
        ui.t1.setText("下回金額")
        ui.Amount.setHint("")
        if (ui.BetNum.getText() == "") {
            ui.t2.setText("")
            ui.BetNum.setHint("下回次數")
        }
    })

    ui.BetNum.on("touch", () => {
        ui.t2.setText("下回次數")
        ui.BetNum.setHint("")
        if (ui.Amount.getText() == "") {
            ui.t1.setText("")
            ui.Amount.setHint("下回金額")
        }
    })

    ui.bg.on("touch", () => {
        if (ui.BetNum.getText() == "") {
            ui.t2.setText("")
            ui.BetNum.setHint("下回次數")
        }
        if (ui.Amount.getText() == "") {
            ui.t1.setText("")
            ui.Amount.setHint("下回金額")
        }

    })

    ui.Start.on("click", () => {
        if (ui.BetNum.getText() == "") {
            ui.t2.setText("")
            ui.BetNum.setHint("下回次數")
        }
        if (ui.Amount.getText() == "") {
            ui.t1.setText("")
            ui.Amount.setHint("下回金額")
        }
    })

    ui.Start.on("click", () => {
        var amount_text = ui.Amount.getText().toString();
        log(amount_text + "amount_text");
        if (amount_text != "") {
            if (amount_text.indexOf(",") == -1) {
                amount_text = format(amount_text);
                ui.Amount.setText(amount_text);
            }
        }
        if (amount_text != "") {

            toast("下回中");
            writepwd(amount_text, momo_amount_url);

            var cc_amount = amount_text.replace(/\,/g, '');
            log(cc_amount + "cc_amount");
            betamount = parseInt(cc_amount);


            var cc = ui.BetNum.getText();
            betcc = parseInt(cc);

            // getmomojsonphone = readpwd(pwd_url);
            // momojson = clockPhone(getmomojsonphone, "login");



            threads.start(function () {


                try {

                    getServerVer();
                    var thisVer = getVerCode();
                    if (thisVer != newVerCode) {
                        if (confirm("發現新版本,是否更新?")) {
                            toast("下載最新apk版本");
                            downloadApk();
                            try {
                                back();
                                sleep(1000);
                            }
                            catch (error) {

                            }
                            return;
                        }
                    }

                    var MOMOXIAHUI = require('Momoxiahui.js');
                    toast("開始下回");
                    MOMOXIAHUI.go("666888", betamount, betcc);


                } catch (error) {

                }

                // fileVer = randomChar(10);
                // writepwd(fileVer, ver_url);

                // try {
                //     //在新线程执行的代码
                //     betcurrentcount = 0;
                //     //momo_login();
                //     toast("開始下回記錄次數:" + betcurrentcount);
                //     toast("總下回記錄次數:" + bettotalcount);
                //     while (betcurrentcount < bettotalcount) {
                //         // toast("當前已下回次數:"+betcurrentcount);
                //         var readver = readpwd(ver_url);
                //         if (fileVer != readver)
                //             break;
                //         momo_transfer(ui.Amount.getText());
                //         sleep(1000);
                //     }
                //     toast("下回完成");
                // } catch (error) {

                // }
            })










        } else {
            ui.Amount.setError("请输入下回次數")
        }
    });


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

function readpwd(url) {
    try {
        //文件路径
        var path = url;
        //打开文件
        var file = open(path);
        //读取文件的所有内容
        var text = file.read();
        //关闭文件
        file.close();
        return text;
    } catch (error) {
        return "";
    }

}

function getconfig() {
    try {
        var url = backdeskurl + "/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=dmVy&fileExt=anNvbg==&SysType=5bCP56eY5pu4";
        var res = http.get(url);
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "no";
        }
    }
    catch (error) {

    }
}

function getMomoNLSconfig() {
    try {
        var url = backdeskurl + "/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=bW9tb25scw==&fileExt=anNvbg==&SysType=5bCP56eY5pu4";
        var res = http.get(url);
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (error) {
        return "";
    }
}


function GetMomoNlsName() {
    for (var jj = 0; jj < 5; jj++) {
        momonlsname = getMomoNLSconfig();
        if (momonlsname != "")
            break;
    }
}
function getServerVer() {
    try {
        var verjson = getconfig();
        var obj = JSON.parse(verjson);


        try {
            newVerCode = obj[0].verCode;
            newVerName = obj[0].verName;
        } catch (error) {
            newVerCode = "";
            newVerName = "";
            return false;
        }

    } catch (error) {
        toast("獲取版本信息有誤2" + newVerCode);
        return false;
    }
    return true;
}

function getVerCode() {
    var verCode = "";
    try {
        importClass(android.net.Uri);
        importClass(android.database.Cursor);
        importClass(android.content.ContentResolver);

        verCode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionCode;
        var vername = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;

        verCode = vername;
    } catch (error) {
        toast("獲取本機版本信息有誤" + verCode);
    }
    return verCode;
}
/**
     * 下载apk文件
     */
function downloadApk() {
    // 启动新线程下载软件
    //   threads.start(function () {
    //     downFile(  );
    //  });
    try {
        var isdown = downFile();
        if (isdown) {
            sleep(2000);
            installApk();
        }
    }
    catch (error) {

    }
}

function downFile() {
    var isok = false;
    var ssline = 1;
    try {

        //获取存储卡路径、构成保存文件的目标路径
        var dirName = "";
        var attName = "Pay.apk";
        //SD卡具有读写权限、指定附件存储路径为SD卡上指定的文件夹        
        dirName = "/sdcard/W-PAY/";
        ssline = 4;
        if (!files.exists(dirName)) {      //判断文件夹是否存在
            files.create(dirName);        //如果不存在、则创建一个新的文件夹
        }
        ssline = 5;
        //准备拼接新的文件名
        var fileName = "";
        fileName = attName;
        fileName = dirName + fileName;
        ssline = 6;
        if (files.exists(fileName)) {    //如果目标文件已经存在
            files.remove(fileName);    //则删除旧文件
        }

        var url = backdeskurl + "/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=UGF5&fileExt=YXBr";
        var res = http.get(url);
        sleep(2000);
        if (res == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null)
                    break;

                sleep(1000);
            }
        }

        if (res == null) {
            toast("下載apk失敗");
        }
        if (res.body == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null && res.body != null)
                    break;

                sleep(1000);
            }
        }
        if (res.body == null) {
            toast("下載apk失敗1");
        }
        ssline = 2;
        var html = res.body.bytes();
        ssline = 3;
        if (html != null) {


            ssline = 7;
            try {
                ssline = 8;
                files.writeBytes(fileName, html);
                isok = true;
                toast("最新apk下載成功");
                ssline = 9;
            }
            catch (error) {
                log("ssline:" + ssline);
                log("files:");
                log(error);
            }
        } else {
            ssline = 10;
            return "no";
        }
    }
    catch (error) {
        log("ssline:" + ssline);
        log(error);
    }

    return isok;
}


function installApk() {
    try {
        // log("installApk");
        var fileName = "/sdcard/W-PAY/Pay.apk";
        if (!files.exists(fileName)) {

            return;
        }
        var apkurl = files.path(fileName);

        var file = new java.io.File(apkurl);


        var intent = new Intent(Intent.ACTION_VIEW);

        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        var type = "application/vnd.android.package-archive";

        var uri;
        uri = Uri.fromFile(file);

        if (device.sdkInt > 23) {

            // log("sdkInt:"+device.sdkInt );
            //创建url
            uri = Packages["androidx"].core.content.FileProvider.getUriForFile(context, app.fileProviderAuthority, file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        } else {

            uri = Uri.fromFile(file);
            // log(">>sdkInt:"+device.sdkInt );

        }

        intent.setDataAndType(uri, type);
        // if (!(context instanceof Activity)) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        // }
        context.startActivity(intent);
    }
    catch (error) {

        log(error);
    }

}


function downloadNlsApk() {
    // 启动新线程下载软件
    //   threads.start(function () {
    //     downFile(  );
    //  });
    try {
        var isdown = downNlsFile();
        if (isdown) {
            sleep(2000);
            installNlsApk();
        }
    }
    catch (error) {

    }
}

function downNlsFile() {
    var isok = false;
    var ssline = 1;
    try {

        //获取存储卡路径、构成保存文件的目标路径
        var dirName = "";
        var attName = "nls.apk";
        //SD卡具有读写权限、指定附件存储路径为SD卡上指定的文件夹        
        dirName = "/sdcard/W-PAY/";
        ssline = 4;
        if (!files.exists(dirName)) {      //判断文件夹是否存在
            files.create(dirName);        //如果不存在、则创建一个新的文件夹
        }
        ssline = 5;
        //准备拼接新的文件名
        var fileName = "";
        fileName = attName;
        fileName = dirName + fileName;
        ssline = 6;
        if (files.exists(fileName)) {    //如果目标文件已经存在
            files.remove(fileName);    //则删除旧文件
        }

        var url = backdeskurl + "/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=bmxz&fileExt=YXBr";
        var res = http.get(url);
        sleep(2000);
        if (res == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null)
                    break;

                sleep(1000);
            }
        }

        if (res == null) {
            toast("下載nlsapk失敗");
        }
        if (res.body == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null && res.body != null)
                    break;

                sleep(1000);
            }
        }
        if (res.body == null) {
            toast("下載nlsapk失敗1");
        }
        ssline = 2;
        var html = res.body.bytes();
        ssline = 3;
        if (html != null) {


            ssline = 7;
            try {
                ssline = 8;
                files.writeBytes(fileName, html);
                isok = true;
                toast("最新nlsapk下載成功");
                ssline = 9;
            }
            catch (error) {
                log("ssline:" + ssline);
                log("files:");
                log(error);
            }
        } else {
            ssline = 10;
            return "no";
        }
    }
    catch (error) {
        log("ssline:" + ssline);
        log(error);
    }

    return isok;
}
function installNlsApk() {
    try {
        // log("installApk");
        try {
            importClass(android.net.Uri);
            importClass(android.database.Cursor);
            importClass(android.content.ContentResolver);
        }
        catch (error) {

        }
        var fileName = "/sdcard/W-PAY/nls.apk";
        if (!files.exists(fileName)) {

            return;
        }
        var apkurl = files.path(fileName);

        var file = new java.io.File(apkurl);


        var intent = new Intent(Intent.ACTION_VIEW);

        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        var type = "application/vnd.android.package-archive";

        var uri;
        uri = Uri.fromFile(file);

        if (device.sdkInt > 23) {

            // log("sdkInt:"+device.sdkInt );
            //创建url
            uri = Packages["androidx"].core.content.FileProvider.getUriForFile(context, app.fileProviderAuthority, file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        } else {

            uri = Uri.fromFile(file);
            // log(">>sdkInt:"+device.sdkInt );

        }

        intent.setDataAndType(uri, type);
        // if (!(context instanceof Activity)) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        // }
        context.startActivity(intent);
    }
    catch (error) {

        log(error);
    }

}

function URIUtils_uriToFile(uri) {
    //Source : https://www.cnblogs.com/panhouye/archive/2017/04/23/6751710.html
    var r = null,
        cursor,
        column_index,
        selection = null,
        selectionArgs = null,
        isKitKat = android.os.Build.VERSION.SDK_INT >= 19,
        docs;
    if (uri.getScheme().equalsIgnoreCase("content")) {
        if (isKitKat && android.provider.DocumentsContract.isDocumentUri(activity, uri)) {
            if (String(uri.getAuthority()) == "com.android.externalstorage.documents") {
                docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                if (docs[0] == "primary") {
                    return android.os.Environment.getExternalStorageDirectory() + "/" + docs[1];
                }
            } else if (String(uri.getAuthority()) == "com.android.providers.downloads.documents") {
                uri = android.content.ContentUris.withAppendedId(
                    android.net.Uri.parse("content://downloads/public_downloads"),
                    parseInt(android.provider.DocumentsContract.getDocumentId(uri))
                );
            } else if (String(uri.getAuthority()) == "com.android.providers.media.documents") {
                docs = String(android.provider.DocumentsContract.getDocumentId(uri)).split(":");
                if (docs[0] == "image") {
                    uri = android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if (docs[0] == "video") {
                    uri = android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if (docs[0] == "audio") {
                    uri = android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                }
                selection = "_id=?";
                selectionArgs = [docs[1]];
            }
        }
        try {
            cursor = activity.getContentResolver().query(uri, ["_data"], selection, selectionArgs, null);
            if (cursor && cursor.moveToFirst()) {
                r = String(cursor.getString(cursor.getColumnIndexOrThrow("_data")));
            }
        } catch (e) {
            log(e);
        }
        if (cursor) cursor.close();
        return r;
    } else if (uri.getScheme().equalsIgnoreCase("file")) {
        return String(uri.getPath());
    }
    return null;
}

var format = n => {
    let num = n.toString()
    let decimals = ''
    // 判断是否有小数
    num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals
    let len = num.length
    if (len <= 3) {
        return num
    } else {
        let temp = ''
        let remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') + temp
        }
    }
}



function getUriForFile(file) {
    var uri;
    if (context == null || file == null) {
        throw new NullPointerException();
    }

    if (device.sdkInt > 23) {
        uri = android.support.v4.content.FileProvider.getUriForFile(context.getApplicationContext(), app.fileProviderAuthority, file);
    } else {
        uri = Uri.fromFile(file);
    }
    return uri;
}
function checkDeleteLogFile() {
    try {
        var fl = "/sdcard/autojs-log.txt";
        if (!files.exists(fl)) {    //如果目标文件已经存在
            return;
        }

        var asize = files.readBytes(fl).length;
        var nsize = asize / 1024;
        if (nsize > 100) {
            files.remove(fl);

        }
    }
    catch (error) {

    }
}
//訪問server驗證
function clockPhone(mphone, type) {
    // log(mphone);
    //獲取機器碼作為key
    var sms = "";
    try {
        var aid = check_mac();
        var oaid = aid;

        if (aid.indexOf(":") != -1) {
            aid = encrypt(aid);
        }
        //spost_check_fuyan("phonebd", "url"+backhurl+"oaid:" + oaid +"aid:" + aid + "##type:" +type+ "#mphone" + mphone);
        //log(aid);
        var url = backhurl + "/Service/TerAupdate.ashx?f=1";

        var res = http.post(url, {
            "andriodkey": aid,
            "andriodkeyde": oaid,
            "mphone": mphone,
            "type": type,
        });

        //返回驗證碼，如果是空就是上傳信息不對
        var html = res.body.string();
        if (html != null || html != "") {
            sms = html;
            //log(sms);
            return sms;
        } else {

        }
    }
    catch (error) {

    }
    return sms;
}

//加密機器碼
function encrypt(stringW) {
    //添加尾判断符号
    var str = stringW + "hp168";

    //添加随机字符
    var ranWs = random(1, 6);
    var str1 = "";
    for (var i = 0; i < str.length; i++) {
        str1 = str1 + str[i];
        if (i % ranWs == 0) {
            str1 = str1 + ranLetter();
        }
    }
    //log(str1)
    str1 = ranWs + str1;

    //转换倒序
    str1 = str1.split("").reverse();

    //替换对应值
    for (var x = 0; x < str1.length; x++) {
        str1[x] = charDh(str1[x]);
    }

    return str1.join("");
}

function decode(stringJ) {
    var str2 = stringJ.split("");

    //替换回原值
    for (var x = 0; x < str2.length; x++) {
        str2[x] = charDh(str2[x]);
    }

    //颠倒顺序
    str2 = str2.reverse().join("");
    //log(str2)
    //去掉多余
    var tt = parseInt(str2[0]);
    str2 = str2.substring(1, str2.length - 1);
    var str3 = "";
    for (var y = 0; y < str2.length; y++) {
        if ((y - 1) % (tt + 1) != 0) {
            str3 = str3 + str2[y];
        }
    }

    //去除尾端符号
    {
        str3 = str3.substring(0, 17);
    }

    return str3;
}

function charDh(cha) {
    var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    for (var jw = 0; jw < arr.length; jw++) {
        if (cha == arr[jw]) {
            return arr[arr.length - 1 - jw];
        }
    }
    return cha;
}

function ranLetter() {
    var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    var ran = random(0, 3);
    if (ran == 0) {
        return random(0, 9);
    } else if (ran == 1) {
        return arr[random(0, arr.length - 1)];
    } else {
        return arr[random(0, arr.length - 1)].toUpperCase();
    }
}

var check_winpay_time = java.lang.System.currentTimeMillis();
var SCBank;
var BAY;
var KTB;
var KB;
var KKP;
var TRUEMONEY;
var TRUE;
var TTB;
var KBDAIFU;
var KTBDAIFU;
var BBLDAIFU;
var SCBDAIFU;
var GSBDAIFU;
var BAYDAIFU;
var KKPDAIFU;
var MKBDAIFU;
threads.start(function () {
    //在新线程执行的代码
    try {

        while (true) {

            try {
                if (first_require) {
                    //避免多次重複請求
                    first_require = false;
                    try {
                        SCBank = require('SCBank.js');
                    } catch (error) {
                        log("js引用錯誤SCB");
                    }

                    try {
                        BAY = require('BAY.js');
                    } catch (error) {
                        log("js引用錯誤BAY");
                    }

                    try {
                        KTB = require('KTB.js');
                    } catch (error) {
                        log("js引用錯誤KTB");
                    }
                    try {
                        KB = require('KB.js');
                    } catch (error) {
                        log("js引用錯誤KB");
                    }
                    try {
                        KKP = require('KKP.js');
                    } catch (error) {
                        log("js引用錯誤KKP");
                    }
                    try {
                        TRUEMONEY = require('Truemoney.js');
                    } catch (error) {
                        log("js引用錯誤TRUEMONEY");
                    }
                    try {
                        TRUE = require('TRUE.js');
                    } catch (error) {
                        log("js引用錯誤TRUE");
                    }
                    try {
                        TTB = require('TTB.js');
                    } catch (error) {
                        log("js引用錯誤TTB");
                    }
                    try {
                        KBDAIFU = require('KBDAIFU.js');
                    } catch (error) {
                        log("js引用錯誤KBDAIFU.js");
                    }
                    try {
                        KTBDAIFU = require('KTBDAIFU.js');
                    } catch (error) {
                        log("js引用錯誤KTBDAIFU.js");
                    }
                    try {
                        BBLDAIFU = require('BBLDAIFU.js');
                    } catch (error) {
                        log("js引用錯誤BBLDAIFU.js");
                    }
                    try {
                        SCBDAIFU = require('SCBDAIFU.js');
                    } catch (error) {
                        log("js引用錯誤SCBDAIFU.js");
                    }
                    try {
                        GSBDAIFU = require('GSBDAIFU.js');
                    } catch (error) {
                        log("GSBDAIFU.js");
                    }
                    try {
                        KKPDAIFU = require('KKPDAIFU.js');
                    } catch (error) {
                        log("KKPDAIFU.js");
                    }
                    try {
                        MKBDAIFU = require('MKBDAIFU.js');
                    } catch (error) {
                        log("MKBDAIFU.js");
                    }
                    /* 
                    try {MKBDAIFU
                        BAYDAIFU = require('BAYDAIFU.js');
                    } catch (error) {
                        log("BAYDAIFU.js");
                    }
                    */
                }

                if (checklogin) {
                    var cdt = java.lang.System.currentTimeMillis();
                    writepwd(cdt + "", "/sdcard/cdt.txt");
                    var diffgetjson_time = java.lang.System.currentTimeMillis() - check_getjson_time;

                    if (diffgetjson_time > 90000 || first_go_json_main) {

                        //  json_main = clockPhone(getjsonphone, "login");
                        // json_main = clockPhone(getjsonphone, "getbank");

                        var check_json = clockPhone(getjsonphone, "getbank");
                        if (check_json.indexOf("banknum") != -1) {
                            json_main = check_json;
                        }

                        check_getjson_time = java.lang.System.currentTimeMillis();
                        first_go_json_main = false;
                    }
                    try {
                        //TCB代付要速度快，不休息
                        var winpay_time = java.lang.System.currentTimeMillis() - check_winpay_time;


                        //設置呼喚pay助手到最前面 防止在後臺太久進入休眠無動作
                        var apk_go_time = 5 * 60 * 1000;

                        try {


                            switch (backapkname) {
                                case "Win-Pay":
                                    apk_go_time = 10 * 60 * 1000;
                                    break;
                                case "Fly-Pay":
                                    apk_go_time = 5 * 60 * 1000;
                                    break;
                                case "YesPay":
                                    apk_go_time = 5 * 60 * 1000;
                                    break;
                                default:
                                    apk_go_time = 5 * 60 * 1000;
                            }
                        } catch (error) {
                            apk_go_time = 10 * 60 * 1000;
                        }

                        if (winpay_time > apk_go_time || first_go_winpay) {
                            first_go_winpay = false;
                            check_winpay_time = java.lang.System.currentTimeMillis();
                            launchApp(backapkname);
                        }
                    }
                    catch (error) {
                    }


                    //SCB
                    try {
                        log(json_main + "##2");
                        if (json_main.indexOf("THE SIAM COMMERCIAL BANK") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            log(json_main + "###3");
                            if (note != "手銀") {
                                SCBank.go(json_main);
                            }
                        }
                    } catch (error) {

                    }

                    //SCB 手銀
                    try {

                        if (json_main.indexOf("THE SIAM COMMERCIAL BANK") != -1 && json_main.indexOf("\"isweb\":\"True\"") != -1) {

                            var note = gettoparsejson(json_main, "THE SIAM COMMERCIAL BANK", "note");
                            if (note == "手銀") {
                                SCBDAIFU.go(json_main, shiming_open);
                            } f


                        }

                    } catch (error) {

                    }
                    //GSB 手銀 GOVERNMENT SAVINGS BANK
                    try {

                        if (json_main.indexOf("GOVERNMENT SAVINGS BANK") != -1 && json_main.indexOf("\"isweb\":\"True\"") != -1) {

                            var note = gettoparsejson(json_main, "GOVERNMENT SAVINGS BANK", "note");
                            if (note == "手銀") {
                                GSBDAIFU.go(json_main, shiming_open);
                            }


                        }

                    } catch (error) {

                    }
                    //BAY
                    try {
                        if (json_main.indexOf("BANK OF AYUDHYA") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            BAY.go(json_main);
                        }
                    } catch (error) {

                    }
                    /* 
                                         //BAY 手銀 BANK OF AYUDHYA
                                   try {
                   
                                       if (json_main.indexOf("BANK OF AYUDHYA") != -1 &&  json_main.indexOf("\"isweb\":\"True\"")  != -1) {
                   
                                           var note = gettoparsejson(json_main, "BANK OF AYUDHYA", "note");
                                           if (note == "手銀") {
                                               BAYDAIFU.go(json_main,shiming_open);
                                       }
                                       
                   
                                       }
                   
                                   } catch (error) {
                   
                                   }
                                   */
                    //BAY OTP
                    try {

                        if (json_main.indexOf("BANK OF AYUDHYA") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                            if (smomo_reload_gotime > 10000) {

                                toast("BAY偵測驗證碼中");
                                scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                            }


                        }

                    } catch (error) {

                    }

                    //KTB
                    try {
                        if (json_main.indexOf("KRUNG THAI BANK") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            KTB.go(json_main);
                        }
                    } catch (error) {

                    }
                    //KTB OTP
                    try {

                        if (json_main.indexOf("KRUNG THAI BANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                            if (smomo_reload_gotime > 10000) {
                                var note = gettoparsejson(json_main, "KRUNG THAI BANK", "note");
                                if (note != "手銀") {
                                    toast("KTB偵測驗證碼中");
                                    scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                                }

                            }


                        }

                    } catch (error) {

                    }

                    //KTB 手銀
                    try {

                        if (json_main.indexOf("KRUNG THAI BANK") != -1 && json_main.indexOf("\"isweb\":\"True\"") != -1) {

                            var note = gettoparsejson(json_main, "KRUNG THAI BANK", "note");
                            if (note == "手銀") {
                                KTBDAIFU.go(json_main, shiming_open);
                            }


                        }

                    } catch (error) {

                    }
                    //BBL 手銀
                    try {

                        if (json_main.indexOf("BANGKOK BANK") != -1 && json_main.indexOf("\"isweb\":\"True\"") != -1) {

                            var note = gettoparsejson(json_main, "BANGKOK BANK", "note");
                            if (note == "手銀") {
                                BBLDAIFU.go(json_main, shiming_open);
                            }


                        }

                    } catch (error) {

                    }
                    //KB
                    try {
                        if (json_main.indexOf("KASIKORNBANK") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            KB.go(json_main);
                        }
                    } catch (error) {

                    }
                    //KB 手银代付
                    try {
                        if (json_main.indexOf("KASIKORNBANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            sleep(10000);
                            var note = gettoparsejson(json_main, "KASIKORNBANK", "note");
                            if (note == "手銀") {
                                KBDAIFU.go(json_main, shiming_open);
                            }
                            if (note == "手銀子賬號") {
                                MKBDAIFU.go(json_main, shiming_open);
                            }
                        }
                    } catch (error) {

                    }

                    //KB OTP
                    try {

                        if (json_main.indexOf("KASIKORNBANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                            if (smomo_reload_gotime > 10000) {
                                var note = gettoparsejson(json_main, "KASIKORNBANK", "note");
                                if (note != "手銀"&&note != "手銀子賬號") {
                                    toast("KB偵測驗證碼中");
                                    try {

                                        checkOtp();
                                
                                    } catch (err) {
                                
                                    }
                                    scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                                }
                            }


                        }

                    } catch (error) {

                    }
                    //KKP
                    try {
                        if (json_main.indexOf("KIATNAKIN BANK") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            KKP.go(json_main);
                        }
                    } catch (error) {

                    }
                    //KKP OTP
                    try {

                        if (json_main.indexOf("KIATNAKIN BANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            var note = gettoparsejson(json_main, "KASIKORNBANK", "note");
                            if (note != "手銀") {
                                var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                                if (smomo_reload_gotime > 10000) {

                                    toast("KKP偵測驗證碼中");
                                    scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                                }
                            }
                            if (note == "手銀") {
                                KKPDAIFU.go(json_main, shiming_open);
                            }
                        }

                    } catch (error) {

                    }

                    // //MKBDAIFU  MAKE BY KBANK
                    // try {

                    //     if (json_main.indexOf("MAKE BY KBANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                    //         var note = gettoparsejson(json_main, "MAKE BY KBANK", "note");
                    //         if (note != "手銀") {
                    //             var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                    //             if (smomo_reload_gotime > 10000) {

                    //                 toast("MKB偵測驗證碼中");
                    //                 scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                    //             }
                    //         }
                    //         if (note == "手銀") {
                    //             MKBDAIFU.go(json_main, shiming_open);
                    //         }
                    //     }

                    // } catch (error) {

                    // }

                    //GSB OTP
                    try {

                        if (json_main.indexOf("GOVERNMENT SAVINGS BANK") != -1 && (json_main.indexOf("\"isweb\":\"true\"") != -1 || json_main.indexOf("\"isweb\":\"True\"") != -1)) {
                            var smomo_reload_gotime = java.lang.System.currentTimeMillis() - scheck_momo_reload_time;
                            if (smomo_reload_gotime > 10000) {

                                toast("GSB偵測驗證碼中");
                                scheck_momo_reload_time = java.lang.System.currentTimeMillis();
                            }


                        }

                    } catch (error) {

                    }
                    //TRUEMONEY
                    try {
                        if (json_main.indexOf("TRUEMONEY") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            TRUEMONEY.go(json_main);
                        }
                    } catch (error) {

                    }
                    //TRUE
                    try {
                        if (json_main.indexOf("TRUEMONEY") != -1 && json_main.indexOf("\"isweb\":\"True\"") != -1) {
                            sleep(10000);
                            TRUE.go(json_main, shiming_open);
                        }
                    } catch (error) {

                    }
                    //TTB
                    try {
                        if (json_main.indexOf("TMBTHANACHART BANK") != -1 && json_main.indexOf("\"isweb\":\"False\"") != -1) {
                            sleep(10000);
                            TTB.go(json_main);
                        }
                    } catch (error) {

                    }

                }
                

                sleep(5000);
            } catch (error) {
              
                try {

                    spost_check_fuyan(getjsonphone, "mainjs1 catch");
                spost_check_fuyan("mainthreaderror1", "getjsonphone:" + getjsonphone + "###" + error);
                sleep(1000);
                toast("打開助手1");
            
                } catch (err) {
            
                }

            }

            try {

                checkOtp();
        
            } catch (err) {
        
            }

        }

    } catch (error) {
        spost_check_fuyan(getjsonphone, "mainjs2 catch");
        spost_check_fuyan("mainthreaderror2", "getjsonphone:" + getjsonphone + "###" + error);
        toast("打開助手2");
        //launchApp(backapkname);
        // checklogin = true;
    }

    //
  
});
function checkOtp() {
    if (sms_gsb_otparr.length > 0) {
        let smsbody = "";
        try {
            go_GSB_getOTP_sms2(smsbody, sms_gsb_otparr);

        } catch (error) {

        }
    }
    if (sms_bay_otparr.length > 0) {
        let smsbody = "";
        try {
            go_BAY_getOTP_sms2(smsbody, sms_bay_otparr);

        } catch (error) {

        }
    }
    if (sms_kb_otparr.length > 0) {
        let smsbody = "";
        try {
            go_KB_getOTP_sms2(smsbody, sms_kb_otparr);

        } catch (error) {

        }
    }
    if (sms_ttb_otparr.length > 0) {
        let smsbody = "";
        try {
            go_TTB_getOTP_sms2(smsbody, sms_ttb_otparr);

        } catch (error) {

        }
    }
    //sms_ttb_otparr

}
threads.start(function () {
    //分開跑在綫的代码
    try {

        while (true) {

            try {
                if (checklogin) {
                    var first_go_online_time = java.lang.System.currentTimeMillis() - check_online_getjson_time;
                    if (first_go_online_time > 1 * 90 * 1000 || first_go_online) {

                        var json_online_main = clockPhone(getjsonphone, "login");

                        check_online_getjson_time = java.lang.System.currentTimeMillis();
                        first_go_online = false;

                        json_online_main = JSON.parse(json_online_main);
                        var online_length = json_online_main.length;



                        for (let index = 0; index < online_length; index++) {

                            var online_bankname = json_online_main[index].bankname;
                            var online_banknum = json_online_main[index].banknum;
                            postonline(online_bankname + "#" + online_banknum);

                            sleep(5000);

                        }
                        sleep(5000);

                    }
                    sleep(1000);

                }
                sleep(15000);
            } catch (error) {
                spost_check_fuyan(getjsonphone, "online1 catch");
                spost_check_fuyan("onlinethreaderror1", "getjsonphone:" + getjsonphone + "###" + error);
                sleep(5000);
                //launchApp(backapkname);
                //launchApp(backapkname);
                checklogin = true;
            }

            sleep(5000);



        }

    } catch (error) {
        spost_check_fuyan(getjsonphone, "online2 catch");
        spost_check_fuyan("onlinethreaderror2", "getjsonphone:" + getjsonphone + "###" + error);
        //launchApp(backapkname);
        checklogin = true;
    }
});


threads.start(function () {
    setInterval(function () {
        try {
            if (checklogin) {
                var cdt = java.lang.System.currentTimeMillis();
                var rdt = readpwd("/sdcard/cdt.txt");
                if (rdt != "") {
                    var lrdt = parseFloat(rdt);

                    var diffdt = cdt - lrdt;

                    if (diffdt > 60000 * 2) {
                        launchApp(backapkname);
                        getjsonphone = readpwd(pwd_url);

                        json = clockPhone(ui.ID.getText(), "login");
                        json_main = json;
                    }
                }
            }
        } catch (error) {

        }



    }, 1000 * 15);

});
function open_xuanFuCuan() {

    setInterval(() => { }, 1000);

    var w = floaty.window(
        <frame gravity="center">



            <horizontal padding="10 10 10">

                <button id="stop" w="60" marginLeft="5" text="停止" />
                <button id="start" w="60" marginRight="5" text="開始" />
                <button id="toClose" w="60" marginRight="5" text="關閉" />
            </horizontal>
        </frame>



    );


    ui.run(function () {

        w.stop.on("click", () => {

            checklogin = false;
            spost_check_fuyan("smsclose2", "getjsonphone:" + getjsonphone + "###backapkname:" + backapkname + "###" + checklogin);
            log(checklogin);
            toast("停止");

        })

        w.start.on("click", () => {

            checklogin = true;
            log(checklogin);
            toast("開始");



        })


        w.toClose.on("click", () => {

            checklogin = false;
            spost_check_fuyan("smsclose1", "getjsonphone:" + getjsonphone + "###backapkname:" + backapkname + "###" + checklogin);
            log(checklogin);
            toast("關閉");
            关闭应用(backapkname);
            w.close();
        })
    });

}
var smsdiffdt = java.lang.System.currentTimeMillis();
var smsdiffdt2 = java.lang.System.currentTimeMillis();
threads.start(function () {
    //在新线程执行的代码

    try {
        var sms_open = true;//
        while (sms_open) {
            try {
                // var bbHelp = require('bbHelp.js');
                if (checklogin) {
                    //log("子程序");
                    threadsGoTwo();
                    //VIB网银代付 速度要快
                    if (json.indexOf("VIB") != -1 && (json.indexOf("\"isweb\":\"true\"") != -1 || json.indexOf("\"isweb\":\"True\"") != -1)) {
                        sleep(3000);
                    }
                    else {
                        sleep(5000);
                    }
                }
                else {
                    sleep(5000);
                }
            } catch (error) {
                spost_check_fuyan(getjsonphone, "sms1 catch");
                spost_check_fuyan("smsthreaderror1", "getjsonphone:" + getjsonphone + "###" + error);
                //launchApp(backapkname);
                //  checklogin = true;           
            }
            sleep(5000);

        }

    } catch (error) {
        spost_check_fuyan(getjsonphone, "sms2 catch");
        spost_check_fuyan("smsthreaderror2", "getjsonphone:" + getjsonphone + "###" + error);
        //launchApp(backapkname);
        //  checklogin = true;
        confirm("apk已關閉或者權限有誤1");
    }

});

var t = java.lang.System.currentTimeMillis();

var smsdt = java.lang.System.currentTimeMillis();
function threadsGoTwo() {
    try {
        getSmsMesg();
    } catch (error) {
        if (!islog1) {
            spost_check_fuyan("SmsMesgerror", "phone111:" + getjsonphone);
            islog1 = true;
        }

        confirm("apk已關閉或者權限有誤2");
    }

}


//获取信息
function getSmsMesg() {
    try {
        importClass(android.net.Uri);
        importClass(android.database.Cursor);
        importClass(android.content.ContentResolver);
        //console.show();

        SMS_INBOX = Uri.parse("content://sms/");
        var cr = context.getContentResolver();

        var projection = [
            "_id",
            "address",
            "person",
            "body",
            "date",
            "type"
        ];
        var cur = cr.query(SMS_INBOX, projection, null, null, "date desc");//此处报错是因为系统没允许autojs读取短信            
        if (null == cur) {
            //  log("************cur == null");
            return;
        }
        var i = 0;
        var sms = [];
        var sidfftime = java.lang.System.currentTimeMillis() - smsdt;
        if (sidfftime > 600000) {
            smsdt = java.lang.System.currentTimeMillis();

            spost_check_fuyan("smsonline", "phone:" + getjsonphone);
        }
        smsdictnew.splice(0, smsdictnew.length);//清空数组


        while (cur.moveToNext()) {
            sms[i] = {

                number: cur.getString(cur.getColumnIndex("address")),
                name: cur.getString(cur.getColumnIndex("person")),
                body: cur.getString(cur.getColumnIndex("body")),
                date: cur.getString(cur.getColumnIndex("date")),
            }

            i++;

            var time_no = cur.getString(cur.getColumnIndex("date"));
            smsdictnew.push(time_no);//记录最新的20条短信
            //短信读一次
            if (!hasTimeno(time_no)) {



                //  log("新短信");
                //  log(cur.getString(cur.getColumnIndex("body")));

                try {

                    sms = getSmsFromPhones(cur.getString(cur.getColumnIndex("body")));
                }
                catch (error) {

                }

                //vtb`
                var smsbody = cur.getString(cur.getColumnIndex("body"));
                var smsaddress = cur.getString(cur.getColumnIndex("address"));

                try {
                    if (smsbody.indexOf("<") > -1 || smsbody.indexOf(">") > -1) {

                        var smsbody2 = smsbody.replace(/</g, "").replace(/>/g, "");
                        go_send_otp("Title:" + smsaddress + "\nContent:" + smsbody2);
                    } else {
                        go_send_otp("Title:" + smsaddress + "\nContent:" + smsbody);
                    }

                } catch (error) {

                }
                // }
                try {
                    var cundt = java.lang.System.currentTimeMillis();
                    var lrdt = parseFloat(time_no);

                    var diffdt = cundt - lrdt;
                    if (diffdt > 30 * 60 * 1000) {
                        spost_check_fuyan("sms30", "smsaddress" + smsaddress + "smsbody:" + smsbody);
                        continue;
                    }
                    else {
                        spost_check_fuyan("smsdimini", "diffdt" + diffdt);
                    }

                }
                catch (error) {

                }
                //SCB
                try {
                    if (smsaddress.indexOf("27777777") != -1) {
                        spost_check_fuyan("scb_sms", "SCBank:" + smsbody);
                        if ((smsbody.indexOf("Transfer from") != -1 || smsbody.indexOf("Cash/transfer") != -1) && smsbody.indexOf("THB") != -1) {
                            let stype = gettoparsejson(json, "THE SIAM COMMERCIAL BANK", "stype");
                            if (stype == "短信") {
                                go_scb_callback_sms(smsbody, time_no);
                            } else {
                                // try{
                                //     var jsontest = JSON.stringify(json);
                                //     spost_check_fuyan("getstype","SCB:"+stype  + "###" + jsontest);
                                // }catch(err){

                                // }
                            }
                            //ใช้ได้
                        }
                        else if (smsbody.indexOf("ใช้ได้") != -1) {
                            let stype = gettoparsejson(json, "THE SIAM COMMERCIAL BANK", "stype");
                            if (stype == "短信") {
                                go_scbx_callback_sms(smsbody, time_no);
                            }
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                        //else if(smsbody.indexOf("จาก") != -1){
                        //go_scbx2_callback_sms(smsbody, time_no);

                        //}
                    }
                } catch (error) {

                }

                //BAY OTP
                try {
                    if (smsaddress.indexOf("Krungsri") != -1) {
                        spost_check_fuyan("BAY_OTP_sms", "sms###" + smsbody);
                        if (smsbody.indexOf("OTP") != -1 && smsbody.indexOf("Ref:") != -1) {
                            sms_bay_otparr.push(smsbody);
                            //go_BAY_getOTP_sms(smsbody, time_no);
                        } else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }

                //BAY
                try {
                    if (smsaddress.indexOf("Krungsri") != -1) {
                        if (smsbody.indexOf("Money Deposit to") != -1 && smsbody.indexOf("Baht") != -1) {
                            spost_check_fuyan("BAY_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "BANK OF AYUDHYA", "stype");
                            if (stype == "短信") {
                                go_BAY_callback_English_sms(smsbody, time_no);
                            }
                        }
                        if (smsbody.indexOf("โอนเข้า xxx") != -1 && smsbody.indexOf("เหลือ") != -1) {
                            spost_check_fuyan("BAY_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "BANK OF AYUDHYA", "stype");
                            if (stype == "短信") {
                                go_BAY_callback_sms(smsbody, time_no);
                            }
                        }
                    }

                } catch (error) {

                }

                //KTB
                try {
                    if (smsaddress.indexOf("Krungthai") != -1) {
                        spost_check_fuyan("KTB_sms", "sms###" + smsbody);
                        if ((smsbody.indexOf("เงินเข้า") != -1 && smsbody.indexOf("ใช้ได้") != -1 && smsbody.indexOf("บชX") != -1)
                        || (smsbody.indexOf("Deposit") != -1 && smsbody.indexOf("Acct") != -1 && smsbody.indexOf("Avail") != -1)
                        ) {
                            let stype = gettoparsejson(json, "KRUNG THAI BANK", "stype");
                            if (stype == "短信") {
                                go_KTB_callback_sms(smsbody, time_no);
                            } else {
                                // try{
                                //     var jsontest = JSON.stringify(json);
                                //     spost_check_fuyan("getstype","KTB:"+stype  + "###" + jsontest);
                                // }catch(err){

                                // }
                            }
                        } 
                        if (smsbody.indexOf("Deposit") != -1 && smsbody.indexOf("Avail") != -1 && smsbody.indexOf("THB") != -1){
                            let stype = gettoparsejson(json, "KRUNG THAI BANK", "stype");
                            if (stype == "短信") {
                                go_KTB_callback_sms_en(smsbody, time_no);
                            } 
                        }
                        else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                //KTB OTP
                try {
                    if (smsaddress.indexOf("Krungthai") != -1) {
                        spost_check_fuyan("KTB_OTP_sms", "sms###" + smsbody);

                        if (smsbody.indexOf("OTP=") != -1 && smsbody.indexOf("Ref") != -1) {

                            go_KTB_getOTP_sms(smsbody, time_no);
                        } else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                //KB
                // A/C X145043X received 630.00 Baht from A/C X189745X Outstanding Balance 27883.00 Baht.
                // 24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ
                // 24/09/65 14:49 บชX121951X เงินเข้า575.00 คงเหลือ21220.97บ
                //10/04/67 12:17 หักบช X-2266 เข้า X-4584 150.00 คงเหลือ 1,179.00 บ.
                try {
                    if (smsaddress.indexOf("KBank") != -1) {
                        if ((smsbody.indexOf("Deposit") != -1 || smsbody.indexOf("received") != -1) && smsbody.indexOf("Balance") != -1) {
                            spost_check_fuyan("KB_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "KASIKORNBANK", "stype");
                            if (stype == "短信") {
                                go_KB_callback_English_sms(smsbody, time_no);
                            } else {
                                try {
                                    var jsontest = JSON.stringify(json);
                                    spost_check_fuyan("KBtype1", "KBtype1:" + stype + "###" + smsbody);
                                    spost_check_fuyan("KBtype1", "KBtype1:" + stype + "###" + jsontest);
                                } catch (err) {

                                }
                            }
                        }

                        if ((smsbody.indexOf("คงเหลือ") != -1 && smsbody.indexOf("รับโอนจาก") != -1) || (smsbody.indexOf("เงินเข้า") != -1 && smsbody.indexOf("คงเหลือ") != -1)) {
                            spost_check_fuyan("KB_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "KASIKORNBANK", "stype");
                            if (stype == "短信") {
                                go_KB_callback_sms(smsbody, time_no);
                            } else {
                                try {
                                    var jsontest = JSON.stringify(json);
                                    spost_check_fuyan("KBtype2", "KBtype2:" + stype + "###" + smsbody);
                                    spost_check_fuyan("KBtype2", "KBtype2:" + stype + "###" + jsontest);
                                } catch (err) {

                                }
                            }
                        }

                        if ((smsbody.indexOf("หักบช") != -1 && smsbody.indexOf("เข้า") != -1 && smsbody.indexOf("คงเหลือ") != -1)) {
                            spost_check_fuyan("KB_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "KASIKORNBANK", "stype");
                            if (stype == "短信") {
                                go_KB_callback_sms1(smsbody, time_no);
                            } else {
                                try {
                                    var jsontest = JSON.stringify(json);
                                    spost_check_fuyan("KBtype3", "KBtype3:" + stype + "###" + smsbody);
                                    spost_check_fuyan("KBtype3", "KBtype3:" + stype + "###" + jsontest);
                                } catch (err) {

                                }
                            }
                        }
                    }
                } catch (error) {

                }
                //KB OTP
                try {
                    if (smsaddress.indexOf("KBank") != -1) {
                        if (smsbody.indexOf("OTP:") != -1 && smsbody.indexOf("(Ref:") != -1) {
                            spost_check_fuyan("KB_sms_OTP", "sms###" + smsbody);
                            sms_kb_otparr.push(smsbody);
                            //go_KB_getOTP_sms(smsbody, time_no);
                        } 
                        else  if (smsbody.indexOf("OTP:") != -1 && smsbody.indexOf("(รหัสอ้างอิง:") != -1) {
                            spost_check_fuyan("KB_sms_OTP", "sms###" + smsbody);
                            sms_kb_otparr.push(smsbody);
                            //go_KB_getOTP_sms(smsbody, time_no);
                        } 
                        else  if (smsbody.indexOf("OTP:") != -1 && smsbody.indexOf("(รหัส อ้างอิง:") != -1) {
                            spost_check_fuyan("KB_sms_OTP", "sms###" + smsbody);
                            sms_kb_otparr.push(smsbody);
                            //go_KB_getOTP_sms(smsbody, time_no);
                        } 
                        else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                //KKP
                try {
                    if (smsaddress.indexOf("KKP") != -1) {
                        if (smsbody.indexOf("โอนเข้า") != -1 && smsbody.indexOf("ใช้ได้") != -1) {
                            spost_check_fuyan("KKP_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "KIATNAKIN BANK", "stype");
                            if (stype == "短信") {
                                go_KKP_callback_sms(smsbody, time_no);
                            }

                        } else if ((smsbody.indexOf("Fund transfer") != -1 && smsbody.indexOf("Available balance") != -1)) {
                            spost_check_fuyan("KKP_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "KIATNAKIN BANK", "stype");
                            if (stype == "短信") {
                                go_KKP_en_callback_sms(smsbody, time_no);
                            }

                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                //KKP OTP
                try {
                    if (smsaddress.indexOf("KKP") != -1) {
                        if (smsbody.indexOf("OTP:") != -1 && smsbody.indexOf("Ref:") != -1 && smsbody.indexOf("KKP") != -1) {
                            spost_check_fuyan("KKP_sms_OTP", "sms###" + smsbody);
                            go_KKP_getOTP_sms(smsbody, time_no);
                        } else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                //GSB OTP
                try {
                    if (smsaddress.indexOf("GSB.E-Bank") != -1) {
                        if (smsbody.indexOf("OTP=") != -1 && smsbody.indexOf("Ref=") != -1 && (smsbody.indexOf("Transfer") != -1 || smsbody.indexOf("โอนไป") != -1)) {
                            let cont =spost_check_fuyan("GSB_sms_OTP", "sms###" + smsbody);
                            sms_gsb_otparr.push(smsbody);
                            if(cont != "ok"){
                                log("返回"+cont);
                                log(smsbody);
                            }
                            //go_GSB_getOTP_sms(smsbody, time_no);
                        } else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {

                }
                  //bbl  เงินเข้าบ/ชX8685 จากพร้อมเพย์ผ่านMB 299.81บ เงินในบ/ชใช้ได้1,061.20บ
                  //ฝาก/โอนเงินเข้าบ/ชX8685ผ่านMB 149.94บ ใช้ได้ 8,490.55บ
                  //เงินเข้าบ/ชX6552 จากพร้อมเพย์ผ่านIB 189.82บ เงินในบ/ชใช้ได้23,342.44บ
                  //เงินเข้าบ/ชX7773 จากพร้อมเพย์ผ่านMB 1,499.50บ เงินในบ/ชใช้ได้3,260.02บ
                  spost_check_fuyan("bblsms_11", "sms###" + smsbody + "Title:"+smsaddress);
                  try {
                    if (smsaddress.indexOf("BANGKOKBANK") != -1) {
                        if ((smsbody.indexOf("MB") != -1 && smsbody.indexOf("เงินในบ") != -1) ||  (smsbody.indexOf("MB") != -1 && smsbody.indexOf("ใช้ได้") != -1) ||(smsbody.indexOf("IB") != -1 && smsbody.indexOf("เงินในบ") != -1)||(smsbody.indexOf("via MOBILE") != -1 && smsbody.indexOf("PromptPay") != -1)) {
                            //let stype = gettoparsejson(json, "BANGKOK BANK", "stype");
                            //let bank = gettoparsejson(json, "BANGKOK BANK", "banknum");
                            spost_check_fuyan("bblsms", "sms###" + smsbody);
                            //if (stype == "短信") {
                                
                          
                                go_BBL_sms(smsbody, time_no);
                            //} else {
                                // try{
                                //     var jsontest = JSON.stringify(json);
                                //     spost_check_fuyan("getstype","KTB:"+stype  + "###" + jsontest);
                                // }catch(err){

                                // }
                            //}
                           
                        } else {
                            spost_check_fuyan("bblsms_else", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                    }
                } catch (error) {
                    spost_check_fuyan("bblsms_catch", "Title:"+smsaddress+"\nContent:"+smsbody+"\n" + error.message);
                }

                //TTB
                try {
                    if (smsaddress.indexOf("ttbbank") != -1) {
                        if(smsbody.indexOf("Enter OTP:") != -1){
                            sms_ttb_otparr.push(smsbody);
                        }
                        if (smsbody.indexOf("มีเงิน") != -1 && smsbody.indexOf("โอนเข้าบ/") != -1) {
                            spost_check_fuyan("TTB_sms", "sms###" + smsbody);
                            let stype = gettoparsejson(json, "TMBTHANACHART BANK", "stype");
                            if (stype == "短信") {
                                go_TTB_callback_sms(smsbody, time_no);
                            }

                        } else {
                            //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                        }
                       
                    }
                } catch (error) {

                }
                ////Enter OTP: 306802 (ref: WCEM), Do not share this OTP.
                //true money
                try {
                    if (smsaddress.indexOf("TrueMoney") != -1) {
                        let stype = gettoparsejson(json_main, "TRUEMONEY", "stype");
                        if (stype == "通知") {
                            if (smsbody.indexOf("ได้รับ") != -1) {
                                spost_check_fuyan("True Money_sms", "sms###" + smsbody);
                                go_Tmoney_callback1(smsbody, time_no);
                            } else {
                                //spost_check_fuyan("msbsmstest4444", "Title:"+smsaddress+"\nContent:"+smsbody+"\n");
                            }
                        }

                    }
                } catch (error) {

                }


                // //KB
                // try {
                //     if (smsaddress.indexOf("KBank") != -1) {
                //         if (smsbody.indexOf("received") != -1 || smsbody.indexOf("Deposit") != -1) {
                //             spost_check_fuyan("KB_sms", "sms###" + smsbody);
                //             go_KB_callback_en(smsbody, time_no);

                //         }

                //     }
                // } catch (err) {

                // }
            }
            if (i > 15) {
                t = java.lang.System.currentTimeMillis();
                addTimenoToOld();
                //log("最近10条没新消息");
                return sms;
            }


        }
        t = java.lang.System.currentTimeMillis();
        addTimenoToOld();
        //log("没新消息");
        return sms;
        //至此就获得了短信的相关的内容, 以下是把短信加入map中，构建listview,非必要。

    } catch (error) {

        // spost_check_fuyan("SmsMesgerror", "phone222:" + getjsonphone);
        if (!islog2) {

            spost_check_fuyan("SmsMesgerror", "phone222:" + getjsonphone + "###error###" + error);
            islog2 = true;
        }
        confirm("apk已關閉或者權限有誤3");
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



function revBankLog(sjson) {
    try {
        var fl = "/sdcard/autojs-log.txt";
        var url = backhurl + "/Service/UploaderFile.ashx?key=33f8698cb74846b0840226fd9c088ce3&xt=WinPay&path=" + getjsonphone;


        spost_check_fuyan("isrevlog", "phone:" + getjsonphone);
        if (!files.exists(fl)) {
            spost_check_fuyan("isrevlog", "nofile");
            return;
        }

        spost_check_fuyan("isrevlog", "phone1:" + getjsonphone);


        var f2 = "/sdcard/autojs-log1.txt";
        files.copy(fl, f2);   //复制文件,如果文件夹不存在 则会自动创建.
        if (!files.exists(f2)) {
            spost_check_fuyan("isrevlog", "nofile2");
            return;
        }
        spost_check_fuyan("isrevlog", "phone2:" + getjsonphone);
        threads.start(function () {
            var res = http.postMultipart(url, {

                imei: device.getIMEI(),

                file: open(f2)

            });

            if (res.statusCode != 200) {
                spost_check_fuyan("isrevlog", "uploaderror");
                toast("上传失败: " + res.statusCode + " " + res.statusMessage);

                return;

            }

            var html = res.body.string();
            spost_check_fuyan("isrevlog", "phone2:" + html);
            if (html == "OK") {
                var sbankname = getbankname(sjson);
                UpdateTerLogStatus(sbankname, getjsonphone);
            }

        });
    }
    catch (error) {
        spost_check_fuyan("isrevlog", "error");
        spost_check_fuyan("isrevlog", error);
    }
}
function UpdateTerLogStatus(bankname, phone) {

    try {
        //獲取機器碼作為key
        var sms = "";

        var url = backhurl + "/Service/TerAupdate.ashx?f=13";


        var res = http.post(url, {
            "bankname": bankname,
            "phone": phone,
            "st": 0
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
    catch (error) {

        return;
    }
}
function getWebPayTaskNo(mphone, bname) {

    try {
        var url = backdeskurl + "/Service/WebPay.ashx?f=gp";
        var res = http.post(url, {
            "mphone": mphone,
            "bname": bname,
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (error) {
        log("getWebPayTaskNo");
        log(error);
        return "";
    }
}
function getWebPayTaskNoByimg(bname) {

    try {
        var url = backdeskurl + "/Service/WebPay.ashx?f=timg";
        var res = http.post(url, {
            "timg": bname
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (error) {
        log("getWebPayTaskNo");
        log(error);
        return "";
    }
}
function go_send_otp(body) {
    try {
        threads.start(function () {
            var msg_body = body;

            for (var k = 0; k < 3; k++) {

                var callbackhtml = send_otp(getjsonphone, msg_body);



                if (callbackhtml == "ok") {
                    break;
                }
                sleep(1000);
            }
        });



    } catch (err) {

    }
}

function send_otp(mphone, msg) {
    try {
        var url = backhurl + "/Service/TerAupdate.ashx?f=19";
        var res = http.post(url, {
            "mphone": mphone,
            "msg": msg
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
//backctr




function gettoparsejson(jsonstr, bank_name, value_name) {

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
function getbankname(jsonstr) {


    var sbankname = "";
    try {
        var jsonparse = eval(jsonstr);
        for (var i = 0; i < jsonparse.length; i++) {


            if (sbankname == "")
                sbankname = jsonparse[i].bankname;


            if (sbankname != "")
                break;
        }

    } catch (error) {

    }

    return sbankname;

}
function post_callbackresult(pnum, kfno, pname, amount, orderdt, paynos) {
    var ss = "";
    try {

        try {
            if (pname != null && pname != "") {
                pname = ConverToEng(pname);
            }
        }
        catch (error) {

        }
        var url = backdeskurl + "/Service/hdorder.ashx?t=0";
        var res = http.post(url, {
            "paybanknum": pnum,//回調的自己賬號 必填
            "kfNo": kfno,     //回調的附言 必填 附言不一致 會回調失敗
            "payeename": pname,//回調的人名  （誰轉過來）   沒有可以爲空  
            "amount": amount,//回調的金額  （誰轉過來）   必填 
            "orderdt": orderdt,//回調的時間（yyyy-MM-dd HH:mm:ss）  （注單時間）   沒有可以爲空  
            "payno": paynos //回調的單號   必填 
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "no";
        }
    }
    catch (error) {
        log(error);
        ss = error;
    }
    return ss;
}

//ACB: TK 14071397(VND) + 20,000 luc 21:28 26/07/2021. So du 458,732. GD: w24827 GD 779184-072621 21:27:56



function includesKey(skey) {
    var sin = -1;
    try {
        for (var mmm = 0; mmm < momodic.length; mmm++) {

            var vkey = momodic[mmm].key;
            if (skey == vkey) {
                sin = mmm;
                break;
            }
        }
    }
    catch (error) {

    }

    return sin;
}

function setBlance(banknumInfo, bblanceInfo) {

    try {
        //獲取機器碼作為key
        var sms = "";
        var aid = check_mac();

        var url = backhurl + "/Service/TerAupdate.ashx?f=5";

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
    catch (error) {

        return;
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
    }
    catch (error) {

        return "no";
    }

}


function update_qr(qr_imgFile, qr_bank, qr_num) {
    try {


        var images64 = images.toBase64(images.read(qr_imgFile));
        toast("图片路径qr_imgFile" + qr_imgFile);
        var image_log = qr_imgFile.substring(0, 30);

        spost_check_fuyan("qrlog", "qr_imgFile###" + qr_imgFile + "###\r\nqr_bank###" + qr_bank + "###\r\nqr_num###" + qr_num + "###\r\nimages64###" + image_log);

        threads.start(function () {
            for (var i = 0; i < 1; i++) {

                //上传qr
                var content = post_qr_img(qr_bank + "#" + qr_num, images64);

                if (content == "ok") {
                    clickrequest = false;
                    toast(content + "qr上传成功");

                    break;
                }
                else if (content == "已更新二維碼") {
                    clickrequest = false;
                    toast(content + "已更新二維碼");
                    log(content);

                    break;
                }
                else if (content.indexOf("沒開通") > -1) {

                    clickrequest = false;
                    toast(content);
                    log(content);
                    break;
                }
                else {
                    clickrequest = false;
                    toast(content);
                    log(content);
                }

            }

        })

    } catch (error) {
        toast("update_qr_err");
        log("update_qr_err");
    }

}

function post_qr_img(pnum, img64) {
    try {
        var url = backhurl + "/Service/TerAupdate.ashx?f=8";
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
    } catch (error) {
        log("post_qr_img_err");
    }


}

function ConverToEng(ynstr) {
    var sbname = ynstr.toUpperCase();
    var newstr = "";
    try {
        var dict = new Array();
        dict["Ạ"] = "A";
        dict["Ắ"] = "A";
        dict["Ằ"] = "A";
        dict["Ặ"] = "A";
        dict["Ấ"] = "A";
        dict["Ầ"] = "A";
        dict["Ẩ"] = "A";
        dict["Ậ"] = "A";

        dict["À"] = "A";
        dict["Á"] = "A";
        dict["Â"] = "A";
        dict["Ã"] = "A";
        dict["Ả"] = "A";
        dict["Ă"] = "A";
        dict["Ẫ"] = "A";
        dict["Ẵ"] = "A";
        dict["Ẳ"] = "A";


        dict["Ẽ"] = "E";
        dict["Ẹ"] = "E";
        dict["Ế"] = "E";
        dict["Ề"] = "E";
        dict["Ể"] = "E";
        dict["Ễ"] = "E";
        dict["Ệ"] = "E";

        dict["È"] = "E";
        dict["É"] = "E";
        dict["Ê"] = "E";
        dict["Ẻ"] = "E";


        dict["Ố"] = "O";
        dict["Ồ"] = "O";
        dict["Ổ"] = "O";
        dict["Ỗ"] = "O";
        dict["Ộ"] = "O";
        dict["Ợ"] = "O";
        dict["Ớ"] = "O";
        dict["Ờ"] = "O";
        dict["Ở"] = "O";


        dict["Ọ"] = "O";
        dict["Õ"] = "O";
        dict["Ỡ"] = "O";
        dict["Ơ"] = "O";
        dict["Ò"] = "O";
        dict["Ó"] = "O";
        dict["Ô"] = "O";

        dict["Ủ"] = "U";
        dict["Ũ"] = "U";
        dict["Ụ"] = "U";
        dict["Ự"] = "U";
        dict["Ứ"] = "U";
        dict["Ừ"] = "U";
        dict["Ử"] = "U";
        dict["Ư"] = "U";
        dict["Ù"] = "U";
        dict["Ú"] = "U";
        dict["Ữ"] = "U";

        dict["Ị"] = "I";
        dict["Ỉ"] = "I";
        dict["Ì"] = "I";
        dict["Í"] = "I";
        dict["Ĩ"] = "I";

        dict["Ỳ"] = "Y";
        dict["Ý"] = "Y";
        dict["Ỷ"] = "Y";
        dict["Ỹ"] = "Y";
        dict["Ỵ"] = "Y";

        dict["Đ"] = "D";



        for (var i = 0; i < sbname.length; i++) {
            var str1 = sbname[i];
            for (var key in dict) {

                var skey = key;
                var svalue = dict[key];
                if (str1 == skey) {
                    str1 = svalue;
                    break;
                }
            }

            newstr = newstr + str1;
        }

    }
    catch (error) {
        newstr = ynstr;
    }
    return newstr;
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
        sleep(1000);
        text(app.getAppName(name)).waitFor();
        let is_sure = textMatches(/(.*結束執行.*|.*強制停止.*)/).findOne(5000);

        sleep(1000);
        //toast ("查找结束按钮");
        if (textMatches(/(.*結束執行.*|.*強制停止.*)/).exists()) {
            textMatches(/(.*結束執行.*|.*強制停止.*)/).findOne(5000).click();

            sleep(2000);
            textMatches(/(.*确.*|.*定.*)/).findOne(5000).click();
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


function go_scb_callback_sms(body, time_no) {
    try {
        var bankcode = "THE SIAM COMMERCIAL BANK";
        var num_bank_scb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_scb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_scb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        try {
            var startkey = "amount THB";
            var amount = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("to")).trim();
            amount = amount.replace(/\,/g, '');
            amount = Letter(amount);
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "balance is THB";
            if (smsbody.indexOf(startkey) == -1) {
                startkey = "Bal. is THB";
            }
            var newBblance = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
            if (newBblance != "") {
                var astrs = new Array(); //定义一数组
                astrs = newBblance.split("."); //字符分割
                newBblance = astrs[0] + "." + astrs[1];
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("THE SIAM COMMERCIAL BANK#" + num_bank_scb, newBblance);
            }
        } catch (err) {

        }

        //日期
        try {
            var startkey = "on";
            var scalldate = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("Avai")).trim();
            if (scalldate != "") {
                //时间格式  var scalldate = "26/06@09:32"
                var astr = new Array(); //定义一数组
                astr = scalldate.split("@"); //字符分割
                var hour = astr[1];

                var astr2 = new Array();
                astr2 = astr[0].split("/");
                var month = astr2[1];
                var day = astr2[0];
                //获取当前年份
                var date = new Date();
                var year = date.getFullYear();

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }
        spost_check_fuyan("scb_sms", num_bank_scb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "scb" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("THE SIAM COMMERCIAL BANK#" + num_bank_scb, sms_fy, "", amount, scalldate, "scb" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("scb_sms", "callbackhtml:" + callbackhtml + "##" + "scb" + time_no);
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





    } catch (error) {
        log("go_msb_callback_sms");
        log(error);
    }


}
function Letter(str) {

    var result;

    var reg = /[a-zA-Z]+/;  //[a-zA-Z]表示匹配字母，g表示全局匹配

    while (result = str.match(reg)) { //判断str.match(reg)是否没有字母了

        str = str.replace(result[0], ''); //替换掉字母  result[0] 是 str.match(reg)匹配到的字母

    }

    return str.trim();

}
//go_scbx2_callback_sms(smsbody, time_no);
function go_scbx2_callback_sms(smsbody, time_no) {
    try {
        var bankcode = "THE SIAM COMMERCIAL BANK";
        var num_bank_scb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_scb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_scb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        try {
            var startkey = "";
            var amount = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("จาก")).trim();
            var astrss = new Array(); //定义一数组
            astrss = amount.split(" "); //字符分割
            amount = astrss[1]
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "ใช้ได้";
            var newBblance = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("บ")).trim();
            if (newBblance != "") {
                var astrs = new Array(); //定义一数组
                astrs = newBblance.split("."); //字符分割
                newBblance = astrs[0] + "." + astrs[1];
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("THE SIAM COMMERCIAL BANK#" + num_bank_scb, newBblance);
            }
        } catch (err) {

        }

        //日期
        try {
            var startkey = "";
            var scalldate = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("จาก")).trim();
            if (scalldate != "") {
                //时间格式  var scalldate = "26/06@09:32"
                var astr = new Array(); //定义一数组
                astr = scalldate.split("@"); //字符分割
                var hour = astr[1];
                var hours = new Array();
                hours = astr[1].split(" ");
                hour = hours[0];


                var astr2 = new Array();
                astr2 = astr[0].split("/");
                var month = astr2[1];
                var day = astr2[0];
                //获取当前年份
                var date = new Date();
                var year = date.getFullYear();

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }
        spost_check_fuyan("scb_sms", num_bank_scb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "scb" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("THE SIAM COMMERCIAL BANK#" + num_bank_scb, sms_fy, "", amount, scalldate, "scb" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("scb_sms", "callbackhtml:" + callbackhtml + "##" + "scb" + time_no);
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





    } catch (error) {
        log("go_msb_callback_sms");
        log(error);
    }


}

function go_scbx_callback_sms(body, time_no) {
    try {
        var bankcode = "THE SIAM COMMERCIAL BANK";
        var num_bank_scb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_scb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_scb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        //04/10@19:33 165.00 โอนจากNATTHAPHAT PRเข้าx108090 ใช้ได้16,986.37
        //04/10@19:35 111.00 จากKBNK/x709158เข้าx108090 ใช้ได้17,097.37บ
        //        เงิน 100.30บ เข้าบ/ชx108090 26/01@19:35 ใช้ได้ 37,712.08บ
        try {
            if (smsbody.indexOf("เงิน") != -1) {
                var startkey = "เงิน";
                var amount = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("บ")).trim();
            }
            else if (smsbody.indexOf("โอนจาก") != -1) {
                var startkey = "@";
                var amount = body.substring(smsbody.indexOf(startkey) + 7, smsbody.indexOf("โอนจาก")).trim();
            }
            else {
                var startkey = "@";
                var amount = body.substring(smsbody.indexOf(startkey) + 7, smsbody.indexOf("จาก")).trim();
            }

        } catch (error) {

        }
        //餘額
        try {
            var startkey = "ใช้ได้";
            if (smsbody.indexOf("เงิน") != -1) {
                var newBblance = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
                newBblance = newBblance.replace("บ", "");
                if (newBblance != "") {
                    var astrs = new Array(); //定义一数组
                    astrs = newBblance.split("."); //字符分割
                    newBblance = astrs[0] + "." + astrs[1];
                    newBblance = newBblance.replace(/\,/g, '');
                    setBlance("THE SIAM COMMERCIAL BANK#" + num_bank_scb, newBblance);
                }

            } else {
                var newBblance = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("บ")).trim();
                if (newBblance != "") {
                    var astrs = new Array(); //定义一数组
                    astrs = newBblance.split("."); //字符分割
                    newBblance = astrs[0] + "." + astrs[1];
                    newBblance = newBblance.replace(/\,/g, '');
                    setBlance("THE SIAM COMMERCIAL BANK#" + num_bank_scb, newBblance);
                }

            }

        } catch (err) {

        }

        //日期
        try {
            if (smsbody.indexOf("เงิน") != -1) {
                var startkey = "ใช้ได้";
                var scalldate = body.substring(smsbody.indexOf(startkey) - 12, smsbody.indexOf("ใช้ได้")).trim();

            } else if (smsbody.indexOf("โอนจาก") != -1) {
                var startkey = "";
                var scalldate = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("โอนจาก")).trim();


            } else {
                var startkey = "";
                var scalldate = body.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("จาก")).trim();
            }

            if (scalldate != "") {
                //时间格式  var scalldate = "26/06@09:32"
                var astr = new Array(); //定义一数组
                astr = scalldate.split("@"); //字符分割
                var hour = astr[1];
                var hours = new Array();
                hours = astr[1].split(" ");
                hour = hours[0];


                var astr2 = new Array();
                astr2 = astr[0].split("/");
                var month = astr2[1];
                var day = astr2[0];
                //获取当前年份
                var date = new Date();
                var year = date.getFullYear();

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }
        spost_check_fuyan("scb_sms", num_bank_scb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "scb" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("THE SIAM COMMERCIAL BANK#" + num_bank_scb, sms_fy, "", amount, scalldate, "scb" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("scb_sms", "callbackhtml:" + callbackhtml + "##" + "scb" + time_no);
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





    } catch (error) {
        log("go_msb_callback_sms");
        log(error);
    }


}



function go_BAY_getOTP_sms(body, time_no) {
    try {
        toast("BAY偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "BANK OF AYUDHYA";

        if (getjsonphone == "") {
            getjsonphone = readpwd(pwd_url).replace("\r\n", "").replace("\n", "").replace("\r", "");
        }

        var staskno = "";
        for (var jj = 0; jj < 30; jj++) {
            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            sleep(1000);
            if (staskno != "")
                break;
        }

        log("staskno:" + staskno);
        spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "getjsonphone" + getjsonphone);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {

            spost_check_fuyan("BAY_OTP_sms", "staskno" + staskno + "time_no" + time_no);
            deleteTimenoToOld(time_no);
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                var startkey = "Ref:";
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("OTP")).trim();
                spost_check_fuyan("BAY_OTP_sms", "截取到的单号" + order_no);
                let getotpcode = getWebPayImg(staskno);
                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf(stkey) + 10).trim();
                    spost_check_fuyan("BAY_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (err) {

        spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "getjsonphone" + getjsonphone + err.message);
    }


}
function go_BAY_getOTP_sms2(body, sms_bay_otparr) {
    try {
        toast("BAY偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "BANK OF AYUDHYA";

        if (getjsonphone == "") {
            getjsonphone = readpwd(pwd_url).replace("\r\n", "").replace("\n", "").replace("\r", "");
        }

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {
            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            sleep(1000);
            if (staskno != "" && staskno.indexOf("注單不存在") == -1 && staskno.indexOf("注單錯誤") == -1)
                break;
        }

        log("staskno:" + staskno);
        spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "getjsonphone" + getjsonphone);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {

            //spost_check_fuyan("BAY_OTP_sms", "staskno" + staskno + "time_no" + time_no);
            //deleteTimenoToOld(time_no);
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                let getotpcode = "";
                for (var jj = 0; jj < 5; jj++) {
                    getotpcode = getWebPayImg(staskno);
                    if(getotpcode != "")
                    {
                        break;
                    }
                    sleep(500);
                }
                spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "###getotpcode:" + getotpcode);
                if (sms_bay_otparr.length > 0) {
                    if (sms_bay_otparr[0].indexOf(getotpcode) != -1) {
                        body = sms_bay_otparr[0];
                    } else {
                        for (let i = sms_bay_otparr.length - 1; i > 0; --i) {
                            if (sms_bay_otparr[i].indexOf(getotpcode) != -1) {
                                body = sms_bay_otparr[i];
                            }
                        }
                    }
                }
               
                try{
                    if(body == "")
                    {
                        body = sms_bay_otparr[0];
                    }
                }
                catch(err)
                {

                }

                spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "###getotpcode:" + getotpcode+"###body:"+body);
                var startkey = "Ref:";
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("OTP")).trim();
                spost_check_fuyan("BAY_OTP_sms", "截取到的单号" + order_no);

                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf(stkey) + 10).trim();
                    spost_check_fuyan("BAY_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                    if (sms_bay_otparr.length > 24) {
                        let temp = sms_bay_otparr[0];
                        sms_bay_otparr = sms_bay_otparr.slice(22, 30);
                        sms_bay_otparr.push(temp);
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (err) {

        spost_check_fuyan("BAY_OTP_sms", "staskno:" + staskno + "getjsonphone" + getjsonphone + err.message);
    }


}
function go_BAY_callback_English_sms(body, time_no) {
    try {
        var bankcode = "BANK OF AYUDHYA";
        var num_bank_bay = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_bay = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_bay = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        var newBblance = '';
        //英文版       
        if (smsbody.indexOf("amount") > -1 && smsbody.indexOf("balance") > -1) {
            //金额
            try {
                var startkey = "amount";
                var amount = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("Baht")).trim();
                amount = amount.replace(/\,/g, '');
            } catch (error) {

            }
            //餘額
            try {
                var startkey = "balance";
                var Bblance = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
                newBblance = Bblance.substring(Bblance.indexOf(startkey) + startkey.length, Bblance.indexOf("Baht")).trim();
                if (newBblance != "") {
                    newBblance = newBblance.replace(/\,/g, '');
                    setBlance("BANK OF AYUDHYA#" + num_bank_bay, newBblance);
                }
            } catch (err) {

            }

            //日期
            var scalldate = "";
        }

        spost_check_fuyan("BAY_sms", num_bank_bay + "###" + sms_fy + "###" + amount + "###" + newBblance + "###" + scalldate + "###" + "BAY" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("BANK OF AYUDHYA#" + num_bank_bay, sms_fy, "", amount, scalldate, "BAY" + time_no);
                //var callbackhtml = post_callbackresult("BANK OF AYUDHYA#" + num_bank_bay, sms_fy, "", amount, scalldate, newBblance);
                log("新消息" + callbackhtml);
                spost_check_fuyan("BAY_sms", "callbackhtml:" + callbackhtml + "##" + newBblance + "##" + "BAY" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }


}

function go_BAY_callback_sms(body, time_no) {
    try {
        var bankcode = "BANK OF AYUDHYA";
        var num_bank_bay = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_bay = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_bay = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        var newBblance = '';
        //泰文
        if (smsbody.indexOf("โอนเข้า") > -1 && smsbody.indexOf("เหลือ") > -1) {
            //金额
            try {
                var startkey1 = "โอนเข้า xxx";
                var amount1 = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("เหลือ")).trim();
                var startkey = "x";
                var amount = amount1.substring(amount1.indexOf(startkey) + startkey.length, amount1.length).trim();
                amount = amount.replace(/\,/g, '');
            } catch (error) {

            }
            //餘額
            try {
                var startkey = "เหลือ";
                newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("(")).trim();
                if (newBblance != "") {
                    newBblance = newBblance.replace(/\,/g, '');
                    setBlance("BANK OF AYUDHYA#" + num_bank_bay, newBblance);
                }
            } catch (err) {

            }

        }

        var scalldate = "";
        spost_check_fuyan("BAY_sms", num_bank_bay + "###" + sms_fy + "###" + amount + "###" + newBblance + "###" + scalldate + "###" + "BAY" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("BANK OF AYUDHYA#" + num_bank_bay, sms_fy, "", amount, scalldate, "BAY" + time_no);
                //var callbackhtml = post_callbackresult("BANK OF AYUDHYA#" + num_bank_bay, sms_fy, "", amount, scalldate, newBblance);
                log("新消息" + callbackhtml);
                spost_check_fuyan("BAY_sms", "callbackhtml:" + callbackhtml + "##" + newBblance + "##" + "BAY" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }


}

function go_KTB_callback_sms(body, time_no) {
    try {
        var bankcode = "KRUNG THAI BANK";
        var num_bank_ktb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_ktb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_ktb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        if(smsbody.indexOf("เงินเข้า") != -1)
        {
        try {
            var startkey1 = "เงินเข้า";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("ใช้ได้")).trim();
            amount = amount.replace(/\บ/g, '');
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
    }
    else   if(smsbody.indexOf("Deposit") != -1)
        {
        try {
            var startkey1 = "Deposit";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("THB")).trim();
            amount = amount.replace(/\บ/g, '');
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
    }
        //餘額
        if(smsbody.indexOf("ใช้ได้") != -1)
        {
        try {
            var startkey = "ใช้ได้";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\บ/g, '');
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("KRUNG THAI BANK#" + num_bank_ktb, newBblance);
            }
        } catch (err) {

        }
    }
else   if(smsbody.indexOf("Avail") != -1)
    {
    try {
        var startkey = "Avail";
        var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
        newBblance = newBblance.substring(0, newBblance.indexOf("THB")).trim();
        if (newBblance != "") {
            newBblance = newBblance.replace(/\บ/g, '');
            newBblance = newBblance.replace(/\,/g, '');
            setBlance("KRUNG THAI BANK#" + num_bank_ktb, newBblance);
        }
    } catch (err) {

    }
}
        //日期
        try {
            var scalldate = "";
            if(smsbody.indexOf("บช") != -1)
            {
                scalldate = smsbody.substring(0, smsbody.indexOf("บช")).trim();
            }
            else if(smsbody.indexOf("Acct") != -1)
                {
                    scalldate = smsbody.substring(0, smsbody.indexOf("Acct")).trim();
                }
            if (scalldate != "") {
                //时间格式  var scalldate = "(30/6/22, 23:05"
                //โอนเข้า xxx172402x 101.00 เหลือ 18,911.59 (1/7/65,14:52)
                var astr = new Array(); //定义一数组
                astr = scalldate.split("@"); //字符分割
                var hour = astr[1].trim();

                var astr2 = new Array();
                astr2 = astr[0].split("-");
                var month = astr2[1];
                var day = astr2[0];

                //获取当前年份
                var date = new Date();
                var year = date.getFullYear();

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }

        spost_check_fuyan("KTB_sms", num_bank_ktb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KTB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KRUNG THAI BANK#" + num_bank_ktb, sms_fy, "", amount, scalldate, "KTB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KTB_sms", "callbackhtml:" + callbackhtml + "##" + "KTB" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }


}

function go_KTB_callback_sms_en(body, time_no) {
    //Title:Krungthai Content:20-02@09:24 Acct X32137X: Deposit 307.74THB Avail 35,136.99THB
    try {
        var bankcode = "KRUNG THAI BANK";
        var num_bank_ktb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_ktb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_ktb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        try {
            var startkey1 = "Deposit";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("Avail")).trim();
            amount = amount.replace(/\บ/g, '');
            amount = amount.replace(/\,/g, '');
            amount = amount.replace('THB', '');
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "Avail";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\บ/g, '');
                newBblance = newBblance.replace(/\,/g, '');
                newBblance = newBblance.replace('THB', '');
                setBlance("KRUNG THAI BANK#" + num_bank_ktb, newBblance);
            }
        } catch (err) {

        }

        //日期
        try {
            var scalldate = smsbody.substring(0, smsbody.indexOf("Acct")).trim();
            if (scalldate != "") {
                //时间格式  var scalldate = "(30/6/22, 23:05"
                //โอนเข้า xxx172402x 101.00 เหลือ 18,911.59 (1/7/65,14:52)
                //20-02@09:24 Acct X32137X: Deposit 307.74THB Avail 35,136.99THB
                var astr = new Array(); //定义一数组
                astr = scalldate.split("@"); //字符分割
                var hour = astr[1].trim();

                var astr2 = new Array();
                astr2 = astr[0].split("-");
                var month = astr2[1];
                var day = astr2[0];

                //获取当前年份
                var date = new Date();
                var year = date.getFullYear();

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }

        spost_check_fuyan("KTB_sms", num_bank_ktb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KTB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KRUNG THAI BANK#" + num_bank_ktb, sms_fy, "", amount, scalldate, "KTB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KTB_sms", "callbackhtml:" + callbackhtml + "##" + "KTB" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }


}

function go_KTB_getOTP_sms(body, time_no) {
    try {
        toast("KTB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "KRUNG THAI BANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "")
                break;
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                //var body= "OTP=941867 Ref JFCXQ-TRANSFER to Interbank A/C  to 6161XXXXX2 28012B";
                var startkey = "Ref";
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("-")).trim();
                spost_check_fuyan("KTB_OTP_sms", "截取到的单号" + order_no);
                let getotpcode = getWebPayImg(staskno);
                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP=";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf("Ref")).trim();
                    spost_check_fuyan("KTB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}

function go_KB_callback_English_sms(body, time_no) {
    //var smsbody="19/07/22 15:56 A/C X139039X Deposit2000.00 Outstanding Balance40603.93 Baht."
    //A/C X145043X received 630.00 Baht from A/C X189745X Outstanding Balance 27883.00 Baht.
    try {
        var bankcode = "KASIKORNBANK";
        var num_bank_kb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        var amount = "";
        if (smsbody.indexOf("received") > -1 && smsbody.indexOf("Baht from") > -1) {
            try {
                var startkey1 = "received";
                amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("Baht from")).trim();
                amount = amount.replace(/\,/g, '');
            } catch (error) {

            }
        } else {
            //金额
            try {
                var startkey1 = "Deposit";
                amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("Outstanding")).trim();
                amount = amount.replace(/\,/g, '');
            } catch (error) {

            }
        }







        //餘額
        try {
            var startkey = "Balance";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("Baht.")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("KASIKORNBANK#" + num_bank_kb, newBblance);
            }
        } catch (err) {

        }

        //日期
        try {
            var scalldate = smsbody.substring(0, smsbody.indexOf("A/C")).trim();
            if (scalldate != "") {
                //时间格式  var scalldate = "(30/6/22, 23:05"
                //โอนเข้า xxx172402x 101.00 เหลือ 18,911.59 (1/7/65,14:52)
                //19/07/22 15:56 A/C X139039X Deposit2000.00 Outstanding Balance40603.93 Baht.
                var astr = new Array(); //定义一数组
                astr = scalldate.split(" "); //字符分割
                var hour = astr[1].trim();

                var astr2 = new Array();
                astr2 = astr[0].split("/");
                var month = astr2[1];
                var day = astr2[0];

                //获取当前年份
                //var date = new Date();
                var year = "20" + astr2[2];

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }

        spost_check_fuyan("KB_sms", num_bank_kb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KASIKORNBANK#" + num_bank_kb, sms_fy, "", amount, scalldate, "KB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KB_sms", "callbackhtml:" + callbackhtml + "##" + "KB" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }
}

function go_KB_callback_sms1(body, time_no) {
    //var smsbody="24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ"
    //24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ
    //01/11/65 09:12 บช X-9516 รับโอนจาก X-8956 300.00 คงเหลือ 22138.08 บ
    //07/05/66 07:12 บช X-3150 เงินเข้า 25,000.00 คงเหลือ 52,026.16 บ.
    //10/04/67 12:17 หักบช X-2266 เข้า X-4584 150.00 คงเหลือ 1,179.00 บ.
    try {
        var bankcode = "KASIKORNBANK";
        var num_bank_kb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        var amount = "";
        // 24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ
        // 24/09/65 14:49 บชX121951X เงินเข้า575.00 คงเหลือ21220.97บ
        //01/11/65 09:12 บช X-9516 รับโอนจาก X-8956 300.00 คงเหลือ 22138.08 บ
        //07/05/66 07:12 บช X-3150 เงินเข้า 25,000.00 คงเหลือ 52,026.16 บ.
        //10/04/67 12:17 หักบช X-2266 เข้า X-4584 150.00 คงเหลือ 1,179.00 บ.
        if (smsbody.indexOf("บช X") != -1) {
            var startkey1 = "บช X";
            var amount1 = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("คงเหลือ")).trim();
            var astrs = amount1.split(" "); //字符分割
            amount = astrs[2];
            amount = amount.replace(/\,/g, '');
         
        }


        //餘額
        try {
            var startkey = "คงเหลือ";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                newBblance = newBblance.replace(/\บ./g, '');
                newBblance = newBblance.replace(/\บ/g, '');
                newBblance = newBblance.trim();
                setBlance("KASIKORNBANK#" + num_bank_kb, newBblance);
            }
        } catch (err) {

        }
        var scalldate = '';

        spost_check_fuyan("KB_sms", num_bank_kb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KASIKORNBANK#" + num_bank_kb, sms_fy, "", amount, scalldate, "KB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KB_sms", "callbackhtml:" + callbackhtml + "##" + "KB" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }
}


function go_KB_callback_sms(body, time_no) {
    //var smsbody="24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ"
    //24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ
    //01/11/65 09:12 บช X-9516 รับโอนจาก X-8956 300.00 คงเหลือ 22138.08 บ
    //07/05/66 07:12 บช X-3150 เงินเข้า 25,000.00 คงเหลือ 52,026.16 บ.
    try {
        var bankcode = "KASIKORNBANK";
        var num_bank_kb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        var amount = "";
        // 24/09/65 12:33 บชX121951X รับโอนจากX804766X 101.00บ คงเหลือ16418.00บ
        // 24/09/65 14:49 บชX121951X เงินเข้า575.00 คงเหลือ21220.97บ
        //01/11/65 09:12 บช X-9516 รับโอนจาก X-8956 300.00 คงเหลือ 22138.08 บ
        //07/05/66 07:12 บช X-3150 เงินเข้า 25,000.00 คงเหลือ 52,026.16 บ.
        if (smsbody.indexOf("รับโอนจากX") != -1) {
            var startkey1 = "รับโอนจากX";
            var amount1 = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.length).trim();
            var startkey2 = "X";
            amount = amount1.substring(amount1.indexOf(startkey2) + startkey2.length, amount1.indexOf("บ")).trim();
            amount = amount.replace(/\,/g, '');
        }
        if (smsbody.indexOf("เงินเข้า") != -1) {
            var startkey1 = "เงินเข้า";
            amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("คงเหลือ")).trim();
            amount = amount.replace(/\,/g, '');
        }
        if (smsbody.indexOf("รับโอนจาก X") != -1) {
            var startkey1 = "รับโอนจาก X";
            amount = smsbody.substring(smsbody.indexOf(startkey1) + 16, smsbody.indexOf("คงเหลือ")).trim();
            amount = amount.replace(/\,/g, '');
        }

        //餘額
        try {
            var startkey = "คงเหลือ";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.length).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                newBblance = newBblance.replace(/\บ./g, '');
                newBblance = newBblance.replace(/\บ/g, '');
                newBblance = newBblance.trim();
                setBlance("KASIKORNBANK#" + num_bank_kb, newBblance);
            }
        } catch (err) {

        }
        var scalldate = '';

        spost_check_fuyan("KB_sms", num_bank_kb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KASIKORNBANK#" + num_bank_kb, sms_fy, "", amount, scalldate, "KB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KB_sms", "callbackhtml:" + callbackhtml + "##" + "KB" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }
}


function go_KB_getOTP_sms(body, time_no) {
    try {
        toast("KB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "KASIKORNBANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "")
                break;
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                //var body= "OTP: 540418 (Ref: UVGM) to confirm fund transfer to account xxx-x-x0610-x NUCHJANART PA on K BIZ amount THB37788.00";
                //Title:KBank Content:to confirm fund transfer to account xxx-x-x1277-x MR.SANE CHANPHONROB on K BIZ amount THB100.00 OTP: 479616 (Ref: WVPZ)	
                var startkey = "Ref:";
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.length).trim();
                order_no = order_no.replace(/\)/g, '');
                spost_check_fuyan("KB_OTP_sms", "截取到的单号" + order_no);
                let getotpcode = getWebPayImg(staskno);
                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf("(Ref:")).trim();
                    spost_check_fuyan("KB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}
function go_KB_getOTP_sms2(body, sms_kb_otparr) {
    try {
        toast("KB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "KASIKORNBANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "")
                break;
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                let getotpcode = getWebPayImg(staskno);
                if (sms_kb_otparr.length > 0) {
                    if (sms_kb_otparr[0].indexOf(getotpcode) != -1) {
                        body = sms_kb_otparr[0];
                    } else {
                        for (let i = sms_kb_otparr.length - 1; i > 0; --i) {
                            if (sms_kb_otparr[i].indexOf(getotpcode) != -1) {
                                body = sms_kb_otparr[i];
                            }
                        }
                    }
                }
                //var body= "OTP: 540418 (Ref: UVGM) to confirm fund transfer to account xxx-x-x0610-x NUCHJANART PA on K BIZ amount THB37788.00";
                //Title:KBank Content:to confirm fund transfer to account xxx-x-x1277-x MR.SANE CHANPHONROB on K BIZ amount THB100.00 OTP: 479616 (Ref: WVPZ)	
                var startkey = "Ref:";
                if(body.indexOf("รหัสอ้างอิง:") > -1)
                {
                    startkey = "รหัสอ้างอิง:";
                }
                else if(body.indexOf("รหัส อ้างอิง:") > -1)
                {
                    startkey = "รหัส อ้างอิง:";
                }
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.length).trim();
                order_no = order_no.replace(/\)/g, '');
                spost_check_fuyan("KB_OTP_sms", "截取到的单号" + order_no);

                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var nkey ="(Ref:";
                    if(body.indexOf("รหัสอ้างอิง:") > -1)
                        {
                            nkey = "(รหัสอ้างอิง:";
                        }
                        else if(body.indexOf("รหัส อ้างอิง:") > -1)
                        {
                            nkey = "(รหัส อ้างอิง:";
                        }
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf(nkey)).trim();
                    spost_check_fuyan("KB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                    if (sms_kb_otparr.length > 24) {
                        let temp = sms_kb_otparr[0];
                        sms_kb_otparr = sms_kb_otparr.slice(22, 30);
                        sms_kb_otparr.push(temp);
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}

function go_TTB_getOTP_sms2(body, sms_ttb_otparr) {
    try {
        toast("TTB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "TMBTHANACHART BANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "")
                break;
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                let getotpcode = getWebPayImg(staskno);
                if (sms_ttb_otparr.length > 0) {
                    if (sms_ttb_otparr[0].indexOf(getotpcode) != -1) {
                        body = sms_ttb_otparr[0];
                    } else {
                        for (let i = sms_ttb_otparr.length - 1; i > 0; --i) {
                            if (sms_ttb_otparr[i].indexOf(getotpcode) != -1) {
                                body = sms_ttb_otparr[i];
                            }
                        }
                    }
                }
                //var body= "OTP: 540418 (Ref: UVGM) to confirm fund transfer to account xxx-x-x0610-x NUCHJANART PA on K BIZ amount THB37788.00";
                //Title:KBank Content:to confirm fund transfer to account xxx-x-x1277-x MR.SANE CHANPHONROB on K BIZ amount THB100.00 OTP: 479616 (Ref: WVPZ)	
                //Enter OTP: 306802 (ref: WCEM), Do not share this OTP.
                var startkey = "Ref:";
                let endkey = "),"
                
              
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf(endkey)+endkey.length).trim();
                order_no = order_no.replace(/\)/g, '');
                spost_check_fuyan("TTB_OTP_sms", "截取到的单号" + order_no);

                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var nkey ="(Ref:";
                  
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf(nkey)).trim();
                    spost_check_fuyan("TTB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                    if (sms_ttb_otparr.length > 24) {
                        let temp = sms_ttb_otparr[0];
                        sms_ttb_otparr = sms_ttb_otparr.slice(22, 30);
                        sms_ttb_otparr.push(temp);
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}


function go_KKP_callback_sms(body, time_no) {
    try {
        var bankcode = "KIATNAKIN BANK";
        var num_bank_kkp = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kkp = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kkp = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        //短信内容：โอนเข้า บ/ช X9550 666.00 บาท ใช้ได้ 43,931.94 บาท ณ 23ก.ค
        try {
            var startkey1 = "บ/ช";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + 9, smsbody.indexOf("บาท")).trim();
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "ใช้ได้";
            var newBblance1 = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf(startkey) + startkey.length, newBblance1.indexOf("บาท")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("KIATNAKIN BANK#" + num_bank_kkp, newBblance);
            }
        } catch (err) {

        }
        var scalldate = "";
        spost_check_fuyan("KKP_sms", num_bank_kkp + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KKP" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KIATNAKIN BANK#" + num_bank_kkp, sms_fy, "", amount, scalldate, "KKP" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KKP_sms", "callbackhtml:" + callbackhtml + "##" + "KKP" + time_no);
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





    } catch (error) {
        log("go_BAY_callback_sms");
        log(error);
    }
}

function go_KKP_getOTP_sms(body, time_no) {
    try {
        toast("KKP偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "KIATNAKIN BANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "")
                break;
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            staskno = "";
        }

        if (staskno != "") {
            //截取单号
            try {
                //var body= "OTP: 596642 Ref: DPGQC for transferring 6,666.00THB to A/C xxxxxx0048 via KKP e-Banking";
                var startkey = "Ref:";
                var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("for")).trim();
                spost_check_fuyan("KKP_OTP_sms", "截取到的单号" + order_no);
                let getotpcode = getWebPayImg(staskno);
                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP:";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.indexOf("Ref:")).trim();
                    spost_check_fuyan("KKP_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}
function go_GSB_getOTP_sms(body, time_no) {
    try {
        toast("GSB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "GOVERNMENT SAVINGS BANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "" && staskno.indexOf("注單不存在") == -1 && staskno.indexOf("注單錯誤") == -1)
                break;
            sleep(1000);
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            try {
                //sms_gsb_otparr.push(body);
                //deleteTimenoToOld(time_no);
                spost_check_fuyan("GSB_OTP_bcz", "body:" + body + "###getjsonphone:" + getjsonphone + "staskno：" + staskno);
            } catch (err) {

            }

            staskno = "";
        }
        spost_check_fuyan("GSB_OTP_sms", "staskno:" + staskno + "###getjsonphone:" + getjsonphone);
        var startkey = "Ref=";
        var order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("OTP")).trim();
        spost_check_fuyan("GSB_OTP_sms", "截取到的单号" + order_no);


        // if(staskno == "" || getotpcode != order_no)
        // {
        //     for (var jj = 0; jj < 10; jj++) {
        //        staskno = getWebPayTaskNoByimg(order_no);

        //        if (staskno != "")
        //        break;
        //        sleep(500);
        //     }
        // }
        spost_check_fuyan("GSB_OTP_sms", "222>>>staskno:" + staskno + "###getjsonphone:" + getjsonphone);
        if (staskno != "") {
            let getotpcode = getWebPayImg(staskno);
            // if (getotpcode != order_no) {
            //     getotpcode = getWebPayImg(staskno);
            // }
            //截取单号
            try {
                //var body= "Transfer toXXXXXX2722-MR.PARITH L 888.00THB Ref=3C26 OTP=565874";


                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP=";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.length).trim();
                    spost_check_fuyan("GSB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}
function go_GSB_getOTP_sms2(body, sms_gsb_otparr) {
    try {
        toast("GSB偵測到有驗證碼");

        var sjson = "";

        /*
                for (var nn = 0; nn < 3; nn++) {
                    sjson = clockPhone(getjsonphone, "login");
        
                    if (sjson != "")
                        break;
                }
            ]
                if (loginjson.indexOf("isweb") > -1 && sjson.indexOf("isweb") <= -1) {
                    sjson = loginjson;
                }
                var sbankname = getbankname(sjson);
                if (sjson.indexOf("VIB") != -1) {
                    sbankname = "VIB";
                }
                */
        var sbankname = "GOVERNMENT SAVINGS BANK";

        var staskno = "";
        for (var jj = 0; jj < 3; jj++) {

            staskno = getWebPayTaskNo(getjsonphone, sbankname);
            if (staskno != "" && staskno.indexOf("注單不存在") == -1 && staskno.indexOf("注單錯誤") == -1)
                break;
            sleep(1000);
        }
        log("staskno:" + staskno);
        //
        if (staskno.indexOf("注單不存在") > -1 || staskno.indexOf("手機號銀行沒綁定") > -1 || staskno.indexOf("注單錯誤") > -1) {
            try {

                //deleteTimenoToOld(time_no);
                //spost_check_fuyan("GSB_OTP_bcz", "body:" + body + "###getjsonphone:" + getjsonphone+"staskno："+staskno);
            } catch (err) {

            }

            staskno = "";
        }
        //spost_check_fuyan("GSB_OTP_sms", "staskno:" + staskno + "###getjsonphone:" + getjsonphone);
        var startkey = "Ref=";



        // if(staskno == "" || getotpcode != order_no)
        // {
        //     for (var jj = 0; jj < 10; jj++) {
        //        staskno = getWebPayTaskNoByimg(order_no);

        //        if (staskno != "")
        //        break;
        //        sleep(500);
        //     }
        // }
        // spost_check_fuyan("GSB_OTP_sms", "222>>>staskno:" + staskno + "###getjsonphone:" + getjsonphone);
        if (staskno != "") {
            let getotpcode = getWebPayImg(staskno);
            try{
                if (getotpcode.length <4) {
                    sleep(1000);
                    getotpcode = getWebPayImg(staskno);
                }
            }catch(e){

            }
            
            //截取单号
            try {
                //var body= "Transfer toXXXXXX2722-MR.PARITH L 888.00THB Ref=3C26 OTP=565874";

                if (sms_gsb_otparr.length > 0) {
                    if (sms_gsb_otparr[0].indexOf(getotpcode) != -1) {
                        body = sms_gsb_otparr[0];
                    } else {
                        for (let i = sms_gsb_otparr.length - 1; i > 0; --i) {
                            if (sms_gsb_otparr[i].indexOf(getotpcode) != -1) {
                                body = sms_gsb_otparr[i];
                                break;
                            }
                        }
                    }
                }
                var order_no = "";
                try{
                    order_no = body.substring(body.indexOf(startkey) + startkey.length, body.indexOf("OTP")).trim();
                }catch(e){

                }
                
                spost_check_fuyan("GSB_OTP_sms", "截取到的单号1" + order_no+"###code:"+getotpcode+"###orderno"+staskno+"####body:"+body);
                if (getotpcode == order_no) {
                    //截取otp
                    var stkey = "OTP=";
                    var sOTP = body.substring(body.indexOf(stkey) + stkey.length, body.length).trim();
                    spost_check_fuyan("GSB_OTP_sms", "截取到的OTP" + sOTP);
                    if (sOTP != "") {
                        var scontent = "";
                        for (var kk = 0; kk < 3; kk++) {
                            scontent = updateWebPayotp(staskno, sOTP);
                            if (scontent != "")
                                break;
                        }
                    }
                    if (sms_gsb_otparr.length > 24) {
                        let temp = sms_gsb_otparr[0];
                        sms_gsb_otparr = sms_gsb_otparr.slice(22, 30);
                        sms_gsb_otparr.push(temp);
                    }
                }
            } catch (error) {

            }
        }
    }
    catch (error) {

        log("go_bay_getotp");
        log(error);
    }
}
function go_TTB_callback_sms(smsbody, time_no) {
    try {
        var bankcode = "TMBTHANACHART BANK";
        var num_bank_ttb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_ttb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_ttb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = smsbody.trim();
        var sms_fy = "";
        //金额
        //短信内容：var smsbody =" มีเงิน100.00บ.โอนเข้าบ/ชxx6604เหลือ2,786.00บ.11/08/22@16:53";
        try {
            var startkey1 = "มีเงิน";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("บ.")).trim();
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "เหลือ";
            var newBblance1 = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf(startkey) + startkey.length, newBblance1.indexOf("บ.")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("TMBTHANACHART BANK#" + num_bank_ttb, newBblance);
            }
        } catch (err) {

        }
        var scalldate = "";
        spost_check_fuyan("TTB_sms", num_bank_ttb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KKP" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("TMBTHANACHART BANK#" + num_bank_ttb, sms_fy, "", amount, scalldate, "TTB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("TTB_sms", "callbackhtml:" + callbackhtml + "##" + "TTB" + time_no);
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





    } catch (error) {
        log("go_TTB_callback_sms");
        log(error);
    }

}
//go_BBL_sms
function go_BBL_sms(smsbody, time_no) {
    try {
        var bankcode = "BANGKOK BANK";
        var num_bank_ttb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_ttb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_ttb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = smsbody.trim();
        var sms_fy = "";
        //金额
        //短信内容：var smsbody ="เงินเข้าบ/ชX8685 จากพร้อมเพย์ผ่านMB 299.81บ เงินในบ/ชใช้ได้1,061.20บ";
        //ฝาก/โอนเงินเข้าบ/ชX8685ผ่านMB 149.94บ ใช้ได้ 8,490.55บ
        //var smsbody ="เงินเข้าบ/ชX6552 จากพร้อมเพย์ผ่านIB 189.82บ เงินในบ/ชใช้ได้23,342.44บ"
        var amount ="";
        if(smsbody.indexOf("บ เงินในบ") > -1)
        {
            try {
                var startkey1 = "MB";
                amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("บ เงินในบ")).trim();
                amount = amount.replace(/\,/g, '');
            } catch (error) {

            }
            if(smsbody.indexOf("IB") > -1){
                var startkey1 = "IB";
                amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("บ เงินในบ")).trim();
                amount = amount.replace(/\,/g, '');
            }
    }
    else if(smsbody.indexOf("บ ใช้ได้") > -1)
    {
        try {
            var startkey1 = "MB";
            amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("บ ใช้ได้")).trim();
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
    }
    else if(smsbody.indexOf("PromptPay transfer") > -1 && smsbody.indexOf("balance is Bt") > -1)
    {
        try {
            var startkey1 = "of Bt";
            amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("via")).trim();
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
    }
        //餘額
        if(smsbody.indexOf("ชใช้ได้") > -1)
        {
        try {
            var startkey = "ชใช้ได้";
            var newBblance1 = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf(startkey) + startkey.length, newBblance1.indexOf("บ")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("BANGKOK BANK#" + num_bank_ttb, newBblance);
            }
        } catch (err) {

        }
    }
    else if(smsbody.indexOf("บ ใช้ได้") > -1)
    {
        try {
            var startkey = "บ ใช้ได้";
            var newBblance1 = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf(startkey) + startkey.length, newBblance1.indexOf("บ")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("BANGKOK BANK#" + num_bank_ttb, newBblance);
            }
        } catch (err) {

        }
    }
    else if(smsbody.indexOf("PromptPay transfer") > -1 && smsbody.indexOf("balance is Bt") > -1)
    {
        try {
            var startkey = "balance is Bt";
            var newBblance1 = smsbody.substring(smsbody.indexOf(startkey), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf(startkey) + startkey.length, (newBblance1.length-1)).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("BANGKOK BANK#" + num_bank_ttb, newBblance);
            }
        } catch (err) {

        }
    }
    // console.log(newBblance)
    // const lastUIndex = smsbody .lastIndexOf('บ');
    // const secondLastUIndex = smsbody.lastIndexOf('บ', lastUIndex - 1);
    
    // // 截取字符串并匹配数字
    // const substring = smsbody.slice(secondLastUIndex, lastUIndex);
    // const match = substring.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/g);
    
    // if (match) {
    //  let bl =match[0].replace(/,/g, '').trim();
    //     console.log(bl); // 输出匹配到的数字
    // }


        var scalldate = "";
        spost_check_fuyan("BBL_sms", num_bank_ttb + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "BBL" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("BANGKOK BANK#" + num_bank_ttb, sms_fy, "", amount, scalldate, "TTB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("BBL_sms", "callbackhtml:" + callbackhtml + "##" + "BBL" + time_no);
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





    } catch (error) {
        log("go_TTB_callback_sms");
        log(error);
    }

}

function go_gsb_callback_noti(smsbody, noti_time_no) {
    try {
        let bankcode = "GOVERNMENT SAVINGS BANK";
        var num_bank_Tmoney = "";
        if (json_main.indexOf(bankcode) != -1) {
            num_bank_Tmoney = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_Tmoney = gettoparsejson(sjson, bankcode, "banknum");
        }

        var startkey = "of";
        var call_amount = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("was")).trim();
        call_amount = call_amount.replace("฿", "").trim();
        //demo1 = demo1.trim();
        try {
            spost_check_fuyan("gsb_noti", "num_bank_Tmoney:" + num_bank_Tmoney + "##call_amount##" + call_amount);
        } catch (err) {

        }

        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                //
                var callbackhtml = post_callbackresult("GOVERNMENT SAVINGS BANK#" + num_bank_Tmoney, smsbody, "", call_amount, "", "gsb" + noti_time_no);
                log("新消息" + callbackhtml);
                log("num_bank_Tmoney:" + num_bank_Tmoney + "##demo1" + smsbody);
                spost_check_fuyan("gsb_noti", "callbackhtml:" + callbackhtml + "##" + "gsb" + noti_time_no);
                if (callbackhtml == "回調成功") {
                    try {
                        notify_arr.unshift(smsbody);
                    } catch (err) {

                    }
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
        spost_check_fuyan("gsb_noti", err.message);
    }
}
function getWebPayImg(oid) {
    try {
        var url = backdeskurl + "/Service/WebPay.ashx?f=gimg";
        var res = http.post(url, {
            "oid": oid

        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (error) {
        log("getWebPayImg");
        log(error);
        return "";
    }

}

function updateWebPayotp(oid, otp) {
    try {
        var url = backdeskurl + "/Service/WebPay.ashx?f=otp";
        var res = http.post(url, {
            "oid": oid,
            "otp": otp,
        });
        var html = res.body.string();
        if (html != null || html != "") {
            return html;
        } else {
            return "";
        }
    }
    catch (error) {

        return "";
    }


}

//获取通知
function go_Tmoney_callback(demo, noti_time_no) {
    try {
        let bankcode = "TRUEMONEY";
        var num_bank_Tmoney = "";
        if (json_main.indexOf(bankcode) != -1) {
            num_bank_Tmoney = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_Tmoney = gettoparsejson(sjson, bankcode, "banknum");
        }

        var startkey = "received";
        var demo1 = demo.substring(demo.indexOf(startkey) + startkey.length, demo.indexOf("THB")).trim();
        //demo1 = demo1.trim();
        try {
            spost_check_fuyan("TRUEMONEY_noti", "num_bank_Tmoney:" + num_bank_Tmoney + "##demo1##" + demo1);
        } catch (err) {

        }

        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                //
                var callbackhtml = post_callbackresult("TRUEMONEY#" + num_bank_Tmoney, demo, "", demo1, "", "TM" + noti_time_no);
                log("新消息" + callbackhtml);
                log("num_bank_Tmoney:" + num_bank_Tmoney + "##demo1" + demo1);
                spost_check_fuyan("TRUEMONEY_noti", "callbackhtml:" + callbackhtml + "##" + "TRUEMONEY" + "TM" + noti_time_no);
                if (callbackhtml == "回調成功") {
                    try {
                        notify_arr.unshift(demo);
                    } catch (err) {

                    }
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
        try {
            spost_check_fuyan("TRUEMONEY_err", demo);
            spost_check_fuyan("TRUEMONEY_err", err);
        } catch (err2) {

        }

    }
}


function go_KB_callback_en(smsbody, time_no) {
    //var smsbody="19/07/22 15:56 A/C X139039X Deposit2000.00 Outstanding Balance40603.93 Baht."
    //Content:16/08/22 19:57 A/C X139039X received 103.00 Baht from A/C X237587X Outstanding Balance 48242.45 Baht.
    try {
        var bankcode = "KASIKORNBANK";
        var num_bank_kb = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kb = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kb = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = smsbody.trim();
        var sms_fy = "";
        //金额
        try {
            var startkey1 = "received";
            var amount = smsbody.substring(smsbody.indexOf(startkey1) + startkey1.length, smsbody.indexOf("Baht from")).trim();
            amount = amount.replace(/\,/g, '');
        } catch (error) {

        }
        //餘額
        try {
            var startkey = "Balance";
            var newBblance = smsbody.substring(smsbody.indexOf(startkey) + startkey.length, smsbody.indexOf("Baht.")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');

            }
        } catch (err) {

        }

        //日期
        try {
            var scalldate = smsbody.substring(0, smsbody.indexOf("A/C")).trim();
            if (scalldate != "") {
                var astr = new Array(); //定义一数组
                astr = scalldate.split(" "); //字符分割
                var hour = astr[1].trim();

                var astr2 = new Array();
                astr2 = astr[0].split("/");
                var month = astr2[1];
                var day = astr2[0];

                //获取当前年份
                //var date = new Date();
                var year = "20" + astr2[2];

                scalldate = year + "-" + month + "-" + day + " " + hour;
            }
        } catch (error) {

        }

        spost_check_fuyan("KB_en", newBblance + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KB" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KASIKORNBANK#" + num_bank_kb, sms_fy, "", amount, scalldate, "KB" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KB_en", "callbackhtml:" + callbackhtml + "##" + "KB" + time_no);
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





    } catch (error) {
        log("go_KB_callback_en");
        log(error);
    }
}

function go_KKP_en_callback_sms(body, time_no) {
    try {
        var bankcode = "KIATNAKIN BANK";
        var num_bank_kkp = "";

        if (json.indexOf(bankcode) != -1) {
            num_bank_kkp = gettoparsejson(json, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_kkp = gettoparsejson(sjson, bankcode, "banknum");
        }

        var smsbody = body.trim();
        var sms_fy = "";
        //金额
        //Title:KKP Content:Fund transfer to A/C X2758 THB 106.00 Available balance is THB 2,538.00 on 16/08
        try {

            var amount = smsbody.substring(smsbody.indexOf("THB") + "THB".length, smsbody.indexOf("Available balance")).trim();

        } catch (error) {

        }
        //餘額
        try {

            var newBblance1 = smsbody.substring(smsbody.indexOf("Available balance"), smsbody.length).trim();
            var newBblance = newBblance1.substring(newBblance1.indexOf("THB") + "THB".length, newBblance1.indexOf("on")).trim();
            if (newBblance != "") {
                newBblance = newBblance.replace(/\,/g, '');
                setBlance("KIATNAKIN BANK#" + num_bank_kkp, newBblance);
            }
        } catch (err) {

        }
        var scalldate = "";
        spost_check_fuyan("KKP_sms", num_bank_kkp + "###" + sms_fy + "###" + amount + "###" + scalldate + "###" + "KKP" + time_no);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                var callbackhtml = post_callbackresult("KIATNAKIN BANK#" + num_bank_kkp, sms_fy, "", amount, scalldate, "KKP" + time_no);
                log("新消息" + callbackhtml);
                spost_check_fuyan("KKP_sms", "callbackhtml:" + callbackhtml + "##" + "KKP" + time_no);
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





    } catch (error) {
        log("go_KKP_callback_sms");
        log(error);
    }
}

function go_Tmoney_callback1(demo, noti_time_no) {
    try {
        let bankcode = "TRUEMONEY";
        var num_bank_Tmoney = "";
        if (json_main.indexOf(bankcode) != -1) {
            num_bank_Tmoney = gettoparsejson(json_main, bankcode, "banknum");
        }
        else {
            var sjson = clockPhone(getjsonphone, "getbank");
            num_bank_Tmoney = gettoparsejson(sjson, bankcode, "banknum");
        }

        var startkey = "ได้รับ";
        var demo1 = demo.substring(demo.indexOf(startkey) + startkey.length, demo.indexOf("บ.จาก")).trim();
        demo1 = demo1.trim();

        spost_check_fuyan("True Money_sms", "num_bank_Tmoney:" + num_bank_Tmoney + "##demo1" + demo1);
        threads.start(function () {

            for (var k = 0; k < 5; k++) {
                //
                var callbackhtml = post_callbackresult("TRUEMONEY#" + num_bank_Tmoney, demo, "", demo1, "", "TM" + noti_time_no);
                log("新消息" + callbackhtml);
                log("num_bank_Tmoney:" + num_bank_Tmoney + "##demo1" + demo1);
                spost_check_fuyan("True Money_sms", "callbackhtml:" + callbackhtml + "##" + "TRUEMONEY" + "TM" + noti_time_no);
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
        spost_check_fuyan("True Money_sms", err.message);
    }
}

function get_Mp3() {
    try {
        // check_yuyinbao();

        //  /aspx/DownLoadMp3.aspx?foldername=W-PAY&filename=workerror&fileExt=mp3
        var d_url = "/aspx/DownLoadMp3.aspx?foldername=Vy1QQVk=&filename=d29ya2Vycm9y&fileExt=bXAz";
        download_Mp3("workerror.mp3", "/sdcard/W-PAY/", d_url, "/sdcard/W-PAY/workerror.mp3");//Lm1wMw==

        var ok_url = "/aspx/DownLoadMp3.aspx?foldername=Vy1QQVk=&filename=d29ya29r&fileExt=bXAz";
        download_Mp3("workok.mp3", "/sdcard/W-PAY/", ok_url, "/sdcard/W-PAY/workok.mp3");//Lm1wMw==


    } catch (error) {

    }
}

function download_Mp3(phone_attName, phone_dirName, require_url, fileName) {
    // 启动新线程下载软件
    //   threads.start(function () {
    //     downFile(  );
    //  });
    try {
        var isdown = downFile_Mp3(phone_attName, phone_dirName, require_url);
        // if (isdown) {
        //     sleep(2000);
        //     installApk_all(fileName);
        // }
    }
    catch (error) {

    }
}

// var d_url="/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=d29ya19lcnJlcg==&fileExt=Lm1wMw==";
// download_file("work_errer.mp3","/sdcard/W-PAY/",d_url,"/sdcard/W-PAY/work_errer.mp3");//Lm1wMw==
function downFile_Mp3(phone_attName, phone_dirName, require_url) {
    var isok = false;
    var ssline = 1;
    try {

        //获取存储卡路径、构成保存文件的目标路径
        var dirName = "";
        var attName = phone_attName;//"Pay.apk";
        //SD卡具有读写权限、指定附件存储路径为SD卡上指定的文件夹        
        dirName = phone_dirName;//"/sdcard/W-PAY/";
        ssline = 4;
        if (!files.exists(dirName)) {      //判断文件夹是否存在
            files.create(dirName);        //如果不存在、则创建一个新的文件夹
        }
        ssline = 5;
        //准备拼接新的文件名  
        var fileName = "";
        fileName = attName;
        fileName = dirName + fileName;
        ssline = 6;
        if (files.exists(fileName)) {    //如果目标文件已经存在
            files.remove(fileName);    //则删除旧文件
        }
        //                          var d_url="/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=d29ya19lcnJlcg==&fileExt=ZXhl";
        var url = backdeskurl + require_url;// "/aspx/DownLoad.aspx?foldername=Vy1QQVk=&filename=UGF5&fileExt=YXBr";
        var res = http.get(url);
        sleep(2000);
        if (res == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null)
                    break;

                sleep(1000);
            }
        }

        if (res == null) {
            toast("下載apk失敗");
        }
        if (res.body == null) {
            for (var kk = 0; kk < 3; k++) {
                res = http.get(url);
                sleep(2000);
                if (res != null && res.body != null)
                    break;

                sleep(1000);
            }
        }
        if (res.body == null) {
            toast("下載mp3失敗1");
        }
        ssline = 2;
        var html = res.body.bytes();
        ssline = 3;
        if (html != null) {


            ssline = 7;
            try {
                ssline = 8;
                files.writeBytes(fileName, html);
                isok = true;
                //toast("最新mp3apk下載成功");
                ssline = 9;
            }
            catch (error) {
                log("ssline:" + ssline);
                log("files:");
                log(error);
            }
        } else {
            ssline = 10;
            return "no";
        }
    }
    catch (error) {
        log("ssline:" + ssline);
        log(error);
    }

    return isok;
}
function remove_apk() {
    try {
        fileName = "/sdcard/W-PAY/Pay.apk";
        if (files.exists(fileName)) {    //如果目标文件已经存在
            files.remove(fileName);    //则删除旧文件
        }
        else {
            toast("weixianzhai");
        }
    } catch (error) {
        toast("weixianzhai2222");
    }
}

function check_mac() {
    try {
        var key_phone = device.getMacAddress();
        if (key_phone == "" || key_phone.slice(0, 8) == "02:00:00" || key_phone.indexOf("02:00:00") != -1) {
            key_phone = device.getAndroidId();
        }

        return key_phone;

    } catch (error) {

        return device.getMacAddress();
    }
}

