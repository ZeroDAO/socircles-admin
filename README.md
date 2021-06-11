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
  <a >EN</a>
  <span> / </span>
  <a href="./README_ZH.md">中文</a>
</h5>




Calibration and tuning ZeroDAO's reputation system algorithm, using circles user data and relational data, as a control group to calculate `Betweenness` , `ArticleRank` , `PageRank` , `Closeness` , `Harmonic Centrality ` , `Eigenvector Centrality` , `Degree Centrality` , statistical data from various algorithms during the iteration.

This is the back-end repository for socircles and other related:

Website: https://socircles.info

Front End: https://github.com/ZeroDAO/socircles-ui

Back End: https://github.com/ZeroDAO/socircles-backend

## Features

- Crawler
  - Set up a crawler monitoring cycle
  - Logging of acquisition tasks
- Calculation management
  - Algorithm parameter setting
  - Algorithm flow management
  - Failed tasks handling
  - Automated operation of multiple processes
- Hall of Fame Management
  - Adding and deleting halls of fame
  - Automatically fetching Hall of Fame user information

## Pre-requisites

Node.js（> = 8.9.0）、@vue/cli （> 3.0.0）。

## Installation

Recommended for `yarn`：

```
yarn
```

## Services

Once the installation process is complete, run the following command to start the service. You can preview the website in your browser [http://localhost:9000](http://localhost:9000/)

```
yarn serve
```

## Thanks

[midway](https://midwayjs.org)
[cool-admin](https://www.cool-js.com)
