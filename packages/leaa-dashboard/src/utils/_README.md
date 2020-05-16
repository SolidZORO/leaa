## 命名规则（前缀）

### 把 A 格式化成 B（I/O 类型不变）`format`

e.g. `formatOrder()`

```
{ order: 'asc' } => { order: 'ASC' }
```

### 把 A 变成 B（I/O 类型改变）`trans`

e.g. `transCrudStateToUrlQuery()`

```
{ q: 'abc' } => { order: ""abc"" } (JSON.stringify)
```

### 把 A 和 B 合并（复杂合并）`merge`

e.g. `mergeUrlParamToUrlQuery()`

```
{ a: 1, b: 2 } => { a: 111, b: 222 }
```

### 由 A 生成 B `gen`

e.g. `genFuzzySearchByQ()`

```
'q' => { a: 'q', b: 'q' }
```

### `get` - 获取一个值

e.g. `getAbc()`

### `set` 设置一个值

e.g. `setAbc('name', options)`
