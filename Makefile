.PHONY: install dev stop build clean run

install:
	npm install

build:
	npm run build

clean:
	npm run clean

run:
	npm run dev

# Legacy docker dev (kept if needed)
dev:
	@docker run \
		-p 8081:80 \
		-d \
		-v $(shell pwd)/dist:/usr/share/nginx/html:ro \
		--name my-website \
		--rm \
		nginx

stop:
	@docker stop my-website
