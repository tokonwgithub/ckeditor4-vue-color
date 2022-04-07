#!/bin/sh

write_config() {
cat <<EOF >.env.development
VUE_APP_ENV=development

# ProxyUri 代理服务器地址
# 本地开发环境服务器
# VUE_APP_PROXY_URI=http://192.168.1.129/routapi

# 如果本地直接调用同事的网关，用下面的方式修改代理地址
VUE_APP_PROXY_URI=http://192.168.1.31:9006

# 如果需要添加其他（自定义）环境变量,需要使用（VUE_APP_）前缀包含,不然不会生效，这个是Vue自己的一个规范
# 例如 VUE_APP_TEST_ENV=testEnv

EOF

echo ">>> write .env.development"
cat .env.development
echo ">>> write .env.development end"
}

rm -rf .env.development
write_config