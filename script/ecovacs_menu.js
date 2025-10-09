/*
 * Ecovacs 我的页面菜单过滤（根据 Argument 开关删除对象）
 * ✅ 传入的 $argument 为布尔类型：
 *    true  → 保留
 *    false → 删除
 * 日期：2025-10-09 13:56
 */

const menuBody = $response.body;
const menu = JSON.parse(menuBody);

// ✅ 读取 $argument
const args = {
    myOrder: $argument?.myOrder,
    serviceHall: $argument?.serviceHall,
    exchangeRecord: $argument?.exchangeRecord,
    activity: $argument?.activity,
    enjoyCard: $argument?.enjoyCard,
    collections: $argument?.collections,
    myComment: $argument?.myComment,
    helpAndFeedback: $argument?.helpAndFeedback,
    electronicWarrantyCard: $argument?.electronicWarrantyCard,
};

// ✅ clickUri 与参数键名映射
const uriMap = {
    "myOrder": "myOrder",
    "https://e-ser.ecovacs.cn/service/": "serviceHall",
    "exchangeRecord": "exchangeRecord",
    "myActivity": "activity",
    "myGiftCard": "enjoyCard",
    "userFavoriteList": "collections",
    "myComment": "myComment",
    "helpfbView": "helpAndFeedback",
    "warrantyCard": "electronicWarrantyCard",
};

// ✅ 遍历并按布尔开关过滤
menu.data.menuList.forEach(group => {
    group.menuItems = group.menuItems.filter(item => {
        const key = uriMap[item.clickUri];
        // 没有映射项 → 默认保留
        if (!key) return true;
        // 参数为 false → 删除
        if (args[key] === false) return false;
        // 参数为 true 或未定义 → 保留
        return true;
    });
});

$done({ body: JSON.stringify(menu) });
