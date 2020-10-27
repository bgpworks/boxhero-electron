#!/bin/bash

SESSION_NAME=boxhero-pc

if [ -z "$(byobu list-sessions | grep -w ${SESSION_NAME})" ]; then
    byobu-tmux new-session -d -t "${SESSION_NAME}" 

    byobu-tmux split-window -t "${SESSION_NAME}:0.0" -h \; split-window -t "${SESSION_NAME}:0.1" -v
    byobu-tmux send-keys -t "${SESSION_NAME}:0.0" 'npx tsc -w' 'C-m'
    byobu-tmux send-keys -t "${SESSION_NAME}:0.1" 'npx webpack -w' 'C-m'
    echo "Start nodemon..."
    sleep 10
    byobu-tmux send-keys -t "${SESSION_NAME}:0.2" "npx nodemon -w out --exec 'cross-env NODE_ENV=development electron .'" 'C-m'
    byobu-tmux select-pane -t "${SESSION_NAME}:0"
fi

# Enter Byobu
byobu-tmux attach -t "${SESSION_NAME}"
