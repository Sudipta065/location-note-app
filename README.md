# Location Notes App

Location Notes App is a mobile application built using React Native, Expo, and Firebase. It allows users to manage notes, including the ability to attach location data and images. User authentication is handled by Firebase Authentication, and all notes are stored securely in Firebase Firestore.


## Features
* User Authentication: Login and registration with Firebase Authentication.
* Notes Management: Create, edit, and delete notes with ease.
* Location-Based Notes: Automatically tag notes with the user's current location.
* Firebase Firestore: Notes are stored and retrieved using Firestore for each authenticated user.
* Logout: Securely log out of the app.
* Modern UI: Clean and responsive design using React Native components.

## How to Run

1. Clone the repository:

git clone https://github.com/Sudipta065/location-notes-app.git

2. Navigate to the project directory:

cd location-notes-app

Install the required dependencies:

npm install

3. Run the application:
npx expo start

The app should now be running on http://localhost:8081. and scan the app on expo app to check it on a device


4. Configure Firebase by creating a firebase.js file in the config/ folder. Add your Firebase credentials.


## Screens
* Register Screen: User sign-up.
* Login Screen: User login.
* Landing Screen: List of user notes with options to add, edit, or delete notes.
* Note Screen: Add or edit a note with title, body, location, and optional image.
* Logout Button: Secure logout feature.


## Technology Stack
* React Native: Cross-platform mobile development framework.
* Expo: Development tool for building React Native apps.
* Firebase Authentication: Handles secure user authentication.
* Firestore: Cloud-based NoSQL database to store and retrieve user notes.
* Expo Location: Access device location to tag notes.
* AsyncStorage: Local storage for maintaining user sessions.

## Usage
* Register: Create a new account.
* Login: Log in using your credentials.
* Add Note: Add a new note with optional location tagging and image attachment.
* Edit Note: Modify an existing note.
* Delete Note: Remove a note from the list.
* Logout: Securely log out.

## Folders

```bash
├── assets              # Image and asset files
├── components          # Reusable React components
├── config              # Firebase configuration
├── screens             # App screens (Login, Register, Landing, etc.)
├── App.js              # Main app entry point
├── README.md           # Project documentation
└── package.json        # Node.js project configuration 
```


## Credits

- This project was created as part of learning React Native and how to create a cross platform app in React Native and Expo.

## License

- This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.