const url = "http://biapi.localhost:8080/";
// const url = "http://hnoffice.acs.vn:8080/";
// const url = "http://biapi.acs.vn:8080/";
var msg = require('./messages.js');
const config = {
    user: 'bi_dev_read',
    password: '123456a@',
    server: 'pyxis.acs.vn', // You can use 'localhost\\instance' to connect to named instance
    database: 'biapi',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true // Use this if you're on Windows Azure
    },
}
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('match origin protocol', true);
io.set('origins', '*:*');

var fs = require('fs');

// Tương tác với API để lấy dữ liệu
var request = require('request');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var page_array = [];


io.on('connection', function (socket) {
    console.log('a user connected: ' + socket.id);
    // console.log('a user connected', socket);

    // Khai báo room theo id của organization nếu có thay đổi dữ liệu sẽ gửi xuống tất cả các thiết bị
    // socket.on('fba_tablet_register_room', function (data) {       
    //     console.log('fba_tablet_register_room', data);
    //     if (data != null) {
    //         // Đăng ký room theo serial_number
    //         var room_tablet_serial_number = 'room_tablet_serial_number_' + data.serial_number
    //         socket.join(room_tablet_serial_number);
    //         socket.room_tablet_serial_number = room_tablet_serial_number;


    //         var room_fba_organization = 'room_fba_organization_' + data.organization_id
    //         socket.join(room_fba_organization);
    //         socket.room_fba_organization = room_fba_organization;

    //         console.log(io.sockets.adapter.rooms);
    //     }
    // });

    socket.on('test_emit', function (data) {
        var get_data = data.data;
        get_data.location_id_check = 5;
        // console.log(get_data);
        var message_object = msg.get_msg(0, '71492d06-dfb0-4196-b44a-04e6ccdb0960', 'plug');
        add_notification(get_data, message_object, '/api/insert_notification_with_location_id');
    });

    // Nhận yêu cầu lấy token
    socket.on('fba_tablet_get_access_token', function (data) {
        // console.log('fba_tablet_get_access_token: ', data);
        request.post({
            headers: { 'content-type': 'application/json' },
            url: url + 'oauth/token',
            form: {
                grant_type: data.grant_type,
                client_id: data.client_id,
                client_secret: data.client_secret,
                scope: data.scope
            }
        }, function (error, response, body) {
            // console.log('fba_tablet_get_access_token response: ', body);

            // Gửi dữ liệu về máy yêu cầu đăng nhập
            socket.emit('fba_tablet_get_access_token', body);
        });
    });
    socket.on('fba_tablet_lock', function (data) {
        // request {serial_number: 'mã imei hoặc serial'}

        // true là mở thiết bị, false là khóa thiết bị
        socket.emit('fba_tablet_lock', { serial_number: data.serial_number, status: true });
    });


    // Lấy dữ liệu trả về máy tính bảng
    // bao gồm cấu hình ứng dụng
    // Câu hỏi mặc định
    // Danh sách câu hỏi
    socket.on('fba_tablet_get_data', function (data) {

        if (data == null || data.tocken_type == null || data.access_token == null || data.serial_number == null) {
            socket.emit('fba_tablet_get_data', null);
        } else {
            if (data.serial_number != null) {
                var room_name = 'room_fba_tablet_' + data.serial_number
                socket.join(room_name);
                socket.room_fba_tablet = room_name;
                console.log('qqqqqqqq', io.sockets.adapter.rooms);
            }

            // Lấy thông tin thiết bị, vị trí, cửa hàng, tổ chức
            url_parth = '/api/fba_tablet_get_info'
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    serial_number: data.serial_number,
                }
            },
                function (error, response, body) {
                    // io.sockets.emit('fba_tablet_get_info', body);
                    socket.emit('fba_tablet_get_info', body);
                });

            // Lấy dữ liệu câu hỏi
            console.log('fba_tablet_get_data', data);
            url_parth = '/api/fba_tablet_get_data'
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    serial_number: data.serial_number,
                }
            }, function (error, response, body) {
                // console.log('fba_tablet_get_data body: ', body);            
                if (body != null) {
                    try {
                        var room_name = 'room_fba_organization_' + JSON.parse(body).app_setting.organization_id
                        socket.join(room_name);
                        socket.room_fba_organization = room_name;
                    } catch (err) {
                        console.log(err);
                    }

                }
                // console.log('wwwwwwwwwwwwwwww', io.sockets.adapter.rooms);
                socket.emit('fba_tablet_get_data', body);
            });
        }

    });

    socket.on('fba_tablet_get_data_v2', function (data) {

        if (data == null || data.tocken_type == null || data.access_token == null || data.serial_number == null) {
            socket.emit('fba_tablet_get_data_v2', null);
        } else {
            if (data.serial_number != null) {
                var room_name = 'room_fba_tablet_' + data.serial_number
                socket.join(room_name);
                socket.room_fba_tablet = room_name;
                console.log('qqqqqqqq', io.sockets.adapter.rooms);
            }

            // Lấy thông tin thiết bị, vị trí, cửa hàng, tổ chức
            url_parth = '/api/fba_tablet_get_info'
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    serial_number: data.serial_number,
                }
            },
                function (error, response, body) {
                    // io.sockets.emit('fba_tablet_get_info', body);
                    socket.emit('fba_tablet_get_info', body);
                });

            // Lấy dữ liệu câu hỏi
            console.log('fba_tablet_get_data', data);
            url_parth = '/api/fba_tablet_get_data_v2'
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    serial_number: data.serial_number,
                }
            }, function (error, response, body) {
                // console.log('fba_tablet_get_data body: ', body);            
                if (body != null) {
                    try {
                        var room_name = 'room_fba_organization_' + JSON.parse(body).app_setting.organization_id
                        socket.join(room_name);
                        socket.room_fba_organization = room_name;
                    } catch (err) {
                        console.log(err);
                    }

                }
                // console.log('wwwwwwwwwwwwwwww', io.sockets.adapter.rooms);
                socket.emit('fba_tablet_get_data_v2', body);
            });
        }

    });

    // Nhận câu trả lời từ máy tính bảng
    socket.on('fba_question_tablet_feedback', function (data) {
        console.log('fba_question_tablet_feedback', data);

        try {
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + '/api/fba_question_tablet_feedback',
                form: {
                    data: data.data
                }
            }, function (error, response, body) {

                // Chỉ gửi dữ liệu về máy yêu cầu
                socket.emit('fba_question_tablet_feedback', body);


            });
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('fba_tablet_status', function (data) {
        console.log('fba_tablet_status', data);
        page_array.push({
            serial_number: data.serial_number
            , socket_id: socket.id
        })
        // Đẩy dữ liệu về web
        socket.broadcast.emit('fba_tablet_status_web', data);
        if (data == null || data.tocken_type == null || data.access_token == null) {
            socket.emit('fba_tablet_get_data', null);
        } else {
            // Nghĩa code ngày 09-05-2019
            var connect_type = null;
            if (data.network === 'wifi') {
                connect_type = 'wifi';
            } else {
                connect_type = 'signal';
            }
            var url_to_emit = '/api/insert_notification_with_location_id';
            var message_object = msg.get_msg(0, data, connect_type);
            add_notification(data, message_object, url_to_emit);
            // end Nghĩa
            url_parth = '/api/fba_tablet_update_status'

            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form:
                {
                    data: data.data
                    // serial_number: data.serial_number,
                    // pin: data.pin,
                    // network: data.network,
                    // storage_capacity: data.storage_capacity,
                    // storage_free: data.storage_free,
                    // storage_capacity_unit: data.storage_capacity_unit,
                    // storage_free_unit: data.storage_free_unit,
                }
            }, function (error, response, body) {
                console.log('fba_tablet_status: ', body)
                socket.emit('fba_tablet_status', body);
            });
        }

    });

    socket.on('fba_tablet_reload_data', function (data) {
        console.log('fba_tablet_reload_data: ', data)

        if (data == null || data.tocken_type == null || data.access_token == null) {
            socket.emit('fba_tablet_get_data', null);
            console.log('fba_tablet_reload_data: Quyet 1');
        } else {

            console.log('fba_tablet_reload_data: Quyet 2');
            url_parth = '/api/fba_tablet_get_data_v2'

            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    organization_id: data.organization_id,
                }
            }, function (error, response, body) {

                try {
                    room_fba_organization = 'room_fba_organization_' + data.organization_id;

                    console.log('room_fba_organization: ', room_fba_organization);

                    io.in(room_fba_organization).emit('fba_tablet_get_data_v2', body);
                    console.log('fba_tablet_reload_data: Quyet 3');

                } catch (err) {
                    console.log(err);
                }


            });
        }
    });

    // Tablet gửi yêu cầu lấy thông tin của thiết bị
    socket.on('fba_tablet_get_info', function (data) {
        console.log('fba_tablet_get_info: ', data)
        if (data == null || data.tocken_type == null || data.access_token == null) {
            socket.emit('fba_tablet_get_data', null);
        } else {
            url_parth = '/api/fba_tablet_get_info'
            request.post({
                headers: {
                    'content-type': 'application/json',
                    'Authorization': data.tocken_type + ' ' + data.access_token
                },
                url: url + url_parth,
                form: {
                    serial_number: data.serial_number,
                }
            }, function (error, response, body) {
                // io.sockets.emit('fba_tablet_get_info', body);
                socket.emit('fba_tablet_get_info', body);
            });
        }
    });

    socket.on('fba_webadmin_test', function (data) {
        console.log('fba_webadmin_test', 'response data from server: ' + data);
        console.log('fba_webadmin_test', 'response data from server json: ' + JSON.stringify(data));
        socket.emit('fba_webadmin_test', 'response data from server: ' + data);
    });
    socket.on('footfall_test', function (data) {
        console.log('footfall_terminal_status', data);
        socket.emit('footfall_terminal_web_status', data.data);
    });

    // Đẩy dữ liệu lên web
    // socket.on('fba_tablet_update_realtime', function (data) {
    //     console.log(data);
    //     var res = data.data;
    //     // console.log(socket.handshake.query.data);
    //     page_array.push({
    //         serial_number: res.serial_number
    //         , socket_id: socket.id
    //     });
    //     // console.log(page_array);
    //     // room_fba_tablet = 'room_fba_tablet_' + res.serial_number;
    //     // console.log('room_fba_tablet: ', room_fba_tablet);

    //     io.emit('fba_tablet_status_web', data);
    //     // io.in(room_fba_tablet).emit('fba_tablet_status_web', data);
    //     // console.log(socket.id);
    // });
    // Nghĩa thêm sự kiện đẩy dữ liệu giám sát thiết bị bricksteam
    socket.on('poc_brickstream_terminals_status', function (data) {
        console.log('get from emit data API', data);
        var get_data = data;
        socket.broadcast.emit('poc_brickstream_terminals_status', get_data);
    });
    socket.on('disconnect', function () {
        var id = 0;
        var serial_number = null;
        console.log('ngat ket noi: ' + socket.id);
        for (let i = 0; i < page_array.length; i++) {
            if (page_array[i].socket_id === socket.id) {
                serial_number = page_array[i].serial_number ? page_array[i].serial_number : '';   // page_array.splice(i, 1);
            }
        };
        socket.broadcast.emit('fba_tablet_disconnect', serial_number ? serial_number : 'empty');
    });
}); // đóng kết nối connect
// Mở server ở cổng 8686
http.listen(8686, function () {
    console.log('listening on *:8686');
    // Gửi yêu cầu đến tất cả các tablet đăng ký lại room
    // sending to all connected clients
    // io.emit('fba_tablet_register_room');
});


// Nghĩa thêm function push notifications
function add_notification(data, message_object, get_url) {
    // console.log('hello', data);
    url_parth = get_url;
    request.post({
        headers: {
            'content-type': 'application/json',
            'Authorization': data.tocken_type + ' ' + data.access_token
        },
        url: url + url_parth,
        form: {
            // biến id dùng để check site theo vị trí location
            id: data.location_id_check,
            // biến message dùng để lưu vào bảng message
            message_object: JSON.stringify(message_object)
        }
    }, function (error, response, body) {
        try {
            console.log(JSON.parse(body));
            var get_data = JSON.parse(body);
            if (!('message' in get_data)) {
                console.log(get_data.message_object);
                get_data.message_object.forEach(element => {
                    console.log('get_notifications_' + element.user_id);
                    io.emit('get_notifications_' + element.user_id, element);
                });
            }
        } catch (err) {
            console.log(err);
        }
    });
}
// End Nghĩa