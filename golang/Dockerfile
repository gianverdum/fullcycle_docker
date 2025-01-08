FROM golang:1.19-alpine AS builder

WORKDIR /usr/app

COPY . .

RUN go build ./main.go

FROM scratch

COPY --from=builder /usr/app/main .

ENTRYPOINT [ "./main" ]
