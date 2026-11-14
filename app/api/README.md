# /app/api is reserved for v2

This folder is intentionally empty in v1.

PineLaunch v1 is a static site with no server. It collects no student data,
so there is nothing for an API route to do.

In v2, once a lawyer has reviewed the rules for storing minors' data, this is
where server routes will go: account sign-up with parent consent, the
built-in AI helper, parent progress emails, and payments.

Until then, do not add route files here. Adding one would break the static
export (`output: "export"` in next.config.ts).
