import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Input, Icon } from 'antd';
import { InputProps } from 'antd/lib/input';

import style from './style.less';

interface IProps {
  onChange?: Function;
  value?: string | string[];
  componentParam?: InputProps;
  isRequired?: boolean | null | undefined;
}

interface IState {
  innerValue?: string | string[];
}

export class SearchInput2 extends React.PureComponent<IProps, IState> {
  static propTypes = {
    isRequired: PropTypes.bool,
  };

  static defaultProps = {
    isRequired: false,
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      innerValue: this.props.value,
    };
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (this.props.value !== prevProps.value) {
      this.onUpdateInnerValue(this.props.value);
    }
  }

  componentWillUnmount() {
    this.setState = () => ({});
  }

  onUpdateInnerValue = (nextInnerValue: any) => {
    this.setState({
      innerValue: nextInnerValue,
    });
  };

  onPassToParent = (e: any | 'clear') => {
    const innerValue = e === 'clear' ? undefined : e.currentTarget.value;

    console.log('SearchInputKit:', innerValue);

    this.setState({ innerValue });

    if (this.props.onChange) {
      this.props.onChange(innerValue);
    }
  };

  onChange = (e: any) => {
    // 以 e.button 判断是 Input 还是按下 Button
    // 只有为 Button 才会触发清空

    if (typeof e.button !== 'undefined') {
      this.onPassToParent('clear');
    } else {
      this.setState({ innerValue: e.currentTarget.value });
    }
  };

  render() {
    return (
      <Input
        prefixCls="search-input ant-input"
        className={cx(style['search-input-wrapper'], 'search-input-wrapper')}
        allowClear
        onChange={this.onChange}
        defaultValue={this.state.innerValue}
        value={this.state.innerValue}
        addonAfter={
          <Icon
            type="search"
            className={style['search-input-search-button']}
            onClick={() =>
              this.onPassToParent({
                currentTarget: {
                  value: this.state.innerValue,
                },
              })
            }
          />
        }
        onPressEnter={this.onPassToParent}
        {...this.props.componentParam}
      />
    );
  }
}
