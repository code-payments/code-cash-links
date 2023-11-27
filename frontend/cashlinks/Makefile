.PHONY: build-cashlinks
build-cashlinks:
	npm install
	npm run build

.PHONY: copy-cashlinks
copy-cashlinks:
	@rm -rf ../../backend/proxy/public/
	@mkdir -p ../../backend/proxy/public/
	@cp -r ./app/dist/* ../../backend/proxy/public/
	@cp -f ./app/favicon.ico ../../backend/proxy/public/favicon.ico

.PHONY: build
build: build-cashlinks copy-cashlinks