.PHONY: build
version=0.1.2

build:
	@rm -rf dist
	@yarn build

release: build
	docker build -t vikings/seg-web:$(version) .
	docker tag vikings/seg-web:$(version) vikings/seg-web
	docker push vikings/seg-web:$(version)
	docker push vikings/seg-web
