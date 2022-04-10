build:
	g++ Notifications.cpp keyboardBrightness.cpp -o keyboardBrightness -std=c++20 `pkg-config --cflags --libs libnotify`
install: build
	cp keyboardBrightness /bin/keyboardBrightness
	mkdir -p /etc/runit/sv/initKeyboardBrightness/
	cp ./initKeyboardBrightness/run /etc/runit/sv/initKeyboardBrightness/run
