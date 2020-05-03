import React from 'react';
import { useTranslation } from 'react-i18next';
import { IPage } from '@leaa/dashboard/src/interfaces';
import { useStore } from '@leaa/dashboard/src/stores';

import { HtmlMeta, SelectTagId, SelectCategoryIdByTree, Rcon, SuspenseFallback } from '@leaa/dashboard/src/components';
import { LikeZanButton } from '@leaa/dashboard/src/pages/Zan/_components/LikeZanButton/LikeZanButton';

import { GithubAuthButton } from '../_components/GithubAuthButton/GithubAuthButton';

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

      <h2>Auth Github</h2>
      <GithubAuthButton />
      <br />
      <br />

      <h2>ZAN</h2>
      <LikeZanButton showInput id="a1307a74-cd18-4594-b67a-3a687cd577ed" />
      <br />
      <br />

      <h2>TAG</h2>
      <SelectTagId selectedTagsMaxLength={5} />
      <br />
      <br />

      {/* <h5>ALL</h5> */}
      {/* <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} /> */}

      <h5>ARTICLES</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} parentSlug="articles" />
      <br />
      <br />

      <h5>BRANDS</h5>
      <SelectCategoryIdByTree componentProps={{ allowClear: true }} style={{ width: 200 }} parentSlug="brands" />
      <br />
      <br />

      <SuspenseFallback />

      <Rcon type="ri-time-line" />
    </div>
  );
};
