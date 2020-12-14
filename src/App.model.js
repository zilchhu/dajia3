export const cols = [
  {
    title: 'city',
    dataIndex: 'city',
    width: 80,
    slots: { filterDropdown: 'filterDropdown' },
    onFilter: (value, record) => record.city.includes(value.trim())
  },
  {
    title: 'person',
    dataIndex: 'person',
    width: 80,
    slots: { filterDropdown: 'filterDropdown' },
    onFilter: (value, record) => record.person.includes(value.trim())
  },
  {
    title: '物理店',
    dataIndex: 'real_shop',
    width: 80,
    slots: { filterDropdown: 'filterDropdown' },
    onFilter: (value, record) => record.real_shop.includes(value.trim())
  },
  {
    title: 'shop_id',
    dataIndex: 'shop_id',
    width: 100,
    slots: { filterDropdown: 'filterDropdown' },
    onFilter: (value, record) => record.shop_id.includes(value.trim())
  },
  {
    title: '店名',
    dataIndex: 'shop_name',
    width: 260,
    slots: { filterDropdown: 'filterDropdown' },
    onFilter: (value, record) => record.shop_name.includes(value.trim())
  },
  {
    title: '平台',
    dataIndex: 'platform',
    width: 100,
    filters: [
      { text: '美团', value: '美团' },
      { text: '饿了么', value: '饿了么' }
    ],
    filterMultiple: true,
    onFilter: (value, record) => record.platform == value
  },
  {
    title: '收入',
    dataIndex: 'income',
    align: 'right',
    width: 100,
    slots: { customRender: 'income' },
    sorter: (a, b) => a.income - b.income
    // width: 100
  },
  {
    title: '平均收入',
    dataIndex: 'income_avg',
    align: 'right',
    width: 100,
    slots: { customRender: 'incomeAvg' },
    sorter: (a, b) => a.income_avg - b.income_avg
  },
  // {
  //   title: 'income_sum',
  //   dataIndex: 'income_sum',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'cost',
  //   dataIndex: 'cost',
  //   align: 'right',
  //   width: 100
  //   // width: 100
  // },
  // {
  //   title: 'cost_avg',
  //   dataIndex: 'cost_avg',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'cost_sum',
  //   dataIndex: 'cost_sum',
  //   align: 'right',
  //   width: 100
  // },
  {
    title: '成本比例',
    dataIndex: 'cost_ratio',
    align: 'right',
    width: 100,
    slots: { customRender: 'costRatio' },
    sorter: (a, b) => a.cost_ratio - b.cost_ratio
  },
  // {
  //   title: 'cost_sum_ratio',
  //   dataIndex: 'cost_sum_ratio',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'consume',
  //   dataIndex: 'consume',
  //   align: 'right',
  //   width: 100
  //   // width: 100
  // },
  // {
  //   title: 'consume_avg',
  //   dataIndex: 'consume_avg',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'consume_sum',
  //   dataIndex: 'consume_sum',
  //   align: 'right',
  //   width: 100
  // },
  {
    title: '推广比例',
    dataIndex: 'consume_ratio',
    align: 'right',
    width: 100,
    slots: { customRender: 'consumeRatio' },
    sorter: (a, b) => a.consume_ratio - b.consume_ratio
  },
  // {
  //   title: 'consume_sum_ratio',
  //   dataIndex: 'consume_sum_ratio',
  //   align: 'right',
  //   width: 100
  // },
  {
    title: '比上月',
    dataIndex: 'settlea_30',
    align: 'right',
    width: 100,
    slots: { customRender: 'settlea30' },
    sorter: (a, b) => a.settlea_30 - b.settlea_30
  },
  {
    title: '比昨日',
    dataIndex: 'settlea_1',
    align: 'right',
    width: 100,
    sorter: (a, b) => a.settlea_1 - b.settlea_1
  },
  {
    title: '比上周',
    dataIndex: 'settlea_7',
    align: 'right',
    width: 100,
    sorter: (a, b) => a.settlea_7 - b.settlea_7
  },
  {
    title: 'status',
    dataIndex: 'op_id',
    align: 'right',
    width: 80,
    slots: { customRender: 'status' }
  },
  // {
  //   title: 'income_score',
  //   dataIndex: 'income_score',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'cost_score',
  //   dataIndex: 'cost_score',
  //   align: 'right',
  //   width: 100
  // },
  // {
  //   title: 'consume_score',
  //   dataIndex: 'consume_score',
  //   align: 'right',
  //   width: 100
  // },
  {
    title: '总分',
    dataIndex: 'score',
    align: 'right',
    width: 100,
    sorter: (a, b) => a.score - b.score
  },
  {
    title: 'date',
    dataIndex: 'date',
    align: 'right',
    width: 100
  }
]

export const cols2 = [
  {
    title: '收入',
    dataIndex: 'income',
    align: 'right',
    width: 100
  },
  {
    title: '平均收入',
    dataIndex: 'income_avg',
    align: 'right',
    width: 100
  },
  {
    title: '成本',
    dataIndex: 'cost',
    align: 'right',
    width: 100
  },
  {
    title: '平均成本',
    dataIndex: 'cost_avg',
    align: 'right',
    width: 100
  },
  {
    title: '成本比例',
    dataIndex: 'cost_ratio',
    align: 'right',
    width: 100
  },
  {
    title: '总成本比例',
    dataIndex: 'cost_sum_ratio',
    align: 'right',
    width: 100
  },
  {
    title: '推广',
    dataIndex: 'consume',
    align: 'right',
    width: 100
  },
  {
    title: '平均推广',
    dataIndex: 'consume_avg',
    align: 'right',
    width: 100
  },
  {
    title: '推广比例',
    dataIndex: 'consume_ratio',
    align: 'right',
    width: 100
  },
  {
    title: '总推广比例',
    dataIndex: 'consume_sum_ratio',
    align: 'right',
    width: 100
  },
  {
    title: '比上月',
    dataIndex: 'settlea_30',
    align: 'right',
    width: 100
  },
  {
    title: '比昨日',
    dataIndex: 'settlea_1',
    align: 'right',
    width: 100
  },
  {
    title: '比上周',
    dataIndex: 'settlea_7',
    align: 'right',
    width: 100
  },
  {
    title: '比上周(3日)',
    dataIndex: 'settlea_7_3',
    align: 'right',
    width: 100
  },
  {
    title: '收入分',
    dataIndex: 'income_score',
    align: 'right',
    width: 100
  },
  {
    title: '成本分',
    dataIndex: 'cost_score',
    align: 'right',
    width: 100
  },
  {
    title: '推广分',
    dataIndex: 'consume_score',
    align: 'right',
    width: 100
  },
  {
    title: '总分',
    dataIndex: 'score',
    align: 'right',
    width: 100
  },
  {
    title: 'date',
    dataIndex: 'date',
    align: 'right',
    width: 100
  }
]

export const cols3 = [
  {
    title: 'op_name',
    dataIndex: 'name',
    align: 'right',
    width: 80
  },
  {
    title: '问题',
    dataIndex: 'q',
    align: 'right',
    width: 200
  },
  {
    title: '方案',
    dataIndex: 'a',
    align: 'right',
    width: 400
  },
  {
    title: 'time',
    dataIndex: 'created_at',
    align: 'right',
    width: 200
  }
]
