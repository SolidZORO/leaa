/* eslint-disable @typescript-eslint/no-non-null-assertion */
import i18n from 'i18next';
import React, { useState, useEffect, forwardRef } from 'react';

import { Editor } from '@toast-ui/react-editor';
import tuiEditor from 'tui-editor';
import toMark from 'to-mark';
import 'tui-editor/dist/tui-editor-extScrollSync';
import 'tui-editor/dist/tui-editor-extTable';
import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.min.css';
import 'tui-editor/dist/tui-editor-contents.min.css';

import { IAttachmentParams } from '@leaa/common/src/interfaces';
import { attachmentUtil } from '@leaa/dashboard/src/utils';

import './editor.less';
import cx from 'classnames';
import style from './style.module.less';

interface IProps {
  attachmentParams: IAttachmentParams;
  content?: string;
  className?: string;
  onSave?: () => void;
  height?: () => number;
  onGetContent?: () => void;
}

interface ITuiEditor extends tuiEditor {
  layout: any;
  eventManager: any;
}

export const WYSIWYGEditor = forwardRef((props: IProps, ref: React.Ref<any>) => {
  const [editor, setEditor] = useState<ITuiEditor>();

  const onSwitchPreview = () => {
    if (!editor) {
      return;
    }

    // TODO if multiple editors have side effects
    const fnPreviewEl = document.querySelector('.tui-fn-preview');

    const previewEl = editor.layout.getPreviewEl();
    const previewElWidth = previewEl && previewEl[0] && previewEl[0].offsetWidth;

    if (previewElWidth > 0) {
      editor.layout.changePreviewStyle('tab');

      if (fnPreviewEl) {
        fnPreviewEl.classList.remove('tui-editor-icon-preview');
        fnPreviewEl.classList.add('tui-editor-icon-dis-preview');
      }
    } else {
      editor.layout.changePreviewStyle('vertical');

      if (fnPreviewEl) {
        fnPreviewEl.classList.remove('tui-editor-icon-dis-preview');
        fnPreviewEl.classList.add('tui-editor-icon-preview');
      }
    }
  };

  const onSwitchFullScreen = () => {
    if (!editor) {
      return;
    }

    // TODO if multiple editors have side effects
    const fnFullscreenEl = document.querySelector('.tui-fn-fullscreen');

    const editorEl = editor.layout.$el[0];

    if (editorEl.offsetTop > 0) {
      editorEl.classList.add('tui-editor-fullscreen');

      if (fnFullscreenEl) {
        fnFullscreenEl.classList.remove('tui-editor-icon-fullscreen');
        fnFullscreenEl.classList.add('tui-editor-icon-dis-fullscreen');

        document.body.style.overflowY = 'hidden';
      }
    } else {
      editorEl.classList.remove('tui-editor-fullscreen');

      if (fnFullscreenEl) {
        fnFullscreenEl.classList.remove('tui-editor-icon-dis-fullscreen');
        fnFullscreenEl.classList.add('tui-editor-icon-fullscreen');

        document.body.style.overflowY = 'auto';
      }
    }
  };

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      setEditor(ref.current!.getInstance());
    }
  }, []);

  useEffect(() => {
    if (editor) {
      editor.eventManager.addEventType('onSwitchPreview');
      editor.eventManager.listen('onSwitchPreview', onSwitchPreview);

      editor.eventManager.addEventType('onSwitchFullScreen');
      editor.eventManager.listen('onSwitchFullScreen', onSwitchFullScreen);
    }
  }, [editor]);

  useEffect(() => {
    if (props.content) {
      editor!.setValue(toMark(props.content));
    }
  }, [props.content]);

  const uploadFn = async (param: any) => {
    const signature = await attachmentUtil.getSignature();

    await attachmentUtil.uploadFile(param.file, signature, props.attachmentParams, {
      onUploadSuccess: event => {
        if (event && event.data && event.data.attachment && event.data.attachment.url) {
          return param.callback(event.data.attachment.url, event.data.attachment.filename);
        }

        return null;
      },
    });
  };

  const toolbarItems = [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider', // --------
    'hr',
    'quote',
    'divider', // --------
    'ul',
    'ol',
    'indent',
    'outdent',
    'divider', // --------
    'table',
    'image',
    'link',
    'divider', // --------
    'code',
    'codeblock',
    {
      type: 'button',
      options: {
        // eslint-disable-next-line no-undef
        $el: $(
          '<button ' +
            `class="tui-editor-icon tui-fn-preview tui-editor-icon-preview" ` +
            'type="button"' +
            '></button>',
        ),
        name: 'onSwitchPreview',
        event: 'onSwitchPreview',
        tooltip: 'PREVIEW',
      },
    },
    {
      type: 'button',
      options: {
        // eslint-disable-next-line no-undef
        $el: $(
          '<button ' +
            `class="tui-editor-icon tui-fn-fullscreen tui-editor-icon-fullscreen" ` +
            'type="button"' +
            '></button>',
        ),
        name: 'onSwitchFullScreen',
        event: 'onSwitchFullScreen',
        tooltip: 'FULL',
      },
    },
  ];

  return (
    <div className={cx(style['wrapper'], props.className)}>
      <Editor
        ref={ref}
        previewStyle="vertical"
        height={props.height || 640}
        initialEditType="markdown"
        useCommandShortcut
        toolbarItems={toolbarItems}
        usageStatistics={false}
        language={i18n.language === 'zh-CN' ? 'zh' : 'en'}
        exts={['scrollSync', 'colorSyntax', 'mark', 'table']}
        hooks={{
          addImageBlobHook: (blob: any, callback: any) =>
            uploadFn({
              file: blob,
              callback,
            }),
        }}
      />
    </div>
  );
});
