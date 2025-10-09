/*
 * Ecovacs 我的页面菜单过滤（根据 Argument 开关删除对象）
 * 开关为 true → 保留
 * 开关为 false → 删除
 * 时间：11:24
 */


let body = $response.body || "{}";

// let aa = $argument.MYORDER
// console.log("aa:", aa);

const cookie = $argument?.Cookie;
console.log("✅ 网易云音乐会员已解锁 🎉","cookie");

// 读取 Loon 插件参数
let args = (typeof $argument !== "undefined" && $argument) ? $argument : {};
console.log("传入参数:", JSON.stringify(args));

// 覆盖默认值
Object.keys(cfg).forEach(k => {
  if (args[k] === "true" || args[k] === "false") {
    cfg[k] = (args[k] === "true");
  }
});

console.log("最终配置:", JSON.stringify(cfg));

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

  // 遍历并删除开关为 false 的对象（基于 menuName）
  if (obj?.data?.menuList) {
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        section.menuItems = section.menuItems.filter(item => {
          if (item.menuName === "我的订单" && !cfg.MYORDER) { removed.push(item.menuName); return false; }
          if (item.menuName === "服务大厅" && !cfg.SERVICEHALL) { removed.push(item.menuName); return false; }
          if (item.menuName === "兑换记录" && !cfg.EXCHANGERECORD) { removed.push(item.menuName); return false; }
          if (item.menuName === "我的活动" && !cfg.MYACTIVITY) { removed.push(item.menuName); return false; }
          if (item.menuName === "我的E享卡" && !cfg.MYGIFTCARD) { removed.push(item.menuName); return false; }
          if (item.menuName === "我的收藏" && !cfg.MYFAVORITE) { removed.push(item.menuName); return false; }
          if (item.menuName === "我的评论" && !cfg.MYCOMMENT) { removed.push(item.menuName); return false; }
          if (item.menuName === "帮助与反馈" && !cfg.HELPFEEDBACK) { removed.push(item.menuName); return false; }
          if (item.menuName === "电子保修卡" && !cfg.WARRANTYCARD) { removed.push(item.menuName); return false; }
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

  let finalBody = JSON.stringify(obj);
  console.log("=final body head=", finalBody.slice(0, 500)); // 打印前500字符，避免日志过长
  $done({ body: finalBody });

} catch (e) {
  console.log("Ecovacs menu parse error:", e);
  $done({ body });
}

