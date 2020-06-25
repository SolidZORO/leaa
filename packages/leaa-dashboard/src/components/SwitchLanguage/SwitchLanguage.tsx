import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Button, Popover, ConfigProvider } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import i18n from 'i18next';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { MdTranslate } from 'react-icons/md';

import style from './style.module.less';

interface IProps {
  className?: string;
  placement?: TooltipPlacement;
  dark?: boolean;
}

const langs = ['en-US', 'zh-CN'];

export const SwitchLanguage = (props: IProps): JSX.Element => {
  const formatLang = (lang?: string) => {
    // trans fallbackLng
    if (lang && ['en', 'us'].includes(lang)) return 'en-US';
    if (lang && ['zh', 'cn'].includes(lang)) return 'zh-CN';

    if ((!lang || !langs.includes(lang)) && i18n?.options.fallbackLng && i18n?.options.fallbackLng.length) {
      return i18n.options.fallbackLng.toString();
    }

    return 'en-US';
  };

  const [language, setLanguage] = useState<string>(formatLang(i18n.language));

  useEffect((): any => {
    i18n.changeLanguage(language);
  }, [language]);

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
          content={langs.map((lang) => (
            <Button
              key={lang}
              type="link"
              className={cx(style['lang-flag'], style[`lang-flag--${lang}`])}
              onClick={() => setLanguage(lang)}
            >
              {i18n.t(`_lang:lang-${lang}`)}
              {i18n.language === lang && <RiCheckboxCircleLine className={style['switch-language-selected']} />}
            </Button>
          ))}
        >
          <div className={style['switch-language-button']}>
            <Button type="link" size="small">
              <MdTranslate className={style['switch-language-button--icon']} />
              <span className={style['switch-language-button--lang']}>{i18n.t(`_lang:lang-code-${language}`)}</span>
            </Button>
          </div>
        </Popover>
      </ConfigProvider>
    </div>
  );
};
