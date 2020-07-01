// TODO, delete after waiting for `https://github.com/react-icons/react-icons` update
import { GenIcon, IconBaseProps } from 'react-icons';

export const RiMoreFill = (props: IconBaseProps) =>
  GenIcon({
    tag: 'svg',
    attr: { viewBox: '0 0 24 24' },
    child: [
      {
        tag: 'g',
        attr: {},
        child: [
          // @ts-ignore
          { tag: 'path', attr: { fill: 'none', d: 'M0 0h24v24H0z' } },
          // @ts-ignore
          {
            tag: 'path',
            attr: {
              d:
                // eslint-disable-next-line max-len
                'M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
            },
          },
        ],
      },
    ],
  })(props);
