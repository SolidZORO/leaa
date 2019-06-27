export interface IMenuItem {
  name: string;
  pattern: string;
  page: string;
  icon?: string;
  isGroup?: boolean; // gropu of sidebar, not into rotues (flatMenu).
  canCreate?: boolean;
  isCreate?: boolean;
  hasParam?: boolean;
  children?: IMenuItem[];
}

export const menuList: IMenuItem[] = [
  { hasParam: true, name: 'Home', pattern: '/', page: 'NewsCreate.tsx', icon: 'home' },
  //
  { hasParam: true, name: 'User Item', pattern: '/users/:id', page: 'users/:id' },
  { canCreate: true, name: 'Users', pattern: '/users', page: 'users', icon: 'user' },
];

export const makeFlatMenuList = (menus: IMenuItem[]): IMenuItem[] => {
  const result: IMenuItem[] = [];

  const insertMenu = (ms: IMenuItem[]) => {
    ms.forEach(menu => {
      if (menu.children) {
        insertMenu(menu.children);
      }

      // gropu of sidebar, not into rotues (flatMenu).
      if (!menu.isGroup) {
        // auto generate create route
        if (menu.canCreate) {
          result.push({
            name: `${menu.name} Create`,
            pattern: `${menu.pattern}/create`,
            page: menu.page,
            icon: menu.icon,
          });
        }

        result.push({
          name: menu.name,
          pattern: menu.pattern,
          page: menu.page,
          icon: menu.icon,
        });
      }
    });
  };

  insertMenu(menus);

  return [...new Set(result)];
};

export const flatMenuList = makeFlatMenuList(menuList);
