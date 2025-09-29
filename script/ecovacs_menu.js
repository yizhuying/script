/*
 * Ecovacs 我的页面菜单过滤（根据 Argument 开关删除对象）
 * 开关为 true → 保留
 * 开关为 false → 删除
 * 时间：10:27
 */

let body = $response.body || "{}";

// 默认配置（与插件 Argument 默认一致）
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

// 读取 Loon 插件参数（安全处理）
let args = (typeof $argument !== "undefined" && $argument) ? $argument : {};
console.log("传入参数:", JSON.stringify(args));

// 覆盖默认值
Object.keys(cfg).forEach(k => {
  if (args[k] === "true" || args[k] === "false") {
    cfg[k] = (args[k] === "true");
  }
});

// 打印最终配置
console.log("Ecovacs 参数:", JSON.stringify(cfg));

// clickUri → 配置键映射
function uriToKey(uri) {
  if (!uri) return null;
  const u = String(uri).trim();
  switch (u) {
    case "myOrder": return "MYORDER";
    case "exchangeRecord": return "EXCHANGERECORD";
    case "myActivity": return "MYACTIVITY";
    case "myGiftCard": return "MYGIFTCARD";
    case "userFavoriteList": return "MYFAVORITE";
    case "myComment": return "MYCOMMENT";
    case "helpfbView": return "HELPFEEDBACK";
    case "warrantyCard": return "WARRANTYCARD";
    default:
      if (u.startsWith("https://e-ser.ecovacs.cn/service/")) return "SERVICEHALL";
      return null;
  }
}

try {
  let obj = JSON.parse(body);

  // 修改前菜单日志
  if (obj?.data?.menuList) {
    console.log("修改前菜单:");
    obj.data.menuList.forEach(sec => {
      if (Array.isArray(sec.menuItems)) {
        console.log(sec.menuItems.map(i => i.menuName).join(" | "));
      }
    });
  }

  const removed = [];

  // 遍历并删除开关为 false 的对象
  if (obj?.data?.menuList) {
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        section.menuItems = section.menuItems.filter(item => {
          const key = uriToKey(item.clickUri);
          if (key && cfg[key] === false) {
            removed.push(item.menuName);
            return false; // 删除
          }
          return true; // 保留
        });
      }
    });
  }

  // 修改后菜单日志
  if (obj?.data?.menuList) {
    console.log("修改后菜单:");
    obj.data.menuList.forEach(sec => {
      if (Array.isArray(sec.menuItems)) {
        console.log(sec.menuItems.map(i => i.menuName).join(" | "));
      }
    });
  }

  if (removed.length > 0) {
    console.log("已删除菜单项:", removed.join(" | "));
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log("Ecovacs menu parse error:", e);
  $done({ body });
}
