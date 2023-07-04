#!/bin/sh

while (true) do
   deno run --allow-all ./main.ts

   # show result
   exitcode=$?
   echo "exit code of command is $exitcode"
done