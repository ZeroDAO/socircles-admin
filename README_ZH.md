<p align="center">
  <a href="https://www.0p0.org/">
    <img alt="ZeroDAO" src="https://pic.tom24h.com/0p0/img/ZERODAO.svg" height="60" />
  </a>
  <span>|</span>
  <a href="https://www.socircles.info/">
    <img alt="socircles" src="https://pic.tom24h.com/0p0/img/socircles-logo.svg" height="50" />
  </a>
</p>


<h5 align="center">
  <a href="./README.md">EN</a>
  <span> / </span>
  <a>中文</a>
</h5>





校验和调优 ZeroDAO 的声誉系统算法，采用 circles 用户数据和关系数据，作为对照组计算 `Betweenness` , `ArticleRank` , `PageRank` , `Closeness` , `Harmonic Centrality` , `Eigenvector Centrality` , `Degree Centrality` , 统计迭代过程中各种算法数据。

这是 socircles 的后端仓库，其他相关：

应用: https://socircles.info

前端: https://github.com/ZeroDAO/socircles-ui

后端: https://github.com/ZeroDAO/socircles-backend

## 功能

- 采集
  - 设置采集监测周期
  - 采集任务记录
- 计算管理
  - 算法参数设置
  - 算法流程管理
  - 失败任务处理
  - 自动化运行多流程
- 名人堂管理
  - 增加和删除名人堂
  - 自动获取名人堂用户信息

## 前置条件

请确保你安装的 Node.js（> = 8.9.0）、@vue/cli （> 3.0.0）。

## 安装

推荐使用 `yarn`：

```
yarn
```

解决 `node-sass` 网络慢的方法：

```
yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
```

## 运行

安装过程完成后，运行以下命令启动服务。您可以在浏览器中预览网站 [http://localhost:9000](http://localhost:9000/)

```
yarn serve
```

## 感谢

[midway](https://midwayjs.org)
[cool-admin](https://www.cool-js.com)