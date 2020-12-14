export const cols = [
  {
    title: 'city',
    dataIndex: 'city',
    width: 80
  },
  {
    title: 'person',
    dataIndex: 'person',
    width: 80
  },
  {
    title: 'real_shop',
    dataIndex: 'real_shop',
    width: 80
  },
  {
    title: 'shop_id',
    dataIndex: 'shop_id',
    width: 100
  },
  {
    title: 'shop_name',
    dataIndex: 'shop_name',
    width: 260
  },
  {
    title: 'platform',
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
    title: 'income',
    dataIndex: 'income',
    align: 'right',
    width: 100,
    slots: { customRender: 'income' }
    // width: 100
  },
  {
    title: 'income_avg',
    dataIndex: 'income_avg',
    align: 'right',
    width: 100,
    slots: { customRender: 'incomeAvg' }
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
    title: 'cost_ratio',
    dataIndex: 'cost_ratio',
    align: 'right',
    width: 100,
    slots: { customRender: 'costRatio' }
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
    title: 'consume_ratio',
    dataIndex: 'consume_ratio',
    align: 'right',
    width: 100,
    slots: { customRender: 'consumeRatio' }
  },
  // {
  //   title: 'consume_sum_ratio',
  //   dataIndex: 'consume_sum_ratio',
  //   align: 'right',
  //   width: 100
  // },
  {
    title: 'settlea_30',
    dataIndex: 'settlea_30',
    align: 'right',
    width: 100,
    slots: { customRender: 'settlea30' }
  },
  {
    title: 'settlea_1',
    dataIndex: 'settlea_1',
    align: 'right',
    width: 100
  },
  {
    title: 'settlea_7',
    dataIndex: 'settlea_7',
    align: 'right',
    width: 100
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
    title: 'score',
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

export const cols2 = [
  {
    title: 'income',
    dataIndex: 'income',
    align: 'right',
    width: 100
  },
  {
    title: 'income_avg',
    dataIndex: 'income_avg',
    align: 'right',
    width: 100
  },
  {
    title: 'cost',
    dataIndex: 'cost',
    align: 'right',
    width: 100
  },
  {
    title: 'cost_avg',
    dataIndex: 'cost_avg',
    align: 'right',
    width: 100
  },
  {
    title: 'cost_ratio',
    dataIndex: 'cost_ratio',
    align: 'right',
    width: 100
  },
  {
    title: 'cost_sum_ratio',
    dataIndex: 'cost_sum_ratio',
    align: 'right',
    width: 100
  },
  {
    title: 'consume',
    dataIndex: 'consume',
    align: 'right',
    width: 100
  },
  {
    title: 'consume_avg',
    dataIndex: 'consume_avg',
    align: 'right',
    width: 100
  },
  {
    title: 'consume_ratio',
    dataIndex: 'consume_ratio',
    align: 'right',
    width: 100
  },
  {
    title: 'consume_sum_ratio',
    dataIndex: 'consume_sum_ratio',
    align: 'right',
    width: 100
  },
  {
    title: 'settlea_30',
    dataIndex: 'settlea_30',
    align: 'right',
    width: 100
  },
  {
    title: 'settlea_1',
    dataIndex: 'settlea_1',
    align: 'right',
    width: 100
  },
  {
    title: 'settlea_7',
    dataIndex: 'settlea_7',
    align: 'right',
    width: 100
  },
  {
    title: 'settlea_7_3',
    dataIndex: 'settlea_7_3',
    align: 'right',
    width: 100
  },
  {
    title: 'income_score',
    dataIndex: 'income_score',
    align: 'right',
    width: 100
  },
  {
    title: 'cost_score',
    dataIndex: 'cost_score',
    align: 'right',
    width: 100
  },
  {
    title: 'consume_score',
    dataIndex: 'consume_score',
    align: 'right',
    width: 100
  },
  {
    title: 'score',
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
    title: 'q',
    dataIndex: 'q',
    align: 'right',
    width: 200
  },
  {
    title: 'a',
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