/*
 * Ecovacs 我的页面菜单过滤（根据 Argument 开关删除对象）
 * 开关为 true → 保留
 * 开关为 false → 删除
 * 时间：1328
 */

const MyOrder = $argument?.myOrder === "true";
const ServiceHall = $argument?.serviceHall === "true";
const ExchangeRecord = $argument?.exchangeRecord === "true";
const Activity = $argument?.activity === "true";
const EnjoyCard = $argument?.enjoyCard === "true";
const Collections = $argument?.collections === "true";
const MYComment = $argument?.myComment === "true";
const HelpAndFeedback = $argument?.helpAndFeedback === "true";
const ElectronicWarrantyCard = $argument?.electronicWarrantyCard === "true";

const menuBody = $response.body;
const menu = JSON.parse(menuBody);

function filterMenuItems(menuItems) {
    return menuItems.filter(item => {
        switch (item.clickUri) {
            case "myOrder":
                return MyOrder;
            case "https://e-ser.ecovacs.cn/service/":
                return ServiceHall;
            case "exchangeRecord":
                return ExchangeRecord;
            case "myActivity":
                return Activity;
            case "myGiftCard":
                return EnjoyCard;
            case "userFavoriteList":
                return Collections;
            case "myComment":
                return MYComment;
            case "helpfbView":
                return HelpAndFeedback;
            case "warrantyCard":
                return ElectronicWarrantyCard;
            default:
                return true; // 未定义的菜单默认保留
        }
    });
}

// 执行过滤逻辑
menu.data.menuList.forEach(section => {
    section.menuItems = filterMenuItems(section.menuItems);
});

// 输出通知与日志
const filteredCount = menu.data.menuList.reduce((sum, sec) => sum + sec.menuItems.length, 0);
console.log(`[Ecovacs] 过滤后剩余菜单项数量：${filteredCount}`);
$notification.post("Ecovacs菜单过滤", "过滤完成", `剩余 ${filteredCount} 个菜单项`);

// 返回修改后的响应体
$done({body: JSON.stringify(menu)});
