const menu_icon_url = 'assets/img/iconmenu/';

export const navItems = [
  {
    name: 'Dashboard',
    name_en: 'Dashboard',
    url: '/dashboard',
    module_title: 'default',
    icon: 'icon-home'
  },
  // Quyet them 3/9/2018
  // Menu Footfall
  {
    name: 'Hệ thống Footfall',
    name_en: 'Footfall System',
    url: '/footfall',
    module_title: 'footfall',
    icon_src: menu_icon_url + 'footfall.jpg',
    icon: 'icon-star',
    children: [
      {
        name: 'Tổng quan',
        name_en: 'Overview',
        title: 'footfall',
        url: '/footfall/overview',
        icon: 'fa fa-bar-chart',
      },




      {
        name: '	Báo cáo tổng hợp', // Footfall Metrics
        name_en: 'alubar report',
        title: 'footfall',
        url: '/footfall/rawdata',
        icon: 'fa fa-code',
        children: [
          {
            name: 'Theo  ngày', // Footfall Store
            name_en: 'By day',
            title: 'footfall',
            url: '/footfall/customer-daily',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Theo tháng',
            name_en: 'By month',
            title: 'footfall',
            url: '/footfall/customer-month',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Theo năm',
            name_en: 'By month',
            title: 'footfall',
            url: '/footfall/customer-year',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Theo cửa, khu vực',
            name_en: 'By locations',
            title: 'footfall',
            url: '/footfall/customer-entrance',
            icon: 'fa fa-bar-chart',
          }
        ]
      },
      {
        name: 'Live Accupancy',
        name_en: 'Live Accupancy',
        title: 'footfall',
        url: '/footfall/liveview',
        icon: 'fa fa-bar-chart',
      },
      {
        name: 'Hiệu quả hoạt động', // Footfall Metrics
        name_en: 'Operational Efficiency',
        title: 'footfall',
        url: '/footfall/visits',
        icon: 'fa fa-code',
        children: [
          {
            name: 'Cửa hàng', // Footfall Time
            name_en: 'Store',
            title: 'footfall',
            url: '/footfall/reporting-stores',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Chỉ số', // Footfall Store
            name_en: 'Metrics',
            title: 'footfall',
            url: '/footfall/visits',
            icon: 'fa fa-bar-chart',
          },
        ]
      },
      {
        name: 'Báo cáo so sánh', // Footfall Metrics
        name_en: 'Comparison Report',
        title: 'footfall',
        url: '/footfall/visits',
        icon: 'fa fa-code',
        children: [
          {
            name: 'Cửa hàng', // Footfall Store
            name_en: 'Store',
            title: 'footfall',
            url: '/footfall/store-comparison',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Thời gian', // Footfall Time
            name_en: 'Time',
            title: 'footfall',
            url: '/footfall/time-comparison',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Chỉ số', // Footfall Metrics
            name_en: 'Metrics',
            title: 'footfall',
            url: '/footfall/metrics-comparison',
            icon: 'fa fa-bar-chart',
          }
        ]
      },
      {
        name: 'Phân tích xu hướng', // Footfall Metrics
        name_en: 'Trend Analysis',
        title: 'footfall',
        url: '/footfall/visits',
        icon: 'fa fa-code',
        children: [
          {
            name: 'Cửa hàng', // Footfall Store
            name_en: 'Store',
            title: 'footfall',
            url: '/footfall/store-trend',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Chỉ số',
            name_en: 'Metrics',
            title: 'footfall',
            url: '/footfall/metrics-trend',
            icon: 'fa fa-bar-chart',
          }
        ]
      },
      {
        name: 'Bản đồ nhiệt Heatmap',
        name_en: 'Store Heatmap',
        title: 'footfall',
        url: '/footfall/heatmap',
        icon: 'fa fa-bar-chart',
      },
    ]
  },
  {
    name: 'Trải nghiệm khách hàng', // FBA
    name_en: 'CX - NPS Index',
    url: '/fba',
    module_title: 'fba',
    icon_src: menu_icon_url + 'fba.jpg',
    icon: 'icon-star',
    children: [
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
    ]
  },
  {
    name: 'Giới tính - Độ tuổi',
    name_en: 'Gender - Age range',
    url: '/gender-age',
    module_title: 'genderage',
    icon_src: menu_icon_url + 'genderage.jpg',
    icon: 'icon-star',
    children: [
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
    ]
  },
  {
    name: 'Báo cáo tổng hợp',
    name_en: 'General Report',
    url: '/footfall',
    module_title: 'performance',
    icon_src: menu_icon_url + 'performance.jpg',
    icon: 'icon-star', // type = 0 là báo cáo, type = 1 là quản trị
    children: [
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
            name: 'Cửa hàng', // Footfall Time
            name_en: 'Store',
            title: 'performance',
            url: '/performance/reporting-stores',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Chỉ số', // Footfall Store
            name_en: 'Metrics',
            title: 'performance',
            url: '/performance/visits',
            icon: 'fa fa-bar-chart',
          },
        ]
      },
      // {
      //   name: 'Metrics Analysis',
      //   name_en: 'Metrics Analysis',
      //   title: 'performance',
      //   url: '/performance/visits',
      //   icon: 'fa fa-bar-chart',
      // },
      // {
      //   name: 'Performance analysis',
      //   name_en: 'Effective Analysis',
      //   title: 'performance',
      //   url: '/performance/reporting-stores',
      //   icon: 'fa fa-bar-chart',
      // },
      {
        name: 'Báo cáo so sánh',
        name_en: 'Comparison report',
        title: 'performance',
        url: '/performance/performance',
        icon: 'fa fa-code',
        children: [
          {
            name: 'Cửa hàng',
            name_en: 'Store',
            title: 'performance',
            url: '/performance/store-comparisons',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Thời gian',
            name_en: 'Time',
            title: 'performance',
            url: '/performance/time-comparisons',
            icon: 'fa fa-bar-chart',
          },
          {
            name: 'Chỉ số',
            name_en: 'Metrics',
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
            name: 'Cửa hàng',
            name_en: 'Store',
            title: 'performance',
            url: '/performance/store-trending',
            icon: 'fa fa-bar-chart',
          },
          // {
          //   name: 'Time',
          //   url: '/performance/time-trending',
          //   icon: 'fa fa-bar-chart',
          // },
          {
            name: 'Chỉ số',
            name_en: 'Metrics',
            title: 'performance',
            url: '/performance/metrics-trending',
            icon: 'fa fa-bar-chart',
          }
        ]
      },
    ]
  },
  {
    name: 'Quản trị',
    name_en: 'Administration',
    module_title: 'all',
    url: '/general',
    icon: 'icon-settings',
    children: [
      {
        name: 'Hệ thống Footfall', // FOOTFALL
        name_en: 'Footfall system',
        title: 'footfall',
        url: '/footfall/setting/terminals',
        icon: 'icon-settings',
      },
      {
        name: 'Trải nghiệm khách hàng', // FBA
        name_en: 'CX - NPS Index',
        title: 'fba',
        url: '/fba/setting/setting',
        icon: 'icon-settings',
      },
      {
        name: 'Giới tính độ tuổi', // GENDERAGE
        name_en: 'Shopper Insights',
        title: 'genderage',
        url: '/gender-age/administration/terminals',
        icon: 'icon-settings',
      },
      {
        name: 'Hiệu quả hoạt động', // FOOTFALL
        name_en: 'Operation Performance',
        title: 'performance',
        url: '/performance/addministrator/user-mail',
        icon: 'icon-settings',
      },
      {
        name: 'Cấu hình chung', // Tất cả
        name_en: 'Overview configuration',
        title: 'all',
        url: '/general/companies',
        icon: 'icon-settings',
      }
    ]
  },
  {
    name: 'Về ACS Analytics', // FBA
    name_en: 'About ACS Analytics',
    module_title: 'about',
    url: '/about',
    icon: 'fa fa-info-circle',
  }
];

