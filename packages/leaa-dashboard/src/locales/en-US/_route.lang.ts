import _lang from './_lang.lang';

const home = 'Home';
const playground = 'Playground';
const user = 'User';
const role = 'Role';
const permission = 'Permission';
const category = 'Category';
const article = 'Article';

export default {
  home,
  login: _lang.login,
  regist: _lang.register,
  //
  playground,
  showStore: 'Show Store',
  testApollo: 'Test Apollo',
  //
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
  article,
  createArticle: `${_lang.create} ${article}`,
  editArticle: `${_lang.edit} ${article}`,
};
