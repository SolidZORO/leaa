import { NextPageContext } from 'next';
// import { ITfn } from './i18n.interface';
import { IAppProps } from './app.interface';

// export interface IPage extends IAppProps {
interface ILang {
  t: (s: string) => string;
}

export type IPage = IAppProps & ILang;
