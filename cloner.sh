output="Already up-to-date."

node server.js &
while [ true ]
do
    t=$(git pull)
    if [ "$t" != "$output" ]
    then
        killall node
        node server.js &
	systemctl restart nginx
    fi

    sleep 10
done
