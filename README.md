# TI Assistant

## Running Locally

1. Clone the repository.

2. Make sure you have npm installed and run `npm install`.

3. Install the [Firebase CLI](https://firebase.google.com/docs/cli) - `curl -sL https://firebase.tools | bash`.

4. Follow the [instructions](https://firebase.google.com/docs/emulator-suite/connect_and_prototype) to install the Firestore Emulator - `firebase init`. When prompted, choose to install the Emulator Suite and Firestore Emulator, and select a port other than 8080. (recommended: 8020).

5. Start the emulators - `firebase emulators:start`.

6. Run `export FIRESTORE_EMULATOR_HOST="127.0.0.1:8020"` to tell the app where to find the emulator.

7. Start the app using `npm run dev`.

8. The app will be available on `localhost:8080`.

## Building

1. Run `npm run build`.

## Testing

Coming soon.

## Contributing
