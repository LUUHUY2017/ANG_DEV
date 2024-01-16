module.exports.get_msg = function (number, terminal_name, icon) {
    var array = [
        {
            id: 0,
            message_content: `Thiết bị <b>${terminal_name}</b> đã kết nối trong module <b>trải nghiệm khách hàng</b>`,
            icon: icon,
        },
        {
            id: 1,
            message_content: `Thiết bị <b>${terminal_name}</b> đã có sự chỉnh sửa trong module <b>trải nghiệm khách hàng</b>`,
            icon: icon
        }
    ];
    var item = array.find(item => item.id === number);
    item.created_at = new Date;
    item.actived = 0;
    return item;
};