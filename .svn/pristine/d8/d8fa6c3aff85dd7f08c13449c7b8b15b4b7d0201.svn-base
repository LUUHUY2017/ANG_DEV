// const url = "http://biapi.localhost:8080/";
// const url = "http://hnoffice.acs.vn:8080/";
const url = "http://biapi.acs.vn:8080/";

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

io.on('connection', function (socket) {
    console.log('a user connected');
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
           // Đẩy dữ liệu về web
        socket.broadcast.emit('fba_tablet_status_web', data);
        if (data == null || data.tocken_type == null || data.access_token == null) {
            socket.emit('fba_tablet_get_data', null);
        } else {
			//Đẩy dữ liệu về trang giám sát thiết bị của web
			socket.broadcast.emit('fba_tablet_status_web', data);
			
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
});

// Mở server ở cổng 8686
http.listen(8686, function () {
    console.log('listening on *:8686');
    // Gửi yêu cầu đến tất cả các tablet đăng ký lại room
    // sending to all connected clients
    // io.emit('fba_tablet_register_room');
});