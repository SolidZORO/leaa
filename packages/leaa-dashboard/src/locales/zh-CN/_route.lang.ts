import _lang from './_lang.lang';

const home = '主页';
const playground = '游乐园';
const user = '用户';
const role = '角色';
const permission = '权限';
const category = '分类';
const article = '文章';

export default {
  home,
  login: _lang.login,
  regist: _lang.register,
  //
  playground,
  showStore: '展示 Store',
  testApollo: '测试 Apollo',
  //
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
  article,
  createArticle: `${_lang.create}${article}`,
  editArticle: `${_lang.edit}${article}`,
};
