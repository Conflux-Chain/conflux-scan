# Conflux Scan V2.0项目
    主要技术栈：React，样式用Styled-Component引入，全部采用flex布局

# 文件夹结构说明
    -- src
      -- assets 资源包，放些图片类的资源，需要webpack处理的
      -- components 公共组件库，比如头，尾部，还有一些基础组件
      -- lang 语言包，目前仅支持en和ch
      -- pages 页面组件
      -- route 路由配置
      -- utils 工具包
        -- constants 静态文件的数据结构
    -- static 静态资源，改动比较频繁的图片，不需要经过编译

# pre-commit
    prettier
    eslint
    提交不了的是时候看看输出结果，把error改了再次提交就可以了

# 响应式布局
    采用media模版文件的配置方式
    const sizes = {
      desktop: 992,
      tablet: 768,
      phone: 576,
    };

    // Iterate through the sizes and create a media template
    const media = Object.keys(sizes).reduce((acc, label) => {
      acc[label] = (...args) => css`
        @media (max-width: ${sizes[label] / 16}em) {
          ${css(...args)}
        }
      `;

      return acc;
    }, {});

    页面import media以后采用下面的方式写响应式就可以了
    ${media.desktop`background: dodgerblue;`}
    ${media.tablet`background: mediumseagreen;`}
    ${media.phone`background: palevioletred;`}


# 编码规范--Airbnb React/JSX 编码规范

*算是最合理的React/JSX编码规范之一了*

此编码规范主要基于目前流行的JavaScript标准，尽管某些其他约定(如async/await，静态class属性)可能在不同的项目中被引入或者被禁用。目前的状态是任何stage-3之前的规范都不包括也不推荐使用。

## 内容目录

  1. [基本规范](#basic-rules-基本规范)
  1. [Class vs React.createClass vs stateless](#创建模块)
  1. [Mixins](#mixins)
  1. [命名](#naming-命名)
  1. [声明模块](#declaration-声明模块)
  1. [代码对齐](#alignment-代码对齐)
  1. [单引号还是双引号](#quotes-单引号还是双引号)
  1. [空格](#spacing-空格)
  1. [属性](#props-属性)
  1. [Refs引用](#refs)
  1. [括号](#parentheses-括号)
  1. [标签](#tags-标签)
  1. [函数/方法](#methods-函数)
  1. [模块生命周期](#ordering-react-模块生命周期)
  1. [isMounted](#ismounted)

## Basic Rules 基本规范

  - 每个文件只写一个模块.
    - 但是多个[无状态模块](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions)可以放在单个文件中. eslint: [`react/no-multi-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md#ignorestateless).
  - 推荐使用JSX语法.
  - 不要使用 `React.createElement`，除非从一个非JSX的文件中初始化你的app.
  - [`react/forbid-prop-types`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md) 仅在包含`array`和`object`时允许`arrays`和`objects`，使用`arrayOf`, `objectOf`, 或者`shape`.

## 创建模块
   Class vs React.createClass vs stateless

  - 如果你的模块有内部状态或者是`refs`, 推荐使用 `class extends React.Component` 而不是 `React.createClass`.
  eslint: [`react/prefer-es6-class`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md) [`react/prefer-stateless-function`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md)

    ```jsx
    // bad
    const Listing = React.createClass({
      // ...
      render() {
        return <div>{this.state.hello}</div>;
      }
    });

    // good
    class Listing extends React.Component {
      // ...
      render() {
        return <div>{this.state.hello}</div>;
      }
    }
    ```

    如果你的模块没有状态或是没有引用`refs`， 推荐使用普通函数（非箭头函数）而不是类:

    ```jsx
    // bad
    class Listing extends React.Component {
      render() {
        return <div>{this.props.hello}</div>;
      }
    }

    // bad (relying on function name inference is discouraged)
    const Listing = ({ hello }) => (
      <div>{hello}</div>
    );

    // good
    function Listing({ hello }) {
      return <div>{hello}</div>;
    }
    ```

## Mixins

  - [不要使用 mixins](https://facebook.github.io/react/blog/2016/07/13/mixins-considered-harmful.html).

  > 为什么? Mixins 会增加隐式的依赖，导致命名冲突，并且会以雪球式增加复杂度。在大多数情况下Mixins可以被更好的方法替代，如：组件化，高阶组件，工具模块等。

## Naming 命名

  - **引用命名**: React模块名使用帕斯卡命名，实例使用骆驼式命名. eslint: [`react/jsx-pascal-case`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md)

    ```jsx
    // bad
    import reservationCard from './ReservationCard';

    // good
    import ReservationCard from './ReservationCard';

    // bad
    const ReservationItem = <ReservationCard />;

    // good
    const reservationItem = <ReservationCard />;
    ```

  - **模块命名**: 模块使用当前文件名一样的名称. 比如 `ReservationCard.jsx` 应该包含名为 `ReservationCard`的模块. 但是，如果整个文件夹是一个模块，使用 `index.js`作为入口文件，然后直接使用 `index.js` 或者文件夹名作为模块的名称:

    ```jsx
    // bad
    import Footer from './Footer/Footer';

    // bad
    import Footer from './Footer/index';

    // good
    import Footer from './Footer';
    ```
  - **高阶模块命名**: 对于生成一个新的模块，其中的模块名 `displayName` 应该为高阶模块名和传入模块名的组合. 例如, 高阶模块 `withFoo()`, 当传入一个 `Bar` 模块的时候， 生成的模块名 `displayName` 应该为 `withFoo(Bar)`.

    > 为什么？一个模块的 `displayName` 可能会在开发者工具或者错误信息中使用到，因此有一个能清楚的表达这层关系的值能帮助我们更好的理解模块发生了什么，更好的Debug.

    ```jsx
    // bad
    export default function withFoo(WrappedComponent) {
      return function WithFoo(props) {
        return <WrappedComponent {...props} foo />;
      }
    }

    // good
    export default function withFoo(WrappedComponent) {
      function WithFoo(props) {
        return <WrappedComponent {...props} foo />;
      }

      const wrappedComponentName = WrappedComponent.displayName
        || WrappedComponent.name
        || 'Component';

      WithFoo.displayName = `withFoo(${wrappedComponentName})`;
      return WithFoo;
    }
    ```

  - **属性命名**: 避免使用DOM相关的属性来用作其他的用途。

    > 为什么？对于`style` 和 `className`这样的属性名，我们都会默认它们代表一些特殊的含义，如元素的样式，CSS class的名称。在你的应用中使用这些属性来表示其他的含义会使你的代码更难阅读，更难维护，并且可能会引起bug。

    ```jsx
    // bad
    <MyComponent style="fancy" />

    // good
    <MyComponent variant="fancy" />
    ```

## Declaration 声明模块

  - 不要使用 `displayName` 来命名React模块，而是使用引用来命名模块， 如 class 名称.

    ```jsx
    // bad
    export default React.createClass({
      displayName: 'ReservationCard',
      // stuff goes here
    });

    // good
    export default class ReservationCard extends React.Component {
    }
    ```

## Alignment 代码对齐

  - 遵循以下的JSX语法缩进/格式. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md) [`react/jsx-closing-tag-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md)

    ```jsx
    // bad
    <Foo superLongParam="bar"
         anotherSuperLongParam="baz" />

    // good, 有多行属性的话, 新建一行关闭标签
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    />

    // 若能在一行中显示, 直接写成一行
    <Foo bar="bar" />

    // 子元素按照常规方式缩进
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    >
      <Quux />
    </Foo>

    // bad
    {showButton &&
      <Button />
    }
    // bad
    {
      showButton &&
        <Button />
    }
    // good
    {showButton && (
      <Button />
    )}
    // good
    {showButton && <Button />}
    ```

## Quotes 单引号还是双引号

  - 对于JSX属性值总是使用双引号(`"`), 其他均使用单引号(`'`). eslint: [`jsx-quotes`](http://eslint.org/docs/rules/jsx-quotes)

    > 为什么? HTML属性也是用双引号, 因此JSX的属性也遵循此约定.

    ```jsx
    // bad
    <Foo bar='bar' />

    // good
    <Foo bar="bar" />

    // bad
    <Foo style={{ left: "20px" }} />

    // good
    <Foo style={{ left: '20px' }} />
    ```

## Spacing 空格

  - 总是在自动关闭的标签前加一个空格，正常情况下也不需要换行. eslint: [`no-multi-spaces`](http://eslint.org/docs/rules/no-multi-spaces), [`react/jsx-tag-spacing`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md)

    ```jsx
    // bad
    <Foo/>

    // very bad
    <Foo                 />

    // bad
    <Foo
     />

    // good
    <Foo />
    ```

  - 不要在JSX `{}` 引用括号里两边加空格. eslint: [`react/jsx-curly-spacing`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md)

    ```jsx
    // bad
    <Foo bar={ baz } />

    // good
    <Foo bar={baz} />
    ```

## Props 属性

  - JSX属性名使用骆驼式风格`camelCase`.

    ```jsx
    // bad
    <Foo
      UserName="hello"
      phone_number={12345678}
    />

    // good
    <Foo
      userName="hello"
      phoneNumber={12345678}
    />
    ```

  - 如果属性值为 `true`, 可以直接省略. eslint: [`react/jsx-boolean-value`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md)

    ```jsx
    // bad
    <Foo
      hidden={true}
    />

    // good
    <Foo
      hidden
    />

    // good
    <Foo hidden />
    ```

  - 对于所有非必须的属性，总是手动去定义`defaultProps`属性.

  > 为什么? propTypes 可以作为模块的文档说明, 并且声明 defaultProps 的话意味着阅读代码的人不需要去假设一些默认值。更重要的是, 显示的声明默认属性可以让你的模块跳过属性类型的检查.

  ```jsx
  // bad
  function SFC({ foo, bar, children }) {
    return <div>{foo}{bar}{children}</div>;
  }
  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
    children: PropTypes.node,
  };

  // good
  function SFC({ foo, bar, children }) {
    return <div>{foo}{bar}{children}</div>;
  }
  SFC.propTypes = {
    foo: PropTypes.number.isRequired,
    bar: PropTypes.string,
    children: PropTypes.node,
  };
  SFC.defaultProps = {
    bar: '',
    children: null,
  };
  ```

  - 尽可能少地使用扩展运算符

  >  为什么? 除非你很想传递一些不必要的属性。对于React v15.6.1和更早的版本，你可以[给DOM传递一些无效的HTML属性](https://doc.react-china.org/blog/2017/09/08/dom-attributes-in-react-16.html)

  例外情况:

  -  使用了变量提升的高阶组件

  ```jsx
  function HOC(WrappedComponent) {
    return class Proxy extends React.Component {
      Proxy.propTypes = {
        text: PropTypes.string,
        isLoading: PropTypes.bool
      };

      render() {
        return <WrappedComponent {...this.props} />
      }
    }
  }
  ```

  -  只有在清楚明白扩展对象时才使用扩展运算符。这非常有用尤其是在使用Mocha测试组件的时候。

  ```jsx
  export default function Foo {
    const props = {
      text: '',
      isPublished: false
    }

    return (<div {...props} />);
  }
  ```

  特别提醒：尽可能地筛选出不必要的属性。同时，使用[prop-types-exact](https://www.npmjs.com/package/prop-types-exact)来预防问题出现。

  ```jsx
  // bad
  render() {
    const { irrelevantProp, ...relevantProps  } = this.props;
    return <WrappedComponent {...this.props} />
  }

  // good
  render() {
    const { irrelevantProp, ...relevantProps  } = this.props;
    return <WrappedComponent {...relevantProps} />
  }
  ```


## Refs

  - 总是在Refs里使用回调函数. eslint: [`react/no-string-refs`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md)

    ```jsx
    // bad
    <Foo
      ref="myRef"
    />

    // good
    <Foo
      ref={(ref) => { this.myRef = ref; }}
    />
    ```


## Parentheses 括号

  - 将多行的JSX标签写在 `()`里. eslint: [`react/jsx-wrap-multilines`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md)

    ```jsx
    // bad
    render() {
      return <MyComponent className="long body" foo="bar">
               <MyChild />
             </MyComponent>;
    }

    // good
    render() {
      return (
        <MyComponent className="long body" foo="bar">
          <MyChild />
        </MyComponent>
      );
    }

    // good, 单行可以不需要
    render() {
      const body = <div>hello</div>;
      return <MyComponent>{body}</MyComponent>;
    }
    ```

## Tags 标签

  - 对于没有子元素的标签来说总是自己关闭标签. eslint: [`react/self-closing-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md)

    ```jsx
    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />
    ```

  - 如果模块有多行的属性， 关闭标签时新建一行. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

    ```jsx
    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />
    ```

## Methods 函数

  - 使用箭头函数来获取本地变量. 当需要将附加数据传递给事件处理程序时，它很方便. 尽管如此，请确保它们[不会严重损害性能]（https://www.bignerdranch.com/blog/为react事件处理程序选择最佳方法/），尤其是在传递给可能是纯组件的自定义组件时，因为它们每次都会触发可能不必要的重传器.

    ```jsx
    function ItemList(props) {
      return (
        <ul>
          {props.items.map((item, index) => (
            <Item
              key={item.key}
              onClick={(event) => doSomethingWith(event, item.name, index)}
            />
          ))}
        </ul>
      );
    }
    ```

  - 当在 `render()` 里使用事件处理方法时，提前在构造函数里把 `this` 绑定上去. eslint: [`react/jsx-no-bind`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)

    > 为什么? 在每次 `render` 过程中， 再调用 `bind` 都会新建一个新的函数，浪费资源. 不要在类字段中使用arrow函数，因为它使它们[对测试和调试具有挑战性，并且会对性能产生负面影响]（https://medium.com/@charpeni/arrow-functions-in-class-properties-may-not-be-great-as-we-think-3b3551c440b1），并且从概念上讲，类字段是用于数据的，而不是逻辑的.

    ```jsx
    // bad
    class extends React.Component {
      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv.bind(this)} />;
      }
    }

    // good
    class extends React.Component {
      constructor(props) {
        super(props);

        this.onClickDiv = this.onClickDiv.bind(this);
      }

      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv} />;
      }
    }
    ```

  - 在React模块中，不要给所谓的私有函数添加 `_` 前缀，本质上它并不是私有的.

    > 为什么？`_` 下划线前缀在某些语言中通常被用来表示私有变量或者函数。但是不像其他的一些语言，在JS中没有原生支持所谓的私有变量，所有的变量函数都是共有的。尽管你的意图是使它私有化，在之前加上下划线并不会使这些变量私有化，并且所有的属性（包括有下划线前缀及没有前缀的）都应该被视为是共有的。了解更多详情请查看Issue [#1024](https://github.com/airbnb/javascript/issues/1024), 和 [#490](https://github.com/airbnb/javascript/issues/490) 。

    ```jsx
    // bad
    React.createClass({
      _onClickSubmit() {
        // do stuff
      },

      // other stuff
    });

    // good
    class extends React.Component {
      onClickSubmit() {
        // do stuff
      }

      // other stuff
    }
    ```

  - 在 `render` 方法中总是确保 `return` 返回值. eslint: [`react/require-render-return`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md)

    ```jsx
    // bad
    render() {
      (<div />);
    }

    // good
    render() {
      return (<div />);
    }
    ```

## Ordering React 模块生命周期

  - `class extends React.Component` 的生命周期函数:

  1. 可选的 `static` 方法
  1. `constructor` 构造函数
  1. `getChildContext` 获取子元素内容
  1. `componentWillMount` 模块渲染前
  1. `componentDidMount` 模块渲染后
  1. `componentWillReceiveProps` 模块将接受新的数据
  1. `shouldComponentUpdate` 判断模块需不需要重新渲染
  1. `componentWillUpdate` 上面的方法返回 `true`， 模块将重新渲染
  1. `componentDidUpdate` 模块渲染结束
  1. `componentWillUnmount` 模块将从DOM中清除, 做一些清理任务
  1. *点击回调或者事件处理器* 如 `onClickSubmit()` 或 `onChangeDescription()`
  1. *`render` 里的 getter 方法* 如 `getSelectReason()` 或 `getFooterContent()`
  1. *可选的 render 方法* 如 `renderNavigation()` 或 `renderProfilePicture()`
  1. `render` render() 方法

  - 如何定义 `propTypes`, `defaultProps`, `contextTypes`, 等等其他属性...

    ```jsx
    import React from 'react';
    import PropTypes from 'prop-types';

    const propTypes = {
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      text: PropTypes.string,
    };

    const defaultProps = {
      text: 'Hello World',
    };

    class Link extends React.Component {
      static methodsAreOk() {
        return true;
      }

      render() {
        return <a href={this.props.url} data-id={this.props.id}>{this.props.text}</a>;
      }
    }

    Link.propTypes = propTypes;
    Link.defaultProps = defaultProps;

    export default Link;
    ```

  - `React.createClass` 的生命周期函数，与使用class稍有不同: eslint: [`react/sort-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md)

  1. `displayName` 设定模块名称
  1. `propTypes` 设置属性的类型
  1. `contextTypes` 设置上下文类型
  1. `childContextTypes` 设置子元素上下文类型
  1. `mixins` 添加一些mixins
  1. `statics`
  1. `defaultProps` 设置默认的属性值
  1. `getDefaultProps` 获取默认属性值
  1. `getInitialState` 或者初始状态
  1. `getChildContext`
  1. `componentWillMount`
  1. `componentDidMount`
  1. `componentWillReceiveProps`
  1. `shouldComponentUpdate`
  1. `componentWillUpdate`
  1. `componentDidUpdate`
  1. `componentWillUnmount`
  1. *clickHandlers or eventHandlers* like `onClickSubmit()` or `onChangeDescription()`
  1. *getter methods for `render`* like `getSelectReason()` or `getFooterContent()`
  1. *Optional render methods* like `renderNavigation()` or `renderProfilePicture()`
  1. `render`

## isMounted

  - 不要再使用 `isMounted`. eslint: [`react/no-is-mounted`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md)

  > 为什么? [`isMounted` 反人类设计模式:()][anti-pattern], 在 ES6 classes 中无法使用， 官方将在未来的版本里删除此方法.

  [anti-pattern]: https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html

**[⬆ 回到顶部](#内容目录)**
