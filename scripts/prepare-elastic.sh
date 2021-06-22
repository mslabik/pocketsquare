#!/bin/sh -e

echo "Ping Elasticsearch"
curl -s -o /dev/null --retry 10 --retry-delay 3 --retry-connrefused -X GET elasticsearch:9200

echo "Create offers index"
curl -s -o /dev/null --retry 10 --retry-delay 3 -X PUT elasticsearch:9200/offers?pretty

echo "Populate offers index"
jq -c '.[]' scripts/data.json |
while read -r rec
do
    curl -s -o /dev/null --retry 10 --retry-delay 3 -X POST elasticsearch:9200/offers/_doc?pretty -H "Content-Type: application/json" -d "$rec"
done
