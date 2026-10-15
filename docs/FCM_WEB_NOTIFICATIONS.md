# SecureWealth Twin browser notifications

This implementation supports Firebase Cloud Messaging (FCM) in the Expo **web**
build only. It does not enable push in Expo Go, React Native Android/iOS builds,
embedded web views, or every browser. The app checks the Firebase SDK's
`isSupported()` result at runtime and leaves the setting off when the current
browser cannot use FCM.

## What is sent and when

The browser prompts only after a signed-in user turns on **Settings → Fraud
Alerts**. The setting explains that permission is needed to deliver a generic
warning when the app is closed. The app does not ask at startup or after login.

An actual `BLOCK` result from the existing `POST /fraud/check` rule engine is
the alert hook. Scoring, thresholds, and fraud decisions are unchanged. When
that request has a valid Firebase ID token, the backend sends a generic payload:

```text
Title: Security alert
Body:  A transaction needs your review in SecureWealth Twin.
```

Payload data contains only `event=fraud_warning` and `screen=notifications`.
It never contains an OTP, access token, FCM token, amount, payee, account
detail, risk score, or fraud reason. There is no invented login-alert path: the
current codebase has no reliable server-side login event yet.

## Firebase configuration — Shahee

Configure the web app and Firebase Authentication in the same Firebase project.
Create a local `SecureWealthTwin-Frontend-main/.env.local` from `.env.example`;
do not commit it.

```powershell
Copy-Item .env.example .env.local
```

Set all `EXPO_PUBLIC_FIREBASE_*` values from Firebase Console, including the
public Web Push/VAPID key. Browser Firebase configuration and the VAPID public
key necessarily appear in a web app at runtime; they are not Firebase Admin
credentials. Do not put service-account JSON, private keys, or a server API key
in this file or any frontend source.

Before starting or exporting the web application, run one of:

```powershell
npm run web
npm run export:web
```

Both commands generate the ignored `public/firebase-messaging-sw.js` from the
local environment. Expo static export copies `public/` files to the website
root, so deployed sites expose the required
`/firebase-messaging-sw.js` service-worker URL. The generated worker uses the
same Firebase JS SDK major version as the app package.

In Firebase Console:

1. Enable Cloud Messaging and the FCM Registration API.
2. Create/import a Web Push certificate and place its public VAPID key in the
   local environment.
3. Add the production HTTPS origin to the Firebase web app and Auth authorized
   domains.
4. Ensure the application sign-in establishes a Firebase Auth user in the
   browser. The current demo login screen does not yet do this; without that
   integration the browser setting correctly reports that sign-in is required
   and no token is registered.

FCM web requires a secure context. Use `https://` in deployments; `localhost`
is acceptable during local development. Test browser support on the actual
target browser because private browsing, enterprise policies, disabled service
workers, and browser-specific Push API availability can prevent registration.
Firebase's current [web setup guide](https://firebase.google.com/docs/cloud-messaging/web/get-started)
and [SDK support matrix](https://firebase.google.com/docs/web/environments-js-sdk)
are the source of truth.

## Server configuration — Rakshit

Install the backend dependencies and configure credentials **only on the
server**:

```powershell
pip install -r requirements.txt
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\secure\firebase-service-account.json"
$env:FIREBASE_PROJECT_ID = "your-project-id"
uvicorn main:app --port 8001
```

`GOOGLE_APPLICATION_CREDENTIALS` is read through Application Default
Credentials. Keep its JSON file outside this repository and outside the static
frontend deployment. In managed infrastructure, prefer workload identity or an
equivalent server-side default credential instead of a downloaded key. See
[Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup).

The two device endpoints are deliberately authenticated with Firebase ID tokens:

| Request | Contract |
| --- | --- |
| `POST /notifications/devices` | `Authorization: Bearer <Firebase ID token>` plus `{ "token": "<FCM token>", "platform": "web" }` |
| `DELETE /notifications/devices` | The same authenticated body; the token stays out of the URL and its logs |

The server verifies the bearer token with Firebase Admin SDK, uses its verified
UID for storage, and ignores any client-supplied `uid`. A token already bound to
another UID produces `409`; delete only affects the authenticated owner's row.
This prevents a signed-in user from registering, reassigning, or removing
another user's browser registration. Invalid/expired/revoked credentials return
`401`; a missing Admin configuration returns `503` rather than accepting an
unverified caller.

The existing API CORS policy is development-only (`*`). Rakshit should replace
it with the exact production web origins before deployment. The narrow changes
to `main.py` are limited to router/storage initialization and calling the FCM
service after an already-computed `BLOCK` decision; fraud logic itself is not
modified.

## Lifecycle handling

- Permission denied: the setting stays off and explains that the site permission
  must be changed in the browser.
- Unsupported browser/configuration: no permission prompt or registration is
  attempted.
- Refresh/replacement: on app start and when the page becomes visible, an
  already-permitted browser obtains the current FCM registration token and
  securely upserts it. This catches token replacement without re-prompting.
- Logout or opting out: the app asks the server to remove the authenticated
  token, then deletes the local FCM token even if the server is temporarily
  unavailable, preventing the next browser user from receiving the prior
  session's alerts. Server-side cleanup failures are reported as a non-fatal
  error and require a retry after sign-in.
- Invalid FCM token: Firebase `UnregisteredError` results are pruned from the
  server token store after a send attempt.

## Test plan

Automated tests live at `BACKEND/tests/test_fcm_notifications.py`:

```powershell
cd BACKEND
python -m unittest discover -s tests -v
```

They cover missing authentication, server-derived ownership, rejection of a
cross-UID registration, owner-only deletion, generic payload construction,
unregistered-token cleanup, and the existing `BLOCK` fraud decision hook.

For an end-to-end web test:

1. Configure Firebase Auth, the local web environment, Admin credentials, and
   an HTTPS/localhost browser session as above.
2. Sign in through the Firebase Auth integration and turn on **Fraud Alerts**.
   Confirm the browser prompt occurs only at that action and that
   `POST /notifications/devices` returns `201` with no UID in the body.
3. With the same authenticated user and registered browser, submit a simulated
   payment to `POST /fraud/check` whose existing indicators produce `BLOCK`.
   For example, a high amount plus `suspicious_qr_mismatch` and
   `remote_access_suspected` reaches the existing threshold. Confirm the
   backgrounded browser shows only the generic alert and opens `/notifications`.
4. Retry with an `ALLOW`/`WARN` result and confirm no FCM request is sent.
5. Test denied permission, unsupported/private browser, expired bearer token,
   a second UID attempting to reuse the token (`409`), logout, and a manually
   invalidated FCM token.

No live FCM delivery is claimed until Shahee supplies the Firebase configuration
and the Firebase Auth login integration is present. Firebase's server send
behavior is documented in the [Admin SDK FCM guide](https://firebase.google.com/docs/cloud-messaging/send/admin-sdk).

## Validation recorded for this branch

- `npx tsc --noEmit`: passed.
- `python -m py_compile main.py fcm_notifications.py tests/test_fcm_notifications.py`:
  passed using the bundled Python runtime.
- The automated unit suite and live FCM delivery were not run in this workspace:
  its default Python has no FastAPI and the sandbox terminates isolated package
  installation before dependencies finish; no Firebase Auth session, Firebase
  project configuration, VAPID key, or Admin credentials were provided. Run the
  commands above in CI or a configured development environment before merge.
