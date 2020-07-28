// const group = 'Group';
const home = 'Home';
const playground = 'Playground';
const test = 'Test';
const debug = 'Debug';
const account = 'Account';
const user = 'User';
const role = 'Role';
const permission = 'Permission';
const category = 'Category';
const article = 'Article';
const ax = 'Ad';
const tag = 'Tag';
const attachment = 'Attachment';
const setting = 'Setting';
const coupon = 'Coupon';
const promo = 'Promo';
const marketing = 'Marketing';
const content = 'Content';
const product = 'Product';
const address = 'Address';
const division = 'Division';
const zan = 'Collect Zan';
const auth = 'Auth';
const oauth = 'OAuth';
const action = 'Action Log';

// eslint-disable-next-line no-underscore-dangle
const _lang = {
  test: '0x00 EN',
  langen: 'English',
  langcn: 'Chinese',
  'lang-en-US': 'English',
  'lang-zh-CN': '中文',
  'lang-code-en-US': 'EN',
  'lang-code-zh-CN': 'CN',
  //
  id: 'ID',
  uuid: 'UUID',
  category: 'Category',
  parentCategory: 'Parent Category',
  user: 'User',
  role: 'Role',
  email: 'Email',
  phone: 'Phone',
  name: 'Name',
  fullname: 'Fullname',
  title: 'Title',
  parent: 'Parent',
  slug: 'Unique Label',
  password: 'Password',
  login: 'Login',
  register: 'Register',
  status: 'Status',
  createdAt: 'Created At',
  updatedAt: 'Updated At',
  releasedAt: 'Released At',
  action: 'Action',
  size: 'Size',
  description: 'Description',
  link: 'Link',
  sort: 'Sort',
  upload: 'Upload',
  attachment: 'Attachment',
  empty: 'Empty',
  list: 'List',
  card: 'Card',
  mobile: 'Mobile',
  desktop: 'Desktop',
  banner: 'Banner',
  cover: 'Cover',
  quantity: 'Quantity',
  ax: 'Ad',
  ad: 'Ad',
  tag: 'Tag',
  icon: 'Icon',
  type: 'Type',
  value: 'Value',
  noData: 'No Data',
  options: 'Options',
  tips: 'Tips',
  unavailable: 'Unavailable',
  admin: 'Admin',
  price: 'Price',
  serial: 'Serial',
  stock: 'Stock',
  account: 'Account',
  module: 'Module',
  //
  create: 'Create',
  edit: 'Edit',
  update: 'Update',
  delete: 'Delete',
  submit: 'Submit',
  redeem: 'Redeem',
  search: 'Search',
  private: 'Private',
  public: 'Public',
  export: 'Export',
  views: 'Views',
  avatar: 'Avatar',
  creator: 'Creator',
  ip: 'IP',
  token: 'Token',
  info: 'Info',
  comingSoon: 'Coming Soon...',
  //
  select: 'Select',
  selected: 'Selected',
  selectAll: 'Select All',
  checkAll: 'Check all',
  //
  type_input: 'Text',
  type_textarea: 'Multiple Text',
  type_radio: 'Select',
  type_checkbox: 'Multiple Select',
  //
  uploadSuccessfully: 'Upload Successfully',
  uploadError: 'Upload Error',
  readSuccessfully: 'Read Successfully',
  createdSuccessfully: 'Created Successfully',
  updatedSuccessfully: 'Updated Successfully',
  deletedSuccessfully: 'Deleted Successfully #{{ id }}',
  //
  bannerMb: 'Banner Mb',
  bannerPc: 'Banner PC',
  galleryMb: 'Gallery Mb',
  galleryPc: 'Gallery PC',
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
    testAny: 'Test Any',
    testAttachment: 'Test Attachment',
    testI18n: 'Test I18n',
    testStore: 'Test Store',
    //
    accountGroup: `${account}`,
    userGroup: `${user}`,
    user,
    createUser: `${_lang.create} ${user}`,
    editUser: `${_lang.edit} ${user}`,
    //
    role,
    createRole: `${_lang.create} ${role}`,
    editRole: `${_lang.edit} ${role}`,
    //
    permission,
    createPermission: `${_lang.create} ${permission}`,
    editPermission: `${_lang.edit} ${permission}`,
    //
    category,
    createCategory: `${_lang.create} ${category}`,
    editCategory: `${_lang.edit} ${category}`,
    //
    contentGroup: `${content}`,
    article,
    createArticle: `${_lang.create}${article}`,
    editArticle: `${_lang.edit}${article}`,
    //
    ax,
    createAx: `${_lang.create} ${ax}`,
    editAx: `${_lang.edit} ${ax}`,
    //
    tag,
    createTag: `${_lang.create} ${tag}`,
    editTag: `${_lang.edit} ${tag}`,
    //
    attachment,
    createAttachment: `${_lang.create} ${attachment}`,
    editAttachment: `${_lang.edit} ${attachment}`,
    //
    setting,
    //
    marketingGroup: `${marketing}`,
    coupon,
    createCoupon: `${_lang.create} ${coupon}`,
    editCoupon: `${_lang.edit} ${coupon}`,
    redeemCoupon: `${_lang.redeem} ${coupon}`,
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
    dataGroup: 'Data',
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
      title: 'CUR ENG',
    },
    UserMenu: {
      safelyLogout: 'Safely Logout',
      logoutFaild: 'Logout Faild',
    },
    TableColumnDeleteButton: {
      confirmDeleteItem: 'Confirm Delete',
    },
    SelectTagId: {
      searchTags: 'Search Tags',
      notFoundTags: 'Not Found Tags',
      addTag: 'Add Tag',
      canAlsoAddTagsQuantity: 'You could add Tag {{ length }}',
      createAndAdd: 'Create and Add',
    },
    SearchInput: {
      placeholder: 'Search...',
    },
    CouponItem: {
      unavailable: 'Unavailable',
      moreThanAmount: 'More than',
      isAvailable: 'available',
    },
    TableColumnStatusSwitch: {
      updatedSuccessfully: '#{{ id }} Status Updated To ',
    },
    UserSearchBox: {
      searchUsers: 'Search User',
    },
    TableCard: {
      totalLength: 'Total {{ length }} Items',
      selectedItems: '{{ length }} Items Selected',
    },
    ConfirmDeleteButton: {
      confirmDeleteMessage: 'Confirm Deletion, PRESS AGAIN',
    },
  },
  _page: {
    Auth: {
      Login: {
        title: 'DASHBOARD',
        subTitle: 'Welcome Back, Please login to your account',
        email: 'Email',
        account: 'Account',
        accountTips: 'Phone or Email',
        password: _lang.password,
        login: _lang.login,
        rememberPassword: 'Remember Password',
        back: 'Back',
        notPermissions: 'Not Premissions',
        backTips: 'here is not back now ; >',
        captcha: 'Captcha',
      },
      //
      openId: 'Open Id',
      userId: 'User Id',
      unionId: 'Union Id',
      platform: 'Platform',
      nickname: 'Nickname',
      lastAuthAt: 'Last Auth At',
    },
    User: {
      userInfo: 'User Info',
      userRoles: 'User Roles',
      userAvatar: 'User Avatar',
      deleteAuthAvatar: 'Delete Avatar',
    },
    Role: {
      roleInfo: 'Role Info',
      rolePermissions: 'Role Permissions',
    },
    Permission: {
      permissionInfo: 'Permission Info',
    },
    Category: {
      categoryInfo: 'Category Info',
    },
    Article: {
      articleInfo: 'Article Info',
      articleContent: 'Article Content',
      extendedInfo: 'Extended Info',
    },
    Ax: {
      axInfo: 'Ad Info',
      axImage: 'Ad Image',
    },
    Setting: {
      pleaseSelectTheTypeFirst: 'Please select the type first',
      options: 'Options',
      optionsTips: 'One per line',
      confirmDelete: 'Confirm Delete Setting',
    },
    Tag: {
      count: 'Count',
      tagInfo: 'Tag Info',
    },
    Coupon: {
      couponInfo: 'Coupon Info',
      couponCodeStatusTitle: 'Coupon Code',
      startTime: 'Start Time',
      expireTime: 'Expire Time',
      amount: 'Amount',
      code: 'Code',
      overAmount: 'Over Amount',
      availableDate: 'Available Date',
      availableProductIds: 'Available Product',
      unavailableProductIds: 'Unvailable Product',
      redeem: 'Redeem',
      redeemConpon: 'Redeem Coupon',
      redeemToUser: 'Redeem Coupon To User',
      redeemUser: 'Redeem User',
      accessOrder: 'Access Order',
    },
    Promo: {
      promoInfo: 'Promo Info',
      promoCodeStatusTitle: 'Promo Code',
      startTime: 'Start Time',
      expireTime: 'Expire Time',
      amount: 'Amount',
      overAmount: 'Over Amount',
      availableDate: 'Available Date',
      availableProductIds: 'Available Product',
      unavailableProductIds: 'Unvailable Product',
      redeemedQuantity: 'redeemed Quantity',
    },
    Product: {
      productInfo: 'Product Info',
      productContent: 'Product Content',
      putOnSale: 'Put On Sale',
      price: 'Price',
      productName: 'Product Name',
      productFullname: 'Product Fullname',
      costPrice: 'Cost Price',
      marketPrice: 'Market Price',
      brand: 'Brand',
      style: 'Style',
      banner: 'Banner',
      //
      productImage: 'Product Images',
      bannerMb: 'Banner MB',
      galleryMb: 'Gallery MB',
      bannerPc: 'Banner PC',
      galleryPc: 'Gallery PC',
    },
    Address: {
      province: 'Province',
      city: 'City',
      area: 'Area',
      areaLabel: 'Area',
      address: 'Address',
      consignee: 'Consignee',
      zip: 'Zip',
      phone: 'Phone',
      status: 'Status',
      //
      addressInfo: 'Address Info',
    },
    Division: {
      name: 'Name',
      provinceCode: 'Province Code',
      cityCode: 'City Code',
      areaCode: 'Area Code',
      code: 'Code',
      //
      divisionData: 'Division Data',
      expandedAll: 'Expanded All',
      collapseAll: 'Collapse All',
    },
    Zan: {
      views: 'Views',
      zanInfo: 'Zan Info',
      zanUserList: 'Zan Users',
      targetZanQuantity: 'Quantity of Target Zan',
      currentZanQuantity: 'Quantity of Current Zan',
      currentTargetZanQuantity: 'Current / Target',
      like: 'Like',
      liked: 'Liked',
      deletedLikeUser: 'Deleted Like User',
    },
    Test: {
      getApiError: 'Get Api Error',
      getApiMessage: 'Get Api Message',
    },
    Action: {
      actionInfo: 'Action Log Info',
    },
  },
};
