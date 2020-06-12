### 打包

建议使用 `sh ./deploy.sh -p local_build` 把项目打包到 `_deploy` 目录。

### 本地

```
cd _deploy
git init
git remote add origin git@xxxx:xxxx/deploy-leaa.git
git add .
git commit
git push -u origin api
```

### 服务器

ssh 到服务器，把服务器的 ssh key 给到 git 提供商。

#### 第一次

```
git clone git@xxxx:xxxx/deploy-leaa.git
cd deploy-leaa
git checkout api
```

#### 非第一次

```
cd deploy-leaa
git pull
```
