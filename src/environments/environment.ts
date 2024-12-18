// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { Version } from '../version';

export const environment = {
    production: false,
    suffixApi: 'api',

    apiUrl: 'https://retail.acs.vn:8443/',
    // apiUrl: 'http://119.17.228.46:8080/',
    UrlSocket: 'https://bisocket.acs.vn:8686/',
    client_secret: 'pMcVtltzSopwTl24es094rhZFoqoeJcbtRl6bYqs',


    // apiUrl: 'https://biapi.acs.vn:8443/',
    // UrlSocket: 'https://bisocket.acs.vn:8686/',
    // client_secret: 'pMcVtltzSopwTl24es094rhZFoqoeJcbtRl6bYqs',

    // apiUrl: 'https://devbiapi.acs.vn:8443/',
    // UrlSocket: 'https://bisocket.acs.vn:8787/',
    // client_secret: 'zSVK9eeV6FZEl8hUSj7KKGVmnpKSOOVF5i3X5xDQ',


    _netUrl: 'https://171.244.9.17:9900/',
    // _netUrl: 'https://192.168.1.29:9900/',
    // _netUrl: 'http://localhost:9900/',
    // apiUrl: 'http://localhost:8080/biapi/public/',
    // apiUrl: 'http://biapi.localhost:8080/',
    // apiUrl: 'http://localhost:8080/biapi/public/',
    // apiUrl: 'http://biapi.localhost:8080/',
    // apiUrl: 'https://devbiapi.acs.vn:8443/',
    // apiUrl: 'http://test.neatclean.vn:8080/biapi/public/',
    // apiUrl: 'https://biapi.acs.vn:8443/',
    // apiUrl: 'https://devbiapi.acs.vn:8443/',
    // apiUrl: 'http://biapi.acs.vn:8080/',
    // apiUrl: 'http://api.bi.acs.vn/',
    // apiUrl: 'https://api.acs.vn/',
    connectSocketIo: '1',
    // UrlSocket: 'https://bisocket.acs.vn:8686/',
    // UrlSocket: 'https://bisocket.acs.vn:8686/',
    // UrlSocket: 'http://127.0.0.1:8686/',
    oauth_token: 'oauth_token',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    client_id: 1,
    // client_secret: 'pMcVtltzSopwTl24es094rhZFoqoeJcbtRl6bYqs',
    grant_type: 'password',
    scope: '*',
    Bearer: 'Bearer',
    ReturnUrl: 'ReturnUrl',
    UserLoged: 'UserLoged',
    module_array: 'module_array',
    Left_menu_array: 'Left_menu_array',
    expert_page_permission: 'expert_page_permission',
    is_admin_organization: 'is_admin_organization',
    version: Version.version,
    validation_code: '770',
    default_error_string: 'Có lỗi xảy ra',
    language: 'language',
    uploadImageHeight: 1200,
    uploadImageWidth: 1200,
    localStorage: {
        overview: 'overview',
        dashboard: 'dashboard',
        dashboard_overview: 'dashboard_overview',
        start_time_list: 'start_time_list',
        end_time_list: 'end_time_list',
        performance_index_group: 'performance_index_group',
        organization_arr: 'organization_arr',
        traffic_index: 'traffic_index',
        menu_tree: 'menu_tree',
        question_id: 'question_id',
        indexes: 'indexes',
        indexess: 'indexess',
        language_index_vn: 'language_index_vn',
    },
    // Quản lý trạng thái
    STATE: {
        insert: 'insert',
        update: 'update',
        delete: 'delete',
        search: 'search',
        retrieve: 'retrieve'
    },
    //
    _netAPI: {
        admin_staff_vip_blacklist_add_image: 'api/admin_staff_vip_blacklist_add_image',
        admin_staff_vip_blacklist_get_image: 'api/admin_staff_vip_blacklist_get_image',
        admin_staff_vip_blacklist_delete_image: 'api/admin_staff_vip_blacklist_delete_image',
        admin_staff_vip_blacklist_soft_delete: 'api/admin_staff_vip_blacklist_soft_delete',
        admin_staff_vip_blacklist_delete: 'api/admin_staff_vip_blacklist_delete',
        admin_staff_vip_blacklist_rollback_data: 'api/admin_staff_vip_blacklist_rollback_data'
    },
    API: {
        fbaTablet: {
            getData: 'api/fbaTablet/getData'
            , insert: 'api/fbaTablet/insert'
            , update: 'api/fbaTablet/update'
            , delete: 'api/fbaTablet/delete'
        },
        fbaAppSetting: {
            getData: 'api/fbaAppSetting/getData'
            , insert: 'api/fbaAppSetting/insert'
            , update: 'api/fbaAppSetting/update'
            , softDelete: 'api/fbaAppSetting/softDelete'
            , delete: 'api/fbaAppSetting/delete'
            , getUpdate: 'api/fbaAppSetting/getUpdate'
        },
        terminal: {
            getData: 'api/terminal/getData'
            , insert: 'api/terminal/insert'
            , update: 'api/terminal/update'
            , delete: 'api/terminal/delete'
            , usermail: {
                getData: 'api/terminal/usermail/getData'
                , insert: 'api/terminal/usermail/insert'
                , update: 'api/terminal/usermail/update'
                , delete: 'api/terminal/usermail/delete'
            }
        },
        // general
        organization: {
            getData: 'api/organization/getData'
            , insert: 'api/organization/insert'
            , update: 'api/organization/update'
            , softDelete: 'api/organization/softDelete'
            , delete: 'api/organization/delete'
            , updateRole: 'api/organization/updateRole'
            , getRole: 'api/organization/getRole'
        },
        site: {
            getData: 'api/site/getData'
            , insert: 'api/site/insert'
            , update: 'api/site/update'
            , softDelete: 'api/site/softDelete'
            , delete: 'api/site/delete'
        },
        location: {
            getData: 'api/location/getData'
            , insert: 'api/location/insert'
            , update: 'api/location/update'
            , softDelete: 'api/location/softDelete'
            , delete: 'api/location/delete'
        },
        categories: {
            getData: 'api/categories/getData'
            , insert: 'api/categories/insert'
            , update: 'api/categories/update'
            , softDelete: 'api/categories/softDelete'
            , delete: 'api/categories/delete'
        },
        users: {
            getData: 'api/user/getData'
            , insert: 'api/user/insert'
            , update: 'api/user/update'
            , softDelete: 'api/user/softDelete'
            , delete: 'api/user/delete'
            , sendNewPassword: 'api/user/sendNewPassword'
            , changePassword: 'api/user/changePassword'
            , updateCurrentRoleUser: 'api/user/updateCurrentRoleUser'
            , getCurrentRoleUser: 'api/user/getCurrentRoleUser'
        },
        client: {
            getData: 'api/client/getData'
            , insert: 'api/client/insert'
            , update: 'api/client/update'
            , softDelete: 'api/client/softDelete'
            , delete: 'api/client/delete'
        },
        oaZalo: {
            getData: 'api/oaZalo/getData'
            , insert: 'api/oaZalo/insert'
            , update: 'api/oaZalo/update'
            , softDelete: 'api/oaZalo/softDelete'
            , delete: 'api/oaZalo/delete'
            , event: {
                getData: 'api/oaZalo/event/getData'
                , eventAccFollowerDelete: 'api/oaZalo/event/eventAccFollowerDelete'
                , updateEventAndFollower: 'api/oaZalo/event/updateEventAndFollower'
                , eventGetFollower: 'api/oaZalo/event/eventGetFollower'
            }
        },
        zaloFollower: {
            getData: 'api/zaloFollower/getData'
            , insert: 'api/zaloFollower/insert'
            , update: 'api/zaloFollower/update'
            , softDelete: 'api/zaloFollower/softDelete'
            , delete: 'api/zaloFollower/delete'
        },
        mail_configuration: {
            getData: 'api/mail_configuration/getData'
            , insert: 'api/mail_configuration/insert'
            , update: 'api/mail_configuration/update'
            , softDelete: 'api/mail_configuration/softDelete'
            , delete: 'api/mail_configuration/delete'
        },
        // end
        mailReportSchedule: {
            insert: 'api/userMailReport/insert'
            , update: 'api/userMailReport/update'
            , softDelete: 'api/userMailReport/softDelete'
            , delete: 'api/userMailReport/delete'
            , userMailScheduleGetData: 'api/userMailReport/userMailScheduleGetData'
            , checkExistParam: 'api/userMailReport/checkExistParam'
            , unsubcribeSchedule: 'api/userMailReport/unsubcribeSchedule'
            , unsubcribeNotification: 'api/userMailReport/unsubcribeNotification'
            , descriptionMail: 'api/userMailReport/descriptionMail'
        },
        userInfo: {
            getMailScheduleInfo: 'api/userInfo/getMailScheduleInfo',
            getSpecificPageSchedule: 'api/userInfo/getSpecificPageSchedule',
            forgotPassword: 'api/forgotPassword'
        },
        userGetOrg: 'api/userGetOrg',
        userGetSite: 'api/userGetSite',
        logout: 'api/logout',
        oauth_token: 'oauth/token',
        user: 'api/user',
        group: 'api/group',
        page_permission: 'api/page_permission',
        roles: 'api/roles',
        get_user_permission: 'api/get_user_permission',
        // Báo cáo
        // FootFall
        // Visits
        sp_poc_data_in_out_sum_by_site: 'api/sp_poc_data_in_out_sum_by_site',
        sp_poc_data_in_out_sum_by_site_export_excel: 'api/sp_poc_data_in_out_sum_by_site_export_excel',
        // heatmap
        sp_footfall_heatmap_poc_data_in_out_sum: 'api/sp_footfall_heatmap_poc_data_in_out_sum',
        sp_footfall_heatmap_treemap_coloraxis_sum: 'api/sp_footfall_heatmap_treemap_coloraxis_sum',

        // Customer Daily
        sp_report_poc_raw_data_by_day: 'api/sp_report_poc_raw_data_by_day',
        sp_report_poc_raw_data_by_month: 'api/sp_report_poc_raw_data_by_month',
        sp_report_poc_raw_data_by_year: 'api/sp_report_poc_raw_data_by_year',
        // livew
        sp_footfall_get_traffic: 'api/sp_footfall_get_traffic',
        sp_footfall_get_traffic_live: 'api/sp_footfall_get_traffic_live',

        sp_footfall_time_comparison: 'api/sp_footfall_time_comparison',
        // sp_footfall_store_comparison
        sp_footfall_store_comparison: 'api/sp_footfall_store_comparison',
        sp_footfall_get_terminal_monitor: 'api/sp_footfall_get_terminal_monitor',
        organizations: 'api/organizations',

        get_message_with_user: 'api/get_message_with_user',
        update_status_message: 'api/update_status_message',
        get_organization_for_login: 'api/get_organization_for_login',
        sp_get_feedback_list: 'api/sp_get_feedback_list',
        sp_get_help_list: 'api/sp_get_help_list',
        sites: 'api/sites',
        sites_tree: 'api/sites_tree',
        vip_user: 'api/vip_user',
        black_list: 'api/black_list',
        staff_upload: 'api/staff_upload',
        sp_get_oa_zalo: 'api/sp_get_oa_zalo',
        sp_get_zalo_follower: 'api/sp_get_zalo_follower',
        sp_get_web_hook: 'api/sp_get_web_hook',
        get_organization_client: 'api/get_organization_client',

        COMMON: {
            get_start_time: 'api/get_start_time',
            get_end_time: 'api/get_end_time',
            get_traffic_index: 'api/get_traffic_index',
            get_user_page_parametter: 'api/get_user_page_parametter',
            user_page_parametter: 'api/user_page_parametter',
            user_send_email: 'api/user_send_email',
            mail_configuration: 'api/mail_configuration'
        }
    },
    POC: {
        colors: {
            visits: '#0426c0',
            exits: '#c336c0',
            traffic_flow: '#12a8c6',
            avg_time: '#ec2f9d',
            compare: '#696969',
            very_positive: '#069D30',
            positive: '#A0C883',
            very_negative: '#ED1E24',
            negative: '#e18889',
            labels: '#223ac2',
            fillColor: 'blue',
            backgroundColor: 'white',
            stackLabels: '#223ac2',
            showcolumn: 'black',
            showcolumnline: 'gray',
            age: '#00a8ff',
            female: '#f32a86',
            male: '#00a8ff',
            unknown: '#aaa69d',
            npsindex: 'DarkTurquoise',
            cxindex: 'OrangeRed',
            logo: '#F3B21C',
            overview: '#09a1e2',
            heatmap: '#8bc4f8',
            items: 'OliveDrab',
            sales: 'darkorange',
            customers: '#9C27B0',
            atv: '#2b908f',
            passer_by: 'Indigo',
            shopper_visits: 'Red',
            conversion: '#40407a',
            kids_visits: '#7B68EE',
            turn_in_rate: 'LightSeaGreen',
            sales_yield: 'LimeGreen',
            loyal_visits: '#00ff00',
            loyal_transactions: '#227093',
            loyal_conversion: 'Gold',
            missed_sales: 'FireBrick',
            missed_loyal: '#c44569',
            sales_hour: 'lightblue',
            shopper_on_sh: '#0be881',
            sales_on_s_h: '#c44569',
        },
        input_start_date: '',
        input_end_date: '',

        input_start_date_compare: '',
        input_end_date_compare: '',

        organization_selected: '',
        organization_id_temp: '',
        organization_id: '',

        site_selected: '',
        site_selected_temp: '',

        footfall_visits_view: 'Day',
        footfall_visits_operation: 'SUM',

        footfall_heatmap_index_source: 'Visits',
        poc_data_in_out: 'api/poc_data_in_out',
        get_brickstream_terminals: 'api/get_brickstream_terminals'
    },
    FBA: {
        API: {
            sp_fba_overview_total: 'api/sp_fba_overview_total',
            get_user_page_parametter: 'api/get_user_page_parametter',
            get_question_for_report: 'api/get_question_for_report',

            fba_report_metrics_analytic: 'api/fba_report_metrics_analytic',
            export_metrics_analytic: 'api/export_metrics_analytic',

            fba_report_reason: 'api/fba_report_reason',
            export_report_reason: 'api/export_report_reason',
            fba_application_settings: 'api/fba_application_settings',
            fba_notifications: 'api/fba_notifications',

            fba_customer_info: 'api/fba_customer_info',
            export_customer_info: 'api/export_customer_info',

            get_category: 'api/get_category',
            fba_report_get_metrics_comparison: 'api/fba_report_get_metrics_comparison',
            export_metrics_comparison: 'api/export_metrics_comparison',
        },
        ADMIN: {
            sp_ad_question: 'api/sp_ad_question',
            // lấy điều kiện, câu hỏi mẫu để insert
            get_status_question_default: 'api/get_status_question_default',
            insert_question: 'api/insert_question',
            get_question_edit: 'api/get_question_edit',
            update_question: 'api/update_question',
            delete_question: 'api/delete_question',

            fba_get_tablet: 'api/fba_get_tablet',
            fba_get_tablet_follow: 'api/fba_get_tablet_follow',
            get_location_tablets: 'api/get_location_tablets',
            get_site_tablets: 'api/get_site_tablets',
            get_crud_page: 'api/get_crud_page',
            get_expert_page: 'api/get_expert_page'
        },
        Administration: {
            // người dùng
            user_organization: 'api/user_organization',
            insert_site: 'api/insert_site',
            update_site: 'api/update_site',
            delete_site: 'api/delete_site',

            // tổ chức
            get_organization_filter: 'api/get_organization_filter',
            insert_organization: 'api/insert_organization',
            update_organization: 'api/update_organization',
            delete_organization: 'api/delete_organization',

            // tài khoản
            get_users: 'api/get_users',
            get_users_filter: 'api/get_users_filter',
            insert_users: 'api/insert_users',
            edit_users: 'api/edit_users',
            delete_users: 'api/delete_users',

            // lấy thông tin email logs đã gửi
            sp_fba_report_user_email_logs: 'api/sp_fba_report_user_email_logs',
            sp_poc_report_user_email_logs: 'api/sp_poc_report_user_email_logs',

            // thiết bị tablets
            get_tablet_filter: 'api/get_tablet_filter',
            update_tablet: 'api/update_tablet',
            insert_tablet: 'api/insert_tablet',
            delete_tablet: 'api/delete_tablet',

            fba_get_terminals: 'api/fba_get_terminals',

            // Vị trí theo site of organization
            get_location: 'api/get_location',
            insert_location: 'api/insert_location',
            update_location: 'api/update_location',
            // categories
            categories: 'api/categories',

        }
    },
    GENDERAGE: {
        API: {
            sp_poc_gender_metric_analytic: 'api/sp_poc_gender_metric_analytic',
            sp_poc_gender_metrics_comparison: 'api/sp_poc_gender_metrics_comparison',
            sp_poc_gender_age_by_day: 'api/sp_poc_gender_age_by_day',
        },
        Administration: {
            sp_poc_gender_age_terminals: 'api/sp_poc_gender_age_terminals',
        }
    },
    PERFORMANCE: {
        API: {
            sp_footfall_performance: 'api/sp_footfall_performance',
        }
    },
    Pages: {
        dashboard: {
            dashboard: '2d4a0422-c561-4eed-94ba-52a1ad13ce7567-t'
        },
        footfall: {
            overview: '4408A000-DD6B-449C-8A67-3D97CCD61E9E', // Overview
            liveview: 'A9D64424-DD6B-439C-8067-3D9750E61E8A', // Liveview
            stores_reporting: '9FAC7554-BD80-4E23-9051-DD93BA9A70BC', // Hiệu quả hoạt động / Cửa hàng
            visits: '3E97AA44-548E-413E-A4F4-3017F52D649E', // Hiệu quả hoạt động / Chỉ số
            store_comparison: 'C68716CB-1935-4400-996D-0532623DF6A3', // Báo cáo so sánh / Cửa hàng
            time_comparison: '54BAE8E6-DE7E-49CB-9B6B-1EDE5952CE4B', // Báo cáo so sánh / Thời gian
            metrics_comparison: 'A3B35B35-A07C-46BC-BDF8-2EF53B1E7B97', // Báo cáo so sánh / Chỉ số
            store_trend: 'C869FC34-129D-47B6-A7F7-D594C5D084E0', // Phân tích xu hướng / Cửa hàng
            metric_trend: '1F1C74E7-D41C-45A8-B3D6-1E890C14988F', // Phân tích xu hướng / Chỉ số
            heatmap: 'F869CA5D-1393-423D-9426-ABE10CF222E2',
            customer_daily: 'F869CABB-1393-423D-9426-ABE10CF222E2',
            customer_monthly: 'e6ae9cd5-5556-4dbd-bede-ec09080f8c24',
            customer_yearly: '2fd4563d-0c0b-4f12-8ac8-65546ec87b0c',
            customer_entrance: '4408A010-DD6B-449C-3A67-3D97CCD61E5E',
            //
            brickstream_terminals: '79a1d3c6-4695-40be-a0e3-1d69a8633498-t',
            user_mail_setting: '5dbed73d-8397-4dc4-9e30-52e37ef75b05-t',

            store_comparison2: '285d433d-0666-4ed9-8356-bg7b7647c49h-t',
            time_comparison2: '285d433d-0665-4ed9-835r-bg7b7647c49d-t',
            metrics_comparison2: '285h433d-0668-4ed9-835r-bg7b7647c49h-t',

            boston: 'F869CA5D-1393-423D-9426-ABE10CF223AA', // Mô hình boston
            performance_reporting_stores: 'F869CA5D-1393-423D-9426-ABE10CF223AB', // Hiệu quả hoạt động / Cửa hàng
            performance_visits: 'F869CA5D-1393-423D-9426-ABE10CF223AC', // Hiệu quả hoạt động / Chỉ số
            performance_store: 'F869CA5D-1393-423D-9426-ABE10CF223AD', // Báo cáo so sánh / Cửa hàng
            performance_time: 'F869CA5D-1393-423D-9426-ABE10CF223AE', // Báo cáo so sánh / Thời gian
            performance_metrics: 'F869CA5D-1393-423D-9426-ABE10CF223AF', // Báo cáo so sánh / Chỉ số
            performance_store_trending: 'F869CC3C-1D93-CC3D-9426-ABE10CF923CC', // Phân tích xu hướng / Cửa hàng
            performance_metrics_trending: 'F869CA5D-1393-423D-9426-ABE10CF22DDD', // Phân tích xu hướng / Chỉ số
            performance_time_trending: 'F869CA5D-1393-423D-9426-ABE10CF223AK', // Phân tích xu hướng / Thời gian
        },
        fba: {
            overview: '1F1C74E7-D41C-45A8-B3D6-1E890C14988A', // Tổng quan
            metrics_analytics: '1F1C74E7-D41C-45A8-B3D6-1E890C14988B', // Phân tích chỉ số
            metrics_comparison: '1F1C74E7-D41C-45A8-B3D6-1E890C14988C', // Báo cáo so sánh
            reason: '1F1C74E7-D41C-45A8-B3D6-1E890C14988D', // Lý do không hài lòng
            customer_info: '1F1C74E7-D41C-45A8-B3D6-1E890C14988E', // Thông tin khách hàng
            detail_fbacustomer_info: '1F1C74E7-D41C-45A8-B3D6-1E890C14988F', // Thông tin đánh giá
            //
            fba_application_settings: 'baf65cd9-6737-4c41-b0fe-d166fc694ed4-t',
            // chỉ có lever bằng 0 mới được quyền thêm cấu hình
            edit_application_settings: '22834b2a-1cce-4310-9107-050fee0b0f20-t',
            fba_notifications: '77f5ab34-91d9-494d-ae84-b5910c4d4352-t',
            edit_notifications: 'b15e66aa-0b43-4122-9767-df0674900848-t',
            staff_performance: '3630705e-de24-482d-9e96-d7f1b5c524f0-t',
            questions: 'd41b08a7-f54d-410b-adee-92e70ce790a5-t',
            add_questions: '691734e5-13bd-4aa6-970d-7e285d3666ef-t',
            edit_questions: '9dd6c14a-d145-4541-97c0-753e693d7c4e-t',
            list_tablets: '556bc8ae-f798-4208-9295-85cefa8cc769-t',
            tablets: '1cfa63ac-334f-4de2-9a98-a8495466b4c6-t',
            user_mail_setting: 'a26fbd50-0ff5-48f6-9c3b-0235225f0f7c-t',
            terminals: '010e936f-1b29-460e-ba7e-71aa7c73b2fb'
        },
        general: {
            sites: 'c6bdbab9-f63c-4971-a1f7-40370c849076',
            location: '2c66b894-bf06-4b30-93b7-69e139ea6143',
            categories: '6292a33c-6c60-49df-ba1f-2db71a22fa87',
            users: 'b79cd9a3-d6be-43b5-96b6-92dec511394d',
            groups: '291d04fd-489f-4d30-869c-706bd77e129e',
            roles: '990e1660-5b39-4b9b-8a9c-cecf687f4c1f',
            organizations: '949f0802-f984-43d3-9024-2c599f20e33d'
        },
        admin: {
            addquestion: '06022E18-1562-4B3A-A787-5ADB1D3A094F',
            updatequestion: 'CF204E66-7D3A-498E-BF22-759312992052',
            adminquestion: '4F649971-15A1-4D3A-8B2B-DF8EE8D0A0D2',
            listtablets: 'C7171A14-ADA7-4356-99D2-355339987E2C',
        },
        administration: {
            users: '30FB1D02-182D-4F19-9F65-472D7D6E8B00',
            devices: '8870B326-84B7-4F9F-9563-F9D6A5A2FFE5',
            categories: 'B6458A12-CF5C-47ED-B9CF-8D2A93076E79',
            sites: '67186428-FD2D-4033-8197-B8DAD64CF8DC',
        },
        age: {
            users: '9EE6843F-81D9-4FCA-8559-0EB35B70D48E',
            terminals: 'C4483EE0-0573-453A-9576-735B6BFFEF9F',
            overview: '071F7010-6787-4796-B722-3A5B339C649A', // Tổng quan
            visit: '071F7010-6787-4796-B722-3A5B339C649B', // Giới tính độ tuổi phân tích
            metrics_age: '071F7010-6787-4796-B722-3A5B339C649C', // Độ tuổi
            metrics_gender: '071F7010-6787-4796-B722-3A5B339C649D', // Giới tính
        },
        terminal: {
            monitor: '0B18CFED-5362-41E6-9793-55252E5BBAC4'
        }
    }
};
