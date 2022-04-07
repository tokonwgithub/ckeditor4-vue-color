#/bin/bash

# auto deploy for testenv
time=$(date "+%m-%d %H:%M:%S")
name=$(git config user.name)

autoDeploy() {
    br=$(git symbolic-ref HEAD 2>/dev/null | cut -d"/" -f 3)
    git add .
    git commit -m "$br 环境部署 ${time} by $name"
    echo 当前分支 -------- $br $time
    git pull origin $br
    git push origin $br
}

deploy() {
    git add .
    git commit -m "$1 环境部署 ${time} by $name"
    git pull origin $1
    git push origin $1
}

if [ x"$1" = x ]; then
    autoDeploy
    echo -e "\n\n----------- 部署成功 $time $name"
else
    deploy $1
    echo -e "\n\n----------- $1分支 环境部署 $time $name"
fi
