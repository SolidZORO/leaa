import Taro from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import './index.less';

type IProps = {
  counterStore?: {
    counter: number;
    increment: Function;
    decrement: Function;
    incrementAsync: Function;
  };
};

@inject('counterStore')
@observer
class Index extends Taro.Component<IProps> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Taro.Config = {
    navigationBarTitleText: '首页',
  };

  increment = () => {
    const { counterStore } = this.props;
    if (counterStore) {
      counterStore.increment();
    }
  };

  decrement = () => {
    const { counterStore } = this.props;
    if (counterStore) {
      counterStore.decrement();
    }
  };

  incrementAsync = () => {
    const { counterStore } = this.props;
    if (counterStore) {
      counterStore.incrementAsync();
    }
  };

  render() {
    return (
      <View className="index">
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Text>{this!.props!.counterStore!.counter}</Text>
      </View>
    );
  }
}

export default Index;
