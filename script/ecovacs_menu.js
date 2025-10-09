/*
 * Ecovacs 我的页面菜单过滤（根据 Argument 开关删除对象）
 * 开关为 true → 保留
 * 开关为 false → 删除
 * 时间：12:37
 */

const isNetEase= true;

if (isNetEase) {
  // 从 Loon 脚本参数中读取配置
  const cookie = $argument?.Cookie;
  const mconfig = $argument?.MConfigInfo;
  const userAgent = $argument?.UserAgent;

  // 检查参数是否缺失
  if (!cookie || !mconfig || !userAgent) {
        console.log("参数缺失信息：");
    if (!cookie) console.log("❌ Cookie 参数缺失");
    if (!mconfig) console.log("❌ MConfigInfo 参数缺失");
    if (!userAgent) console.log("❌ UserAgent 参数缺失");
    
    $notification.post("网易云音乐遇到问题", "参数缺失", "请在插件内填入会员数据");
    $notification.post("cookie的值", "cookie", cookie);
    $done({});
  } else {
    header["cookie"] = cookie;
    header["mconfig-info"] = mconfig;
    header["user-agent"] = userAgent;


    console.log("cookie:",cookie);
    
    console.log("✅ 网易云音乐会员已解锁 🎉");
    $done({ headers: header });
  }
} else {
  $done({});
}
