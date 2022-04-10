#include <libnotify/notify.h>

#include "Notifications.h"

bool Notify(Progress progress) {
    static const int hints[] = {0, 50, 100};
    
    if (progress > (Progress) 2) {
        return false;
    }

    notify_init("Keyboard brightness");
    NotifyNotification* n = notify_notification_new("Keyboard brightness", "", nullptr);
    notify_notification_set_timeout(n, 1000);
    notify_notification_set_hint_int32(n, "value", hints[progress]);
    return notify_notification_show(n, nullptr);
}