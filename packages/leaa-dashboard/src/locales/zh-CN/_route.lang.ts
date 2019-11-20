import _lang from './_lang.lang';

const group = '组';
const home = '主页';
const playground = '游乐园';
const test = '测试';
const debug = '调试';
const user = '用户';
const role = '角色';
const permission = '权限';
const category = '分类';
const article = '文章';
const ax = '广告';
const tag = '标签';
const attachment = '附件';
const setting = '设置';
const coupon = '代金券';
const marketing = '营销';
const content = '内容';

export default {
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
  userGroup: `${user}${group}`,
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
};
