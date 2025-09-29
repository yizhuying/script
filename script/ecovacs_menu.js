/*
 * Ecovacs 我的页面菜单过滤（Loon）
 * 读取 [Argument] 开关，动态控制菜单显示
 * - 开关为 true：保留
 * - 开关为 false：删除
 * 使用 clickUri 精确匹配，避免中文名称变化导致不命中
 * 增加日志：打印参数、修改前后菜单、删除的项目
 */

const raw = $response.body || "{}";

// 默认配置（与插件 Argument 默认一致）
const cfg = {
  MYORDER: true,        // myOrder
  SERVICEHALL: true,    // https://e-ser.ecovacs.cn/service/
  EXCHANGERECORD: true, // exchangeRecord
  MYACTIVITY: true,     // myActivity
  MYGIFTCARD: false,    // myGiftCard
  MYFAVORITE: true,     // userFavoriteList
  MYCOMMENT: true,      // myComment
  HELPFEEDBACK: true,   // helpfbView
  WARRANTYCARD: true    // warrantyCard
};

// 将插件界面的 Argument 值覆盖默认配置
Object.keys(cfg).forEach(k => {
  const v = $argument?.[k];
  if (v === "true" || v === "false") cfg[k] = (v === "true");
});

// 打印参数
console.log("Ecovacs 参数:", JSON.stringify(cfg));

// clickUri -> 配置键 的映射
const uriToKey = (uri) => {
  if (!uri) return null;
  // 规范化 URI（去空白）
  const u = String(uri).trim();

  switch (u) {
    case "myOrder":          return "MYORDER";
    case "exchangeRecord":   return "EXCHANGERECORD";
    case "myActivity":       return "MYACTIVITY";
    case "myGiftCard":       return "MYGIFTCARD";
    case "userFavoriteList": return "MYFAVORITE";
    case "myComment":        return "MYCOMMENT";
    case "helpfbView":       return "HELPFEEDBACK";
    case "warrantyCard":     return "WARRANTYCARD";
    default:
      // 服务大厅是完整 URL
      if (u.startsWith("https://e-ser.ecovacs.cn/service/")) return "SERVICEHALL";
      return null; // 未映射项默认保留
  }
};

try {
  const obj = JSON.parse(raw);

  // 修改前菜单日志
  if (obj?.data?.menuList && Array.isArray(obj.data.menuList)) {
    console.log("修改前菜单:");
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        console.log(section.menuItems.map(i => i.menuName).join(" | "));
      }
    });
  }

  // 记录删除的项
  const removed = [];

  // 过滤逻辑：按开关删除为 false 的项
  if (obj?.data?.menuList && Array.isArray(obj.data.menuList)) {
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        const kept = [];
        section.menuItems.forEach(item => {
          const key = uriToKey(item.clickUri);
          if (key === null) {
            // 未映射项：默认保留
            kept.push(item);
          } else {
            const keep = cfg[key] === true;
            if (keep) {
              kept.push(item);
            } else {
              removed.push(item.menuName || item.clickUri || "[未知项]");
            }
          }
        });
        section.menuItems = kept;
      }
    });
  }

  // 修改后菜单日志
  if (obj?.data?.menuList && Array.isArray(obj.data.menuList)) {
    console.log("修改后菜单:");
    obj.data.menuList.forEach(section => {
      if (Array.isArray(section.menuItems)) {
        console.log(section.menuItems.map(i => i.menuName).join(" | "));
      }
    });
  }

  // 删除项日志
  if (removed.length > 0) {
    console.log("已删除菜单项:", removed.join(" | "));
  } else {
    console.log("未删除任何菜单项（所有开关均为保留或未映射）。");
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log("Ecovacs menu parse error:", e);
  // 解析失败直接返回原始响应，避免破坏页面
  $done({ body: raw });
}
