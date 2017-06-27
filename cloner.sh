output="Already up-to-date."

while [ true ]
do
    t=$(git pull)
    if [ t != output ]
    then
        killall node
        node server.js
    fi

    sleep 10
done
