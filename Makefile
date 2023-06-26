run-localstack:
	docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack localstack

run-mongo:
	docker rm mongodb && \
	docker run -p 27017:27017 --name mongodb -v /var/mongo/data:/data/db mongo

