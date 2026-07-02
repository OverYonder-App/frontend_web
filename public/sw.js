/* OverYonder push reminders service worker.
 * Receives Web Push messages and shows a notification; clicking it focuses an
 * existing tab (or opens a new one) at the event URL carried in the payload. */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_e) {
    data = { title: "OverYonder", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "OverYonder";
  const options = {
    body: data.body || "",
    icon: "/images/overyonder-logo.png",
    badge: "/images/overyonder-logo.png",
    tag: data.tag, // collapses repeat reminders for the same event
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      })
  );
});
