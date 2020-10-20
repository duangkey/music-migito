# music-migito

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 播放器打开渠道多样， 需全局设计---vuex
变量：
    1.播放/暂停 （playing）
    2.展开/收起（fullScreen）
    3.播放列表 （playList）
    4.顺序列表 （sequenceList）
    5.播放模式 （mode）
    6.播放索引 (currentIndex)

### Vuex的使用
state.js定义全局状态 => getters.js获取state中的状态 => mutations中更改状态
