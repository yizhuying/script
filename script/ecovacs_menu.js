/*
 * Ecovacs 我的页面菜单过滤（Loon）
 * 读取 [Argument] 开关，动态控制菜单显示
 */

let body = $response.body || "{}";
let cfg = {
  MYORDER: true,
  SERVICEHALL: true,
  EXCHANGERECORD: true,
  MYACTIVITY: true,
  MYGIFTCARD: false,
  MYFAVORITE: true,
  MYCOMMENT: true,
  HELPFEEDBACK: true,
  WARRANTYCARD: true
};

// 打印调试参数
console.log("Ecovacs 参数:", $argument);

try {
  // 将 Loon 传入的开关覆盖默认值
  Object.keys(cfg).forEach(k => {
    if ($argument[k] === "true" || $argument[k] === "false") {
      cfg[k] = ($argument[k] === "true");
    }
  });

  let obj = JSON.parse(body);
  if (obj?.data?.menuList && Array.isArray(obj.data.menuList)) {
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        section.menuItems = section.menuItems.filter(item => {
          switch (item.menuName) {
            case "我的订单": return cfg.MYORDER;
            case "服务大厅": return cfg.SERVICEHALL;
            case "兑换记录": return cfg.EXCHANGERECORD;
            case "我的活动": return cfg.MYACTIVITY;
            case "我的E享卡": return cfg.MYGIFTCARD;
            case "我的收藏": return cfg.MYFAVORITE;
            case "我的评论": return cfg.MYCOMMENT;
            case "帮助与反馈": return cfg.HELPFEEDBACK;
            case "电子保修卡": return cfg.WARRANTYCARD;
            default: return true; // 未配置项默认保留
          }
        });
      }
    });
  }
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log("Ecovacs menu parse error:", e);
  $done({ body });
}
