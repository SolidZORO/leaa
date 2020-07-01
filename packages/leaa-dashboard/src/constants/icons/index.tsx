// TODO, delete after waiting for `https://github.com/react-icons/react-icons` update
import { GenIcon, IconBaseProps } from 'react-icons';

export const RiEdit2Fill = (props: IconBaseProps) =>
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
                'M9.243 19H21v2H3v-4.243l9.9-9.9 4.242 4.244L9.242 19zm5.07-13.556l2.122-2.122a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414l-2.122 2.121-4.242-4.242z',
            },
          },
        ],
      },
    ],
  })(props);
