# TI Assistant

## Running Locally

1. Clone the repository.

2. Install the [Firebase CLI](https://firebase.google.com/docs/cli).

  On Linux, run `curl -sL https://firebase.tools | bash`

3. Follow the [instructions](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) to install the Firestore Emulator.

  Run `firebase init`. When prompted, select a port other than 8080. (recommended: 8020)

4. Start the emulators - `firebase emulators:start`.

5. Run `export FIRESTORE_EMULATOR_HOST="127.0.0.1:8020"` to tell the app where to find the emulator.

6. Start the app using `npm run dev`.

7. The app will be available on `localhost:8080`

## Building

1. Run `npm run build`.

## Testing

Coming soon