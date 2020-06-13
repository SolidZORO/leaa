目前这边是自动化部署的一些不成熟的思路记录。

### 需求

理论上可以在 CI/CD 上自动部署，但是我想

- 不装 Jenkins（服务器上）
- 有 Version 控制，可以 rollback
- 可以同时部署到多台机器上
- 尽可能简单

所以我觉得，用一个专有的 Git Repo 去作为部署跳板这里叫 Deploy Repo，这个 Deploy Repo 可以由 PM2 控制。PM2 天然支持多 hosts 部署，而且有很好的 rollback 支持。

重要的是，这个 Deploy Repo 虽然接受所有 node_modules 文件，但也只是第一次会很大，后面更新 package 因为有 git diff 算法的关系，所以只是在增量，所以网络传输完全可以忽略不计。并且因为是独立的 Git Repo，可以很方便的做到回滚。回滚就和 Git checkout 一样简单可靠。

抛开 Deploy Repo 不谈，其实 PM2 也是支持多版本 rollback 的，但他是已文件夹形式存在的，如果每个版本都有自己的 node_modules，那势必会让文件夹变得很大，最终权衡下来，还是使用独立的 Deploy Repo 配合 PM2 管理版本。

### 步骤

建议使用 `sh ./deploy.sh -p docker_install` 把项目打包到 `_deploy` 目录并在 docker 里面安装好所有 `node_modules`。

然后用 PM2 直接部署，比如 `pm2 deploy api`，回滚版本直接 `pm2 deploy api revert 4d2c-hash-0582` 就好。
