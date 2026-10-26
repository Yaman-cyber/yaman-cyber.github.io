// terminal: a locked-down Docker run
docker run --rm \
  --network none \
  --memory 256m --cpus 0.5 \
  --read-only \
  python:3.12-slim python -c "print(sum(range(10)))"
# --network none: no internet   --rm: deleted after   --read-only: can't change files
