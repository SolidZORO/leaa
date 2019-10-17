// import tuiEditor from 'tui-editor';

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare module 'braft-extensions/*';
declare module 'to-mark';
declare module '@toast-ui/react-editor';
// declare module '@toast-ui/react-editor' {
//   export default tuiEditor.Editor;
// }
