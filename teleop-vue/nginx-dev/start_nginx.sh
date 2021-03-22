echo "stop nginx"
sudo nginx -s stop
echo "reconfigure and start nginx"
sudo nginx -c nginx-dev.conf -p $PWD
echo "nginx started"