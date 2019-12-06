import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from 'antd';

import { IPage } from '@leaa/dashboard/src/interfaces';
import { useStore } from '@leaa/dashboard/src/stores';

import { HtmlMeta, SelectTagId, SelectCategoryIdByTree } from '@leaa/dashboard/src/components';
import style from '@leaa/dashboard/src/pages/Article/_components/ArticleInfoForm/style.module.less';

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
      <Icon type="thunderbolt" />
      <Icon type="shandian" />
      <Icon type="flashlight" />
      <h5>ALL</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} />

      <br />
      <br />
      <h5>ARTICLE</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} parentSlug="article" />
      {/* <h2>STORE</h2> */}
      {/* <code> */}
      {/*  <Input.TextArea rows={5} value={JSON.stringify(store)} /> */}
      {/* </code> */}
      {/* <Divider /> */}
      {/* <h2>LOCALSTORAGE</h2> */}
      {/* <code> */}
      {/*  <Input.TextArea rows={10} value={JSON.stringify(ls)} /> */}
      {/* </code> */}
    </div>
  );
};
