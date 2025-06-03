#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-17159-63a9ac54/note_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

