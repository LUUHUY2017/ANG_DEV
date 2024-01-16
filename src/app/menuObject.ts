export namespace MenuItemNameSpace {
    const menu_icon_url = 'assets/img/iconmenu/';
    export abstract class MenuItem {
        name: string;
        url: string;
        module_title: string;
        icon: string;
        children?: Array<any>;
        icon_src?: string;
    }
    export class DefaultMenuItem extends MenuItem {
        name = 'Bảng tổng hợp';
        url = '/dashboard';
        module_title = 'default';
        icon = 'icon-home';
        name_en = 'Dashboard';
    }

    export class AboutMenuItem extends MenuItem {
        name = ' Về AMMS Analytics';
        url = '/about';
        module_title = 'about';
        icon = 'icon icon-speech';
        name_en = 'About AMMS Analytics';
        children = [
            {
                name: 'Tổng quan',
                name_en: 'Overview',
                title: 'about',
                url: '/about',
                icon: 'icon-drop',
            },
            {
                name: 'Hướng dẫn sử dụng',
                name_en: 'User manual',
                title: 'about',
                url: '/guides/report',
                icon: 'icon-drop',
            }
        ];
    }
    export class NotificationMenuItem extends MenuItem {
        name = 'Thông báo và phản hồi';
        url = '/about';
        module_title = 'notification';
        icon = 'fa fa-info-circle';
        name_en = 'Notification and feedback';
        children = [
            {
                name: 'Thông báo',
                name_en: 'Notification',
                title: 'about',
                url: '/about',
                icon: 'icon-drop',
            },
            {
                name: 'Trợ giúp',
                name_en: 'Help',
                title: 'about',
                url: '/manual/report',
                icon: 'icon-drop',
            },
            {
                name: 'Phản hồi',
                name_en: 'Feedback',
                title: 'about',
                url: '/manual/report',
                icon: 'icon-drop',
            }
        ];
    }

    export class FbaMenuItem extends MenuItem {
        name = 'Trải nghiệm khách hàng'; // FBA
        url = '/fba';
        module_title = 'fba';
        icon = 'icon-star';
        icon_src = menu_icon_url + 'fba.jpg';
        name_en = 'CX - NPS Index';
        children = [
            {
                name: 'Tổng quan',
                name_en: 'Overview',
                title: 'fba',
                url: '/fba/overview',
                icon: 'icon-drop',
            },
            {
                name: 'Phân tích chỉ số',
                name_en: 'Metrics Analysis',
                title: 'fba',
                url: '/fba/metrics-analytics',
                icon: 'icon-drop',
            },
            {
                name: 'Báo cáo so sánh',
                name_en: 'Comparison Report',
                title: 'fba',
                url: '/fba/metrics-comparison',
                icon: 'icon-drop',
            },
            {
                name: 'Lý do không hài lòng',
                name_en: 'Unhappy factors',
                title: 'fba',
                url: '/fba/reason',
                icon: 'icon-drop',
            },
            {
                name: 'Thông tin khách hàng',
                name_en: 'Shopper information',
                title: 'fba',
                url: '/fba/customer-info',
                icon: 'icon-drop',
            },
            {
                name: 'Thông tin đánh giá',
                name_en: 'Detailed evaluation information',
                title: 'fba',
                url: '/fba/response-info',
                icon: 'icon-drop',
            },
        ];
    }
    export class FootfallMenuItem extends MenuItem {
        name = 'Hệ thống đếm người';
        url = '/footfall';
        module_title = 'footfall';
        icon = 'icon-star';
        icon_src = menu_icon_url + 'footfall.jpg';
        name_en = 'Footfall System';
        children = [

            {
                name: 'Tổng quan',
                name_en: 'Overview',
                title: 'footfall',
                url: '/footfall/overview',
                icon: 'fa fa-bar-chart',
            },
            // {
            //     name: 'Số khách hiện tại',
            //     name_en: 'Live Occupancy',
            //     title: 'footfall',
            //     url: '/footfall/liveview',
            //     icon: 'fa fa-bar-chart',
            // },
            // {
            //     name: 'Báo cáo tổng hợp', // Footfall Metrics
            //     name_en: 'Talubar report',
            //     title: 'footfall',
            //     url: '/footfall/rawdata',
            //     icon: 'fa fa-code',
            //     children: [
            //         {
            //             name: 'Theo ngày', // Footfall Store
            //             name_en: 'By day',
            //             title: 'footfall',
            //             url: '/footfall/customer-daily',
            //             icon: 'fa fa-bar-chart',
            //         },
            //         {
            //             name: 'Theo tháng',
            //             name_en: 'By month',
            //             title: 'footfall',
            //             url: '/footfall/customer-monthly',
            //             icon: 'fa fa-bar-chart',
            //         },
            //         {
            //             name: 'Theo năm',
            //             name_en: 'By year',
            //             title: 'footfall',
            //             url: '/footfall/customer-yearly',
            //             icon: 'fa fa-bar-chart',
            //         },
            //         {
            //             name: 'Theo cửa, khu vực',
            //             name_en: 'By locations',
            //             title: 'footfall',
            //             url: '/footfall/customer-entrance',
            //             icon: 'fa fa-bar-chart',
            //         },
            //         // {
            //         //     name: 'Ngày',
            //         //     name_en: 'Gate',
            //         //     title: 'footfall',
            //         //     url: '/footfall/report-daily',
            //         //     icon: 'fa fa-bar-chart',
            //         // }
            //     ]
            // },
            {
                name: 'Phân tích', // Footfall Metrics
                name_en: 'Analysis',
                title: 'footfall',
                url: '/footfall/visits',
                icon: 'fa fa-code',
                children: [
                    {
                        // name: 'Cửa hàng', // Footfall Time
                        // name_en: 'Store',
                        name: 'Theo địa điểm', // Footfall Time
                        name_en: 'By locations',
                        title: 'footfall',
                        url: '/footfall/reporting-stores',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo chỉ số', // Footfall Store
                        name_en: 'By metrics',
                        title: 'footfall',
                        url: '/footfall/visits',
                        icon: 'fa fa-bar-chart',
                    },
                ]
            },
            {
                name: 'Báo cáo so sánh', // Footfall Metrics
                name_en: 'Comparison report',
                title: 'footfall',
                url: '/footfall/visits',
                icon: 'fa fa-code',
                children: [
                    {
                        // name: 'Cửa hàng', // Footfall Store
                        // name_en: 'Store',
                        name: 'Theo địa điểm', // Footfall Time
                        name_en: 'By locations',
                        title: 'footfall',
                        url: '/footfall/store-comparison',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo thời gian', // Footfall Time
                        name_en: 'By time',
                        title: 'footfall',
                        url: '/footfall/time-comparison',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo chỉ số', // Footfall Metrics
                        name_en: 'By metrics',
                        title: 'footfall',
                        url: '/footfall/metrics-comparison',
                        icon: 'fa fa-bar-chart',
                    }
                ]
            },
            {
                name: 'Phân tích xu hướng', // Footfall Metrics
                name_en: 'Trend analysis',
                title: 'footfall',
                url: '/footfall/visits',
                icon: 'fa fa-code',
                children: [
                    {
                        // name: 'Cửa hàng', // Footfall Store
                        // name_en: 'Store',
                        name: 'Theo địa điểm', // Footfall Time
                        name_en: 'By locations',
                        title: 'footfall',
                        url: '/footfall/store-trend',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo chỉ số ',
                        name_en: 'By metrics',
                        title: 'footfall',
                        url: '/footfall/metrics-trend',
                        icon: 'fa fa-bar-chart',
                    }
                ]
            },
            {
                name: 'Bản đồ nhiệt ',
                name_en: 'Heatmap',
                title: 'footfall',
                url: '/footfall/heatmap',
                icon: 'fa fa-bar-chart',
            },

        ];
    }

    export class GenderAgeMenuItem extends MenuItem {
        name = 'Giới tính - Độ tuổi';
        url = '/gender-age';
        module_title = 'genderage';
        icon = 'icon-star';
        icon_src = menu_icon_url + 'genderage.jpg';
        name_en = 'Gender - Age range';
        children = [
            {
                name: 'Tổng quan',
                name_en: 'Overview',
                title: 'genderage',
                url: '/gender-age/overview',
                icon: 'icon-drop',
            },
            {
                name: 'Phân tích',
                name_en: 'Analysis',
                title: 'genderage',
                url: '/gender-age/visit',
                icon: 'icon-drop',
            },
            {
                name: 'Độ tuổi',
                name_en: 'Age range',
                title: 'genderage',
                url: '/gender-age/metrics-age',
                icon: 'icon-drop',
            },
            {
                name: 'Giới tính ',
                name_en: 'Gender',
                title: 'genderage',
                url: '/gender-age/metrics-gender',
                icon: 'icon-drop',
            },
        ];
    }
    export class PerformanceMenuItem extends MenuItem {
        name = 'Báo cáo tổng hợp';
        url = '/footfall';
        module_title = 'performance';
        icon_src = menu_icon_url + 'performance.jpg';
        icon = 'icon-star';
        name_en = 'General Report';
        children = [
            {
                name: 'Mô hình Boston',
                name_en: 'Boston Cash & Cow Report',
                title: 'performance',
                url: '/performance/metrics-boston',
                icon: 'icon-drop',
            },
            {
                name: 'Hiệu quả hoạt động', // Footfall Metrics
                name_en: 'Operation Performance',
                title: 'footfall',
                url: '/footfall/visits',
                icon: 'fa fa-code',
                children: [
                    {
                        name: 'Theo địa điểm', // Footfall Time
                        name_en: 'By locations',
                        title: 'performance',
                        url: '/performance/reporting-stores',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo chỉ số', // Footfall Store
                        name_en: 'By metrics',
                        title: 'performance',
                        url: '/performance/visits',
                        icon: 'fa fa-bar-chart',
                    },
                ]
            },
            {
                name: 'Báo cáo so sánh',
                name_en: 'Comparison report',
                title: 'performance',
                url: '/performance/performance',
                icon: 'fa fa-code',
                children: [
                    {
                        name: 'Theo địa điểm',
                        name_en: 'By locations',
                        title: 'performance',
                        url: '/performance/store-comparisons',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo thời gian',
                        name_en: 'By time',
                        title: 'performance',
                        url: '/performance/time-comparisons',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo địa điểm',
                        name_en: 'By metrics',
                        title: 'performance',
                        url: '/performance/metrics-comparisons',
                        icon: 'fa fa-bar-chart',
                    }
                ]
            },
            {
                name: 'Phân tích xu hướng',
                name_en: 'Trend Analysis',
                title: 'performance',
                url: '/performance/performance',
                icon: 'fa fa-code',
                children: [
                    {
                        name: 'Theo địa điểm',
                        name_en: 'By locations',
                        title: 'performance',
                        url: '/performance/store-trending',
                        icon: 'fa fa-bar-chart',
                    },
                    {
                        name: 'Theo chỉ số',
                        name_en: 'By metrics',
                        title: 'performance',
                        url: '/performance/metrics-trending',
                        icon: 'fa fa-bar-chart',
                    }
                ]
            },
        ];
    }
    export class GeneralMenuItem extends MenuItem {
        name = 'Quản trị';
        name_en = 'Administration';
        module_title = 'all';
        url = '/general';
        icon = 'icon-settings';
        children = [];

        constructor(arrayItem: Array<string>) {
            super();
            if (arrayItem.includes('footfall') || arrayItem.includes('genderage') || arrayItem.includes('performance')) {
                this.children.push({
                    name: 'Quản trị thiết bị', // FOOTFALL
                    name_en: 'Device control',
                    title: 'footfall',
                    url: '/terminal',
                    icon: 'icon-settings',
                });
            }

            for (let i = 0; i < arrayItem.length; i++) {
                const newChildrenInstance = this.createChildrenObject(arrayItem[i]);
                if (newChildrenInstance !== null) {
                    this.children.push(newChildrenInstance);
                }
            }
        }

        createChildrenObject(k: string) {
            let instance = null;
            const toLowerKey = k.toLowerCase();
            switch (toLowerKey) {
                // case 'footfall': {
                //     instance = {
                //         name: 'Hệ thống đếm người', // FOOTFALL
                //         name_en: 'Footfall setting',
                //         title: 'footfall',
                //         url: '/footfall/setting',
                //         icon: 'icon-settings'
                //     };
                //     break;
                // }
                case 'fba': {
                    instance = {
                        name: 'Trải nghiệm khách hàng', // FBA
                        name_en: 'CX - NPS Index',
                        title: 'fba',
                        url: '/fba/setting',
                        icon: 'icon-settings'
                    };
                    break;
                }
                case 'genderage': {
                    instance = {
                        name: 'Giới tính độ tuổi', // GENDERAGE
                        name_en: 'Shopper Insights',
                        title: 'genderage',
                        url: '/gender-age/setting',
                        icon: 'icon-settings'
                    };
                    break;
                }
                case 'performance': {
                    instance = {
                        name: 'Báo cáo tổng hợp', // FOOTFALL
                        name_en: 'Operation Performance',
                        title: 'performance',
                        url: '/performance/setting',
                        icon: 'icon-settings',
                    };
                    break;
                }
                case 'all': {
                    instance = {
                        name: 'Cấu hình chung', // Tất cả
                        name_en: 'General config',
                        title: 'all',
                        url: '/general/',
                        icon: 'icon-settings',
                    };
                    break;
                }
                default: {
                    break;
                }
            }
            return instance;
        }
        // {
        //     name: 'Hệ thống đếm người', // FOOTFALL
        //     name_en: 'Footfall system',
        //     title: 'footfall',
        //     url: '/footfall/setting/terminals',
        //     icon: 'icon-settings',
        //   },
    }
}
