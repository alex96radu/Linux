build:
	g++ keyboardBrightness.cpp -o keyboardBrightness
install: build
	cp keyboardBrightness /bin/keyboardBrightness
	cp initKeyboardBrightness.service /etc/systemd/system/initKeyboardBrightness.service
