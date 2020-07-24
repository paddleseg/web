.PHONY: build
version=0.1.11

build:
	@rm -rf dist
	@yarn build

release: build
	docker build -t registry.cn-zhangjiakou.aliyuncs.com/vikings/seg-web:$(version) .
	docker tag registry.cn-zhangjiakou.aliyuncs.com/vikings/seg-web:$(version) registry.cn-zhangjiakou.aliyuncs.com/vikings/seg-web
	docker push registry.cn-zhangjiakou.aliyuncs.com/vikings/seg-web:$(version)
	docker push registry.cn-zhangjiakou.aliyuncs.com/vikings/seg-web
