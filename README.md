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

## Localization

#### Adding a new string

1. Add string using `<FormattedMessage />` or `intl.formatMessage(...)`.

2. Run `npm run extract` to generate `/server/lang/en.json`

3. Add generated IDs from `/server/lang/en.json` to new locations.

4. Copy new sections from `/server/lang/en.json` to other language files and translate string.

5. Run `npm run compile` to generate `/server/compiled-lang/<language>.json` files.

6. Create a PR with the changes.

#### Adding a new language

1. Copy `/server/lang/en.json` to `/server/lang/<language>.json`.

2. Translate strings in new language file.

3. Run `npm run compile` to generate `/server/compiled-lang/<language>.json` files.

5. Update `/app/layout.tsx` to include the new locale.

6. Create a PR with the changes.

## Testing

Coming soon.
