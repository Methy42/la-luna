mksir dist
mkdir dist/asar
mkdir dist/asar/main_process
mkdir dist/asar/ui_process

cp -R main_process/* dist/asar/main_process
cp -R ui_process/dist dist/asar/ui_process/dist



rm -rf dist
