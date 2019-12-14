import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { useStore } from '@leaa/dashboard/src/stores';

import { HtmlMeta, SelectTagId, SelectCategoryIdByTree, Rcon, SuspenseFallback } from '@leaa/dashboard/src/components';
// import { Icon } from 'antd';

// import { MessageOutlined, createFromIconfontCN } from '@ant-design/icons';

export default (props: IPage) => {
  const { t } = useTranslation();

  const store = useStore();
  store.mapping.abcMapping = ['AAAAAAAAAAAAAAAAAA'];

  const ls = [];

  for (let i = 0, len = localStorage.length; i < len; i += 1) {
    if (typeof localStorage.key(i) === 'string') {
      ls.push(localStorage.getItem(localStorage.key(i) as string));
    }
  }

  return (
    <div>
      <HtmlMeta title={t(`${props.route.namei18n}`)} />
      <h2>TAG</h2>
      <SelectTagId selectedTagsMaxLength={5} />
      <br />

      <h5>ALL</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} />

      <br />
      <br />
      <h5>ARTICLE</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} parentSlug="article" />

      <br />
      <br />
      <h5>NOT THIS SLUG</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} parentSlug="JUST-TEST" />

      <br />
      <br />

      <SuspenseFallback />

      <Rcon type="ri-time-line" />
    </div>
  );
};
