ssh pi@pi << EOF
cd ~/dev/ellicore2
./node_modules/.bin/ts-node --fast --nolazy --inspect=192.168.1.10:9229 ./index.ts
EOF