.PHONY: dev stop build clean serve

install:
	npm install

build:
	npm run build

clean:
	npm run clean

serve:
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
