import cx from 'classnames';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { Cascader } from 'antd';

import { GET_DIVISIONS_MAPPING } from '@leaa/dashboard/src/graphqls';
import { IDivisionDist } from '@leaa/common/src/interfaces';

import style from './style.module.less';

interface IProps {
  onChangeCallback: (v: any) => void;
  defaultValue?: any[];
}

export const AddressSelect = (props: IProps) => {
  const { t } = useTranslation();

  // query
  const getDivisionMappingQuery = useQuery<{ divisionsMapping: string }>(GET_DIVISIONS_MAPPING);

  const [divisionsMapping, setDivisionsMapping] = useState<IDivisionDist[]>();
  const [value, setValue] = useState<string[] | undefined>(props.defaultValue);

  useEffect(() => {
    if (getDivisionMappingQuery?.data?.divisionsMapping) {
      setDivisionsMapping(JSON.parse(getDivisionMappingQuery?.data?.divisionsMapping));
    }
  }, [getDivisionMappingQuery?.data?.divisionsMapping]);

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  const onChange = (v: any[]) => {
    setValue(v);

    if (props.onChangeCallback) {
      props.onChangeCallback(v);
    }
  };

  return (
    <div className={cx(style['wrapper'])}>
      <Cascader
        options={divisionsMapping}
        fieldNames={{ label: 'value', value: 'value' }}
        onChange={onChange}
        value={value}
        showSearch
      />
    </div>
  );
};
