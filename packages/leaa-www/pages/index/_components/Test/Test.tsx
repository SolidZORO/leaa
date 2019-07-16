import React from 'react';
import { Button, Switch } from 'antd';

import style from './style.less';

export const Test = () => {
  return (
    <div className={style['wrapper']}>
      <div className={style['biggg']}>TESTx</div>
      <Button type="primary">AA333A</Button>
      <Switch />
    </div>
  );
};

// import React from 'react';
// import { Button, Switch } from 'antd';
//
// // import style from './style.less';
//
// export const Test = () => {
//   return (
//     <div>
//       <Button type="primary">AA333Axxx</Button>
//       <Switch />
//     </div>
//   );
// };
