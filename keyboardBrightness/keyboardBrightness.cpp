#include <cstdio>
#include <cstdlib>
#include <cstring>

const int MIN_BRIGHTNESS = '0';
const int MAX_BRIGHTNESS = '3';

int main(int argc, char** argv) 
{
    if (argc <= 1) {
        return EXIT_FAILURE;
    }

    bool increase;
    if (strcmp(argv[1], "inc") == 0) {
        increase = true;
    } else if (strcmp(argv[1], "dec") == 0) {
        increase = false;
    } else {
        return EXIT_FAILURE;
    }

    FILE* file = fopen("/sys/class/leds/asus::kbd_backlight/brightness", "w+");
    if (file == nullptr) {
        return EXIT_FAILURE;
    }
    int brightness = fgetc(file);

    if (increase) {
        ++brightness;
    } else {
        --brightness;
    }

    if (brightness < MIN_BRIGHTNESS) {
        brightness = MIN_BRIGHTNESS;
    } else if (brightness > MAX_BRIGHTNESS) {
        brightness = MAX_BRIGHTNESS;
    }

    rewind(file);

    fputc(brightness, file);
    fflush(file);

    fclose(file);

    return EXIT_SUCCESS;
}