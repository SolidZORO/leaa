import _ from 'lodash';
import React from 'react';
import cx from 'classnames';
import { Button, Popover, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { TooltipPlacement } from 'antd/lib/tooltip';

import style from './style.less';

interface IProps {
  className?: string;
  placement?: TooltipPlacement;
  dark?: boolean;
}

const langs = ['en', 'cn'];

export const SwitchLanguage = (props: IProps): JSX.Element => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  return (
    <div
      className={cx(style['wrapper'], props.className, {
        [style['wrapper--dark']]: props.dark,
      })}
    >
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Popover
          trigger="click"
          arrowPointAtCenter
          placement={props.placement}
          overlayClassName={cx(style['switch-language-popover'], 'switch-language-popover')}
          content={
            <>
              {langs.map(lang => (
                <Button
                  key={lang}
                  type="link"
                  className={cx(style['lang-flag'], style[`lang-flag--${lang}`])}
                  onClick={() => changeLanguage(lang)}
                >
                  {t(`_lang:lang${_.upperFirst(lang)}`)}
                </Button>
              ))}
            </>
          }
        >
          <Button
            type="link"
            className={cx(style['lang-flag'], style[`lang-flag--${i18n.language}`], style['lang-flag--current'])}
          >
            {t(`_lang:lang${_.upperFirst(i18n.language)}`)}
          </Button>
        </Popover>
      </ConfigProvider>
    </div>
  );
};
