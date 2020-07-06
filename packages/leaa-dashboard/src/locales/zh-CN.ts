// const group = '组';
const home = '主页';
const playground = '游乐园';
const test = '测试';
const debug = '调试';
const user = '用户';
const account = '账号';
const role = '角色';
const permission = '权限';
const category = '分类';
const article = '文章';
const ax = '广告';
const tag = '标签';
const attachment = '附件';
const setting = '设置';
const coupon = '代金券';
const promo = '优惠码';
const marketing = '营销';
const content = '内容';
const product = '商品';
const address = '地址';
const division = '地址源';
const zan = '集赞';
const auth = '授权';
const oauth = '开放授权';
const action = '操作记录';

// eslint-disable-next-line no-underscore-dangle
const _lang = {
  test: '0x00 中文',
  langen: '英文',
  langcn: '中文',
  'lang-en-US': 'English',
  'lang-zh-CN': '中文',
  'lang-code-en-US': 'EN',
  'lang-code-zh-CN': 'CN',
  //
  id: 'ID',
  uuid: 'UUID',
  category: '分类',
  parentCategory: '父分类',
  user: '用户',
  role: '角色',
  email: 'Email',
  phone: '手机号',
  name: '名字',
  fullname: '全名',
  title: '标题',
  parent: '父',
  slug: '唯一标识',
  password: '密码',
  login: '登录',
  register: '注册',
  status: '状态',
  createdAt: '创建于',
  updatedAt: '更新于',
  releasedAt: '发布于',
  createdTime: '创建时间',
  updatedTime: '更新时间',
  releasedTime: '发布时间',
  action: '操作',
  size: '大小',
  description: '描述',
  link: '链接',
  sort: '排序',
  upload: '上传',
  attachment: '附件',
  empty: '暂无',
  list: '列表',
  card: '卡片',
  mobile: '手机',
  desktop: '电脑',
  banner: '题图',
  cover: '封面',
  quantity: '数量',
  ax: '广告',
  ad: '广告',
  tag: '标签',
  icon: '图标',
  type: '类型',
  value: '值',
  noData: '无数据',
  options: '可选项',
  tips: '提示',
  unavailable: '不可用',
  admin: '管理员',
  price: '价格',
  serial: '编号',
  stock: '库存',
  account: '账户',
  module: '模块',
  //
  create: '创建',
  edit: '编辑',
  update: '更新',
  delete: '删除',
  submit: '提交',
  redeem: '兑换',
  search: '搜索',
  private: '私有',
  public: '公开',
  export: '导出',
  views: '浏览量',
  avatar: '头像',
  creator: '创建人',
  ip: 'IP',
  token: 'Token',
  //
  select: '选择',
  selected: '选中',
  selectAll: '全选',
  checkAll: '全选',
  //
  type_input: '文本',
  type_textarea: '多行文本',
  type_radio: '单选',
  type_checkbox: '多选',
  //
  uploadSuccessfully: '上传成功',
  uploadError: '上传出错',
  readSuccessfully: '读取成功',
  createdSuccessfully: '创建成功',
  updatedSuccessfully: '更新成功',
  deletedSuccessfully: '删除成功 #{{ id }}',
  //
  bannerMb: '主图 MB',
  galleryMb: '图列表 MB',
  bannerPc: '主图 PC',
  galleryPc: '图列表 PC',
};

export default {
  _lang,
  _route: {
    home,
    login: _lang.login,
    regist: _lang.register,
    //
    playground,
    test,
    debug,
    testAny: '测试 Any',
    testAttachment: '测试 Attachment',
    testI18n: '测试 I18n',
    testStore: '测试 Store',
    //
    accountGroup: `${account}`,
    userGroup: `${user}`,
    user,
    createUser: `${_lang.create}${user}`,
    editUser: `${_lang.edit}${user}`,
    //
    role,
    createRole: `${_lang.create}${role}`,
    editRole: `${_lang.edit}${role}`,
    //
    permission,
    createPermission: `${_lang.create}${permission}`,
    editPermission: `${_lang.edit}${permission}`,
    //
    category,
    createCategory: `${_lang.create}${category}`,
    editCategory: `${_lang.edit}${category}`,
    //
    contentGroup: `${content}`,
    article,
    createArticle: `${_lang.create}${article}`,
    editArticle: `${_lang.edit}${article}`,
    //
    ax,
    createAx: `${_lang.create}${ax}`,
    editAx: `${_lang.edit}${ax}`,
    //
    tag,
    createTag: `${_lang.create}${tag}`,
    editTag: `${_lang.edit}${tag}`,
    //
    attachment,
    createAttachment: `${_lang.create}${attachment}`,
    editAttachment: `${_lang.edit}${attachment}`,
    //
    setting,
    //
    marketingGroup: `${marketing}`,
    coupon,
    createCoupon: `${_lang.create}${coupon}`,
    editCoupon: `${_lang.edit}${coupon}`,
    redeemCoupon: `${_lang.redeem}${coupon}`,
    //
    promo,
    createPromo: `${_lang.create}${promo}`,
    editPromo: `${_lang.edit}${promo}`,
    redeemPromo: `${_lang.redeem}${promo}`,
    //
    productGroup: `${product}`,
    product,
    createProduct: `${_lang.create} ${product}`,
    editProduct: `${_lang.edit} ${product}`,
    //
    dataGroup: '数据',
    //
    address,
    createAddress: `${_lang.create} ${address}`,
    editAddress: `${_lang.edit} ${address}`,
    //
    division,
    createDivision: `${_lang.create} ${division}`,
    editDivision: `${_lang.edit} ${division}`,
    //
    zan,
    createZan: `${_lang.create} ${zan}`,
    editZan: `${_lang.edit} ${zan}`,
    //
    action,
    createAction: `${_lang.create} ${action}`,
    editAction: `${_lang.edit} ${action}`,
    //
    auth,
    oauth,
  },
  _comp: {
    SwitchLanguage: {
      title: '当前中文',
    },
    UserMenu: {
      safelyLogout: '安全登出',
      logoutFaild: '登出失败',
    },
    TableColumnDeleteButton: {
      confirmDeleteItem: '确定删除',
    },
    SelectTagId: {
      searchTags: '搜索标签',
      notFoundTags: '找不到相关标签',
      addTag: '添加标签',
      canAlsoAddTagsQuantity: '还可以添加 {{ length }} 个',
      createAndAdd: '创建并添加',
    },
    SearchInput: {
      placeholder: '搜索…',
    },
    CouponItem: {
      unavailable: '不可用',
      moreThanAmount: '满',
      isAvailable: '可用',
    },
    TableColumnStatusSwitch: {
      updatedSuccessfully: '#{{ id }} 状态更新为 ',
    },
    UserSearchBox: {
      searchUsers: '搜索用户',
    },
    TableCard: {
      totalLength: '共 {{ length }} 个条目',
      selectedItems: '选中 {{ length }} 个条目',
    },
    ConfirmDeleteButton: {
      confirmDeleteMessage: '确认删除请再按一次',
    },
  },
  _page: {
    Auth: {
      Login: {
        title: '控制台',
        subTitle: '欢迎回来，请输入您的账户并登录',
        email: 'Email',
        account: '账号',
        accountTips: '手机号或 Email',
        password: _lang.password,
        login: _lang.login,
        rememberPassword: '记住登陆',
        back: '返回',
        notPermissions: '无权限',
        backTips: '这里就是起点啊 ：）',
        captcha: '验证码',
      },
      //
      openId: 'Open Id',
      userId: 'User Id',
      unionId: 'Union Id',
      platform: '平台',
      nickname: '昵称',
      lastAuthAt: '最后授权于',
    },
    User: {
      userInfo: '用户信息',
      userRoles: '用户角色',
      userAvatar: '用户头像',
      deleteAuthAvatar: '删除头像',
    },
    Role: {
      roleInfo: '角色信息',
      rolePermissions: '角色权限',
    },
    Permission: {
      permissionInfo: '权限信息',
    },
    Category: {
      categoryInfo: '分类信息',
    },
    Article: {
      articleInfo: '文章信息',
      articleContent: '文章内容',
      extendedInfo: '扩展信息',
    },
    Ax: {
      axInfo: '广告信息',
      axImage: '广告图片',
    },
    Setting: {
      pleaseSelectTheTypeFirst: '请先选择类型',
      options: '可选项',
      optionsTips: '每行一个',
      confirmDelete: '确定删除设置',
    },
    Tag: {
      count: '展示次数',
      tagInfo: '标签信息',
    },
    Coupon: {
      couponInfo: '代金券信息',
      couponCodeStatusTitle: '代金券号',
      startTime: '开始时间',
      expireTime: '结束时间',
      amount: '金额',
      code: '券号',
      overAmount: '触发金额',
      availableDate: '生效时间',
      availableProductIds: '可用商品',
      unavailableProductIds: '不可用商品',
      redeem: '兑换',
      redeemConpon: '兑换代金券',
      redeemToUser: '兑换代金券给用户',
      redeemUser: '兑换用户',
      accessOrder: '关联订单',
    },
    Promo: {
      promoInfo: '优惠码信息',
      promoCodeStatusTitle: '优惠码号',
      startTime: '开始时间',
      expireTime: '结束时间',
      amount: '金额',
      overAmount: '触发金额',
      availableDate: '可用日期',
      availableProductIds: '可用商品',
      unavailableProductIds: '不可用商品',
      redeemedQuantity: '已兑数量',
    },
    Product: {
      productInfo: '商品信息',
      productContent: '商品内容',
      putOnSale: '上架',
      price: '价格',
      productName: '商品名',
      productFullname: '商品全名',
      costPrice: '成本价',
      marketPrice: '市场价',
      brand: '品牌',
      style: '款式',
      banner: '商品图',
      //
      productImage: '商品配图',
      bannerMb: '主图 MB',
      galleryMb: '图集 MB',
      bannerPc: '主图 PC',
      galleryPc: '图集 PC',
    },
    Address: {
      province: '省',
      city: '市',
      area: '区',
      areaLabel: '区域',
      address: '地址',
      consignee: '收件人',
      zip: '邮编',
      phone: '电话',
      status: '状态',
      //
      addressInfo: '地址信息',
    },
    Division: {
      name: '名称',
      provinceCode: '省代码',
      cityCode: '市代码',
      areaCode: '区代码',
      code: '代码',
      //
      divisionData: '地址数据',
      expandedAll: '全部展开',
      collapseAll: '全部折叠',
    },
    Zan: {
      views: '浏览量',
      zanInfo: '集赞信息',
      zanUserList: '集赞用户',
      targetZanQuantity: '目标点赞数',
      currentZanQuantity: '当前点赞数',
      currentTargetZanQuantity: '当前 / 目标',
      like: '赞',
      liked: '已赞',
      deletedLikeUser: '已删除点赞用户',
    },
    Test: {
      getApiError: '获取 Api 错误',
      getApiMessage: '获取 Api 消息',
    },
    Action: {
      actionInfo: '操作记录信息',
    },
  },
};
