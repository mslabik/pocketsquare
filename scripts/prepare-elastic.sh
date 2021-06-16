#!/bin/sh -e

max_time=30

echo "Ping Elasticsearch"
curl -s -o /dev/null --retry-delay 3 --retry-max-time 30 -X GET elasticsearch:9200

echo "Create offers index"
curl -s -o /dev/null --retry-delay 3 --retry-max-time 30 -X PUT elasticsearch:9200/offers?pretty

echo "Populate offers index"
jq -c '.[]' scripts/data.json |
while read -r rec
do
    curl -s -o /dev/null --retry-delay 3 --retry-max-time 30 -X POST elasticsearch:9200/offers/_doc?pretty -H "Content-Type: application/json" -d "$rec"
done
