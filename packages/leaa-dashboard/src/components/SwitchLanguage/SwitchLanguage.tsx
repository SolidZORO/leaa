import React, { useEffect } from 'react';
import cx from 'classnames';
import { Button, Popover, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { TooltipPlacement } from 'antd/es/tooltip';

import { CheckCircleOutlined } from '@ant-design/icons';

import { Rcon } from '@leaa/dashboard/src/components';

import style from './style.module.less';

interface IProps {
  className?: string;
  placement?: TooltipPlacement;
  dark?: boolean;
}

const langs = ['en-US', 'zh-CN'];

export const SwitchLanguage = (props: IProps): JSX.Element => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
  };

  useEffect((): any => {
    const lang = i18n.language;

    // trans fallbackLng
    if (['en', 'us'].includes(lang)) return i18n.changeLanguage('en-US');
    if (['zh', 'cn'].includes(lang)) return i18n.changeLanguage('zh-CN');

    if (!langs.includes(lang) && i18n.options.fallbackLng && i18n.options.fallbackLng.length) {
      return i18n.changeLanguage(i18n.options.fallbackLng.toString());
    }

    return undefined;
  }, []);

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
              {langs.map((lang) => (
                <Button
                  key={lang}
                  type="link"
                  className={cx(style['lang-flag'], style[`lang-flag--${lang}`])}
                  onClick={() => changeLanguage(lang)}
                >
                  {t(`_lang:lang-${lang}`)}
                  {i18n.language === lang && <CheckCircleOutlined />}
                </Button>
              ))}
            </>
          }
        >
          <div className={style['switch-language-button']}>
            <Button type="link" size="small">
              <Rcon type="ri-translate-2" className={style['switch-language-button--icon']} />
              <span className={style['switch-language-button--lang']}>{t(`_lang:lang-code-${i18n.language}`)}</span>
            </Button>
          </div>
        </Popover>
      </ConfigProvider>
    </div>
  );
};
