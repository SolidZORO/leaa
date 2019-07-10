import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Input, Form, Card, Descriptions, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

import { WYSIWYGEditor } from '@leaa/dashboard/components/WYSIWYGEditor';

import style from './style.less';

interface IProps {
  content?: string;
  className?: string;
}

export const ArticleContentForm = React.forwardRef((props: IProps, ref: React.Ref<any>) => {
  const { t } = useTranslation();

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Card>
        <Descriptions title={t('_page:Article.Component.articleContent')} />

        <Row gutter={16} className={style['form-row']}>
          <Col xs={24}>
            <WYSIWYGEditor ref={ref} content={props.content} />
          </Col>
        </Row>
      </Card>
    </div>
  );
});
